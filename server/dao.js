
const { rewriteURIForGET } = require('@apollo/client');
const { Pool, Client } = require('pg')
const { v4: uuidv4 } = require('uuid');

const pool = new Pool()

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

//const res = await pool.query('INSERT INTO Users (uuid, username, password) VALUES ($1, $2, $3)')
//console.log(res.rows[0]);
//return books