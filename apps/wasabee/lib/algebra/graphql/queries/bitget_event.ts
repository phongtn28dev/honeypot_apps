import { gql } from '@apollo/client';

export const GET_BITGET_EVENTS_INFO = gql`
  query getBitgetEvents($user: ID) {
    bitgetCampaigns {
      totalVolumeUSD
      totalFinishedUserCount
      eventPools {
        pool {
          ...PoolFields
        }
        totalVolumeUSD
        totalFinishedUserCount
        top10Users: finishedUsers(orderBy: amountUSD, orderDirection: desc) {
          user {
            ...AccountField
          }
          amountUSD
          finished
        }
        currentUser: finishedUsers(where: { user_: { id: $user } }) {
          user {
            ...AccountField
          }
          amountUSD
          finished
        }
      }
    }
  }
`;
