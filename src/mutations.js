import { gql } from '@apollo/client';

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      error
      user {
        uuid
      }
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
      user {
        uuid
      }
    }
  }
`;

const SEND_INVITE = gql`
  mutation invite($inviter: String!, $invitee: String!) {
     # Alias to login so the responses can be treated the same :)
    sendInvite(input: { inviter: $inviter, invitee: $invitee }) {
      ...on Invite {
        uuid
      }
      ...on Error {
        errorMessage
      }
    }
  }
`;

export { LOGIN, SIGNUP, SEND_INVITE }