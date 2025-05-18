import { wallet } from '@honeypot/shared/lib/wallet';
import { PAGE_LIMIT, SubgraphProjectFilter } from '..';
import { IndexerPaginationState } from '@honeypot/shared';
import { fetchPot2PumpList } from '@/lib/algebra/graphql/clients/pair';
import { MemePairContract } from '@/services/contract/launches/pot2pump/memepair-contract';

export class Pot2PumpPumpingService {
  DEFAULT_FILTER: SubgraphProjectFilter = {
    currentPage: 0,
    status: 'success',
    limit: PAGE_LIMIT,
    hasNextPage: true,
    orderBy: 'endTime',
    orderDirection: 'desc',
  };

  projectsPage = new IndexerPaginationState<
    SubgraphProjectFilter,
    MemePairContract
  >({
    namespace: 'projectsPage',
    defaultFilter: this.DEFAULT_FILTER,
    LoadNextPageFunction: async (filter) => {
      return await this.LoadMoreProjectPage(filter);
    },
  });

  LoadMoreProjectPage = async (filter: SubgraphProjectFilter) => {
    const res = await fetchPot2PumpList({
      chainId: String(wallet.currentChainId),
      filter: filter,
    });

    console.log('res', res);

    if (res.status === 'success') {
      return { items: res.data.pairs, filterUpdates: res.data.filterUpdates };
    } else {
      return {
        items: [],
      };
    }
  };
}
