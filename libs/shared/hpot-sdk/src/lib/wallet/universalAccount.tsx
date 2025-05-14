import {
  IAssetsResponse,
  ITransaction,
  SUPPORTED_TOKEN_TYPE,
  SUPPORTED_PRIMARY_TOKENS,
} from '@particle-network/universal-account-sdk';
import { ISmartAccountOptions } from '@particle-network/universal-account-sdk';
import { makeAutoObservable, runInAction } from 'mobx';
import { UniversalAccount as PartialUniversalAccount } from '@particle-network/universal-account-sdk';
import { universalAccountProjectId } from '../../config/particleUniversalAccount';
import { Address, parseEther, SignableMessage, zeroAddress } from 'viem';
import { wallet } from './wallet';
import { Token } from '../contract';
import { WrappedToastify } from '../utils';
import { ExternalLinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { BigNumber } from 'bignumber.js';

export class UniversalAccount {
  ownerAddress: string;
  universalAccount: undefined | PartialUniversalAccount;
  universalAccountAssetValueUSD: IAssetsResponse | undefined;
  universalAccountInfo: ISmartAccountOptions | undefined;

  evmSmartAccountAddress: Address = zeroAddress;
  solanaSmartAccountAddress: Address = zeroAddress;
  accountUsdValue: number = 0;

  constructor(private readonly account: string) {
    this.ownerAddress = account;
    this.universalAccount = new PartialUniversalAccount({
      projectId: universalAccountProjectId,
      ownerAddress: account,
      tradeConfig: {
        // If this is not set, it will use auto slippage
        slippageBps: 100, // 100 means 1%, max is 10000
        // Use $PARTI to pay for fees
        // Otherwise, the SDK will use the primary tokens (e.g. USDC, ETH)
        // universalGas: true,
      },
    });
    makeAutoObservable(this);
  }

  get currentChainSupportedTokens() {
    return SUPPORTED_PRIMARY_TOKENS.filter((token) => {
      return token.chainId === wallet.currentChain.chainId;
    }).map((token) => {
      return Token.getToken({
        address: token.address,
        chainId: token.chainId.toString(),
        isNative: token.address === zeroAddress,
      });
    });
  }

  async getAccountTokenBalance(token: Token) {
    return await token.contract.read.balanceOf([this.evmSmartAccountAddress]);
  }

  async loadUniversalAccountInfo() {
    if (this.universalAccount) {
      const primaryAssetsResponse =
        await this.universalAccount.getPrimaryAssets();
      const smartAccountOptionsResponse =
        await this.universalAccount.getSmartAccountOptions();

      runInAction(() => {
        this.universalAccountAssetValueUSD = primaryAssetsResponse;
        this.universalAccountInfo = smartAccountOptionsResponse;

        this.evmSmartAccountAddress =
          smartAccountOptionsResponse.smartAccountAddress as Address;
        this.solanaSmartAccountAddress =
          smartAccountOptionsResponse.solanaSmartAccountAddress as Address;
        this.accountUsdValue = primaryAssetsResponse.totalAmountInUSD;
      });
    }
  }

  async buyToken(token: Token, amountInUSD: string) {
    const pendingToastId = WrappedToastify.pending({
      title: 'Purchasing token...',
      message: token.symbol,
    });
    try {
      const transaction = await this.universalAccount?.createBuyTransaction({
        token: {
          chainId: Number(token.chainId),
          address: token.isNative ? zeroAddress : token.address,
        },
        amountInUSD: amountInUSD,
      });

      const signature = await wallet.walletClient.request({
        method: 'personal_sign',
        params: [
          transaction?.rootHash ?? '',
          // @ts-ignore
          wallet.account,
        ],
      });

      console.log({ signature });

      const result = await this.universalAccount?.sendTransaction(
        transaction as ITransaction,
        signature as `0x${string}`
      );
      console.log({ result });

      WrappedToastify.success({
        title: 'Token purchased successfully',
        message: (
          <div>
            <p>Token Purchased</p>
            <p>
              <a
                className="flex items-center gap-1 text-yellow-500"
                target="_blank"
                href={`https://universalx.app/activity/details?id=${result.transactionId}`}
              >
                View Transaction <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </p>
          </div>
        ),
      });
    } catch (error: any) {
      console.log({ error });
      WrappedToastify.error({
        title: 'Error purchasing token',
        message: error.message,
      });
    } finally {
      toast.dismiss(pendingToastId);
    }
  }

  async deposit(token: Token, amount: string) {
    try {
      token.transfer.call([
        this.evmSmartAccountAddress,
        BigInt(
          new BigNumber(amount).multipliedBy(10 ** token.decimals).toFixed()
        ),
      ]);
    } catch (error: any) {
      console.log({ error });
      WrappedToastify.error({
        title: 'Error depositing token',
        message: error.message,
      });
    }
  }

  async withdraw(token: Token, amount: string) {
    if (!this.universalAccount) {
      throw new Error('Universal account not found');
    }

    const pendingToastId = WrappedToastify.pending({
      title: 'Withdrawing token...',
      message: `Withdrawing ${token.symbol}`,
    });

    const transaction = await this.universalAccount.createTransferTransaction({
      receiver: wallet.account,
      amount: amount,
      token: {
        chainId: wallet.currentChain.chainId,
        address: token.address,
      },
    });

    const signature = await wallet.walletClient.request({
      method: 'personal_sign',
      params: [
        transaction?.rootHash as `0x${string}`,
        wallet.account as `0x${string}`,
      ],
    });

    const result = await this.universalAccount?.sendTransaction(
      transaction as ITransaction,
      signature as `0x${string}`
    );

    console.log({ result });

    WrappedToastify.success({
      title: 'Token withdrawn successfully',
      message: (
        <div>
          <p>Token Withdrawn</p>
          <p>
            <a
              className="flex items-center gap-1 text-yellow-500"
              target="_blank"
              href={`https://universalx.app/activity/details?id=${result.transactionId}`}
            >
              View Transaction <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </p>
        </div>
      ),
    });
  }
}
