import { gql } from '@apollo/client';

export const GET_RECENT_ORDERS = gql`
  query RecentOrders {
    orders {
      ...OrderFields
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query UserOrders(
    $user: String
    $skip: Int
    $first: Int
    $status_in: [OrderStatus!]
  ) {
    orders(
      where: { dealer: $user, status_in: $status_in }
      first: $first
      skip: $skip
    ) {
      ...OrderFields
    }
  }
`;

export const GET_RECENT_BUY_ORDERS = gql`
  query RecentBuyOrders($status_in: [OrderStatus!], $skip: Int, $first: Int) {
    orders(
      where: { orderType: BuyBGT, status_in: $status_in }
      skip: $skip
      first: $first
    ) {
      ...OrderFields
    }
  }
`;

export const GET_RECENT_SELL_ORDERS = gql`
  query RecentSellOrders($status_in: [OrderStatus!], $skip: Int, $first: Int) {
    orders(
      where: { orderType: SellBGT, status_in: $status_in }
      skip: $skip
      first: $first
    ) {
      ...OrderFields
    }
  }
`;

export const BUNDLE_FRAGMENT = gql`
  fragment OrderFields on Order {
    id
    dealer {
      id
    }
    price
    vaultAddress
    balance
    spentBalance
    height
    orderType
    status
  }
`;
