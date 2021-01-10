import { gql } from '@apollo/client';

const HOME_PAGE = gql`
    query HOME_PAGE {
        me {
            activeGames {
                player1
                player2
                turn
                status
            }
        }
    }
`

export default HOME_PAGE