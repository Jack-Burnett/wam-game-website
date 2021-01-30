var dao = require('./dao');

async function submit_move(game_uuid, player, move) {
    try {
        const updated = await dao.submit_move(game_uuid, player, move)
        console.log(updated)
        return {
            success: true,
            game : updated
        }
    } catch (error) {
        console.log("henlo")
        return {
            success: false,
            error: error.message
        }
    }
}

exports.submit_move = submit_move