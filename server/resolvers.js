const { createUser, login, getUsers } = require('./users')
const { sendInvite, respondToInvite } = require('./invites')
const { get_user_by_uuid, get_active_games_for_user, get_invites_for_user } = require('./dao')

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
      }
    },
    User: {
      activeGames: (data) => {
        return get_active_games_for_user(data.user_uuid)
      },
      invites: (data) => {
        return get_invites_for_user(data.user_uuid)
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
        return Math.min(data.player1_turns.length, data.player2_turns.length) + 1
      },
      state: (data) => {
        if (data.waiting_player1 && data.waiting_player2) {
          return "WAITING_BOTH"
        } else if(data.waiting_player1) {
          return "WAITING_PLAYER_1"
        } else if(data.waiting_player2) {
          return "WAITING_PLAYER_1"
        } else {
          return "FINISHED"
        }
      }
    }
  };

  exports.resolvers = resolvers
