import { gql } from "@apollo/client";

const GET_ENTITIES_I_CAN_SEE = gql`
query GetEntitiesICanSee {
    getEntitiesICanSee {
      id
      name
      longName
      speed
      ownerId
      position {
        x
        y
      }
      color
    }
  }
`;


export {
  GET_ENTITIES_I_CAN_SEE
};