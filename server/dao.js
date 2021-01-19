const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid');

const pool = new Pool()

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
            'INSERT INTO games (game_uuid, player1, player2, player1_turns, player2_turns, waiting_player1, waiting_player2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [game.game_uuid, game.player1, game.player2, game.player1Turns, game.player2Turns, game.waitingPlayer1, game.waitingPlayer2]
        )
        const created = res.rows[0]
        return created
    } catch (err) {
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
exports.upsert_game = upsert_game