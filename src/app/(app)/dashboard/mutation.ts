import gql from "graphql-tag";

export const ACCEPT_MESSAGES = gql`
  mutation AcceptingMessages($input: AcceptMessagesInput!) {
    acceptingMessages(input: $input)
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input)
  }
`;
