import { gql } from '@apollo/client';

export const WASABEE_IDO = gql`
  query WasabeeIDO($id: ID!) {
    idopools(where: { id: $id }) {
      purchases {
        id
        buyer
        ethAmount
        tokenAmount
        timestamp
      }
    }
  }
`;
