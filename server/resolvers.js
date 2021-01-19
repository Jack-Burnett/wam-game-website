const { createUser, login, getUsers } = require('./users')
const { sendInvite, respondToInvite } = require('./invites')

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
    }
  };

  exports.resolvers = resolvers
