import { action, makeAutoObservable, reaction } from 'mobx';
import { Token } from '@honeypot/shared';
import { PairContract } from '@honeypot/shared';
import { AsyncState } from './utils';
import { ChartDataResponse, resolutionType } from './priceFeed/priceFeedTypes';
import { wallet } from '@honeypot/shared';
import { trpcClient } from '@/lib/trpc';
import { dayjs } from '@/lib/dayjs';
import { AlgebraPoolContract } from './contract/algebra/algebra-pool-contract';

type Range = '5M' | '15M' | '30M' | '4H' | '1D';

export const chartColorThemes = {
  default: {
    textColor: 'white',
    labelColor: 'orange',
  },
  green: {
    textColor: 'white',
    labelColor: '#43D9A3',
  },
  red: {
    textColor: 'white',
    labelColor: 'red',
  },
};

export const chartTimeRanges: {
  [key: string]: {
    label: Range;
    value: number;
    resolution: resolutionType;
  };
} = {
  '5M': {
    label: '5M',
    value: dayjs().unix() - 60 * 5 * 10,
    resolution: '1',
  },
  '15M': {
    label: '15M',
    value: dayjs().unix() - 60 * 15 * 10,
    resolution: '5',
  },
  '30M': {
    label: '30M',
    value: dayjs().unix() - 60 * 30 * 10,
    resolution: '15',
  },
  '4H': {
    label: '4H',
    value: dayjs().unix() - 60 * 60 * 4 * 10,
    resolution: '30',
  },
  '1D': {
    label: '1D',
    value: dayjs().unix() - 60 * 60 * 24 * 10,
    resolution: '60',
  },
};

class Chart {
  isLoading = false;
  showChart = true;
  chartTarget: Token | PairContract | AlgebraPoolContract | undefined =
    undefined;
  tokenNumber: 0 | 1 = 0;
  currencyCode: 'USD' | 'TOKEN' = 'USD';
  range: Range = '5M';
  chartColors = chartColorThemes.default;
  chartLabel = '';
  chartData = new AsyncState<
    () => Promise<ChartDataResponse | undefined>,
    ChartDataResponse | undefined
  >(async () => {
    if (!this.chartTarget) {
      console.log('Chart data fetch canceled: No chart target defined');
      return undefined;
    }

    console.log('Starting chart data fetch...');
    this.isLoading = true;

    try {
      console.log('Chart data request parameters:', {
        chainId: wallet.currentChainId.toString(),
        tokenAddress: this.chartTarget.address,
        from: this.timestampsByRange,
        to: dayjs().unix(),
        resolution: chartTimeRanges[this.range].resolution,
        tokenNumber: this.tokenNumber,
        currencyCode: this.currencyCode,
      });

      const priceDataRequest = await trpcClient.priceFeed.getChartData.query({
        chainId: wallet.currentChainId.toString(),
        tokenAddress: this.chartTarget.address,
        from: this.timestampsByRange,
        to: dayjs().unix(),
        resolution: chartTimeRanges[this.range].resolution,
        tokenNumber: this.tokenNumber,
        currencyCode: this.currencyCode,
      });

      this.isLoading = false;

      if (priceDataRequest.status === 'error') {
        console.log(
          'Chart data fetch error:',
          priceDataRequest.message || 'Unknown error'
        );
        return undefined;
      } else {
        console.log('Chart data fetch successful:', {
          dataPoints: priceDataRequest.data?.getBars?.c?.length || 0,
          firstPrice: priceDataRequest.data?.getBars?.c?.[0],
          lastPrice:
            priceDataRequest.data?.getBars?.c?.[
              priceDataRequest.data?.getBars?.c?.length - 1
            ],
        });
        return priceDataRequest.data;
      }
    } catch (error) {
      console.error('Exception during chart data fetch:', error);
      this.isLoading = false;
      return undefined;
    }
  });

  get currentPrice() {
    if (this.chartData.value?.getBars?.c) {
      console.log('getBars', this.chartData.value.getBars);
      const priceIndex = this.chartData.value.getBars.c.length - 1;
      const price = this.chartData.value.getBars.c[priceIndex];
      console.log(`Accessing current price: ${price} (index: ${priceIndex})`);
      return price;
    } else {
      console.log('No chart data available for current price');
      return 0;
    }
  }

  get chartPricePercentageChange() {
    if (this.chartData.value?.getBars?.c) {
      const firstPrice = this.firstValidPrice;
      const lastPrice = this.lastValidPrice;

      return ((lastPrice - firstPrice) / firstPrice) * 100;
    } else {
      return 0;
    }
  }

  get TargetLogoDisplay(): Token[] {
    if (this.chartTarget instanceof Token) {
      this.chartTarget.init();
      return [this.chartTarget];
    } else if (this.chartTarget instanceof PairContract) {
      this.chartTarget.token0.init();
      this.chartTarget.token1.init();
      return [this.chartTarget.token0, this.chartTarget.token1];
    } else if (this.chartTarget instanceof AlgebraPoolContract) {
      this.chartTarget.init();
      return [this.chartTarget.token0.value!, this.chartTarget.token1.value!];
    } else {
      return [];
    }
  }

  get firstValidPrice() {
    if (
      this.chartData.value?.getBars.c &&
      this.chartData.value.getBars.c.length > 0
    ) {
      let i = 0;
      while (
        (this.chartData.value.getBars.c[i] === undefined ||
          this.chartData.value.getBars.c[i] === null) &&
        i < this.chartData.value.getBars.c.length
      ) {
        i++;
      }

      return this.chartData.value.getBars.c[i] ?? 0;
    } else {
      return 0;
    }
  }

  get lastValidPrice() {
    if (this.chartData.value?.getBars.c) {
      let i = this.chartData.value.getBars.c.length - 1;
      while (
        (this.chartData.value.getBars.c[i] === undefined ||
          this.chartData.value.getBars.c[i] === null) &&
        i > 0
      ) {
        i--;
      }

      return this.chartData.value.getBars.c[i] ?? 0;
    } else {
      return 0;
    }
  }

  get timestampsByRange() {
    return chartTimeRanges[this.range].value;
  }

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => [this.range, this.chartTarget],
      () => {
        this.chartData.call();
      }
    );
  }

  async updateCurrentPrice() {
    if (!this.chartTarget) {
      console.log('updateCurrentPrice skipped: No chart target defined');
      return;
    }

    console.log('Fetching latest price update...');
    try {
      const from = dayjs().unix() - 60;
      const to = dayjs().unix();

      console.log('Latest price request parameters:', {
        chainId: wallet.currentChainId.toString(),
        tokenAddress: this.chartTarget.address,
        from,
        to,
        resolution: '1',
        tokenNumber: this.tokenNumber,
        currencyCode: this.currencyCode,
      });

      const newestPrice = await trpcClient.priceFeed.getChartData.query({
        chainId: wallet.currentChainId.toString(),
        tokenAddress: this.chartTarget.address,
        from,
        to,
        resolution: '1',
        tokenNumber: this.tokenNumber,
        currencyCode: this.currencyCode,
      });

      if (
        newestPrice.status === 'success' &&
        newestPrice.data?.getBars?.c[0] !== undefined
      ) {
        const newPrice = newestPrice.data?.getBars?.c[0];
        console.log('Latest price update received:', newPrice);

        if (this.chartData.value?.getBars?.c) {
          console.log(
            'Previous last price:',
            this.chartData.value.getBars.c[
              this.chartData.value.getBars.c.length - 1
            ]
          );
          this.chartData.value.getBars.c.push(
            newestPrice.data?.getBars?.c[0] as never
          );
          console.log('Updated chart with new price point');
        } else {
          console.log('Cannot update chart: No existing chart data');
        }
      } else {
        console.log('Latest price update failed or returned undefined data:', {
          status: newestPrice.status,
          hasData: newestPrice.data?.getBars?.c[0] !== undefined,
        });
      }
    } catch (error) {
      console.error('Exception during latest price update:', error);
    }
  }

  toggleChart() {
    this.showChart = !this.showChart;
  }

  setChartTarget(
    target: Token | PairContract | AlgebraPoolContract | undefined
  ) {
    this.chartTarget = target;
  }

  setRange(value: Range) {
    this.range = value;
  }

  setTokenNumber(value: 0 | 1) {
    this.tokenNumber = value;
  }

  setCurrencyCode(value: 'USD' | 'TOKEN') {
    this.currencyCode = value;
  }

  setChartLabel(value: string) {
    this.chartLabel = value;
  }

  setChartColors(value: 'default' | 'green' | 'red') {
    this.chartColors = chartColorThemes[value];
  }
}

export const chart = new Chart();
