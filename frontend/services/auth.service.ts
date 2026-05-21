import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import { tokenService } from "@/lib/token";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      message
      user {
        id
        email
      }
    }
  }
`;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<void> => {
    console.log("Sending to:", process.env.NEXT_PUBLIC_API_URL);  // ✅
    try {
      const result = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: data,
      });
      console.log("Result:", result);  // ✅
      if (result.errors) throw new Error(result.errors[0].message);
      tokenService.setToken(result.data.tokenAuth.token);
    } catch (err) {
      console.error("Apollo error:", err);  // ✅
      throw err;
    }
  },

  register: async (data: RegisterPayload): Promise<{ message: string }> => {
    const { data: result, errors } = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: data,
    });
    if (errors) throw new Error(errors[0].message);
    return result.registerUser;
  },

  logout: () => {
    tokenService.clearToken();
    client.clearStore();
    window.location.href = "/login";
  },
};