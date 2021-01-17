
const { gql } = require('apollo-server-express');

const { Pool, Client } = require('pg')
const { createUser, login, getUsers } = require('./dao')

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
    inviter: String!
    invitee: String!
  }

  input InviteResponse {
    inviteId: String!
    accepted: Boolean!
  }
  
  type Mutation {
    createUser(input: UserInput!): SignupResult!
    sendInvite(input: InviteInput!): Invite!
    respondToInvite(input: InviteResponse!): Game!
    login(username: String!, password: String!): LoginResult!
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
  
  type SignupResult {
      success: Boolean!
      user: User
      token: String
      error: String
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

  type Query {
    me: User
    game(id: Int): Game
    users(startswith: String): User
  }

  input UserSearchInput {
    startsWith: String
    excludeSelf: Boolean
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
        },
        sendInvite: async(_, {input}) => {
            return await sendInvite(input.inviter, input.invitee)
        },
        respondToInvite: async(_, {input}) => {
            return await login(input.inviteId, input.accepted)
        }
    },
    Query: {
      users: (_, {input}) => {
        print()
        getUsers(input)
      },

      me: (_, _params, context) => {
        return {
            activeGames: [
                {
                    player1: { "username" : context.user},
                    player2: { "username" : "BadGuy"},
                    turn: 2,
                    state: "WAITING_PLAYER_1"
                },
                {
                    player1: { "username" : context.user},
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