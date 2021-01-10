
const { gql } = require('apollo-server-express');

const { Pool, Client } = require('pg')
const { createUser, login } = require('./dao')

const pool = new Pool()

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  type User {
      username: String
      activeGames: [Game]
      pastGames: [Game]
  }

  input UserInput {
      username: String!
      password: String!
  }

  input InviteInput {
    inviter: Int!
    invitee: Int!
  }

    input InviteResponse {
        inviteId: Int!
        accepted: Boolean!
    }
  
  type Mutation {
      createUser(input: UserInput!): User!
      invite(input: InviteInput!): Invite!
      acceptInvite(input: InviteResponse!): Game!
      login(username: String, password: String): LoginResult
  }

  type Invite {
    uuid: ID
    inviter: User
    invitee: User
  }

  enum State {
      WAITING_PLAYER_1
      WAITING_PLAYER_2
      WAITING_BOTH
      FINISHED
  }

  type LoginResult {
      success: Boolean!
      user: User
      token: String
      error: String
  }

  type Game {
    uuid: ID
    player1: User
    player2: User
    turn: Int
    state: State

    data: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    me: User
    game(id: Int): Game
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Mutation: {
        createUser: async (_, {input}) => {
            return await createUser(input.username, input.password)
        },
        login: async(_, {username, password}) => {
            return await login(username, password)
        }
    },
    Query: {
      me: () => {
        return {
            activeGames: [
                {
                    player1: { "username" : "Jack"},
                    player2: { "username" : "BadGuy"},
                    turn: 2,
                    state: "WAITING_PLAYER_1"
                },
                {
                    player1: { "username" : "Jack"},
                    player2: { "username" : "Mean Chris"},
                    turn: 3,
                    state: "WAITING_BOTH"
                }
            ]
        }
      }
    },
  };

  exports.typeDefs = typeDefs
  exports.resolvers = resolvers