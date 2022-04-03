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

export default GET_ALL_PLAYERS;
