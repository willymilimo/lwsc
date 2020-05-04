export const toFixed = (value: string | number) => {
  let amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) amount = 0;
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
