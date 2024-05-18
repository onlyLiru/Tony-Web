import {
  IconButton,
  IconButtonProps,
  createIcon,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import * as globalApis from '@/services/global';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { ShimmerImage } from '@/components/Image';

const GasIcon = createIcon({
  displayName: 'Nav Gas Icon',
  viewBox: '0 0 30 30',
  path: [
    <path
      key="p1"
      d="M25.1327 6.04625C24.2435 5.60167 23.4957 5.31015 23.4641 5.29807C23.1391 5.17197 22.7721 5.33399 22.6457 5.66115C22.5192 5.98798 22.6829 6.35541 23.0097 6.48151C23.0169 6.48429 23.7279 6.76343 24.5638 7.18135C25.1999 7.4992 25.7294 8.47414 25.7294 9.31031V20.2494C25.7294 20.9328 25.2864 21.6227 24.6013 21.6227H23.9668C23.2769 21.6227 22.5678 20.9502 22.5678 20.2494V14.0506V13.7334V11.6484C22.5678 9.97145 21.5133 8.59321 20.1596 8.59321H18.7561V3.07122C18.7561 2.0746 18.1009 1 16.987 1H4.93107C3.8888 1 2.88896 2.02904 2.88896 3.07122V25.7295H1.63454C1.28413 25.7295 1 26.0144 1 26.3648C1 26.7152 1.2841 27 1.63454 27H3.53813H18.1322H20.0358C20.3862 27 20.6703 26.7152 20.6703 26.3648C20.6703 26.0144 20.3862 25.7295 20.0358 25.7295H18.7562V9.86364H20.1597C20.8448 9.86364 21.2973 10.8169 21.2973 11.6484V13.7334V14.0506V20.2494C21.2973 21.654 22.5736 22.8932 23.9669 22.8932H24.6014C25.9327 22.8932 27 21.7293 27 20.2494V9.31034C27 7.98407 26.2016 6.58066 25.1327 6.04625ZM4.15952 25.7295V3.07122C4.15952 2.72395 4.58377 2.27045 4.93107 2.27045H16.9871C17.2926 2.27045 17.4856 2.70504 17.4856 3.07122V25.7295H4.15952Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
    />,
    <path
      key="p2"
      d="M15.8184 5.12082C15.8184 4.77041 15.5234 4.48633 15.1595 4.48633H7.57887C7.21495 4.48633 6.91992 4.77038 6.91992 5.12082V10.2041C6.91992 10.5546 7.21492 10.8386 7.57887 10.8386H15.1595C15.5234 10.8386 15.8184 10.5546 15.8184 10.2041V5.12082ZM14.4989 9.56815H8.23935V5.75678H14.4989V9.56815Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
    />,
  ],
});

export default function GasButton(props: Omit<IconButtonProps, 'aria-label'>) {
  const { visitChain } = useSwitchChain();
  // const { data } = useRequest(
  //   () => globalApis.getGas({ chain_id: visitChain.id }),
  //   {
  //     refreshDeps: [visitChain.id],
  //     pollingInterval: 12000,
  //     refreshOnWindowFocus: true,
  //     pollingWhenHidden: false,
  //     pollingErrorRetryCount: 5,
  //   },
  // );

  return (
    <Flex
      borderRadius="12px"
      border={{ base: 'none', md: '1px solid rgba(255,255,255,0.1)' }}
      align={'center'}
      padding={{ base: '0', md: '12px 16px' }}
      h="40px"
      _hover={{ opacity: 0.6 }}
    >
      {/* <IconButton
        bg="none !important"
        aria-label=""
        fontSize={22}
        size="sm"
        {...props}
        icon={<GasIcon />}
      /> */}
      <ShimmerImage
        w="20px"
        h="20px"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAexJREFUWEftly83BGEUxp+nrEIhUSgoJEmiKRSSJvlQEsUmCh9A27Rp2+oUEmWV6zxz7sy5Mztrz9p9ZwNvnNl37m/vc/8Scz6cs32UAMxsD8AOgIUJwQYA+iQ78Z6ZHQJYIXk36nsFgBsXwDSnS7Kbf8DMzgQAoFeFy38TAc4BLAFok/yYhMLMdE/3v0heBwA9F0QLQIdkr/rdCHCplySvJjEejNXeN7NtAAeCA/BI8i1+PzmAjJnZPoBdAPLsPUnFTHaGAKaUoORBl0aBuBwC+5Xkw08Av1GguJNL6MZPR2TUE8n+KA/MCuAIwLrSUwHogags2wJQeKFOglkBZEEZJTUzZcNFzJaUADIkgzd50IV0LWIlJcAJgFWXQMVJaahskASNAMQiNCRrHqzJPOD5Lwj96w33wLuX5lYjAHXRbGZZyf8HSOYBFRkA0loteKirJpcg6C7j6n4liCYAVHbV+Rbrul9yAGnrJVeFSNNQaRBpBMBrwBqA49h4/HlzaWhm6gcDku0wOTUKIGOq+38bQDuGJu1sDnRZantB3r+nGUg+Sd4GvTUPqv1qHH8GsOkpWjsRaVya9WKiNFQ6ajCJp9g9qquZWqfm+OqFcV7RsKHSW2xFwQuCyFY0L9GqCy9DU/E4C6nez307/gZKwD8wCTTtmQAAAABJRU5ErkJggg=="
      />
      <Text fontFamily={'Inter'} fontSize="sm" color={'rgba(255,255,255,0.4)'}>
        {/* {data && data.data ? +data.data.SafeGasPrice : 0} */}-
      </Text>
    </Flex>
  );
}
