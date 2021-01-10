
const { rewriteURIForGET } = require('@apollo/client');
const { Pool, Client } = require('pg')
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');

const pool = new Pool()

async function login(username, password) {
    const res = await pool.query(
        'SELECT * FROM "Users" WHERE username = $1 AND password = $2',
         [username, password]
    )
    if (res.rows.length !== 0) {
        user = res.rows[0]
        var token = jwt.sign({ uuid: user.uuid, username: user.username}, 'encryption_key');
        return {
            success: true,
            token: token,
            user: {
                username: user.username,
                uuid: user.uuid
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
    try {
        const res = await pool.query(
            'INSERT INTO "Users" (uuid, username, password) VALUES ($1, $2, $3) RETURNING *',
             [uuidv4(), username, password]
        )
        console.log(res.rows[0])
        created = res.rows[0]
        return {
            username: created.username,
            uuid: created.uuid
        }   
        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      } catch (err) {
        console.log(err.stack)
      }
}

exports.createUser = createUser
exports.login = login

//const res = await pool.query('INSERT INTO Users (uuid, username, password) VALUES ($1, $2, $3)')
//console.log(res.rows[0]);
//return books