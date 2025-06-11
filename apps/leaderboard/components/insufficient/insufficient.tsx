import React from 'react';

interface InsufficientProps {
  balance: string | number;
  selectedToken: string;
}

export default function Insufficient({
  balance,
  selectedToken,
}: InsufficientProps) {
  return (
    <div className="w-full mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            <span className="font-medium">Insufficient balance!</span> You only
            have {balance} {selectedToken} tokens available.
          </p>
        </div>
      </div>
    </div>
  );
}
