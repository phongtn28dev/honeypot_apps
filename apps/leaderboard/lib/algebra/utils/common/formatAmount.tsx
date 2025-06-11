import { ReactNode } from "react";
import { formatCurrency } from "./formatCurrency";

export function formatAmountWithAlphabetSymbol(
  amount: string,
  decimals = 3
): string {
  const amountNum = Number(amount);
  const minAmount = 1 / 10 ** decimals;

  if (amountNum === 0) return "0";
  if (amountNum < minAmount) return `< ${minAmount}`;
  if (amountNum < 1)
    return (Math.floor(amountNum / minAmount) * minAmount).toFixed(decimals);
  if (amountNum < 100) return (Math.floor(amountNum * 100) / 100).toString();
  if (amountNum < 10000) return Math.floor(amountNum).toString();

  if (amountNum < 1000000000000000)
    return formatCurrency.format(Math.floor(amountNum * 100) / 100);

  return "∞";
}

export function formatAmountWithScientificNotation(
  amount: string,
  decimals = 3
): string {
  const amountNum = Number(amount);
  if (amountNum === 0) return "0";
  return amountNum.toExponential(decimals);
}

export function DynamicFormatAmount({
  amount,
  decimals = 3,
  beginWith,
  endWith,
}: {
  amount: string | number;
  decimals?: number;
  beginWith?: ReactNode;
  endWith?: ReactNode;
}): ReactNode {
  console.log("DynamicFormatAmount", amount, decimals, beginWith, endWith);

  const isNegative = Number(amount) < 0;
  const absAmount = Math.abs(Number(amount));
  const amountStr = absAmount.toString();
  const output: ReactNode =
    getFirstDecimalPlace(amountStr) < decimals
      ? formatAmountWithAlphabetSymbol(amountStr, decimals)
      : FormatSmallDecimal({ number: Number(amountStr) });

  return (
    <span>
      {beginWith ? `${beginWith} ` : ""}
      {isNegative ? "-" : ""}
      {output}
      {endWith ? ` ${endWith}` : ""}
    </span>
  );
}

export function FormatSmallDecimal({
  number,
  decimals = 10,
}: {
  number: number;
  decimals?: number;
}) {
  function formatSmallDecimal(num: number): ReactNode {
    if (num === 0) return "0"; // Handle zero separately
    if (num >= 1) return num.toFixed(decimals);

    const numStr = num.toFixed(18);
    let firstNonZeroIndex = 0;

    for (let i = 0; i < numStr.length; i++) {
      if (numStr[i + 3] !== "0") {
        firstNonZeroIndex = i + 3;
        break;
      }
    }

    const first2digit =
      numStr[2] === "0" ? numStr.slice(0, 3) : numStr.slice(0, 2);
    const compressedCount = firstNonZeroIndex < 3 ? 0 : firstNonZeroIndex - 3;
    const first2NonZero = numStr.slice(
      firstNonZeroIndex,
      2 + firstNonZeroIndex
    );

    console.log({ numStr, first2digit, compressedCount, first2NonZero });
    return (
      <>
        {first2digit}
        <sub>{compressedCount === 0 ? "" : compressedCount + 1}</sub>
        {first2NonZero}
      </>
    );
  }

  return <span>{formatSmallDecimal(number)}</span>;
}

export function getFirstDecimalPlace(amount: string): number {
  if (Number(amount) === 0 || Math.abs(Number(amount)) > 1) return 0;

  let decimalPlaces = 0;
  if (amount.includes(".")) {
    const decimalString = amount.split(".")[1];
    while (decimalString[decimalPlaces] === "0") {
      decimalPlaces++;
    }
  }
  return decimalPlaces;
}

export function reverseFormatAmount(formattedNumber: string): number {
  const suffixes: { [key: string]: number } = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };

  const suffix = formattedNumber.slice(-1);
  const value = parseFloat(formattedNumber.slice(0, -1));

  if (formattedNumber.startsWith("< ") || formattedNumber.startsWith("> ")) {
    const value = parseFloat(formattedNumber.slice(2));
    return value > 0 ? value : 0;
  }

  if (suffixes[suffix]) {
    return value * suffixes[suffix];
  } else {
    return parseFloat(formattedNumber);
  }
}
