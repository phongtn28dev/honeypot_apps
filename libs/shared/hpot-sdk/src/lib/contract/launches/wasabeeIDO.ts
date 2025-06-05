import BigNumber from 'bignumber.js';
import { makeAutoObservable, runInAction } from 'mobx';
import { Address, getContract, GetContractReturnType, zeroAddress } from 'viem';
import { wasabeeIDOABI } from '../../abis/wasabeeIDO/WasabeeIDOABI';
import dayjs, { Dayjs } from 'dayjs';
import { ContractWrite } from '../../utils';
import { Token } from '../token/token';
import { DEFAULT_CHAIN_ID } from '../../../config/algebra/default-chain-id';
import { wallet } from '../../wallet';

export enum IDO_STATUS {
  NOT_STARTED,
  STARTED,
  ENDED,
}

export class WasabeeIDO {
  address: Address | undefined;
  abi = wasabeeIDOABI;

  // Input data
  amountIn: BigNumber = new BigNumber(0);

  // Onchain data
  idoToken: Token | undefined;
  weth: Token | undefined;
  idoTotalAmount: BigNumber = new BigNumber(0);
  priceInETH: BigNumber = new BigNumber(0);
  startsAt: Dayjs = dayjs();
  endsAt: Dayjs = dayjs();
  idoSold: BigNumber = new BigNumber(0);
  maxEthPerWallet: BigNumber = new BigNumber(0);
  feeRate: BigNumber = new BigNumber(0);
  ethPurchased: BigNumber = new BigNumber(0);
  contractBalance: BigNumber = new BigNumber(0);
  purchaseHistory: {
    buyer: string;
    ethAmount: BigNumber;
    tokenAmount: BigNumber;
    timestamp: number;
  }[] = [];
  purchaseHistoryPage = 0;
  purchaseHistoryHasMore = true;

  // Metadata
  chainId: number = DEFAULT_CHAIN_ID;
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  bannerUrl: string = '';
  learnMoreUrl: string = '';
  socials: {
    id: string;
    url: string;
    name: string;
    joinedAt: string;
    provider: string;
    username: string;
    followers: number;
    image_url: string;
  }[] = [];

  constructor({
    address,
    ...args
  }: { address: Address } & Partial<WasabeeIDO>) {
    Object.assign(this, args);
    this.address = address;
    makeAutoObservable(this);
  }

  get contract(): GetContractReturnType<
    typeof wasabeeIDOABI,
    typeof wallet.walletClient
  > {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  get idoStatus() {
    const now = dayjs();
    if (now.isBefore(this.startsAt)) {
      return IDO_STATUS.NOT_STARTED;
    }
    if (now.isAfter(this.endsAt)) {
      return IDO_STATUS.ENDED;
    }
    return IDO_STATUS.STARTED;
  }

  get idoStatusDisplay() {
    switch (this.idoStatus) {
      case IDO_STATUS.ENDED:
        return 'Ended';
      case IDO_STATUS.NOT_STARTED:
        return 'Not Started';
      case IDO_STATUS.STARTED:
        return 'Started';
    }
  }

  async loadPurchaseHistory(page = 0, pageSize = 20) {
    if (!this.address) {
      return;
    }

    try {
      // Get current block number
      const currentBlock = await wallet.publicClient.getBlockNumber();
      // Look back 10,000 blocks per page (approximately 2.5 hours on Berachain)
      const blockRange = BigInt(10000);
      const fromBlock = currentBlock - blockRange * BigInt(page + 1);
      const toBlock = currentBlock - blockRange * BigInt(page);

      const events = await wallet.publicClient.getLogs({
        address: this.address,
        event: {
          type: 'event',
          name: 'Purchased',
          inputs: [
            { type: 'address', name: 'buyer', indexed: true },
            { type: 'uint256', name: 'ethAmount', indexed: false },
            { type: 'uint256', name: 'tokenAmount', indexed: false },
          ],
        },
        fromBlock,
        toBlock,
      });

      // Sort by block number (most recent first)
      const sortedEvents = events
        .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
        .slice(0, pageSize);

      // Get block timestamps for each event
      const blocks = await Promise.all(
        sortedEvents.map((event) =>
          wallet.publicClient.getBlock({ blockNumber: event.blockNumber })
        )
      );

      const newHistory = sortedEvents.map((event, index) => {
        if (!event.args.ethAmount || !event.args.tokenAmount) {
          throw new Error('Invalid event data');
        }
        return {
          buyer: event.args.buyer as string,
          ethAmount: new BigNumber(event.args.ethAmount.toString()).div(1e18),
          tokenAmount: new BigNumber(event.args.tokenAmount.toString()).div(
            10 ** (this.idoToken?.decimals ?? 18)
          ),
          timestamp: Number(blocks[index].timestamp),
        };
      });

      if (page === 0) {
        this.purchaseHistory = newHistory;
      } else {
        this.purchaseHistory = [...this.purchaseHistory, ...newHistory];
      }

      this.purchaseHistoryPage = page;
      this.purchaseHistoryHasMore = events.length >= pageSize;

      return this.purchaseHistory;
    } catch (error) {
      console.error('Error loading purchase history:', error);
      return [];
    }
  }

  async loadMorePurchaseHistory() {
    if (!this.purchaseHistoryHasMore) return;
    return this.loadPurchaseHistory(this.purchaseHistoryPage + 1);
  }

  async loadOnchainData() {
    if (!this.address) {
      return;
    }

    await Promise.all([
      this.loadIDOToken(),
      this.loadWETH(),
      this.loadSaleTimeFrame(),
      this.loadIDOTotalAmount(),
      this.loadPriceInETH(),
      this.loadIDOSold(),
      this.loadMaxEthPerWallet(),
      this.loadFeeRate(),
      this.loadEthPurchased(),
      this.loadPurchaseHistory(0), // Load first page
    ]);

    // Load contract balance after IDO token is loaded
    if (this.idoToken) {
      const balance = await this.idoToken.contract.read['balanceOf']([
        this.address,
      ]);
      this.contractBalance = new BigNumber(balance.toString()).div(
        10 ** (this.idoToken?.decimals ?? 18)
      );
    }
  }

  async loadIDOToken() {
    if (!this.address) {
      return;
    }
    const token = (await this.contract.read['idoToken']()) as `0x${string}`;
    const idoToken = Token.getToken({
      address: token,
      force: true,
      chainId: this.chainId.toString(),
    });

    this.idoToken = idoToken;
    return this.idoToken;
  }

  async loadWETH() {
    if (!this.address) {
      return;
    }
    const token = (await this.contract.read['weth']()) as `0x${string}`;
    const weth = Token.getToken({
      address: token,
      force: true,
      chainId: this.chainId.toString(),
    });

    this.weth = weth;
    return this.weth;
  }

  async loadSaleTimeFrame() {
    if (!this.address) {
      return {
        startsAt: new Date(),
        endsAt: new Date(),
      };
    }

    const startsAt = (await this.contract.read['startTime']()) as bigint;
    const endsAt = (await this.contract.read['endTime']()) as bigint;

    this.startsAt = dayjs(Number(startsAt) * 1000);
    this.endsAt = dayjs(Number(endsAt) * 1000);

    return {
      startsAt: new Date(startsAt.toString()),
      endsAt: new Date(endsAt.toString()),
    };
  }

  async loadIDOTotalAmount() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const totalAmount = (await this.contract.read[
      'idoTotalAmount'
    ]()) as bigint;
    this.idoTotalAmount = new BigNumber(totalAmount.toString()).div(
      10 ** (this.idoToken?.decimals ?? 18)
    );

    return this.idoTotalAmount;
  }

  async loadPriceInETH() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const price = (await this.contract.read['priceInETH']()) as bigint;
    this.priceInETH = new BigNumber(price.toString()).div(1e18);

    return this.priceInETH;
  }

  async loadIDOSold() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const sold = (await this.contract.read['idoSold']()) as bigint;
    this.idoSold = new BigNumber(sold.toString()).div(
      10 ** (this.idoToken?.decimals ?? 18)
    );

    return this.idoSold;
  }

  async loadMaxEthPerWallet() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const max = (await this.contract.read['maxEthPerWallet']()) as bigint;
    this.maxEthPerWallet = new BigNumber(max.toString()).div(1e18);

    return this.maxEthPerWallet;
  }

  async loadFeeRate() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const rate = (await this.contract.read['feeRate']()) as bigint;
    this.feeRate = new BigNumber(rate.toString());

    return this.feeRate;
  }

  async loadEthPurchased() {
    if (!this.address || !wallet.account) {
      return new BigNumber(0);
    }

    const purchased = (await this.contract.read['ethPurchased']([
      wallet.account as `0x${string}`,
    ])) as bigint;
    this.ethPurchased = new BigNumber(purchased.toString()).div(1e18);

    return this.ethPurchased;
  }

  setAmountIn(amountIn: string) {
    runInAction(() => {
      this.amountIn = new BigNumber(amountIn);
    });
  }

  async buyWithETH() {
    if (!this.address || this.amountIn.lte(0)) {
      return;
    }

    try {
      // Check if this purchase would exceed maxEthPerWallet
      const totalAfterPurchase = this.ethPurchased.plus(this.amountIn);
      if (totalAfterPurchase.gt(this.maxEthPerWallet)) {
        throw new Error(
          `This purchase would exceed the maximum BERA per wallet limit of ${this.maxEthPerWallet.toString()} BERA. You have already purchased ${this.ethPurchased.toString()} BERA.`
        );
      }

      // Calculate token amount based on BERA amount and price
      const tokenAmount = this.amountIn.div(this.priceInETH);
      const tokenAmountInWei = BigInt(
        tokenAmount
          .times(10 ** (this.idoToken?.decimals ?? 18))
          .toFixed(0)
          .toString()
      );
      const beraAmountInWei = BigInt(
        this.amountIn.times(1e18).toFixed(0).toString()
      );

      // Check if contract has enough tokens
      if (this.contractBalance.lt(tokenAmount)) {
        throw new Error(
          `Contract has insufficient tokens. Required: ${tokenAmount.toString()} ${
            this.idoToken?.symbol
          }, Available: ${this.contractBalance.toString()} ${
            this.idoToken?.symbol
          }`
        );
      }

      // Check if user has enough ETH
      const userBalance = await wallet.publicClient.getBalance({
        address: wallet.account as `0x${string}`,
      });
      if (userBalance < beraAmountInWei) {
        throw new Error(
          `Insufficient BERA balance. Required: ${this.amountIn.toString()} BERA, Available: ${new BigNumber(
            userBalance.toString()
          )
            .div(1e18)
            .toString()} BERA`
        );
      }

      const debugInfo = {
        amountIn: this.amountIn.toString(),
        priceInETH: this.priceInETH.toString(),
        tokenAmount: tokenAmount.toString(),
        tokenAmountInWei: tokenAmountInWei.toString(),
        beraAmountInWei: beraAmountInWei.toString(),
        tokenDecimals: this.idoToken?.decimals ?? 18,
        idoTokenSymbol: this.idoToken?.symbol,
        ethPurchased: this.ethPurchased.toString(),
        maxEthPerWallet: this.maxEthPerWallet.toString(),
        contractBalance: this.contractBalance.toString(),
        userBalance: new BigNumber(userBalance.toString()).div(1e18).toString(),
      };
      console.log('ETH Purchase Debug:', debugInfo);

      // Simulate the transaction first
      try {
        const simulateResult = await this.contract.simulate['buy'](
          [tokenAmountInWei],
          {
            account: wallet.account as `0x${string}`,
            value: beraAmountInWei,
          }
        );
        console.log('Simulation result:', simulateResult);
        console.log('Transaction simulation successful');
      } catch (simError: any) {
        console.error('Transaction simulation failed:', simError);
        throw new Error(
          `Transaction would fail: ${simError.message || 'Unknown error'}`
        );
      }

      // If simulation succeeds, proceed with actual transaction
      const tx = await new ContractWrite(this.contract.write['buy']).call(
        [tokenAmountInWei],
        {
          value: beraAmountInWei,
        }
      );

      console.log('Transaction successful:', tx);

      // Refresh data after successful purchase
      await this.refreshAfterPurchase();
    } catch (error) {
      console.error('Transaction Error:', error);
      throw error;
    }
  }

  async buyWithWETH() {
    if (!this.address || this.amountIn.lte(0)) {
      return;
    }

    try {
      // Check if this purchase would exceed maxEthPerWallet
      const totalAfterPurchase = this.ethPurchased.plus(this.amountIn);
      if (totalAfterPurchase.gt(this.maxEthPerWallet)) {
        throw new Error(
          `This purchase would exceed the maximum BERA per wallet limit of ${this.maxEthPerWallet.toString()} BERA. You have already purchased ${this.ethPurchased.toString()} BERA.`
        );
      }

      // Calculate token amount based on WBERA amount and price
      const tokenAmount = this.amountIn.div(this.priceInETH);
      const tokenAmountInWei = BigInt(
        tokenAmount
          .times(10 ** (this.idoToken?.decimals ?? 18))
          .toFixed(0)
          .toString()
      );
      const wberaAmountInWei = BigInt(
        this.amountIn.times(1e18).toFixed(0).toString()
      );

      // Check if contract has enough tokens
      const contractBalance = await this.idoToken?.contract.read['balanceOf']([
        this.address,
      ]);
      if (
        !contractBalance ||
        BigInt(contractBalance.toString()) < tokenAmountInWei
      ) {
        throw new Error(
          `Contract has insufficient tokens. Required: ${tokenAmount.toString()} ${
            this.idoToken?.symbol
          }, Available: ${new BigNumber(contractBalance?.toString() ?? '0')
            .div(10 ** (this.idoToken?.decimals ?? 18))
            .toString()} ${this.idoToken?.symbol}`
        );
      }

      const debugInfo = {
        amountIn: this.amountIn.toString(),
        priceInETH: this.priceInETH.toString(),
        tokenAmount: tokenAmount.toString(),
        tokenAmountInWei: tokenAmountInWei.toString(),
        wberaAmountInWei: wberaAmountInWei.toString(),
        tokenDecimals: this.idoToken?.decimals ?? 18,
        idoTokenSymbol: this.idoToken?.symbol,
        ethPurchased: this.ethPurchased.toString(),
        maxEthPerWallet: this.maxEthPerWallet.toString(),
        contractBalance: contractBalance
          ? new BigNumber(contractBalance.toString())
              .div(10 ** (this.idoToken?.decimals ?? 18))
              .toString()
          : '0',
      };
      console.log('WETH Purchase Debug:', debugInfo);

      await this.contract.simulate['buyWithWETH']([tokenAmountInWei], {
        account: wallet.account as `0x${string}`,
      });

      // If simulation succeeds, proceed with approval and transaction
      await this.weth?.approveIfNoAllowance({
        amount: wberaAmountInWei.toString(),
        spender: this.address,
      });

      const tx = await new ContractWrite(
        this.contract.write['buyWithWETH']
      ).call([tokenAmountInWei]);

      console.log('Transaction successful:', tx);

      // Refresh data after successful purchase
      await this.refreshAfterPurchase();
    } catch (error) {
      console.error('Transaction Error:', error);
      throw error;
    }
  }

  async refreshAfterPurchase() {
    // Refresh all relevant data
    await Promise.all([
      this.loadIDOSold(),
      this.loadEthPurchased(),
      this.loadContractBalance(),
      this.loadPurchaseHistory(0), // Reset to first page
    ]);
  }

  async loadContractBalance() {
    if (!this.address || !this.idoToken) {
      return;
    }
    const balance = await this.idoToken.contract.read['balanceOf']([
      this.address,
    ]);
    this.contractBalance = new BigNumber(balance.toString()).div(
      10 ** (this.idoToken?.decimals ?? 18)
    );
    return this.contractBalance;
  }
}
