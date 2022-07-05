import { gql } from "@apollo/client";

const GET_ALL_PLAYERS = gql`
  query getAllPlayers {
    getAllPlayers {
      id
      name
      gameState {
        position {
          x
          y
          z
        }
      }
    }
  }
`;

const GET_NEARBY_TILES = gql`
query GetTilesNear($positions: [PositionInput]!, $range: Int!) {
  getTilesNear(positions: $positions, range: $range) {
    x
    y
    TileType {
      type
    }
  }
}
`;

const GET_WORLD_STATE = gql`
query GetWorldState($positions: [PositionInput]!, $range: Int!) {
  getWorldState(positions: $positions, range: $range) {
    tiles {
      x
      y
      TileType {
        type
      }
    }
    position {
      x
      y
      z
    }
    stateTimeUTC
    range
  }
}
`;

const GET_CHUNK = gql`
query GetChunk($positions: [PositionInput]!, $chunkSize: Int!) {
  getWorldState(positions: $positions, chunkSize: $chunkSize) {
    tiles {
      x
      y
      TileType {
        type
      }
    }
    position {
      x
      y
      z
    }
    stateTimeUTC
    chunkSize
  }
}
`;


export {
  GET_ALL_PLAYERS,
  GET_NEARBY_TILES,
  GET_WORLD_STATE,
  GET_CHUNK
};
