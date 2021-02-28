import { gql } from '@apollo/client';

const HOME_PAGE = gql`
    query HOME_PAGE {
        me {
            activeGames {
                uuid
                player1 {
                    username
                }
                player2 {
                    username
                }
                turn
                state
                data
            }
            receivedInvites {
                uuid
                inviter {
                    username
                }
            }
            sentInvites {
                uuid
                invitee {
                    username
                }
            }
        }
        users (search: {startsWith: "", excludeSelf: true}) {
            uuid
            username
        }
    }
`

const GAME = gql`
    query GAME($uuid: ID!) {
        game(uuid: $uuid) {
            uuid
            player1 {
                uuid
                username
            }
            player2 {
                uuid
                username
            }
            turn
            state
            data
        }
    }
`

const HISTORY = gql`
    query HISTORY($users:[String], $includeOngoing: Boolean!, $includeFinished: Boolean!) {
        games(search:{
            withUsers: $users, includeFinished: $includeFinished, includeOngoing: $includeOngoing
        }) {
            uuid
            player1 {
                username
            }
            player2 {
                username
            }
            turn
            state
            data
        }
    }
`

export { HOME_PAGE, GAME, HISTORY }