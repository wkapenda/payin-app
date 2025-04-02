import { currencyOptions } from "@/constants/currencies";

export function getCurrencyLabel(value: string | null): string {
  const option = currencyOptions.find((opt) => opt.value === value);
  return option ? option.label : "Bitcoin";
}

// Shorten the value if it is too long.
export const shortenValue = (val: string): string => {
  const threshold = 15;
  if (val.length <= threshold) return val;
  const prefixLength = 7;
  const suffixLength = 5;
  return `${val.substring(0, prefixLength)}...${val.substring(
    val.length - suffixLength
  )}`;
};
