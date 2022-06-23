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

export {
  GET_ALL_PLAYERS,
  GET_NEARBY_TILES,
  GET_WORLD_STATE
};
