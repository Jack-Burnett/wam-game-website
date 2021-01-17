import { gql } from '@apollo/client';

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      error
    }
  }
`;

const SIGNUP = gql`
  mutation signup($username: String!, $password: String!) {
     # Alias to login so the responses can be treated the same :)
    login: createUser(input: { username: $username, password: $password }) {
      success
      token
      error
    }
  }
`;

export { LOGIN, SIGNUP }