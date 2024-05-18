import { useRouter } from 'next/router';
import { useRequest, useLocalStorageState } from 'ahooks';
import { useEffect } from 'react';
import { bindRelationship } from '@/services/user';
import { useUserDataValue, useInviteCode } from '@/store';
import { useToast } from '@chakra-ui/react';

export const useBindRela = () => {
  const router = useRouter();
  // useLocalStorageState 其他页面 改变监听不到变化 改 useInviteCode
  const [_, setCode] = useLocalStorageState<string>('inviteCode', {
    defaultValue: '',
  });
  const [inviteCode, setInviteCode] = useInviteCode();
  const bindReq = useRequest(bindRelationship, { manual: true });
  const userData = useUserDataValue();
  const toast = useToast();

  useEffect(() => {
    if (userData?.wallet_address && inviteCode) {
      bindRela();
    }
  }, [userData?.wallet_address, inviteCode]);

  const bindRela = async () => {
    try {
      await bindReq.runAsync({
        trace_id: inviteCode,
      });
      router.push(`/user/${userData?.wallet_address}?activityTip=friend`);
      setInviteCode('');
      setCode('');
    } catch (error) {
      if (error.code === 200009) {
        setInviteCode('');
        setCode('');
      }
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };
  return { bindRela };
};
