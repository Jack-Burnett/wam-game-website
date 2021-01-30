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

export { HOME_PAGE, GAME }