import { gql } from '@apollo/client';

export const POOL_REWARD = gql`
query PoolRewards {
  globals {
    items {
      totalWeight
    }
  }
}`;