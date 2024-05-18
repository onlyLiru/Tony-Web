import { providers, TypedDataDomain } from 'ethers';
import { MakerOrder } from '../types';
import { etherSignTypedData } from './etherSignTypedData';
import { generateMakerOrderTypedData } from './generateMakerOrderTypedData';

/**
 * Create a signature for a maker order
 * @param signer user signer
 * @param chainId current chain id
 * @param verifyingContractAddress Looksrare exchange contract address
 * @param order see MakerOrder
 * @returns String signature
 */
export const signMakerOrder = async (
  signer: providers.JsonRpcSigner,
  order: MakerOrder,
  domain: TypedDataDomain,
): Promise<string> => {
  const signerAddress = await signer.getAddress();
  const { type, value } = generateMakerOrderTypedData(signerAddress, order);
  const signatureHash = await etherSignTypedData(
    signer.provider,
    signerAddress,
    domain,
    type,
    value,
  );
  return signatureHash;
};
