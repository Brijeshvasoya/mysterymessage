import gql from "graphql-tag";

export const ACCEPT_MESSAGES_STATUS = gql`
  query Query($username: String!) {
    acceptMessages(username: $username)
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($username: String!) {
    getMessages(username: $username) {
      id
      content
      createdAt
    }
  }
`;
