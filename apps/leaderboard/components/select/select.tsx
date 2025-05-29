import { Input } from '../input';
import { WarppedNextSelect } from '../wrappedNextUI/Select/Select';
import { SelectItem } from '@nextui-org/react';
import { useState } from 'react';

// Define token options
const tokenOptions = [
  { key: 'LBGT', label: 'LBGT', symbol: 'LBGT', icon: '🍯' },
  { key: 'BERA', label: 'BERA', symbol: 'BERA', icon: '🐻' },
  { key: 'HONEY', label: 'HONEY', symbol: 'HONEY', icon: '🍯' },
  { key: 'BGT', label: 'BGT', symbol: 'BGT', icon: '🎯' },
  { key: 'USDC', label: 'USDC', symbol: 'USDC', icon: '💰' },
  { key: 'WETH', label: 'WETH', symbol: 'WETH', icon: '⚡' },
];

interface InputSectionProps {
  onTokenChange?: (value: string) => void;
  onAmountChange?: (value: string) => void;
  selectedToken?: string;
  amount?: string;
  className?: string;
}

export default function InputSection({
  onTokenChange,
  onAmountChange,
  selectedToken,
  amount,
  className = '',
}: InputSectionProps) {
  const [internalSelectedToken, setInternalSelectedToken] = useState<string>(
    selectedToken || ''
  );

  const handleTokenChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    setInternalSelectedToken(selectedKey);
    onTokenChange?.(selectedKey);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Choose a token
        </label>
        <WarppedNextSelect
          placeholder="Select a token"
          selectedKeys={internalSelectedToken ? [internalSelectedToken] : []}
          onSelectionChange={handleTokenChange}
          className="w-full"
          classNames={{
            trigger:
              'h-[48px] bg-white border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200',
            popoverContent: 'bg-white border border-gray-300 shadow-lg',
            listboxWrapper: 'p-0',
            listbox: 'p-0',
          }}
        >
          {tokenOptions.map((token) => (
            <SelectItem
              key={token.key}
              value={token.key}
              startContent={<span className="text-lg mr-2">{token.icon}</span>}
              className="hover:bg-black group/item"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 group-hover/item:text-white">{token.label}</span>
                <span className="text-xs text-gray-500 group-hover/item:text-gray-300">{token.symbol}</span>
              </div>
            </SelectItem>
          ))}
        </WarppedNextSelect>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Enter amount
        </label>
        <Input
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="h-[48px] bg-white border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow text-gray-900 font-medium rounded-xl"
          type="number"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}
