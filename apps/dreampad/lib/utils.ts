import BigNumber from "bignumber.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function toCompactLocaleString(
  value: number | string | BigNumber,
  options?: Intl.NumberFormatOptions
) {
  if (!!!value) return "0";
  return Number(value) >= 0.01
    ? Number(value).toLocaleString("en-US", {
        // add suffixes for thousands, millions, and billions
        // the maximum number of decimal places to use
        maximumFractionDigits: 2,
        // specify the abbreviations to use for the suffixes
        notation: "compact",
        compactDisplay: "short",
        ...options,
      })
    : "< 0.01";
}

export const shortenAddressString = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
};

export const formatVolume = (volume: number): string => {
  const value = volume;

  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }

  return `$${value.toFixed(2)}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isNotNull = (value: any): boolean => {
  return value !== null && value !== undefined;
};

export function hasValue(obj: any): boolean {
  if (typeof obj !== "object" || obj === null) return false;
  for (let key in obj) {
    const value = obj[key];
    if (typeof value !== "object" && isNotNull(value) && Boolean(value))
      return true;

    if (Array.isArray(value)) {
      if (value.some(hasValue)) return true;
    }

    if (typeof value === "object" && value !== null) {
      if (hasValue(value)) return true;
    }
  }

  return false;
}
type FilterObject = {
  [key: string]: any;
};

export function removeEmptyFields(obj: FilterObject): FilterObject {
  const cleanedObject: FilterObject = {};

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        const nestedObject = removeEmptyFields(obj[key]);
        if (Object.keys(nestedObject).length > 0) {
          cleanedObject[key] = nestedObject;
        }
      } else if (obj[key] !== "") {
        cleanedObject[key] = obj[key];
      }
    }
  }

  return cleanedObject;
}
