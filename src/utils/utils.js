//@flow

export const toCurrencyString = (value: number, currency: string): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: currency
  });
};
