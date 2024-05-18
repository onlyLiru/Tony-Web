import { Contract, BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { contAddr } from './useTicket';
import teamz from '@/contract/abi/teamz.2024.json';
import retry from 'retry-as-promised';
import { useProvider } from 'wagmi';

const maxRetryT = 2;

export const useBirdTime = () => {
  const [isBirdTime, setBirdTime] = useState(false);
  const provider = useProvider();
  const contract = new Contract(contAddr.ticket, teamz.abi, provider);

  /**
   * 获取早鸟时间
   */
  const getEarlyBirdTime = async () => {
    try {
      const time = await contract['BIRDTIME']();
      const birdTimestamp = BigNumber.from(time).toNumber();
      const currentTimestamp = Math.floor(new Date().getTime() / 1000);
      const isBirdTime = birdTimestamp > currentTimestamp;

      return isBirdTime;
    } catch (error) {
      return false;
    }
  };

  const initEarlyBirdTime = async () => {
    const res = await getEarlyBirdTime();
    setBirdTime(res);
  };

  useEffect(() => {
    retry(() => initEarlyBirdTime(), {
      max: maxRetryT,
      timeout: 10000,
    });
  }, []);

  return {
    isBirdTime,
  };
};
