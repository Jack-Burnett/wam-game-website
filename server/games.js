var dao = require('./dao');

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

exports.sendInvite = sendInvite