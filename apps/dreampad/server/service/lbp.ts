import { pg } from '@/lib/db';

type transactionColumn = {
  tx_hash: string;
  buy_amount: string;
  lbp_address: string;
  chain_id: number;
  wallet_address: string;
  created_at: string;
};

export const lbpService = {
  createLbpTransaction: async (data: transactionColumn) => {
    await pg`INSERT INTO lbp_transaction ${pg(data)}`;
  },
  getLbpTransactions: async (data: { tx_hash: string }) => {
    return pg`SELECT * FROM lbp_transaction WHERE tx_hash = ${data.tx_hash}`;
  },
  getLbpTransactionsByLbpAddress: async (data: { lbp_address: string }) => {
    return pg`SELECT * FROM lbp_transaction WHERE lbp_address = ${data.lbp_address}`;
  },
};
