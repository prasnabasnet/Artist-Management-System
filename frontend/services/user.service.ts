
import client from "@/lib/apollo";
import { gql } from "@apollo/client";

const GET_ARTIST_USERS = gql`
  query GetArtistUsers {
    artistUsers {
      id
      email
    }
  }
`;

export interface UserOption {
  id: string;
  email: string;
}

export const userService = {
  getArtistUsers: async (): Promise<UserOption[]> => {
    const { data, errors } = await client.query({
      query: GET_ARTIST_USERS,
      fetchPolicy: "network-only",
    });
    if (errors) throw new Error(errors[0].message);
    return data.artistUsers;
  },
};