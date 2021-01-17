import { gql } from '@apollo/client';

const HOME_PAGE = gql`
    query HOME_PAGE {
        me {
            activeGames {
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
        users (search: {startsWith: "", excludeSelf: true}) {
            uuid
            username
        }
    }
`

export { HOME_PAGE }