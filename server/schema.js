const { gql } = require('apollo-server-express');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  type User {
      uuid: ID
      username: String
      activeGames: [Game]
      # Not implemented
      pastGames: [Game]
      sentInvites: [Invite]
      receivedInvites: [Invite]
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
    submitMove(game_uuid: ID!, player:Int!, move: String!): SubmitMoveResult!
  }
  
  type SubmitMoveResult {
    success: Boolean!
    error: String
    game: Game
  }

  type InviteResponseResult {
    success: Boolean
    error: String
    game: Game
  }

  type Error {
    errorMessage: String
  }
  
  union MaybeInvite = Invite | Error

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
    game(uuid: ID): Game
    users(search: UserSearchInput): [User]
  }

  input UserSearchInput {
    startsWith: String = ""
    excludeSelf: Boolean = false
  }
`;

  exports.typeDefs = typeDefs