import { Addresses } from '../types';
import exchangeJson from '../abi/transfer.json';
import erc721Json from '../abi/erc721.json';
import erc1155Json from '../abi/erc1155.json';
import royaltyFeeJson from '../abi/roy.json';
import wethJson from '../abi/weth.json';
import sellJson from '../abi/sell.json';
import collectionRoyaltyJson from '../abi/royalti.json';

type AbiMap = Partial<Record<keyof Addresses, any>>;

export const abis: AbiMap = {
  EXCHANGE: exchangeJson.abi,
  TRANSFER_MANAGER_ERC721: erc721Json.abi,
  TRANSFER_MANAGER_ERC1155: erc1155Json.abi,
  ROYALTY_FEE: royaltyFeeJson.abi,
  LOCAL_WRAPPER_CURRENCY: wethJson.abi,
  SELL_APPROVAL: sellJson,
  COLLECTION_ROYALTI: collectionRoyaltyJson,
};
