import client from "@/lib/apollo";
import { gql } from "@apollo/client";

const GET_ALL_MUSIC = gql`
  query GetAllMusic($first: Int, $skip: Int, $search: String) {
    allMusic(first: $first, skip: $skip, search: $search) {
      totalRows
      rows {
        id
        title
        albumName
        genre
        createdAt
        updatedAt
        artist {
          id
          name
        }
      }
    }
  }
`;

const GET_MUSIC_BY_ID = gql`
  query GetMusicById($id: Int!) {
    musicById(id: $id) {
      id
      title
      albumName
      genre
      artist {
        id
        name
      }
    }
  }
`;

const MY_MUSIC = gql`
  query MyMusic($first: Int, $skip: Int) {
    myMusic(first: $first, skip: $skip) {
      totalRows
      rows {
        id
        title
        albumName
        genre
        createdAt
        artist {
          id
          name
        }
      }
    }
  }
`;

const CREATE_MUSIC = gql`
  mutation CreateMusic($input: MusicInput!) {
    createMusic(input: $input) {
      music {
        id
        title
      }
      message
    }
  }
`;

const UPDATE_MUSIC = gql`
  mutation UpdateMusic($id: Int!, $input: MusicInput!) {
    updateMusic(id: $id, input: $input) {
      music {
        id
        title
      }
      message
    }
  }
`;

const DELETE_MUSIC = gql`
  mutation DeleteMusic($id: Int!) {
    deleteMusic(id: $id) {
      message
    }
  }
`;

export interface MusicPayload {
  artistId: string;
  title: string;
  albumName: string;
  genre: string;
}

export interface Music {
  id: number;
  title: string;
  albumName: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
  artist: {
    id: number;
    name: string;
  };
}

export interface GetMusicResponse {
  totalRows: number;
  rows: Music[];
}

export const musicService = {
  getAllMusic: async (
    page: number,
    limit: number,
    search?: string
  ): Promise<GetMusicResponse> => {
    const { data, errors } = await client.query({
      query: GET_ALL_MUSIC,
      variables: { first: limit, skip: (page - 1) * limit, search },
      fetchPolicy: "network-only",
    });
    if (errors) throw new Error(errors[0].message);
    return data.allMusic;
  },

  getMusicById: async (id: number): Promise<Music> => {
    const { data, errors } = await client.query({
      query: GET_MUSIC_BY_ID,
      variables: { id },
    });
    if (errors) throw new Error(errors[0].message);
    return data.musicById;
  },

  getMyMusic: async (page: number, limit: number): Promise<GetMusicResponse> => {  // ✅ new
    const { data, errors } = await client.query({
      query: MY_MUSIC,
      variables: { first: limit, skip: (page - 1) * limit },
      fetchPolicy: "network-only",
    });
    if (errors) throw new Error(errors[0].message);
    return data.myMusic;
  },

  createMusic: async (input: MusicPayload): Promise<Music> => {
    const { data, errors } = await client.mutate({
      mutation: CREATE_MUSIC,
      variables: { input },
    });
    if (errors) throw new Error(errors[0].message);
    return data.createMusic.music;
  },

  updateMusic: async (id: number, input: MusicPayload): Promise<Music> => {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_MUSIC,
      variables: { id, input },
    });
    if (errors) throw new Error(errors[0].message);
    return data.updateMusic.music;
  },

  deleteMusic: async (id: number): Promise<{ message: string }> => {
    const { data, errors } = await client.mutate({
      mutation: DELETE_MUSIC,
      variables: { id },
    });
    if (errors) throw new Error(errors[0].message);
    return data.deleteMusic;
  },
};