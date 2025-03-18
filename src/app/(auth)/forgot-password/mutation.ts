import gql from "graphql-tag";

export const FORGOT_PASSWORD_EMAIL = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input)
  }
`;
