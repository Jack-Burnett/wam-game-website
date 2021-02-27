const { Pool } = require('pg')
const { v4: uuidv4, validate: validateUuid } = require('uuid');
const { Game, Outcome } = require('./game')

const pool = new Pool()

async function acknowledge_game_end(game_uuid, player) {
    try {
        if (player == 1) {
            await pool.query("UPDATE games SET game_over_acknowledged_player1 = true WHERE game_uuid = $1", [game_uuid])
        } else if (player == 2) {
            await pool.query("UPDATE games SET game_over_acknowledged_player2 = true WHERE game_uuid = $1", [game_uuid])
        } else {
            console.log("Error: Acknowledge target bad")
        }
    } catch (err) {
        console.log(err)
    }
}

async function submit_move(game_uuid, player, moveString, context) {
    if (!validateUuid(game_uuid)) {
        throw Error("Bad Game UUID")
    }
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const queryText = 'SELECT * FROM games WHERE game_uuid = $1 FOR UPDATE'
        const gameRes = await client.query(queryText, [game_uuid])
        if (gameRes.rows.length !== 1) {
            throw Error("No game with that UUID exists")
        }
        let {player1, player2, player1_turns, player2_turns, waiting_player1, waiting_player2 } = gameRes.rows[0]
        if (player != 1 && player != 2){
            throw Error("Player must be either 1 or 2")
        }
        if (player == 1 && !waiting_player1) {
            throw Error("This game is not waiting for input from player 1")
        }
        if (player == 2 && !waiting_player2) {
            throw Error("This game is not waiting for input from player 2")
        }
        if (player == 1 && context.user != player1) {
            throw Error("You cannot make moves as that player in that game")
        }
        if (player == 2 && context.user != player2) {
            throw Error("You cannot make moves as that player in that game")
        }
        const moves = JSON.parse(moveString)
        validateMoves(player1_turns, player2_turns, moves, player)

        // only do on correct player
        if (player == 1) {
            player1_turns = [...player1_turns, ...moves]
        }
        if (player == 2) {
            player2_turns = [...player2_turns, ...moves]
        }
        waiting_player1 = player1_turns.length <= player2_turns.length
        waiting_player2 = player2_turns.length <= player1_turns.length

        // check for end
        const outcome = checkForEnd(player1_turns, player2_turns)
        let game_over_acknowledged_player1 = false
        let game_over_acknowledged_player2 = false
        let gameover = false
        if (outcome != Outcome.ONGOING) {
            gameover = true
            // Current submitter should know game is over right away
            game_over_acknowledged_player1 = player == 1
            game_over_acknowledged_player2 = player == 2
            waiting_player1 = false
            waiting_player2 = false
        }

        const updateQuery = 'UPDATE games SET player1_turns = $2, player2_turns = $3, waiting_player1 = $4, waiting_player2 = $5,\
        game_over = $6, game_over_acknowledged_player1 = $7, game_over_acknowledged_player2 = $8, outcome = $9 WHERE game_uuid = $1 RETURNING *'
        const updateValues = [game_uuid, player1_turns, player2_turns, waiting_player1, waiting_player2, gameover,
        game_over_acknowledged_player1, game_over_acknowledged_player2, outcome]
        const updatedGame = await client.query(updateQuery, updateValues)
        await client.query('COMMIT')
        return updatedGame.rows[0]

    } catch (e) {
        await client.query('ROLLBACK')
        console.log("Error updating game")
        console.log(e)
        throw e
    } finally {
        client.release()
    }
}

function checkForEnd(player1_turns, player2_turns) {
    const completeTurns = Math.min(player1_turns.length, player2_turns.length)
    const game = new Game()
    for (let i = 0; i < completeTurns; i++) {
        game.tick(player1_turns[i], player2_turns[i])
    }
    let outcome = game.checkWinner()
    return outcome
}

function validateMoves(player1_turns, player2_turns, moves, player) {
    const completeTurns = Math.min(player1_turns.length, player2_turns.length)

    const game = new Game()
    for (let i = 0; i < completeTurns; i++) {
        game.tick(player1_turns[i], player2_turns[i])
    }

    moves.forEach((move, _) => {
        move.player = player
    })
    // Throws if invalid
    game.validate(moves)
}

async function get_user_by_username(username) {
    const res = await pool.query(
        'SELECT * FROM users WHERE username = $1',
         [username]
    )
    if (res.rows.length !== 0) {
        return res.rows[0]
    } else {
        return null
    }
}

async function get_games(user_uuids, game_over_states) {
    let clauses = []
    let values = []
    if (user_uuids) {
        clauses.push(`(player1 = ANY (${"$" + (values.length + 1)}) OR player2 = ANY (${"$" + (values.length + 1)}))`)
        values.push(user_uuids)
    }
    if (game_over_states) {
        clauses.push(`game_over = ANY (${"$" + (values.length + 1)})`)
        values.push(game_over_states)
    }
    const res = await pool.query(
        'SELECT * FROM games' + (clauses.length >= 1 ? " WHERE " : "") + clauses.join(" AND "),
         values
    )
    return res.rows
}

async function get_game_by_uuid(uuid) {
    const res = await pool.query(
        'SELECT * FROM games WHERE game_uuid = $1',
         [uuid]
    )
    if (res.rows.length !== 0) {
        return res.rows[0]
    } else {
        return null
    }
}

async function get_user_by_uuid(uuid) {
    const res = await pool.query(
        'SELECT * FROM users WHERE user_uuid = $1',
         [uuid]
    )
    if (res.rows.length !== 0) {
        return res.rows[0]
    } else {
        return null
    }
}

async function insert_user(uuid, username, hash) {
    try {
        const res = await pool.query(
            'INSERT INTO users (user_uuid, username, hash) VALUES ($1, $2, $3) RETURNING *',
                [uuid, username, hash]
        )
        if (res.rows.length !== 0) {
            return res.rows[0]
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
        return null
    }
}

async function get_active_games_for_user(user_uuid) {
    const res = await pool.query(
        'SELECT * FROM games WHERE (player1 = $1 AND NOT game_over_acknowledged_player1) OR (player2 = $1 AND NOT game_over_acknowledged_player2)',
         [user_uuid]
    )
    return res.rows
}

async function get_sent_invites_for_user(user_uuid) {
    const res = await pool.query(
        'SELECT * FROM invites WHERE inviter_uuid = $1',
         [user_uuid]
    )
    return res.rows
}

async function get_received_invites_for_user(user_uuid) {
    const res = await pool.query(
        'SELECT * FROM invites WHERE invitee_uuid = $1',
         [user_uuid]
    )
    return res.rows
}

async function get_users(startsWith = "", excludeUuid = "NONE") {
    if (excludeUuid == "NONE") {
        excludeUuid = "00000000-0000-0000-0000-000000000000"
    }
    const res = await pool.query(
        'SELECT * FROM users WHERE username LIKE $1 AND user_uuid != $2 LIMIT 30',
         [startsWith + "%", excludeUuid]
    )
    return res.rows
}

async function insert_invite(inviter_uuid, invitee_uuid) {
    try {
        const res = await pool.query(
            'INSERT INTO invites (invite_uuid, inviter_uuid, invitee_uuid) VALUES ($1, $2, $3) RETURNING *',
                [uuidv4(), inviter_uuid, invitee_uuid]
        )
        const invite = res.rows[0]
        return invite
    } catch (err) {
        console.log(err.stack)
        return null
    }
}

async function get_invite_by_uuid(uuid) {
    const res = await pool.query(
        'SELECT * FROM invites WHERE invite_uuid = $1',
         [uuid]
    )
    if (res.rows.length !== 0) {
        return res.rows[0]
    } else {
        return null
    }
}

async function delete_invite_by_uuid(uuid) {
    const res = await pool.query(
        'DELETE FROM invites WHERE invite_uuid = $1',
         [uuid]
    )
}

async function upsert_game(game) {
    try {
        const res = await pool.query(
            "INSERT INTO games (game_uuid, player1, player2, player1_turns, player2_turns, waiting_player1, waiting_player2, game_over,\
                game_over_acknowledged_player1, game_over_acknowledged_player2, outcome) \
             VALUES ($1, $2, $3, $4, $5, $6, $7, false, false, false, 'ONGOING') RETURNING *",
                [game.game_uuid, game.player1, game.player2, game.player1_turns, game.player2_turns, game.waiting_player1, game.waiting_player2]
        )
        const created = res.rows[0]
        return created
    } catch (err) {
        console.log("Game upsert failed")
        console.log(err.stack)
        return null
    }
}

exports.get_user_by_username = get_user_by_username
exports.insert_user = insert_user
exports.get_users = get_users
exports.insert_invite = insert_invite
exports.get_invite_by_uuid = get_invite_by_uuid
exports.delete_invite_by_uuid = delete_invite_by_uuid
exports.get_active_games_for_user = get_active_games_for_user
exports.upsert_game = upsert_game
exports.get_user_by_uuid = get_user_by_uuid
exports.get_game_by_uuid = get_game_by_uuid
exports.submit_move = submit_move
exports.get_sent_invites_for_user = get_sent_invites_for_user
exports.get_received_invites_for_user = get_received_invites_for_user
exports.acknowledge_game_end = acknowledge_game_end
exports.get_games = get_games