
const { gql } = require('apollo-server-express');

const { Pool, Client } = require('pg')

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

  type Player {
    user: User
    uuid: Int
  }

  type Invite {
      hm: String
  }

  enum State {
      WAITING_PLAYER_1
      WAITING_PLAYER_2
      WAITING_BOTH
      FINISHED
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