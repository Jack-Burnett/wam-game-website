var dao = require('./dao');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

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
    console.log(invite)
    if (invite == null) {
        return {
            success: false,
            gameCreated: false,
            error: "No such invite"
        }
    }
    // TODO validate context user matches
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
        player1Turns: [],
        player2Turns: [],
        waitingPlayer1: true,
        waitingPlayer2: true
    }
    await dao.upsert_game(game)
    return {
        success: true,
        gameCreated: true,
        game: {
            uuid: game.game_uuid
        }
    }
}

exports.sendInvite = sendInvite
exports.respondToInvite = respondToInvite