import client from "@/lib/apollo";
import { gql } from "@apollo/client";

const GET_ARTISTS = gql`
  query GetArtists($first: Int, $skip: Int, $search: String) {
    allArtist(first: $first, skip: $skip, search: $search) {
      totalRows
      rows {
        id
        name
        dob
        gender
        address
        firstReleaseYear
        noOfAlbumsReleased
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_ARTIST_BY_ID = gql`
  query GetArtistById($id: Int!) {
    artistById(id: $id) {
      id
      name
      dob
      gender
      address
      firstReleaseYear
      noOfAlbumsReleased
    }
  }
`;

const MY_ARTIST_PROFILE = gql`   
  query MyArtistProfile {
    myArtistProfile {
      id
      name
      dob
      gender
      address
      firstReleaseYear
      noOfAlbumsReleased
    }
  }
`;

const CREATE_ARTIST = gql`
  mutation CreateArtist($input: ArtistInput!) {
    createArtist(input: $input) {
      artist {
        id
        name
      }
      message
    }
  }
`;

const UPDATE_ARTIST = gql`
  mutation UpdateArtist($id: Int!, $input: ArtistInput!) {
    updateArtist(id: $id, input: $input) {
      artist {
        id
        name
      }
      message
    }
  }
`;

const DELETE_ARTIST = gql`
  mutation DeleteArtist($id: Int!) {
    deleteArtist(id: $id) {
      message
    }
  }
`;

export interface ArtistPayload {
  name: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  firstReleaseYear?: number;
  noOfAlbumsReleased?: number;
}

export interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  firstReleaseYear: number;
  noOfAlbumsReleased: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetArtistsResponse {
  totalRows: number;
  rows: Artist[];
}

export const artistService = {
  getArtists: async (
    page: number,
    limit: number,
    search?: string
  ): Promise<GetArtistsResponse> => {
    const { data, errors } = await client.query({
      query: GET_ARTISTS,
      variables: { first: limit, skip: (page - 1) * limit, search },
      fetchPolicy: "network-only",
    });
    if (errors) throw new Error(errors[0].message);
    return data.allArtist;
  },

  getArtistById: async (id: number): Promise<Artist> => {
    const { data, errors } = await client.query({
      query: GET_ARTIST_BY_ID,
      variables: { id },
    });
    if (errors) throw new Error(errors[0].message);
    return data.artistById;
  },

  getMyProfile: async (): Promise<Artist> => {  // ✅ new
    const { data, errors } = await client.query({
      query: MY_ARTIST_PROFILE,
      fetchPolicy: "network-only",
    });
    if (errors) throw new Error(errors[0].message);
    return data.myArtistProfile;
  },

  createArtist: async (input: ArtistPayload): Promise<Artist> => {
    const { data, errors } = await client.mutate({
      mutation: CREATE_ARTIST,
      variables: { input },
    });
    if (errors) throw new Error(errors[0].message);
    return data.createArtist.artist;
  },

  updateArtist: async (id: number, input: ArtistPayload): Promise<Artist> => {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_ARTIST,
      variables: { id, input },
    });
    if (errors) throw new Error(errors[0].message);
    return data.updateArtist.artist;
  },

  deleteArtist: async (id: number): Promise<{ message: string }> => {
    const { data, errors } = await client.mutate({
      mutation: DELETE_ARTIST,
      variables: { id },
    });
    if (errors) throw new Error(errors[0].message);
    return data.deleteArtist;
  },
};