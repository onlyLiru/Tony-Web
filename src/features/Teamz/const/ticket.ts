// export enum TicketNum {
//   VIP = 10,
//   RED = 20,
//   NORMAL = 30,
// }
export const totalTikcetNum = {
  vip: 6000,
  red: 6000,
  express: 600,
  general: 6000,
  business: 6000,
};
export const ticketPrice = {
  vip: 320,
  red: 150,
  express: 40,
  general: 60,
  business: 110,
};
export const confEndTime = '13 April 2024 23:59:59 GMT+9'; // UTC Time String
// export const confEndTime = '17 May 2023 23:59:59 GMT+9'; // UTC Time String

const birdTimestamp = 1702742400;

export const isBirdTime = () => {
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);
  return birdTimestamp > currentTimestamp;
};
