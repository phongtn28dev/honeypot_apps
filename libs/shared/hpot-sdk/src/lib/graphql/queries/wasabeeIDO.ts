import { gql } from '@apollo/client';

export const WASABEE_IDO = gql`
  query WasabeeIDO($id: ID!) {
    idopools(where: { id: $id }) {
      purchases(orderBy: timestamp, orderDirection: desc) {
        id
        buyer
        ethAmount
        tokenAmount
        timestamp
      }
    }
  }
`;
