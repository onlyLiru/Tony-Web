import { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import useSignHelper from '@/hooks/helper/useSignHelper';
import teamz from '@/contract/abi/teamz.2024.json';
import { formatUnits } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';

type TICKET_TYPE = 'vip' | 'express' | 'red' | 'general' | 'business';

const TICKEYLIST: any = ['vip', 'express', 'red', 'general', 'business'];

const MINT_TYPE_MAP: any = {
  // vip票
  vip: {
    supply: 'TICKET_SUPPLY', // 可以mint的总数
    supplyed: 'TICKET_SUPPLYED', //已经mint的数量
  },
  // 单日票
  express: {
    supply: 'TICKET_SUPPLY', // 可以mint的总数
    supplyed: 'TICKET_SUPPLYED', //已经mint的数量
  },
  // 红色票
  red: {
    supply: 'TICKET_SUPPLY', // 可以mint的总数
    supplyed: 'TICKET_SUPPLYED', //已经mint的数量
  },
  // general
  general: {
    supply: 'TICKET_SUPPLY', // 可以mint的总数
    supplyed: 'TICKET_SUPPLYED', //已经mint的数量
  },
  // general
  business: {
    supply: 'TICKET_SUPPLY', // 可以mint的总数
    supplyed: 'TICKET_SUPPLYED', //已经mint的数量
  },
};

const MINT_TPYE: any = {
  express: 1,
  general: 2,
  business: 3,
  red: 4,
  vip: 5,
};
const TPYE: any = {
  express: 'EXP',
  general: 'GEN',
  business: 'BUS',
  red: 'RED',
  vip: 'VIP',
};

let contract: any = null;

/**
 *
 * @param contractAddress
 * 测试环境默认传0x36BE8B846e3b44f7A5Ca1De0Ed7aD75cA75e3A95
 * @returns
 */
export const useMintEvent = (contractAddress: string) => {
  const { signer } = useSignHelper();
  const [loading, setLoading] = useState(false);

  /**
   * 初始化合约
   */
  const initContract = async (cb: () => void) => {
    contract = new Contract(contractAddress, teamz.abi, signer!);
    cb && cb();
  };

  /**
   * 初始化_mintType
   */

  const initMinttype = async () => {
    const keys: any[] = [];
    const res = Object.entries(TPYE).map((v) => {
      keys.push(v[0]);
      return contract[v[1] as any]();
    });
    const types = await Promise.all(res);
    for (let i = 0; i < types.length; i++) {
      MINT_TPYE[keys[i]] = types[i];
    }
  };

  /**
   * 查询不同类型可以mint的总数
   */
  const getSupply = async (type?: TICKET_TYPE | any) => {
    let supply: any = {};
    if (contract) {
      try {
        if (type && MINT_TYPE_MAP[type]) {
          supply = await contract[MINT_TYPE_MAP[type].supply]();
        } else {
          supply = await Promise.all(
            Object.keys(MINT_TYPE_MAP).map((v) =>
              contract[MINT_TYPE_MAP[v].supply](),
            ),
          );
          supply = TICKEYLIST.reduce((init: any, cur: any, index: number) => {
            init[cur] = supply[index].toNumber();
            return init;
          }, {});
        }
      } catch (err) {
        console.error(err);
      }
    }
    return supply;
  };

  /**
   * 查询不同类型已经mint的数量
   */
  const getSupplyed = async (type?: TICKET_TYPE) => {
    let supplyed: any = {};
    if (contract) {
      try {
        if (type && MINT_TYPE_MAP[type]) {
          supplyed = await contract[MINT_TYPE_MAP[type].supplyed]();
        } else {
          supplyed = await Promise.all(
            Object.keys(MINT_TYPE_MAP).map((v) =>
              contract[MINT_TYPE_MAP[v].supplyed](),
            ),
          );

          supplyed = TICKEYLIST.reduce((init: any, cur: any, index: number) => {
            init[cur] = BigNumber.from(supplyed[index]).toNumber();
            return init;
          }, {});
        }
      } catch (err) {
        console.error(err);
      }
    }
    return supplyed;
  };

  /**
   * 查询不同类型的价格
   */
  const getPrice = async () => {
    let price: any = {};
    if (contract) {
      try {
        price = await Promise.all(
          Object.keys(MINT_TYPE_MAP).map((v) =>
            contract.getPrice(MINT_TPYE[v]),
          ),
        );
        price = TICKEYLIST.reduce((init: any, cur: any, index: number) => {
          init[cur] = price[index];
          // 页面上换算成usdt：formatUnits(BigNumber.from(price[index]), 6)
          // 转换成wei单位：formatUnits(BigNumber.from(tx), 'wei')
          return init;
        }, {});
      } catch (err) {
        console.error(err);
      }
    }
    return price;
  };

  /**
   * mint逻辑
   * type值
   *  1. Day（TICKET）单日票
      2. Red（RED） 红色票
      3. Vip（VIP） vip票
   */
  const mint = async (mintAmount: number, type: string) => {
    if (!mintAmount || !type) return null;

    try {
      setLoading(true);

      const tx: any = await contract.publicMint(mintAmount, MINT_TPYE[type], {
        // gasLimit: 300000,
      });

      const reicept = await tx.wait();
      return reicept;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (signer) {
      initContract(initMinttype);
    }
  }, [contractAddress, signer]);

  return { loading, getSupply, getSupplyed, getPrice, mint };
};
