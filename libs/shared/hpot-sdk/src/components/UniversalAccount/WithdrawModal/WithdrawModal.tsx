import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { Button } from '../../button';
import { useEffect, useState } from 'react';
import { TokenSelector } from '../../TokenSelector';
import { Token } from '../../../lib/contract';
import { wallet } from '../../../lib/wallet';
import TokenCard from '../../TokenCard/TokenCard';
import { zeroAddress } from 'viem';
import { ExtendedNative } from '@cryptoalgebra/sdk';
import { Token as AlgebraToken } from '@cryptoalgebra/sdk';
import { DynamicFormatAmount } from '@honeypot/shared';
import UniversalAccountTokenCard from '../../TokenCard/UniversalAccountTokenCard';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<Token | undefined>(
    wallet.universalAccount?.currentChainSupportedTokens[0]
  );
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleMaxButtonClick = () => {
    setAmount(
      wallet.universalAccount?.currentChainSupportedTokens[0].balance.toString() ??
        '0'
    );
  };
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Withdraw from Universal Account</ModalHeader>
        <div className="flex justify-end items-center gap-x-2 px-8">
          <span className="font-bold">Account Balance:</span>{' '}
          <span className="text-right">
            {DynamicFormatAmount({
              amount: wallet.universalAccount?.accountUsdValue ?? 0,
              decimals: 5,
              endWith: token?.symbol ?? '',
            })}
          </span>
        </div>
        <ModalBody>
          <UniversalAccountTokenCard
            classNames={{
              textColors: {
                balance: 'text-white',
              },
            }}
            staticTokenList={
              wallet.universalAccount?.currentChainSupportedTokens
            }
            showMaxButton={true}
            showBalance={false}
            showAdvancedInput={false}
            handleMaxValue={handleMaxButtonClick}
            handleTokenSelection={(token) =>
              setToken(
                Token.getToken({
                  address: token.isNative
                    ? wallet.currentChain.nativeToken.address
                    : token.wrapped?.address ?? zeroAddress,
                  chainId:
                    token.wrapped?.chainId.toString() ??
                    wallet.currentChain.chainId.toString(),
                  isNative: token.isNative,
                })
              )
            }
            value={amount}
            handleValueChange={(value) => setAmount(value)}
            currency={
              token &&
              (token.isNative
                ? ExtendedNative.onChain(
                    Number(token?.chainId ?? wallet.currentChain.chainId),
                    token?.symbol ?? '',
                    token?.name ?? ''
                  )
                : new AlgebraToken(
                    Number(token?.chainId),
                    token?.address ?? '',
                    Number(token?.decimals),
                    token?.symbol ?? '',
                    token?.name ?? ''
                  ))
            }
            otherCurrency={null}
          />
          <Button
            onPress={() => {
              if (token) {
                wallet.universalAccount?.withdraw(token, amount);
              }
            }}
          >
            Withdraw
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
