import { IAssetsResponse, ITransaction } from '@GDdark/universal-account';
import { ISmartAccountOptions } from '@GDdark/universal-account';
import { makeAutoObservable, runInAction } from 'mobx';
import { UniversalAccount as PartialUniversalAccount } from '@GDdark/universal-account';
import { universalAccountProjectId } from '../../config/particleUniversalAccount';
import { Address, SignableMessage, zeroAddress } from 'viem';
import { wallet } from './wallet';
import { Token } from '../contract';
import { WrappedToastify } from '../utils';
import { ExternalLinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';

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
}
