import { Token } from '@honeypot/shared';

declare type pairQueryOutput = Record<
  string,
  {
    address: string;
    token0: Token;
    token1: Token;
  }
>;
