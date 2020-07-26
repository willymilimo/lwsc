export const toFixed = (value: string | number) => {
  let amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) amount = 0;
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

// export const asyncForEach = async (array: any[], callback: Function) => {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// };

export async function asyncForEach<T>(array: T[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
