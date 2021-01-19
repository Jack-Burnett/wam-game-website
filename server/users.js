var dao = require('./dao');

var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const saltRounds = 10;

async function login(username, password) {
    user = await dao.get_user_by_username(username)
    const match = await bcrypt.compare(password, user.hash);
    if (match) {
        var token = jwt.sign({ uuid: user.user_uuid, username: user.username}, 'encryption_key');
        return {
            success: true,
            token: token,
            user: {
                username: user.username,
                uuid: user.user_uuid
            },
        }
    } else {
        return {
            success: false,
            error: "Login failed"
        }
    }
}

async function createUser(username, password) {
    if (username.length > 100 || username.length < 4) {
        return {
            success: false,
            error: "Username must be between 4 and 100 characters"
        }
    }
    if (password.length > 50 || password.length < 4) {
        return {
            success: false,
            error: "Password must be between 4 and 100 characters"
        }
    }
    user = await dao.get_user_by_username(username)
    if (user != null) {
        return {
            success: false,
            error: "There is already an account with that username"
        }
    }
    
    const uuid = uuidv4()
    const hash = await bcrypt.hash(password, saltRounds)

    user = await dao.insert_user(uuid, username, hash)
    if (user != null) {
        var token = jwt.sign({ uuid: user.user_uuid, username: user.username}, 'encryption_key');
        return {
            success: true,
            token: token,
            user: {
                username: user.username,
                uuid: user.user_uuid
            },
        }
    } else {
        return {
            success: false,
            error: "Signup failed"
        }
    }
}

async function getUsers(startsWith = "", excludeUuid = "NONE") {
    users = await dao.get_users(startsWith, excludeUuid)
    response = users.map(row => {
        return {
            username: row.username,
            uuid: row.user_uuid
        }
    })
    return response
}

exports.createUser = createUser
exports.login = login
exports.getUsers = getUsers