import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Button } from '../../button';
import { useEffect, useState } from 'react';
import { TokenSelector } from '../../TokenSelector';
import { Token } from '../../../lib/contract';
import { wallet } from '../../../lib/wallet';
import TokenCard from '../../TokenCard/TokenCard';
import { zeroAddress } from 'viem';
import { ExtendedNative } from '@cryptoalgebra/sdk';
import { Token as AlgebraToken } from '@cryptoalgebra/sdk';
interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
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
        <ModalHeader>Deposit to Universal Account</ModalHeader>
        <ModalBody>
          <TokenCard
            classNames={{
              textColors: {
                balance: 'text-white',
              },
            }}
            staticTokenList={
              wallet.universalAccount?.currentChainSupportedTokens
            }
            showMaxButton={true}
            showBalance={true}
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
                wallet.universalAccount?.deposit(token, amount);
              }
            }}
          >
            Deposit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
