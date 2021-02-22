var dao = require('./dao');

async function get_game_by_uuid(game_uuid, user_uuid) {

    const game = dao.get_game_by_uuid(game_uuid, user_uuid)
    // Note; this does not block the return of the game (which is returned as a promise)
    // It is done seperatley and async
    game.then(
        async g => {
            if (g.game_over) {
                if (g.player1 == user_uuid && !g.game_over_acknowledged_player1) {
                    dao.acknowledge_game_end(game_uuid, 1)
                }
                if (g.player2 == user_uuid && !g.game_over_acknowledged_player2) {
                    dao.acknowledge_game_end(game_uuid, 2)
                }
            }
        }
    )
    return game
}

async function submit_move(game_uuid, player, move, context) {
    try {
        const updated = await dao.submit_move(game_uuid, player, move, context)
        return {
            success: true,
            game : updated
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

exports.submit_move = submit_move
exports.get_game_by_uuid = get_game_by_uuid