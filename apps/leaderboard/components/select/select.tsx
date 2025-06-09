import { Input } from '../input';
import { WarppedNextSelect } from '../wrappedNextUI/Select/Select';
import { SelectItem } from '@nextui-org/react';
import { useState, useEffect } from 'react';

const tokenOptions = [
  { key: 'LBGT', label: 'LBGT' },
  { key: 'BERA', label: 'BERA' },
  { key: 'HONEY', label: 'HONEY' },
  { key: 'BGT', label: 'BGT' },
  { key: 'USDC', label: 'USDC' },
  { key: 'WETH', label: 'WETH' },
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

  useEffect(() => {
    setInternalSelectedToken(selectedToken || '');
  }, [selectedToken]);

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
              className="hover:bg-black focus:bg-black data-[hover=true]:bg-black data-[focus=true]:bg-black group/item transition-colors duration-150"
              classNames={{
                base: 'hover:bg-black focus:bg-black data-[hover=true]:bg-black data-[focus=true]:bg-black',
                wrapper:
                  'group-hover/item:text-white group-focus/item:text-white',
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 group-hover/item:text-white group-focus/item:text-white transition-colors duration-150">
                  {token.label}
                </span>
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
          isClearable={true}
          onClear={() => onAmountChange?.('')}
        />
      </div>
    </div>
  );
}
