import { observer } from 'mobx-react-lite';
import { useSwitchChain, useChainId } from 'wagmi';
import { networks } from '@honeypot/shared/lib/chains';
import { useEffect, useState } from 'react';
import { Token, TokenLogo, wallet } from '@honeypot/shared';
import { CardContainer } from '@honeypot/shared/components/CardContianer';
import { TokenVestingContract } from '@honeypot/shared/lib/contract/token/tokenVesting';
import { formatEther } from 'viem';
import { Button } from '@nextui-org/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { ADDRESS_ZERO } from '@cryptoalgebra/sdk';

const ClaimTokenPage = observer(() => {
  const { chains, switchChain } = useSwitchChain();
  const chain = useChainId();
  const [vestingContract, setVestingContract] =
    useState<TokenVestingContract>();
  const [claimLoading, setClaimLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);

  useEffect(() => {
    if (!wallet.currentChain.contracts.hpotToken.tokenVesting) {
      toast.error('Vesting contract not found');
      return;
    }
    // Initialize vesting contract with the deployed address
    const contract = new TokenVestingContract({
      // Set the contract address from your deployment
      address: wallet.currentChain.contracts.hpotToken.tokenVesting,
    });

    setVestingContract(contract);

    // Initialize the contract data
    if (contract.address) {
      setInitialLoading(true);
      contract.init().finally(() => {
        setInitialLoading(false);
        setDataInitialized(true);
      });
    }

    // Re-fetch data when wallet changes
    const interval = setInterval(() => {
      if (wallet.account && contract.address) {
        contract.init();
      }
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [wallet.currentChain, wallet.account]);

  useEffect(() => {
    if (chain !== 80094) {
      // @ts-ignore
      switchChain(networks.find((network) => network.chainId === 80094)?.chain);
    }
  }, [chain]);

  const handleClaim = async () => {
    if (!vestingContract || !wallet.account) return;

    try {
      setClaimLoading(true);
      await vestingContract.claim.call();
      await vestingContract.init(); // Refresh data after claiming
    } catch (error) {
      console.error('Failed to claim tokens:', error);
    } finally {
      setClaimLoading(false);
    }
  };

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatAmount = (amount?: bigint) => {
    if (!amount) return '0';
    return parseFloat(formatEther(amount)).toFixed(4);
  };

  const isClaimDisabled = () => {
    return (
      claimLoading ||
      !vestingContract?.currentUserClaimableAmount ||
      vestingContract.currentUserClaimableAmount <= BigInt(0)
    );
  };
  if (!wallet.account || wallet.account === ADDRESS_ZERO) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <div>Please connect your wallet to continue</div>
      </div>
    );
  }

  if (chain !== 80094 && chain !== 80069) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <div>Switching to Berachain to continue</div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <CardContainer className="mx-auto max-w-[800px] w-full">
        <div className="flex flex-col items-center p-6 space-y-6 w-full">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>
              <TokenLogo
                token={Token.getToken({
                  address: wallet.currentChain.contracts.hpotToken.token,
                  chainId: wallet.currentChain.chainId.toString(),
                })}
              />
            </span>
            Claim Your Tokens
          </h1>

          {initialLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="ml-2 text-white">
                Loading vesting information...
              </span>
            </div>
          ) : !dataInitialized ? (
            <div className="text-center py-6">
              <p className="mb-4 text-white">Failed to load vesting data</p>
            </div>
          ) : !vestingContract?.currentUserVestingInfo ? (
            <div className="text-center py-6">
              <p className="text-white">
                No vesting schedule found for your address
              </p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 shadow">
                  <h3 className="text-sm text-white mb-1">Total Allocation</h3>
                  <p className="text-xl font-semibold text-white">
                    {formatAmount(vestingContract.currentUserVestingInfo[0])}{' '}
                    Tokens
                  </p>
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <h3 className="text-sm text-white mb-1">Claimed So Far</h3>
                  <p className="text-xl font-semibold text-white">
                    {formatAmount(vestingContract.currentUserVestingInfo[1])}{' '}
                    Tokens
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 shadow">
                  <h3 className="text-sm text-white mb-1">Start Date</h3>
                  <p className="text-base font-medium text-white">
                    {formatDate(vestingContract.currentUserVestingInfo[2])}
                  </p>
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <h3 className="text-sm text-white mb-1">Cliff Ends</h3>
                  <p className="text-base font-medium text-white">
                    {formatDate(
                      vestingContract.currentUserVestingInfo[2] +
                        vestingContract.currentUserVestingInfo[3]
                    )}
                  </p>
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <h3 className="text-sm text-white mb-1">Vesting Ends</h3>
                  <p className="text-base font-medium text-white">
                    {formatDate(
                      vestingContract.currentUserVestingInfo[2] +
                        vestingContract.currentUserVestingInfo[4]
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 shadow border border-primary/20 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      Claimable Now
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {formatAmount(vestingContract.currentUserClaimableAmount)}{' '}
                      Tokens
                    </p>
                  </div>
                  <Button
                    onClick={handleClaim}
                    disabled={isClaimDisabled()}
                    className="px-6 bg-white text-black"
                  >
                    {claimLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      'Claim Tokens'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {vestingContract?.error && !initialLoading && (
            <div className="w-full bg-destructive/10 border border-destructive rounded-lg p-4 mt-4">
              <p className="text-white font-medium">
                Error: {vestingContract.error.message}
              </p>
            </div>
          )}
        </div>
      </CardContainer>
    </div>
  );
});

export default ClaimTokenPage;
