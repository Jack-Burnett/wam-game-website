
const { rewriteURIForGET } = require('@apollo/client');
const { Pool, Client } = require('pg')
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = new Pool()

async function login(username, password) {
    const res = await pool.query(
        'SELECT * FROM users WHERE username = $1',
         [username]
    )
    if (res.rows.length !== 0) {
        user = res.rows[0]
        const match = await bcrypt.compare(password, user.password);
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
        }
    }
    return {
        success: false,
        error: "Login failed"
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
    const res = await pool.query(
        'SELECT * FROM users WHERE username = $1',
         [username]
    )
    if (res.rows.length !== 0) {
        return {
            success: false,
            error: "There is already an account with that username"
        }
    }
    
    const hash = await bcrypt.hash(password, saltRounds)
    try {
        const res = await pool.query(
            'INSERT INTO users (user_uuid, username, password) VALUES ($1, $2, $3) RETURNING *',
                [uuidv4(), username, hash]
        )
        console.log(res.rows[0])
        const user = res.rows[0]
        var token = jwt.sign({ uuid: user.user_uuid, username: user.username}, 'encryption_key');
        return {
            success: true,
            token: token,
            user: {
                username: user.username,
                uuid: user.user_uuid
            },
        }
    } catch (err) {
        console.log(err.stack)
    }
    return {
        success: false,
        error: "Signup failed"
    }
}

async function getUsers(startsWith = "", excludeUuid = "NONE") {
    const res = await pool.query(
        'SELECT * FROM users WHERE username LIKE $1 AND user_uuid != $2 LIMIT 30',
         [startsWith + "%", excludeUuid]
    )
    response = res.rows.map(row => {
        return {
            username: row.username,
            uuid: row.user_uuid
        }
    })
    return response
}

async function sendInvite(inviter, invitee) {
    try {
        const res = await pool.query(
            'INSERT INTO invites (invite_uuid, inviter_uuid, invitee_uuid) VALUES ($1, $2, $3) RETURNING *',
                [uuidv4(), inviter, invitee]
        )
        const invite = res.rows[0]
        return {
            uuid: invite.invite_uuid
        }
    } catch (err) {
        console.log(err.stack)
        return {
            errorMessage: "Something went wrong"
        }
    }
}

exports.createUser = createUser
exports.login = login
exports.getUsers = getUsers
exports.sendInvite = sendInvite