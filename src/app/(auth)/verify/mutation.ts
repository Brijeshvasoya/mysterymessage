import gql from "graphql-tag";

export const VERIFY_USER = gql`
  mutation VerifyUser($input: VerifyUserInput!) {
    verifyUser(input: $input) {
      id
      username
      email
      isVerified
      isAcceptingMessages
      messages {
        content
        createAt
      }
    }
  }
`;

export const RESEND_VERIFY_CODE = gql`
  mutation ResendVerifyCode($input: ResendVerifyCodeInput!) {
    resendVerifyCode(input: $input)
  }
`;
