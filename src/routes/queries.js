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
            }
            invites {
                uuid
                inviter {
                    username
                }
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

const HOME_PAGE = gql`
    query GAME {
        game {
            uuid
            player1 {
                username
            }
            player2 {
                username
            }
            turn
            state
        }
    }
`

export { HOME_PAGE }