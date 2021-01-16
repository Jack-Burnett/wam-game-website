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
    }
`

export { HOME_PAGE }