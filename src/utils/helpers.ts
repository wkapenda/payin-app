import { currencyOptions } from "@/constants/currencies";

export function getCurrencyLabel(value: string | null): string {
  const option = currencyOptions.find((opt) => opt.value === value);
  return option ? option.label : "Bitcoin";
}
