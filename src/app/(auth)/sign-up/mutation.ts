import gql from "graphql-tag";

export const SIGN_UP = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      isVerified
      isAcceptingMessages
      messages {
        content
        createdAt
      }
    }
  }
`;

export const CHECK_USERNAME = gql`
  mutation CheckUserName($input: CheckUserInput!) {
    checkUserName(input: $input)
  }
`;
