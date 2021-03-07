var dao = require('./dao');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const { randomConfig } = require('./game')

async function sendInvite(inviter, invitee) {
    invite = await dao.insert_invite(inviter, invitee)
    if (invite != null) {
        return {
            uuid: invite.invite_uuid
        }
    } else {
        return {
            errorMessage: "Something went wrong"
        }
    }
}

async function respondToInvite(invite_uuid, accepted, context) {
    if (!uuidValidate(invite_uuid)) {
        return {
            success: false,
            gameCreated: false,
            error: "Not a valid uuid"
        }
    }
    invite = await dao.get_invite_by_uuid(invite_uuid)
    if (invite == null) {
        return {
            success: false,
            gameCreated: false,
            error: "No such invite"
        }
    }
    if (context.user != invite.invitee_uuid) {
        return {
            success: false,
            gameCreated: false,
            error: "Cannot accept games you are not invited to"
        }
    }
    // TODO this should be a transaction...

    await dao.delete_invite_by_uuid(invite_uuid)
    uuidv4
    if (!accepted) {
        return {
            success: true,
            gameCreated: false
        }
    }
    // Create game
    game = {
        game_uuid: uuidv4(),
        player1: invite.inviter_uuid,
        player2: invite.invitee_uuid,
        player1_turns: [],
        player2_turns: [],
        waiting_player1: true,
        waiting_player2: true,
        config: randomConfig()
    }
    await dao.upsert_game(game)
    return {
        success: true,
        gameCreated: true,
        game: game
    }
}

exports.sendInvite = sendInvite
exports.respondToInvite = respondToInvite