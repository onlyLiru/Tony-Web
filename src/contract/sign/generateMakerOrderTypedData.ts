import { MakerOrder, MakerOrderWithEncodedParams } from '../types';
import { getMakerOrderTypeAndDomain } from './getMakerOrderTypeAndDomain';
import { encodeOrderParams } from './encodeOrderParams';
import { TypedDataField } from 'ethers';

export const generateMakerOrderTypedData = (
  signerAddress: string,
  order: MakerOrder,
): {
  type: Record<string, TypedDataField[]>;
  value: MakerOrderWithEncodedParams;
} => {
  const { type } = getMakerOrderTypeAndDomain();
  const { encodedParams } = encodeOrderParams(order.params);
  const value: MakerOrderWithEncodedParams = {
    ...order,
    signer: signerAddress,
    params: encodedParams,
  };

  return { type, value };
};
