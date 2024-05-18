/* eslint-disable */
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import React from 'react';
import {
  Box,
  Text,
  HStack,
  Button,
  Center,
  useToast,
  Input,
  Flex,
  useMediaQuery,
  SimpleGrid,
  Image,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  Spacer,
  ModalContent,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  PopoverContent,
  ModalBody,
  ModalFooter,
  Link,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  ModalCloseButton,
  Modal,
  Tooltip,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import CommonHead from '@/components/PageLayout/CommonHead';
import { ShimmerImage } from '@/components/Image';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getMasonryRank } from '@/services/rebate';
import ProfileButton from '@/components/PageLayout/Header/ChatProfileButton';
import styles from './BlinkingDots.module.css';
import axios from 'axios';

import {
  useUserDataValue,
  useUuInfoValue,
  useFetchUuInfo,
  useIsInvited,
  useInvitationCode,
} from '@/store';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';
import * as userApis from '@/services/user';
import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';
type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};
interface Message {
  type: string;
  messData: string;
}

let timeoutId: NodeJS.Timeout;

interface UserChat {
  avatar: string;
  chat_score: number;
  intimcay: number;
  username: string;
}

export default function Chat({}: {}) {
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const router = useRouter();
  const userData = useUserDataValue();
  const t = useTranslations('chatPage');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const {
    isOpen: achieveModalOpen,
    onOpen: onOpenAchievekModel,
    onClose: onCloseAchieveModel,
  } = useDisclosure({
    id: 'achieve',
  });
  const {
    isOpen: firstModalOpen,
    onOpen: onOpenfirst,
    onClose: firstonClose,
  } = useDisclosure({
    id: 'first',
  });
  const {
    isOpen: JapanModalOpen,
    onOpen: onOpenJapan,
    onClose: JapanonClose,
  } = useDisclosure({
    id: 'Japan',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { openConnectModal } = useConnectModal();
  const toast = useToast();
  interface Iprops {
    [propName: string]: any;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const [chatBoxHeight, setChatBoxHeight] = useState<number | undefined>(0);
  const [chatHeight, setChatHeight] = useState<number | undefined>(0);
  const [screen, setScreen] = useState<boolean>(false);
  const [chatData, setChatData] = useState<any | null>(null);
  const [chatStatus, setChatStatus] = useState<boolean>(false);
  const [cursor, setCursor] = useState<any>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRef1 = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWs, setIsLoadingWs] = useState(false);
  const [goHome, setGoHome] = useState<any>(false);
  const [achievements, setAchievements] = useState<any>(null);
  const [copywriting, setCopywriting] = useState<any>({
    color: 'blue',
    img: '/images/chat/1.png',
    text: 'Deep Heartbeat',
    twShare: '',
  });
  const maxRetries = 6; // 最大重连次数
  let reconnectAttempts = useRef(0);
  let heartbeatWorker = useRef<Worker | null>(null);
  let ifconnect = useRef(true); //是否需要重连
  const prevScrollHeightRef = useRef(0);
  const scrollToBottomIf = useRef(true);
  let user_id = useRef(0);
  // 心跳机制
  // function resetTimer() {
  //   if (timeoutId) {
  //     clearTimeout(timeoutId);
  //   }
  //   const expectedTime = Date.now() + 40000; // 预期的执行时间，例如 1 秒后
  //   if (socket.current) {
  //     // console.log('十秒内没有用户输入内容');
  //     // console.log(socket);
  //     socket.current.send('heartbeat');
  //   }
  //   const currentTime = Date.now(); // 当前时间
  //   const timeDiff = expectedTime - currentTime; // 预期时间与当前时间的差值
  //   console.log(timeDiff);

  //   // 根据差值调整下一次定时器的执行时间
  //   timeoutId = setTimeout(resetTimer, timeDiff);
  // }
  // const heartbeatWorker = new Worker('/heartbeatWorker.js');
  function resetTimer() {
    heartbeatWorker.current = new Worker('/heartbeatWorker.js');
    heartbeatWorker.current.postMessage('start');
    heartbeatWorker.current.onmessage = (e) => {
      if (e.data === 'heartbeat') {
        if (socket.current) {
          console.log('Received heartbeat');
          heartbeatWorker.current!.postMessage('start');
          // console.log('十秒内没有用户输入内容');
          // console.log(socket);
          socket.current.send('heartbeat');
        }
      }
    };
  }

  const scrollToBottom = () => {
    // console.log(messagesEndRef)
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (messagesEndRef1.current) {
      messagesEndRef1.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const sendMessage = () => {
    if (messageInput !== '') {
      const newData = {
        type: 'pe',
        messData: messageInput,
      };
      console.log(messages);
      scrollToBottomIf.current = true;
      setMessages((prevMessages) => [...prevMessages, newData]);
      // setMessages([...messages, newData]);
      // 发送消息到后端服务器
      if (socket.current) {
        socket.current.send(messageInput);
        setMessageInput('');
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        heartbeatWorker.current!.postMessage('start');
        // timeoutId = setTimeout(resetTimer, 40000);
        setChatStatus(true);
      }
    }
  };
  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter' && messageInput !== '') {
      // 在这里执行回车键按下时的操作
      const newData = {
        type: 'pe',
        messData: messageInput,
      };
      console.log(messages);
      scrollToBottomIf.current = true;
      setMessages((prevMessages) => [...prevMessages, newData]);
      // setMessages([...messages, newData]);
      // 发送消息到后端服务器
      if (socket.current) {
        socket.current.send(messageInput);
        setMessageInput('');
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        heartbeatWorker.current!.postMessage('start');
        // timeoutId = setTimeout(resetTimer, 40000);
        setChatStatus(true);
      }
    }
  };
  const screenFun = () => {
    const containerBoxHeight = document.body.clientHeight - 66;
    setChatBoxHeight(containerBoxHeight);
    const containerHeight = document.body.clientHeight - 66 - 10 - 70;
    setChatHeight(containerHeight);
    setScreen(true);
  };
  const onScreenFun = () => {
    const containerBoxHeight = document.body.clientHeight / 2;
    setChatBoxHeight(containerBoxHeight);
    const containerHeight = document.body.clientHeight / 2 - 70;
    setChatHeight(containerHeight);
    setScreen(false);
  };

  const modalAchievements = () => {
    // console.log(chatData, 'chatData');
    // console.log(achievements);
    let Achievement: string = '0';
    if (achievements) {
      if (chatData?.intimacy >= 30 && chatData?.intimacy < 50) {
        Achievement = '1';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'blue',
            img: '/images/chat/1.png',
            text: t('text1'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '1': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.intimacy >= 50 && chatData?.intimacy < 70) {
        Achievement = '2';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'blue',
            img: '/images/chat/2.png',
            text: t('text2'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '2': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.intimacy >= 70 && chatData?.intimacy < 90) {
        Achievement = '3';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'yellow',
            img: '/images/chat/3.png',
            text: t('text3'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '3': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.intimacy >= 90 && chatData?.intimacy < 99) {
        Achievement = '4';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'yellow',
            img: '/images/chat/4.png',
            text: t('text4'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '4': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.intimacy >= 99) {
        Achievement = '5';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'purple',
            img: '/images/chat/5.png',
            text: t('text5'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '5': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.chat_count >= 10 && chatData?.chat_count < 25) {
        Achievement = '6';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'blue',
            img: '/images/chat/6.png',
            text: t('text6'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '6': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.chat_count >= 25 && chatData?.chat_count < 50) {
        Achievement = '7';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'blue',
            img: '/images/chat/7.png',
            text: t('text7'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '7': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.chat_count >= 50 && chatData?.chat_count < 70) {
        Achievement = '8';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'yellow',
            img: '/images/chat/8.png',
            text: t('text8'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '8': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.chat_count >= 70 && chatData?.chat_count < 90) {
        Achievement = '9';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'yellow',
            img: '/images/chat/9.png',
            text: t('text9'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '9': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
      if (chatData?.chat_count >= 90) {
        Achievement = '10';
        if (!achievements[Achievement as keyof typeof achievements]) {
          setCopywriting({
            color: 'purple',
            img: '/images/chat/10.png',
            text: t('text10'),
            twShare: `As UNE AI Field's🚀 first Honorary Officer, my bond with Taki🤖 transcends tech—it's a soulful connection. A beautiful AI-human interaction journey✨. https://test.unemeta.com/zh/UneFieldLandingPage/cyber &hashtags=UneMeta,SocialFi,Innovation,AIJourney,MindfulTech`,
          });
          setAchievements({
            ...achievements,
            '10': {
              Status: true,
              CreateAt: 1708485981,
              Costs: 689,
              Count: 2,
            },
          });
          onOpenAchievekModel();
        }
      }
    }

    // console.log(achievements[Achievement as keyof typeof achievements])
    return null;
  };

  const userinfoFun = async () => {
    if (userData?.wallet_address) {
      const result = await axios.post('/api/userinfo', {
        wallet: userData?.wallet_address,
      });
      console.log('userinfo 请求的响应数据:', result, user_id.current);
      setAchievements(result.data.data.achievements || {});
      if (result.data.data.is_first && user_id.current !== 0) {
        onOpenfirst();
      }
    }
  };

  const twShare = () => {
    const target = `https://twitter.com/intent/tweet?text=${copywriting?.twShare}`;
    window.open(target, '_blank');
  };
  const userShare = () => {
    // console.log(window.location.origin)
    // const target = `https://twitter.com/intent/tweet?text=🎉超级兴奋宣布，我正式成为了AI UNE荣耀体验官！🚀
    // 首批获得了Whitelist的资格，我将与Taki进行深入对话和互动—这是一场前所未有的科技冒险。🤖💬
    // 作为体验官，我迫不及待地想看到Taki如何适应我的风格，并期待我们的关系如何发展。💞
    //     "作为UNE AI Field🚀首位荣耀体验官，我与Taki🤖建立了不仅是Ai技术的连接，更是在心灵上的共鸣，这是关于AI与人类交流的美好旅程✨。#UneMeta #SocialFi #Innovation #AIJourney #MindfulTech
    // https://test.unemeta.com/zh/UneFieldLandingPage/cyber"
    // 感谢@UneMeta为我打开了这扇通往未来的大门。🙏 跟着我一起，让我们揭开AI UNE奇妙世界的面纱！🌌&hashtags=AIUNE,体验官,Taki,AI,未来科技,Whitelist,UneMeta`;
    const target = t('share1', { url: window.location.origin });
    window.open(target, '_blank');
  };
  const japanShare = () => {
    const target = `https://twitter.com/UneWeb3`;
    window.open(target, '_blank');
  };

  const fetchChatInfo = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post('/api/proxy', {
        wallet: userData?.wallet_address,
        room: 'Taki',
        cursor: cursor,
        page_size: 10,
      });
      console.log('POST 请求的响应数据:', result);
      if (result.data.msg === 'success' && result.data.data) {
        scrollToBottomIf.current = false;
        if (chatContainerRef.current) {
          prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
        }
        setCursor(result.data.cursor);
        const creatChatdata = result.data.data
          .map((v: { Role: string; Message: any }) => {
            return {
              type: v.Role === 'user' ? 'pe' : 'bot',
              messData: v.Message,
            };
          })
          .reverse();
        setMessages((prevMessages) => [...creatChatdata, ...prevMessages]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      // toast({ title: 'error.msg', status: 'error' });
    }
  };
  const initChatInfo = async () => {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    try {
      setIsLoading(true);
      const result = await axios.post('/api/proxy', {
        wallet: userData?.wallet_address,
        room: 'Taki',
        cursor: timestampInSeconds,
        page_size: 10,
      });
      console.log('POST 请求的响应数据:', result);
      if (result.data.msg === 'success' && result.data.data) {
        scrollToBottomIf.current = false;
        if (chatContainerRef.current) {
          prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
        }
        setCursor(result.data.cursor);
        const creatChatdata = result.data.data
          .map((v: { Role: string; Message: any }) => {
            return {
              type: v.Role === 'user' ? 'pe' : 'bot',
              messData: v.Message,
            };
          })
          .reverse();
        setMessages((prevMessages) => [...creatChatdata, ...prevMessages]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      // toast({ title: 'error.msg', status: 'error' });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      const scrollTop = chatContainer.scrollTop;
      if (scrollTop === 0 && !isLoading) {
        fetchChatInfo();
      }
    }
  };

  const handleResize = () => {
    if (!screen) {
      const containerBoxHeight = document.body.clientHeight / 2;
      setChatBoxHeight(containerBoxHeight);
      const containerHeight = document.body.clientHeight / 2 - 70;
      setChatHeight(containerHeight);
    } else {
      const containerBoxHeight = document.body.clientHeight - 66;
      setChatBoxHeight(containerBoxHeight);
      const containerHeight = document.body.clientHeight - 66 - 10 - 70;
      setChatHeight(containerHeight);
    }
  };

  const connect = () => {
    // let newSocket: WebSocket | null = null;
    if (userData?.wallet_address) {
      // 创建WebSocket连接
      socket.current = new WebSocket(
        `wss://chat.unemeta.com/ws?room=Taki&roomid=1&wallet=${userData?.wallet_address}`,
      );
      // setSocket(newSocket);
      socket.current.onopen = () => {
        console.log('WebSocket 连接已建立。');
        console.log('连接已建立。', socket.current);
        if (socket.current) {
          socket.current.send('heartbeat');
        }
      };

      // 监听消息接收事件
      socket.current.onmessage = function (event: { data: string }) {
        const data = JSON.parse(event.data);
        if (data?.messages?.role === 'error') {
          if (
            data?.messages?.message === 'sorry, your chat score is not enough'
          ) {
            onOpen();
          } else {
            ifconnect.current = false;
            onOpenJapan();
          }
        }
        if (data?.messages?.message === 'heartbeat received') {
          const getChatData = {
            intimacy: data.intimacy,
            chat_score: data.chat_score,
            user_id: data?.user_id,
            chat_count: data?.chat_count,
          };
          user_id.current = data?.user_id;
          setChatData(getChatData);
        }
        console.log(data);
        if (data?.messages?.role === 'user') {
          const getChatData = {
            intimacy: data.intimacy,
            chat_score: data.chat_score,
            user_id: data?.user_id,
            chat_count: data?.chat_count,
          };
          setChatData(getChatData);
          // onOpenJapan()
          // ifconnect.current = false;
          // socket.current.close();
          const newData = {
            type: 'bot',
            messData: '',
          };
          setMessages((prevMessages) => [...prevMessages, newData]);
          scrollToBottomIf.current = true;
          setChatStatus(false);
          let index = 0;
          const interval = setInterval(() => {
            if (index < data?.messages?.message.length) {
              setMessages((prevMessages) => {
                return prevMessages.map((item, key) => {
                  if (key === prevMessages.length - 1) {
                    const botData = {
                      type: 'bot',
                      messData:
                        item.messData + data?.messages?.message.charAt(index),
                    }; // 创建新的对象，修改名称
                    index++;
                    return botData;
                  }
                  return item;
                });
              });
            } else {
              clearInterval(interval);
            }
          }, 5);
        }
      };
      socket.current.onerror = (error: any) => {
        console.error('WebSocket 错误：', error);
        setChatStatus(false);
        if (socket.current) {
          socket.current.close();
        }
      };
      socket.current.onclose = (e) => {
        console.log(ifconnect.current);
        console.log('连接已关闭。', e);
        setChatStatus(false);
        socket.current = null;
        // setSocket(null); // 清除旧的 WebSocket 实例
        // 重新连接
        if (ifconnect.current) {
          setIsLoadingWs(true);
          reconnectAttempts.current += 1;
          console.log('连接次数', reconnectAttempts.current);
          if (reconnectAttempts.current < maxRetries) {
            // 使用退避算法计算重连时间
            const retryDelay = Math.pow(2, reconnectAttempts.current) * 1000;
            console.log('时间', retryDelay);
            setTimeout(() => {
              connect(); // 重连
              setIsLoadingWs(false);
            }, retryDelay);
          } else {
            setGoHome(true);
          }
        } else {
          ifconnect.current = true;
        }
      };
    } else {
      // ifconnect.current = false;
      console.log(socket.current);
      if (socket?.current) {
        ifconnect.current = false;
        socket?.current?.close();
      }
    }
  };

  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.padding = '0';
    const element = document.getElementById('__next');
    if (element) {
      element.style.height = '100%';
      const childElements = element.children[0] as HTMLElement;
      childElements.style.height = '100%';
      // console.log(childElements)
    }

    const containerBoxHeight = document.body.clientHeight / 2;
    setChatBoxHeight(containerBoxHeight);
    const containerHeight = document.body.clientHeight / 2 - 70;
    setChatHeight(containerHeight);

    // 清理函数，关闭WebSocket连接
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.overflow = '';
      document.body.style.padding = '';
      const element = document.getElementById('__next');
      if (element) {
        element.style.height = '';
        const childElements = element.children[0] as HTMLElement;
        childElements.style.height = '';
      }
    };
  }, []);

  useEffect(() => {
    // scrollToBottom();
    if (scrollToBottomIf.current) {
      scrollToBottom();
    } else {
      if (prevScrollHeightRef.current && chatContainerRef.current) {
        const chatContainer = chatContainerRef.current;
        chatContainer.scrollTop =
          chatContainer.scrollHeight - prevScrollHeightRef.current;
      }
    }
  }, [messages]);

  useEffect(() => {
    handleResize(); // 初始化窗口大小

    window.addEventListener('resize', handleResize);
    scrollToBottom();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screen]);

  useEffect(() => {
    if (userData?.wallet_address) {
      initChatInfo();
    }
    if (!userData?.wallet_address) {
    }
    console.log('userData', userData);
    if (!isLargerThan768) {
      setMessages([]);
      setChatData(null);
      user_id.current = 0;
      JapanonClose();
      connect();
    }
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [userData]);

  useEffect(() => {
    // console.log(socket.current);
    // const handleVisibilitychange = () => {
    //   // console.log(socket.current);
    //   if (document.visibilityState === 'visible') {
    //     // console.log(ifconnect.current);
    //     // 页面在前台，重新连接 WebSocket
    //     // if (!socket.current) {
    //     //   connect();
    //     // }
    //   } else {
    //     // 页面在后台，可以选择断开 WebSocket 连接
    //     // console.log(socket.current);
    //     if (socket.current) {
    //       // ifconnect.current = false
    //       socket?.current?.close();
    //     }
    //   }
    // };
    console.log('???????');
    resetTimer();
    // window.addEventListener('visibilitychange', handleVisibilitychange);
    // timeoutId = setTimeout(resetTimer, 40000);
    return () => {
      if (socket.current) {
        heartbeatWorker.current!.postMessage('stop');
        // window.removeEventListener('visibilitychange', handleVisibilitychange);
      }
    };
  }, [socket.current]);
  // useEffect(() => {
  //   userinfoFun();
  // }, [user_id.current]);

  // console.log('reconnectAttempts', reconnectAttempts);

  // console.log(messages)

  return (
    <>
      {!isLargerThan768 ? (
        <Box
          // minH={'100vh'}
          style={{ height: '100%' }}
          position={'relative'}
          // display={'grid'}
          backgroundImage={`url('/images/chat/bg.png')`}
          backgroundSize="100%"
          backgroundPosition="0px 66px"
          backgroundRepeat={'no-repeat'}
          gridAutoRows={'auto 1fr'}
        >
          {/* {isLoading && <Box position={'absolute'} bg={'rgba(0,0,0,0.5)'} w={'100%'} h={'100%'}></Box>} */}
          {isLoadingWs && (
            <Box
              position={'absolute'}
              bg={'rgba(0,0,0,0.5)'}
              w={'100%'}
              h={'100%'}
              zIndex={'9999'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box w={'230px'} h={'180px'} bg={'#2c2c2c'}>
                <Box w={'40px'} h={'40px'} m={'0 auto'} mt={'40px'}>
                  <Image
                    src={'/images/chat/loading.gif'}
                    w={'100%'}
                    h={'100%'}
                  ></Image>
                </Box>
                <Text textAlign={'center'} color={'#fff'} mt={'18px'}>
                  {t('Reconnecting')}
                </Text>
              </Box>
            </Box>
          )}
          {goHome && (
            <Box
              position={'absolute'}
              bg={'rgba(0,0,0,0.5)'}
              w={'100%'}
              h={'100%'}
              zIndex={'9999'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box w={'320px'} h={'258px'} bg={'#2c2c2c'}>
                <Box w={'40px'} h={'40px'} m={'0 auto'} mt={'40px'}>
                  <Image
                    src={'/images/chat/error.png'}
                    w={'100%'}
                    h={'100%'}
                  ></Image>
                </Box>
                <Text
                  fontSize={'20px'}
                  fontFamily={'SourceHanSansCN, SourceHanSansCN'}
                  fontWeight={'bold'}
                  textAlign={'center'}
                  color={'#fff'}
                  mt={'14px'}
                >
                  connection failed
                </Text>
                <Text
                  fontSize={'14px'}
                  fontFamily={'SourceHanSansCN, SourceHanSansCN'}
                  fontWeight={'bold'}
                  textAlign={'center'}
                  color={'#828282'}
                  m={'0 auto'}
                  mt={'10px'}
                  w={'242px'}
                >
                  Unable to connect to the server. Please check your network
                  connection or go to the official website to view the latest
                  news
                </Text>
                <Box textAlign={'center'} mt={'10px'}>
                  <Button
                    px={'27px'}
                    py={'14px'}
                    color={'#fff'}
                    bg={'#FF5500'}
                    m={'0 auto'}
                    onClick={() => router.push('/')}
                  >
                    Return to the official website
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          <CommonHead title="chat" />
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            px="20px"
            h="66px"
            w="100%"
            backgroundImage={`url('/images/chat/banner.png')`}
            backgroundSize="100% 100%"
          >
            <Box display={'flex'} alignItems={'center'}>
              <Image
                onClick={() => router.push('https://ai.unemeta.com/')}
                src={'/images/chat/return.png'}
                w={'24px'}
                h={'22px'}
              ></Image>
              <Image
                ml="8px"
                w={'30px'}
                h={'30px'}
                src={
                  chatData?.avatar
                    ? chatData?.avatar
                    : 'https://unemeta-1322481783.cos.ap-tokyo.myqcloud.com/console/default_avatar.jpg'
                }
                borderRadius={'50%'}
                // bg={'#000'}
              ></Image>
              <Box
                ml="8px"
                fontSize={'14px'}
                color={'#fff'}
                fontFamily={'SourceHanSerifSC, SourceHanSerifSC'}
                fontWeight={'bold'}
                lineHeight={'14px'}
              >
                <Text>Taki</Text>
                <Box display={'flex'} alignItems={'center'}>
                  <Image
                    src={'/images/chat/love.png'}
                    w={'13px'}
                    h={'13px'}
                  ></Image>
                  <Text ml={'4px'}>{chatData?.intimacy || 0}</Text>
                </Box>
              </Box>
            </Box>
            <Box
              display={'flex'}
              alignItems={'center'}
              fontSize={'14px'}
              color={'#fff'}
              fontFamily={'SourceHanSerifSC, SourceHanSerifSC'}
              fontWeight={'bold'}
            >
              <Image
                src={'/images/chat/integral.png'}
                w={'14px'}
                h={'15px'}
              ></Image>
              <Text mx={'8px'}>{chatData?.chat_score || 0}/200</Text>
              <ProfileButton />
            </Box>
          </Box>
          <Box
            ref={containerRef}
            backgroundImage={!screen ? `url('/images/chat/jian111.png')` : ''}
            backgroundSize="100% 100%"
            position={'absolute'}
            w={'100%'}
            h={chatBoxHeight}
            bottom={'0'}
          >
            {/* {isLoading && <Box position={'absolute'} bg={'rgba(0,0,0,0.5)'} w={'100%'} h={'100%'}></Box>} */}
            {!screen && messages.length > 0 && (
              <Box
                // h={'80px'}
                textAlign={'center'}
                fontSize={'12px'}
                w={'100%'}
                color={'#f3f3f3'}
                fontWeight={'bold'}
                // backgroundImage={`url('/images/chat/jianbian.png')`}
                // backgroundSize="100% 100%"
                position={'absolute'}
                top={'-38px'}
              >
                <Box
                  py={'10px'}
                  px={'16px'}
                  display={'flex'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  fontSize={'12px'}
                  onClick={screenFun}
                >
                  <Text>{t('history')}</Text>
                  <Image
                    src={'/images/chat/jiantou.png'}
                    w={'6px'}
                    h={'10px'}
                    ml={'10px'}
                  ></Image>
                </Box>
              </Box>
            )}

            <Box
              ref={chatContainerRef}
              style={{ height: chatHeight }}
              onScroll={handleScroll}
              pb={'16px'}
              overflow={'auto'}
            >
              {messages.map((message, index) => (
                <Box ref={messagesEndRef} key={index}>
                  {message?.type === 'pe' && (
                    <Box display={'flex'} mt={'20px'}>
                      <Box flex={'1'}></Box>
                      <Box
                        maxW={'225px'}
                        // textAlign={'right'}
                        fontSize={'14px'}
                        color={'#fff'}
                        pr={'16px'}
                        // lineHeight={'40px'}
                      >
                        <span
                          style={{
                            background: 'rgba(95, 193, 168, .5)',
                            borderRadius: '16px 16px 0px 16px',
                            padding: '8px 12px',
                            display: 'inline-block',
                            wordBreak: 'break-all',
                          }}
                        >
                          {message.messData}
                        </span>
                      </Box>
                      {/* <Box w={'50px'}>
                    <Image
                      ml="8px"
                      w={'40px'}
                      h={'40px'}
                      src={
                        userData?.profile_image
                          ? userData?.profile_image
                          : 'https://unemeta-1322481783.cos.ap-tokyo.myqcloud.com/console/default_avatar.jpg'
                      }
                      borderRadius={'50%'}
                    ></Image>
                  </Box> */}
                    </Box>
                  )}
                  {message?.type === 'bot' && (
                    <Box display={'flex'} mt={'20px'}>
                      <Box
                        maxW={'225px'}
                        textAlign={'left'}
                        fontSize={'14px'}
                        color={'#fff'}
                        pl={'16px'}
                        // lineHeight={'40px'}
                      >
                        <span
                          // className={styles.typingText}
                          style={{
                            background: 'rgba(144, 143, 167, .5)',
                            borderRadius: '16px 16px 16px 0px',
                            padding: '8px 12px',
                            display: 'inline-block',
                            wordBreak: 'break-all',
                          }}
                        >
                          {message.messData}
                        </span>
                      </Box>
                      <Box flex={'1'}></Box>
                    </Box>
                  )}
                </Box>
              ))}
              {chatStatus && (
                <Box ref={messagesEndRef1}>
                  <Box display={'flex'} mt={'20px'}>
                    <Box
                      maxW={'225px'}
                      textAlign={'left'}
                      fontSize={'14px'}
                      color={'#fff'}
                      pl={'16px'}
                      // lineHeight={'40px'}
                    >
                      <div className={styles.blinkingDotsContainer}>
                        <div className={styles.blinkingDot}></div>
                        <div className={styles.blinkingDot}></div>
                        <div className={styles.blinkingDot}></div>
                      </div>
                    </Box>
                    <Box h={'40px'} flex={'1'}></Box>
                  </Box>
                </Box>
              )}
            </Box>
            {!screen ? (
              <Box
                h="54px"
                p={'14px'}
                // backgroundImage={`url('/images/chat/input.png')`}
                // backgroundSize="100% 100%"
                m={'0 auto'}
                // mx={'15px'}
                bg={'#191926'}
                mb={'16px'}
                onClick={() => {
                  if (!userData?.wallet_address) {
                    web2LoginModal?.current?.open();
                  }
                }}
                border={'2px solid #fff'}
                alignSelf={'end'}
                alignItems={'center'}
                display={!chatStatus ? 'flex' : 'none'}
                w={'92%'}
              >
                <Input
                  type="text"
                  value={messageInput}
                  placeholder={t('enter')}
                  h={'24px'}
                  // isDisabled={!userData?.wallet_address}
                  fontSize={'14px'}
                  bg={'transparent'}
                  color={'#fff'}
                  onChange={(e) => {
                    if (userData?.wallet_address) {
                      const maxLength = 200;
                      const value = e.target.value;
                      if (value.length <= maxLength) {
                        setMessageInput(value);
                      }
                    }
                  }}
                  onPaste={(event) => {
                    const maxLength = 200;
                    const pastedText =
                      event.clipboardData.getData('text/plain');
                    const truncatedText = pastedText.slice(0, maxLength);

                    setMessageInput(truncatedText);
                    event.preventDefault();
                  }}
                  onKeyPress={handleKeyPress}
                  border={'none'}
                  outline={'none'}
                  appearance={'none'}
                />
                <Image
                  src={'/images/chat/right.png'}
                  w={'42px'}
                  h={'40px'}
                  onClick={() => {
                    if (userData?.wallet_address) {
                      sendMessage();
                    }
                  }}
                ></Image>
              </Box>
            ) : (
              <Box
                h="170px"
                // p={'14px'}
                position={'absolute'}
                bottom={'0'}
                backgroundImage={`url('/images/chat/yinying.png')`}
                backgroundSize="100% 100%"
                // m={'0 auto'}
                // mx={'15px'}
                // mb={'16px'}
                // alignSelf={'end'}
                alignItems={'center'}
                justifyContent={'center'}
                display={'flex'}
                w={'100%'}
              >
                <Image
                  src={'/images/chat/x.png'}
                  w={'48px'}
                  onClick={onScreenFun}
                  h={'48px'}
                ></Image>
              </Box>
            )}
          </Box>
          <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
          <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
            {/* <DrawerOverlay /> */}
            <DrawerContent
              bgImage={`url('/images/chat/toBg.png')`}
              backgroundSize="100% 100%"
              boxShadow={'none'}
            >
              {/* <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader> */}
              <DrawerBody p={'22px 28px'}>
                <Text
                  fontSize={'20px'}
                  fontFamily={'SourceHanSerifSC, SourceHanSerifSC'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  textAlign={'center'}
                >
                  Sorry, there are currently no chat points
                </Text>
                <Text
                  fontSize={'14px'}
                  fontFamily={'SourceHanSerifSC, SourceHanSerifSC'}
                  fontWeight={'bold'}
                  color={'#beb9b9'}
                  textAlign={'center'}
                >
                  Each chat consumes 10 chat points
                </Text>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <Modal
            onClose={onCloseAchieveModel}
            isOpen={achieveModalOpen}
            isCentered
            size="xs"
          >
            <ModalOverlay />
            <ModalContent bg={'#2c2c2c'}>
              <ModalCloseButton color={'#fff'} />
              <ModalBody color={'#fff'} p={'40px'}>
                <Text textAlign={'center'}>{t('reaching')}</Text>
                <Text textAlign={'center'}>{t('unlock')}</Text>
                {copywriting?.color === 'blue' && (
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    my={'14px'}
                  >
                    <Image
                      src={'/images/chat/blueLeft.png'}
                      w={'20px'}
                      h={'40px'}
                    ></Image>
                    <Text
                      mx={'8px'}
                      color={'#6B9AC4'}
                      fontSize={'24px'}
                      fontWeight={'bold'}
                      textAlign={'center'}
                    >
                      {copywriting.text}
                    </Text>
                    <Image
                      src={'/images/chat/blueRight.png'}
                      w={'20px'}
                      h={'40px'}
                    ></Image>
                  </Box>
                )}
                {copywriting?.color === 'yellow' && (
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    my={'14px'}
                  >
                    <Image
                      src={'/images/chat/yellowLfet.png'}
                      w={'20px'}
                      h={'40px'}
                    ></Image>
                    <Text
                      mx={'8px'}
                      color={'#FFC900'}
                      fontSize={'24px'}
                      fontWeight={'bold'}
                      textAlign={'center'}
                    >
                      {copywriting.text}
                    </Text>
                    <Image
                      src={'/images/chat/yellowRight.png'}
                      w={'20px'}
                      h={'40px'}
                    ></Image>
                  </Box>
                )}
                {copywriting?.color === 'purple' && (
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    my={'14px'}
                  >
                    <Image
                      src={'/images/chat/purpleLeft.png'}
                      w={'20px'}
                      h={'40px'}
                    ></Image>
                    <Text
                      mx={'8px'}
                      color={'#DA63FF'}
                      fontSize={'24px'}
                      fontWeight={'bold'}
                      textAlign={'center'}
                    >
                      {copywriting.text}
                    </Text>
                    <Image
                      src={'/images/chat/purpleRight.png'}
                      w={'20px'}
                      h={'40px'}
                    ></Image>
                  </Box>
                )}
                {copywriting?.color === 'blue' && (
                  <Image
                    src={copywriting?.img}
                    w={'120px'}
                    h={'120px'}
                    margin={'0 auto'}
                    borderRadius={'8px'}
                    border={'5px solid #6b9ac4'}
                  ></Image>
                )}
                {copywriting?.color === 'yellow' && (
                  <Image
                    src={copywriting?.img}
                    w={'120px'}
                    h={'120px'}
                    margin={'0 auto'}
                    borderRadius={'8px'}
                    border={'5px solid #FFC900'}
                  ></Image>
                )}
                {copywriting?.color === 'purple' && (
                  <Image
                    src={copywriting?.img}
                    w={'120px'}
                    h={'120px'}
                    margin={'0 auto'}
                    borderRadius={'8px'}
                    border={'5px solid #DA63FF'}
                  ></Image>
                )}

                <Box textAlign={'center'} mt={'30px'}>
                  <Button
                    px={'37px'}
                    py={'14px'}
                    color={'#000'}
                    bg={'#72DCF7'}
                    m={'0 auto'}
                    onClick={twShare}
                  >
                    {t('share')}
                  </Button>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal
            onClose={firstonClose}
            isOpen={firstModalOpen}
            isCentered
            size="sm"
          >
            <ModalOverlay />
            <ModalContent bg={'#2c2c2c'}>
              <ModalCloseButton color={'#fff'} />
              <ModalBody color={'#fff'} p={'40px'}>
                <Text textAlign={'center'}>
                  恭喜您获得AI UNE 第{chatData?.user_id}号首席体
                </Text>
                <Box textAlign={'center'} mt={'10px'}>
                  <Button
                    px={'27px'}
                    py={'14px'}
                    color={'#fff'}
                    bg={'#72DCF7'}
                    m={'0 auto'}
                    onClick={userShare}
                  >
                    {t('share')}
                  </Button>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal
            onClose={() => {
              router.push('https://ai.unemeta.com/');
              JapanonClose();
            }}
            isOpen={JapanModalOpen}
            isCentered
            size="sm"
          >
            <ModalOverlay />
            <ModalContent bg={'#2c2c2c'}>
              <ModalCloseButton color={'#fff'} />
              <ModalBody color={'#fff'} p={'40px'}>
                <Text textAlign={'center'}>
                  Please go to https://twitter.com/UneWeb3 Pay attention to the
                  distribution information of whitelists
                </Text>
                <Box textAlign={'center'} mt={'10px'}>
                  <Button
                    px={'27px'}
                    py={'14px'}
                    color={'#fff'}
                    bg={'#72DCF7'}
                    m={'0 auto'}
                    onClick={japanShare}
                  >
                    proceed
                  </Button>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
          {modalAchievements()}
        </Box>
      ) : (
        <Box
          h={'100%'}
          bgImage={`url('/images/chat/chatPCBG.png')`}
          backgroundSize="100% 100%"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box w={'440px'} h={'380px'} bg={'#2c2c2c'}>
            <Box w={'140px'} h={'120px'} m={'0 auto'} mt={'80px'}>
              <Image
                src={'/images/chat/uneLogo.png'}
                w={'100%'}
                h={'100%'}
              ></Image>
            </Box>
            <Text
              fontSize={'24px'}
              fontWeight={'bold'}
              textAlign={'center'}
              color={'#fff'}
              mt={'48px'}
            >
              Visit UneMeta Al on mobile
            </Text>
            <Text mt={'30px'} textAlign={'center'}>
              <Link fontSize={'16px'} color="#FF5500" href="/aiChatLandingPage">
                landing page
              </Link>
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['chatPage']);
  return {
    props: {
      messages,
    },
  };
}
