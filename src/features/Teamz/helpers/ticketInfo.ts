import { formatUnits } from 'ethers/lib/utils.js';
import { tiktMintType, tiktPriceType } from '../hooks/useTicket';
import { BigNumber } from 'ethers';
import { CreateToastFnReturn, UseToastOptions } from '@chakra-ui/react';
import { requestV1 } from '@/utils/request';

const mailUrl = `/api/project/v1/email/send`;
const setMailUrl = `/api/integral/v1/whitelist/user/address`;

export const calculatePrice = (
  tiktMint: tiktMintType,
  tiktPrice: tiktPriceType,
) => {
  // USDT Price
  const priceT: number =
    tiktMint.vip * tiktPrice.vip +
    tiktMint.red * tiktPrice.red +
    tiktMint.general * tiktPrice.general +
    tiktMint.business * tiktPrice.business +
    tiktMint.express * tiktPrice.express;

  return priceT;
};

const validMintTotal = (
  tiktMint: tiktMintType,
  tiktPrice: tiktPriceType,
  balc: any,
) => {
  let valid = false;
  try {
    // USDT Price
    const priceT: number = calculatePrice(tiktMint, tiktPrice);
    // USDT Balance
    const balcT = Number(formatUnits(BigNumber.from(balc), 6));
    console.info(
      '[ticketInfo][otalPrice]:',
      'Price = ',
      priceT,
      'Balance = ',
      balcT,
    );
    valid = balcT >= priceT;
  } catch (err) {
    console.error('[Helper][vldTiktTotal]err:', err);
  }
  return valid;
};

const validMintNum = (tiktMint: tiktMintType) => {
  const valid =
    tiktMint.red +
      tiktMint.express +
      tiktMint.vip +
      tiktMint.general +
      tiktMint.business >=
    1;
  console.info('[ticketInfo][validMintNum]:', valid);
  return valid;
};

const validDollarNum = (tiktMint: tiktMintType) => {
  const valid =
    tiktMint.red +
      tiktMint.express +
      tiktMint.vip +
      tiktMint.general +
      tiktMint.business ===
    1;
  return valid;
};

const confTimeInfo = (endTime = '') => {
  const info = { isEnd: false };
  const endTimestamp = new Date(endTime).getTime();
  const curTimestamp = new Date().getTime();
  info.isEnd = curTimestamp >= endTimestamp;
  return info;
};

const mToast = (
  toastInstance: CreateToastFnReturn,
  text: string,
  tType: UseToastOptions['status'] = 'error',
  duration = 1500,
) => {
  toastInstance({
    description: text,
    duration: duration,
    status: tType,
    position: 'top',
    containerStyle: { mt: '15%', h: '20', fontSize: '18px' },
  });
};
const setMail = async (mail: string) => {
  try {
    const rsp = await requestV1(setMailUrl, {
      method: 'POST',
      body: JSON.stringify({ email: mail }),
    });
    console.info('[setMail]', rsp);
  } catch (err) {
    console.error('[ticketInfo]setMail:', err);
  }
};
const sendMail = async ({
  red = 0,
  vip = 0,
  express = 0,
  general = 0,
  business = 0,
}) => {
  try {
    const options = JSON.stringify({
      template_id: 1,
      language_type: 2,
      vip_pass: vip, //  五种类型票数量
      red_carpet_pass: red,
      general_pass: general,
      express_ticket: express,
      business_pass: business,
    });
    const rsp = await requestV1(mailUrl, { method: 'POST', body: options });
    console.info('[sendMail]:', rsp);
  } catch (err) {
    console.error('[ticketInfo][sendMail]:', err);
  }
};

const validBalance = (balc: any) => {
  let v = true;
  try {
    formatUnits(BigNumber.from(balc), 6);
  } catch (err) {
    v = false;
  }
  return v;
};

const genToastOpt: any = (t: string) => {
  const opt = {
    description: t || 'Systen Error, Plesae Try Again Later.',
    status: 'error',
    position: 'top' as any,
    duration: 3000,
    containerStyle: { mt: '15%', h: '20', fontSize: '18px' },
  };
  return opt;
};

export {
  validMintTotal,
  validMintNum,
  validDollarNum,
  validBalance,
  confTimeInfo,
  mToast,
  sendMail,
  setMail,
  genToastOpt,
};
