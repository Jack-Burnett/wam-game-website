var dao = require('./dao');

async function submit_move(game_uuid, player, move) {
    try {
        const updated = await dao.submit_move(game_uuid, player, move)
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