import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const formatTime = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

export const useListingLink = (walletAddress: string | undefined) => {
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  return {
    handleListing: () => {
      if (!walletAddress) {
        openConnectModal?.();
        return;
      }
      router.push(`/user/${walletAddress}?bulkList=true`);
    },
  };
};
