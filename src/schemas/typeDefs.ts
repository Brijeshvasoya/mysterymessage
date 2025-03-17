import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID
    username: String
    email: String
    isVerified: Boolean
    isAcceptingMessages: Boolean
    messages: [Message]
  }

  type Message {
    id: ID
    content: String
    createdAt: String
  }

  type Query {
    users: [User]
    getMessages(username: String!): [Message]
    acceptMessages(username: String!): Boolean
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    verifyUser(input: VerifyUserInput!): User
    checkUserName(input: CheckUserInput!): String
    sendMessage(input: SendMessageInput!): Message
    acceptingMessages(input: AcceptMessagesInput!): String
    deleteMessage(input: DeleteMessageInput!): String
    resendVerifyCode(input: ResendVerifyCodeInput!): String
  }

  input CreateUserInput {
    username: String
    email: String
    password: String
  }

  input VerifyUserInput {
    username: String
    verifyCode: String
  }

  input CheckUserInput {
    username: String
  }

  input SendMessageInput {
    username: String
    content: String
  }

  input AcceptMessagesInput {
    username: String
    accept: Boolean
  }

  input DeleteMessageInput {
    username: String
    messageId: String
  }

  input ResendVerifyCodeInput {
    username: String
  }
`;