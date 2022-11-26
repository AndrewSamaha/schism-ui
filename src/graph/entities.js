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

const MY_ACTION_EFFECT_MUTATION = gql`
mutation myActionEffect($aE: MyActionEffectInput) {
  myActionEffect(aE: $aE)
}
`;

const MY_CREATE_NEW_ENTITIES_MUTATION = gql`
mutation myCreateNewEntities($entities: [MyNewEntityInput]!) {
  myCreateNewEntities(entities: $entities)
}
`;

export {
  GET_ENTITIES_I_CAN_SEE,
  MY_ACTION_EFFECT_MUTATION,
  MY_CREATE_NEW_ENTITIES_MUTATION
};