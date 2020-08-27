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

export function formatDate(date: Date | string) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function formatDateTime(date: Date | string) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = "" + d.getFullYear(),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes(),
    seconds = "" + d.getSeconds();

  console.log(d);

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;
  if (month.length < 2) seconds = "0" + seconds;

  return `${[year, month, day].join("-")} ${[hour, minute, seconds].join(":")}`;
}

export function uuid() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export function isMoreThanOneDay(loadTime: Date) {
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date().valueOf() - loadTime.valueOf() > oneDay;
}
