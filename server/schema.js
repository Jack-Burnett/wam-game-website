const { gql } = require('apollo-server-express');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  type User {
      username: String
      uuid: String
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
    inviteUuid: String!
    accepted: Boolean!
  }
  
  type Mutation {
    createUser(input: UserInput!): SignupResult!
    sendInvite(input: InviteInput!): MaybeInvite!
    respondToInvite(input: InviteResponse!): InviteResponseResult!
    login(username: String!, password: String!): LoginResult!
  }

  type InviteResponseResult {
    success: Boolean
    error: String
    gameCreated: Boolean
    game: Game
  }

  type Error {
    errorMessage: String
  }
  
  union MaybeInvite = Invite | Error

  type Invite {
    uuid: ID
    # TODO not implemented
    inviter: User
    # TODO not implemented
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
    users(search: UserSearchInput): [User]
  }

  input UserSearchInput {
    startsWith: String = ""
    excludeSelf: Boolean = false
  }
`;

  exports.typeDefs = typeDefs