import { gql } from "@apollo/client";

const GET_ENTITIES_I_CAN_SEE = gql`
query GetEntitiesICanSee {
    getEntitiesICanSee {
      id
      name
      longName
      speed
      ownerId
      position
      color
      sightRange
    }
  }
`;


export {
  GET_ENTITIES_I_CAN_SEE
};