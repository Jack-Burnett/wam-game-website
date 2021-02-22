const { createUser, login, getUsers } = require('./users')
const { sendInvite, respondToInvite } = require('./invites')
const { submit_move, get_game_by_uuid } = require('./games')
const { get_user_by_uuid, get_active_games_for_user, get_sent_invites_for_user, get_received_invites_for_user } = require('./dao')

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    MaybeInvite: {
      __resolveType(obj, context, info){
        if(obj.errorMessage){
          return "Error";
        }

        return "Invite";
      },
    },
    Mutation: {
        // Not authorised
        createUser: async (_, {input}) => {
            return await createUser(input.username, input.password)
        },
        login: async(_, {username, password}) => {
            return await login(username, password)
        },

        // Authorised
        sendInvite: async(_, {input}, context) => {
          if (context.user != input.inviter) {
            return {
              errorMessage: "You cannot send invites on someone elses behalf"
            }
          }
          return await sendInvite(input.inviter, input.invitee)
        },
        respondToInvite: async(_, {input}, context) => {
            return await respondToInvite(input.inviteUuid, input.accepted, context)
        },
        submitMove: async(_, {game_uuid, player, move}, context) => {
          return await submit_move(game_uuid, player, move, context)
        }
    },
    Query: {
      users: (_, {search}, context) => {
        
        return getUsers(
          startsWith = search.startsWith,
          excludeUuid = search.excludeSelf ? context.user : "NONE"
        );
      },

      me: (_, _params, context) => {
        return get_user_by_uuid(context.user)
      },

      game: (_, params, context) => {
        return get_game_by_uuid(params.uuid, context.user)
      },
    },
    User: {
      activeGames: (data) => {
        return get_active_games_for_user(data.user_uuid)
      },
      sentInvites: (data) => {
        return get_sent_invites_for_user(data.user_uuid)
      },
      receivedInvites: (data) => {
        return get_received_invites_for_user(data.user_uuid)
      },
      uuid: (data) => {
        return data.user_uuid
      },
      username: (data) => {
        return data.username
      }
    },
    Invite: {
      uuid: (data) => {
        return data.invite_uuid
      },
      inviter: (data) => {
        return get_user_by_uuid(data.inviter_uuid)
      },
      invitee: (data) => {
        return get_user_by_uuid(data.invitee_uuid)
      }
    },
    Game: {
      uuid: (data) => {
        return data.game_uuid
      },
      player1: (data) => {
        return get_user_by_uuid(data.player1)
      },
      player2: (data) => {
        return get_user_by_uuid(data.player2)
      },
      turn: (data) => {
        return Math.min(data.player1_turns.length / 4, data.player2_turns.length / 4) + 1
      },
      state: (data) => {
        if (data.waiting_player1 && data.waiting_player2) {
          return "WAITING_BOTH"
        } else if(data.waiting_player1) {
          return "WAITING_PLAYER_1"
        } else if(data.waiting_player2) {
          return "WAITING_PLAYER_2"
        } else {
          return "FINISHED"
        }
      },
      data: (input) => {
        
        const completeTurns = Math.min(input.player1_turns.length, input.player2_turns.length)
        let data = []
        for (let i = 0; i < completeTurns; i++) {
          let datum = {
            move1: input.player1_turns[i],
            move2: input.player2_turns[i]
          }
          data = [...data, datum]
        }

        return JSON.stringify(data)
      }
      
    }
  };

  exports.resolvers = resolvers
