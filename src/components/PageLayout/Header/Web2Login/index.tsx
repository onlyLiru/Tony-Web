import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  Input,
  Text,
  Button,
  Flex,
  PinInput,
  PinInputField,
  Divider,
  useMediaQuery,
  IconButton,
  Image,
  useToast,
  SimpleGrid,
  Badge,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as globalApi from '@/services/global';
import { useFetchUser, useUserData } from '@/store';
import { jwtHelper, EMAIL_KEY } from '@/utils/jwt';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import * as globalApis from '@/services/global';
// import { useRouter } from 'next/router';
// import * as userApis from '@/services/user';

export const Web2LoginModal = forwardRef((_, ref) => {
  const t = useTranslations('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  const { fetchUser } = useFetchUser();
  const [step, setStep] = useState(0);
  const [email, setEmail] = React.useState('');
  const [showEmailFormatError, setShowEmailFormatError] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const router = useRouter();
  const [userData, setUserData] = useUserData();
  const LOGIN_TYPE = [
    {
      type: 'web3',
      title: t('header.web2Login.connectWallet'),
      renderList: [
        {
          type: 'OKX',
          name: 'OKX Wallet',
          recommend: true,
          icon: 'OKX.png',
        },
        {
          type: 'MetaMask',
          name: 'MetaMask',
          icon: '',
          svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuMDg5MSAzLjExOTlMMTUuMzQ0NiA5LjYxNDU2TDE2Ljk2MTcgNS43ODI4TDI0LjA4OTEgMy4xMTk5WiIgZmlsbD0iI0UyNzYxQiIgc3Ryb2tlPSIjRTI3NjFCIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zLjkwMjA3IDMuMTE5OUwxMi41NzYzIDkuNjc2MDhMMTEuMDM4MyA1Ljc4MjhMMy45MDIwNyAzLjExOTlaIiBmaWxsPSIjRTQ3NjFCIiBzdHJva2U9IiNFNDc2MUIiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIwLjk0MjkgMTguMTc0NUwxOC42MTM5IDIxLjc0MjZMMjMuNTk3IDIzLjExMzZMMjUuMDI5NSAxOC4yNTM2TDIwLjk0MjkgMTguMTc0NVoiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMi45NzkyOSAxOC4yNTM2TDQuNDAzMDEgMjMuMTEzNkw5LjM4NjA3IDIxLjc0MjZMNy4wNTcxMyAxOC4xNzQ1TDIuOTc5MjkgMTguMjUzNloiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4xMDQ4MyAxMi4xNDU2TDcuNzE2MjYgMTQuMjQ2MUwxMi42NjQyIDE0LjQ2NThMMTIuNDg4NCA5LjE0ODc3TDkuMTA0ODMgMTIuMTQ1NloiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTguODg2NCAxMi4xNDU2TDE1LjQ1ODkgOS4wODcyNUwxNS4zNDQ2IDE0LjQ2NThMMjAuMjgzNyAxNC4yNDYxTDE4Ljg4NjQgMTIuMTQ1NloiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4zODYwNiAyMS43NDI2TDEyLjM1NjYgMjAuMjkyNUw5Ljc5MDMzIDE4LjI4ODhMOS4zODYwNiAyMS43NDI2WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNS42MzQ3IDIwLjI5MjVMMTguNjEzOSAyMS43NDI2TDE4LjIwMDkgMTguMjg4OEwxNS42MzQ3IDIwLjI5MjVaIiBmaWxsPSIjRTQ3NjFCIiBzdHJva2U9IiNFNDc2MUIiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE4LjYxMzkgMjEuNzQyNkwxNS42MzQ3IDIwLjI5MjVMMTUuODcxOSAyMi4yMzQ4TDE1Ljg0NTYgMjMuMDUyMUwxOC42MTM5IDIxLjc0MjZaIiBmaWxsPSIjRDdDMUIzIiBzdHJva2U9IiNEN0MxQjMiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkuMzg2MDYgMjEuNzQyNkwxMi4xNTQ0IDIzLjA1MjFMMTIuMTM2OCAyMi4yMzQ4TDEyLjM1NjYgMjAuMjkyNUw5LjM4NjA2IDIxLjc0MjZaIiBmaWxsPSIjRDdDMUIzIiBzdHJva2U9IiNEN0MxQjMiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyLjE5ODQgMTcuMDA1Nkw5LjcyMDAyIDE2LjI3NjJMMTEuNDY4OSAxNS40NzY1TDEyLjE5ODQgMTcuMDA1NloiIGZpbGw9IiMyMzM0NDciIHN0cm9rZT0iIzIzMzQ0NyIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuNzkyOCAxNy4wMDU2TDE2LjUyMjMgMTUuNDc2NUwxOC4yOCAxNi4yNzYyTDE1Ljc5MjggMTcuMDA1NloiIGZpbGw9IiMyMzM0NDciIHN0cm9rZT0iIzIzMzQ0NyIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4zODYwNiAyMS43NDI2TDkuODA3OTEgMTguMTc0NUw3LjA1NzEyIDE4LjI1MzZMOS4zODYwNiAyMS43NDI2WiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOC4xOTIxIDE4LjE3NDVMMTguNjEzOSAyMS43NDI2TDIwLjk0MjkgMTguMjUzNkwxOC4xOTIxIDE4LjE3NDVaIiBmaWxsPSIjQ0Q2MTE2IiBzdHJva2U9IiNDRDYxMTYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIwLjI4MzcgMTQuMjQ2MUwxNS4zNDQ2IDE0LjQ2NThMMTUuODAxNiAxNy4wMDU3TDE2LjUzMTEgMTUuNDc2NUwxOC4yODg4IDE2LjI3NjJMMjAuMjgzNyAxNC4yNDYxWiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05LjcyMDAyIDE2LjI3NjJMMTEuNDc3NyAxNS40NzY1TDEyLjE5ODQgMTcuMDA1N0wxMi42NjQyIDE0LjQ2NThMNy43MTYyNiAxNC4yNDYxTDkuNzIwMDIgMTYuMjc2MloiIGZpbGw9IiNDRDYxMTYiIHN0cm9rZT0iI0NENjExNiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNy43MTYyNiAxNC4yNDYxTDkuNzkwMzMgMTguMjg4OEw5LjcyMDAyIDE2LjI3NjJMNy43MTYyNiAxNC4yNDYxWiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOC4yODg4IDE2LjI3NjJMMTguMjAwOSAxOC4yODg4TDIwLjI4MzcgMTQuMjQ2MUwxOC4yODg4IDE2LjI3NjJaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyLjY2NDIgMTQuNDY1OEwxMi4xOTg0IDE3LjAwNTdMMTIuNzc4NCAyMC4wMDI1TDEyLjkxMDIgMTYuMDU2NUwxMi42NjQyIDE0LjQ2NThaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE1LjM0NDYgMTQuNDY1OEwxNS4xMDczIDE2LjA0NzdMMTUuMjEyOCAyMC4wMDI1TDE1LjgwMTYgMTcuMDA1N0wxNS4zNDQ2IDE0LjQ2NThaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE1LjgwMTYgMTcuMDA1NkwxNS4yMTI4IDIwLjAwMjVMMTUuNjM0NyAyMC4yOTI1TDE4LjIwMDkgMTguMjg4OEwxOC4yODg4IDE2LjI3NjJMMTUuODAxNiAxNy4wMDU2WiIgZmlsbD0iI0Y2ODUxQiIgc3Ryb2tlPSIjRjY4NTFCIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05LjcyMDAyIDE2LjI3NjJMOS43OTAzMyAxOC4yODg4TDEyLjM1NjYgMjAuMjkyNUwxMi43Nzg0IDIwLjAwMjVMMTIuMTk4NCAxNy4wMDU2TDkuNzIwMDIgMTYuMjc2MloiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuODQ1NiAyMy4wNTIxTDE1Ljg3MTkgMjIuMjM0OEwxNS42NTIyIDIyLjA0MTRIMTIuMzM5TDEyLjEzNjggMjIuMjM0OEwxMi4xNTQ0IDIzLjA1MjFMOS4zODYwNiAyMS43NDI2TDEwLjM1MjggMjIuNTMzNkwxMi4zMTI2IDIzLjg5NThIMTUuNjc4NkwxNy42NDcyIDIyLjUzMzZMMTguNjEzOSAyMS43NDI2TDE1Ljg0NTYgMjMuMDUyMVoiIGZpbGw9IiNDMEFEOUUiIHN0cm9rZT0iI0MwQUQ5RSIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuNjM0NyAyMC4yOTI1TDE1LjIxMjggMjAuMDAyNUgxMi43Nzg0TDEyLjM1NjYgMjAuMjkyNUwxMi4xMzY4IDIyLjIzNDhMMTIuMzM5IDIyLjA0MTRIMTUuNjUyMkwxNS44NzE5IDIyLjIzNDhMMTUuNjM0NyAyMC4yOTI1WiIgZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNC40NTgzIDEwLjAzNjRMMjUuMjA1MyA2LjQ1MDcyTDI0LjA4OTEgMy4xMTk5TDE1LjYzNDcgOS4zOTQ4NUwxOC44ODY0IDEyLjE0NTZMMjMuNDgyNyAxMy40OTAzTDI0LjUwMjIgMTIuMzAzOEwyNC4wNjI4IDExLjk4NzRMMjQuNzY1OCAxMS4zNDU5TDI0LjIyMSAxMC45MjRMMjQuOTI0IDEwLjM4NzlMMjQuNDU4MyAxMC4wMzY0WiIgZmlsbD0iIzc2M0QxNiIgc3Ryb2tlPSIjNzYzRDE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yLjc5NDcyIDYuNDUwNzJMMy41NDE3NCAxMC4wMzY0TDMuMDY3MTcgMTAuMzg3OUwzLjc3MDI0IDEwLjkyNEwzLjIzNDE1IDExLjM0NTlMMy45MzcyMiAxMS45ODc0TDMuNDk3OCAxMi4zMDM4TDQuNTA4NDcgMTMuNDkwM0w5LjEwNDgzIDEyLjE0NTZMMTIuMzU2NiA5LjM5NDg1TDMuOTAyMDcgMy4xMTk5TDIuNzk0NzIgNi40NTA3MloiIGZpbGw9IiM3NjNEMTYiIHN0cm9rZT0iIzc2M0QxNiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjMuNDgyNyAxMy40OTAzTDE4Ljg4NjQgMTIuMTQ1NkwyMC4yODM3IDE0LjI0NjFMMTguMjAwOSAxOC4yODg4TDIwLjk0MjkgMTguMjUzNkgyNS4wMjk1TDIzLjQ4MjcgMTMuNDkwM1oiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4xMDQ4NCAxMi4xNDU2TDQuNTA4NDggMTMuNDkwM0wyLjk3OTI5IDE4LjI1MzZINy4wNTcxM0w5Ljc5MDMzIDE4LjI4ODhMNy43MTYyNiAxNC4yNDYxTDkuMTA0ODQgMTIuMTQ1NloiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuMzQ0NiAxNC40NjU4TDE1LjYzNDcgOS4zOTQ4NUwxNi45NzA1IDUuNzgyOEgxMS4wMzgzTDEyLjM1NjYgOS4zOTQ4NUwxMi42NjQyIDE0LjQ2NThMMTIuNzY5NiAxNi4wNjUzTDEyLjc3ODQgMjAuMDAyNUgxNS4yMTI4TDE1LjIzMDQgMTYuMDY1M0wxNS4zNDQ2IDE0LjQ2NThaIiBmaWxsPSIjRjY4NTFCIiBzdHJva2U9IiNGNjg1MUIiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==',
        },
        {
          type: 'Bitget',
          name: 'Bitget Wallet',
          icon: 'Bitget.png',
          bitget: true,
        },
        {
          type: 'TokenPocket',
          name: 'TokenPocket',
          icon: 'TokenPocket.png',
        },
        {
          type: 'Coinbase',
          name: 'Coinbase Wallet',
          icon: '',
          svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjMkM1RkY2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjMuOEMxOS40MTI0IDIzLjggMjMuOCAxOS40MTI0IDIzLjggMTRDMjMuOCA4LjU4NzYxIDE5LjQxMjQgNC4yIDE0IDQuMkM4LjU4NzYxIDQuMiA0LjIgOC41ODc2MSA0LjIgMTRDNC4yIDE5LjQxMjQgOC41ODc2MSAyMy44IDE0IDIzLjhaTTExLjU1IDEwLjhDMTEuMTM1OCAxMC44IDEwLjggMTEuMTM1OCAxMC44IDExLjU1VjE2LjQ1QzEwLjggMTYuODY0MiAxMS4xMzU4IDE3LjIgMTEuNTUgMTcuMkgxNi40NUMxNi44NjQyIDE3LjIgMTcuMiAxNi44NjQyIDE3LjIgMTYuNDVWMTEuNTVDMTcuMiAxMS4xMzU4IDE2Ljg2NDIgMTAuOCAxNi40NSAxMC44SDExLjU1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
        },
        {
          type: 'WalletConnect',
          name: 'WalletConnect',
          icon: '',
          svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjM0I5OUZDIi8+CjxwYXRoIGQ9Ik04LjM4OTY5IDEwLjM3MzlDMTEuNDg4MiA3LjI3NTM4IDE2LjUxMTggNy4yNzUzOCAxOS42MTAzIDEwLjM3MzlMMTkuOTgzMiAxMC43NDY4QzIwLjEzODIgMTAuOTAxNyAyMC4xMzgyIDExLjE1MjkgMTkuOTgzMiAxMS4zMDc4TDE4LjcwNzYgMTIuNTgzNUMxOC42MzAxIDEyLjY2MDkgMTguNTA0NSAxMi42NjA5IDE4LjQyNzEgMTIuNTgzNUwxNy45MTM5IDEyLjA3MDNDMTUuNzUyMyA5LjkwODcgMTIuMjQ3NyA5LjkwODcgMTAuMDg2MSAxMi4wNzAzTDkuNTM2NTUgMTIuNjE5OEM5LjQ1OTA5IDEyLjY5NzMgOS4zMzM1IDEyLjY5NzMgOS4yNTYwNCAxMi42MTk4TDcuOTgwMzkgMTEuMzQ0MkM3LjgyNTQ3IDExLjE4OTMgNy44MjU0NyAxMC45MzgxIDcuOTgwMzkgMTAuNzgzMkw4LjM4OTY5IDEwLjM3MzlaTTIyLjI0ODUgMTMuMDEyTDIzLjM4MzggMTQuMTQ3NEMyMy41Mzg3IDE0LjMwMjMgMjMuNTM4NyAxNC41NTM1IDIzLjM4MzggMTQuNzA4NEwxOC4yNjQ1IDE5LjgyNzdDMTguMTA5NiAxOS45ODI3IDE3Ljg1ODQgMTkuOTgyNyAxNy43MDM1IDE5LjgyNzdDMTcuNzAzNSAxOS44Mjc3IDE3LjcwMzUgMTkuODI3NyAxNy43MDM1IDE5LjgyNzdMMTQuMDcwMiAxNi4xOTQ0QzE0LjAzMTQgMTYuMTU1NyAxMy45Njg2IDE2LjE1NTcgMTMuOTI5OSAxNi4xOTQ0QzEzLjkyOTkgMTYuMTk0NCAxMy45Mjk5IDE2LjE5NDQgMTMuOTI5OSAxNi4xOTQ0TDEwLjI5NjYgMTkuODI3N0MxMC4xNDE3IDE5Ljk4MjcgOS44OTA1MyAxOS45ODI3IDkuNzM1NjEgMTkuODI3OEM5LjczNTYgMTkuODI3OCA5LjczNTYgMTkuODI3NyA5LjczNTYgMTkuODI3N0w0LjYxNjE5IDE0LjcwODNDNC40NjEyNyAxNC41NTM0IDQuNDYxMjcgMTQuMzAyMiA0LjYxNjE5IDE0LjE0NzNMNS43NTE1MiAxMy4wMTJDNS45MDY0NSAxMi44NTcgNi4xNTc2MyAxMi44NTcgNi4zMTI1NSAxMy4wMTJMOS45NDU5NSAxNi42NDU0QzkuOTg0NjggMTYuNjg0MSAxMC4wNDc1IDE2LjY4NDEgMTAuMDg2MiAxNi42NDU0QzEwLjA4NjIgMTYuNjQ1NCAxMC4wODYyIDE2LjY0NTQgMTAuMDg2MiAxNi42NDU0TDEzLjcxOTQgMTMuMDEyQzEzLjg3NDMgMTIuODU3IDE0LjEyNTUgMTIuODU3IDE0LjI4MDUgMTMuMDEyQzE0LjI4MDUgMTMuMDEyIDE0LjI4MDUgMTMuMDEyIDE0LjI4MDUgMTMuMDEyTDE3LjkxMzkgMTYuNjQ1NEMxNy45NTI2IDE2LjY4NDEgMTguMDE1NCAxNi42ODQxIDE4LjA1NDEgMTYuNjQ1NEwyMS42ODc0IDEzLjAxMkMyMS44NDI0IDEyLjg1NzEgMjIuMDkzNiAxMi44NTcxIDIyLjI0ODUgMTMuMDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
        },
      ],
    },
    // {
    //   type: 'web2',
    //   title: t('header.web2Login.web2Login'),
    //   renderList: [
    //     {
    //       type: 'Email',
    //       name: t('header.web2Login.email'),
    //       icon: 'Email.png',
    //       svg: '',
    //       recommend: true,
    //     },
    //     // {
    //     //   type: 'Google',
    //     //   name: 'Google',
    //     //   svg: '',
    //     //   icon: 'Google.png',
    //     // },
    //     // {
    //     //   type: 'Twitter',
    //     //   name: 'Twitter',
    //     //   svg: '',
    //     //   icon: 'Twitter.png',
    //     // },
    //   ],
    // },
  ];

  // // 存在code 时调用接口
  // const getDcName = async ()=>{
  //   if(query.code){
  //     const code  = query.code as string
  //     const url = window.location.origin
  //     try {
  //       const { data } = await userApis.dcCallback({ code: code ,redirect_uri:url });
  //       console.log(data.discord_name)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  // }
  // useEffect(()=>{
  //   console.log('我被调用了')
  //   getDcName()
  // },[])

  useEffect(() => {
    if (isOpen) {
      // 如果本地缓存中有上次登陆的邮箱就直接回填
      const UserEmail = window.localStorage.getItem('UserEmail');
      if (UserEmail && isValidEmail(UserEmail)) {
        setEmail(UserEmail);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // 在登录页通过web2登陆成功之后需要跳转出去
    if (router.route === '/login') {
      // 如果绑定过web3账号就往个人中心跳
      if (userData?.wallet_address) {
        const oldRoute = window.sessionStorage.getItem('oldRoute');
        if (oldRoute) {
          router.replace(oldRoute);
        } else {
          router.replace(`/user/${userData?.wallet_address}`);
        }
      } else if (userData?.login_email) {
        router.replace(`/`);
      }
    }
  }, [userData]);

  useImperativeHandle(ref, () => ({
    open: onOpen,
    close: onClose,
  }));

  const handleModalClose = () => {
    setEmail('');
    setEmailCode('');
    setShowEmailFormatError(false);
    setStep(0);
    onClose();
  };

  const isValidEmail = (email: string) => {
    return /^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
  };

  const getErrorText = (code: number) => {
    let errorText = '';
    switch (code) {
      case 200019:
        errorText = t('header.web2Login.sendTooOften');
        break;
      case 200020:
        errorText = t('header.web2Login.verifyCodeError');
        break;
    }
    return errorText;
  };

  // 发送验证码
  const handleGetEmailValidCode = async () => {
    if (isValidEmail(email)) {
      setButtonLoading(true);
      await globalApi
        .sendEmailValidCode({
          email,
        })
        .then(() => {
          setShowEmailFormatError(false);
          setStep(step + 1);
        })
        .catch((e) => {
          toast({
            position: 'top',
            containerStyle: {
              top: '30px',
            },
            title: getErrorText(e.code) || 'Request error',
            status: 'error',
            isClosable: true,
          });
        })
        .finally(() => {
          setButtonLoading(false);
        });
    } else {
      if (!email) {
        setEmailErrorText(t('header.web2Login.enterEmailTip'));
      } else {
        setEmailErrorText(t('header.web2Login.errorEmailTip'));
      }
      setShowEmailFormatError(true);
    }
  };

  // 输入验证码
  const handlePinInputChange = (value: string) => {
    setEmailCode(value);
    // 如果填满5位直接触发提交
    if (value?.length >= 5) {
      loginWithEmail(email, value);
    }
  };

  // 点击登录按钮
  const handleClickLogin = () => {
    if (emailCode?.length < 5) {
      toast({
        position: 'top',
        containerStyle: {
          top: '30px',
        },
        title: t('header.web2Login.enterVerifyCode'),
        status: 'error',
        isClosable: true,
      });
    } else {
      loginWithEmail(email, emailCode);
    }
  };

  // 邮箱登陆
  const loginWithEmail = async (email: string, code: string) => {
    if (buttonLoading) {
      return;
    }
    setButtonLoading(true);
    globalApi
      .loginWithEmail({
        email,
        code: Number(code),
      })
      .then(async ({ data }) => {
        jwtHelper.setEmail(email, {
          expires: new Date(+data.accessExpire * 1000),
        });
        jwtHelper.setToken(data.accessToken, {
          expires: new Date(+data.accessExpire * 1000),
        });
        await fetchUser();
        // 登陆成功后把邮箱在本地缓存一份，用于下次登陆时回填
        window.localStorage.setItem('UserEmail', email);
        handleModalClose();
        // 不需要换绑钱包，邮箱登陆完流程就结束
        // if (!data.isInit) {
        //   setStep(step + 1);
        // } else {
        //   handleModalClose();
        // }
      })
      .catch(async (e) => {
        console.log(e);
        toast({
          position: 'top',
          containerStyle: {
            top: '30px',
          },
          title: getErrorText(e.code) || 'Request error',
          status: 'error',
          isClosable: true,
        });
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  const handleWeb2Login = (type: string) => {
    switch (type) {
      case 'Email':
        setStep(step + 1);
        break;
      default:
        handleModalClose();
        break;
    }
  };

  const handleClickWallet = (type: string) => {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
      if (button?.innerHTML.indexOf(type) > -1) {
        button?.click();
        break;
      }
    }
  };

  // 跳转discord登陆，重定向的地址需要在discord配置项里添加
  // const handleDiscordLogin = () => {
  //   console.log('handleDiscordLogin');
  //   try {
  //     const url = `https://discord.com/api/oauth2/authorize?client_id=1119493794484719727&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify%20email`
  //     window.location.replace(url);
  //   } catch (error) {
  //     console.error(error)
  //   }

  // };

  const styleMap = {
    titleFontSize: isLargerThan480 ? '24px' : '16px',
    tipFontSize: isLargerThan480 ? '16px' : '12px',
    contentFontSize: isLargerThan480 ? '20px' : '14px',
    pinInputFieldSize: {
      width: isLargerThan480 ? '56px' : '44px',
      height: isLargerThan480 ? '56px' : '44px',
    },
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        isCentered
        scrollBehavior="inside"
        variant={{ md: 'right', base: '' }}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          rounded="22px"
          maxWidth="528px"
          minHeight="240px"
          maxHeight="506px"
          bgColor="#2B2B2B"
          padding={isLargerThan480 ? '32px' : '16px 32px'}
          marginBottom={isLargerThan480 ? 'auto' : '0px'}
          borderBottomLeftRadius={isLargerThan480 ? '22px' : '0px'}
          borderBottomRightRadius={isLargerThan480 ? '22px' : '0px'}
        >
          <ModalCloseButton color={'#fff'} />
          <ModalBody padding="0" overflow="hidden">
            {/* 初始化，选择登录方式 */}
            {step === 0 && (
              <Box height="100%" fontSize={styleMap.contentFontSize}>
                {LOGIN_TYPE.map((loginItem, loginIndex) => {
                  // 如果已经是web2登陆了就不显示邮箱登陆

                  return loginItem.type === 'web3' || !userData?.login_email ? (
                    <Box
                      key={`${loginItem.type}-${loginIndex}`}
                      mt={loginIndex !== 0 ? '53px' : ''}
                    >
                      {/* 标题 */}
                      <Text fontWeight={600} color={'#fff'}>
                        {loginItem.title}
                      </Text>
                      {/* 钱包类型 */}
                      <SimpleGrid mt="32px" columns={2} spacing="16px">
                        {loginItem.renderList.map((item) => {
                          return (
                            <ConnectButton.Custom key={item.type}>
                              {({ openConnectModal }) => (
                                <>
                                  <Button
                                    fontSize="14px"
                                    size="lg"
                                    borderRadius="8px"
                                    border="1px solid rgba(0,0,0,0.2)"
                                    colorScheme="teal"
                                    variant="outline"
                                    bg="#2B2B2B"
                                    color={'#fff'}
                                    _hover={{
                                      bg: '#E49F5C',
                                      color: '#000',
                                    }}
                                    _active={{
                                      bg: '#E49F5C',
                                      color: '#000',
                                    }}
                                    borderColor="rgba(255, 255, 255, 0.10)"
                                    leftIcon={
                                      <Image
                                        w="20px"
                                        h="20px"
                                        src={`${
                                          (item.icon &&
                                            `/images/login/${item.icon}`) ||
                                          item.svg
                                        } `}
                                        alt={item.icon}
                                      />
                                    }
                                    onClick={() => {
                                      if (loginItem.type === 'web3') {
                                        handleModalClose();
                                        openConnectModal();
                                        setTimeout(() => {
                                          handleClickWallet(item.type);
                                        }, 150);
                                      } else {
                                        handleWeb2Login(item.type);
                                      }
                                    }}
                                  >
                                    {/* 右上角推荐按钮 */}
                                    {item.recommend && (
                                      <Badge
                                        position="absolute"
                                        right="0"
                                        top="0"
                                        w="36px"
                                        h="20px"
                                        lineHeight="20px"
                                        fontSize="12px"
                                        color="#544AEC"
                                        background="rgba(84,74,236,0.12)"
                                        borderRadius="0px 8px 0px 8px"
                                        overflow="hidden"
                                      >
                                        {t('header.web2Login.recommend')}
                                      </Badge>
                                    )}
                                    {item.name}
                                  </Button>
                                </>
                              )}
                            </ConnectButton.Custom>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  ) : null;
                })}
              </Box>
            )}
            {/* 第一步 */}
            {step === 1 && (
              <Flex
                height="100%"
                fontSize={styleMap.contentFontSize}
                flexDirection="column"
                justifyContent="space-between"
              >
                {/* 标题 */}
                <Text
                  fontSize={styleMap.titleFontSize}
                  fontWeight={600}
                  color={'#fff'}
                >
                  {t('header.web2Login.loginWithEmail')}
                </Text>
                <Box width="100%">
                  {/* 错误提示 */}
                  {showEmailFormatError && (
                    <Text
                      textAlign="center"
                      backgroundColor="rgba(255,0,48,0.17)"
                      fontWeight="400"
                      color="#FF0030"
                      borderRadius={isLargerThan480 ? '8px' : '5px'}
                      mt={isLargerThan480 ? '9px' : '5px'}
                      lineHeight={isLargerThan480 ? '32px' : '28px'}
                      fontSize={styleMap.tipFontSize}
                    >
                      {emailErrorText}
                    </Text>
                  )}
                  <Input
                    mt={isLargerThan480 ? '15px' : '8px'}
                    placeholder={t('header.web2Login.enterEmailTip')}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        handleGetEmailValidCode();
                      }
                    }}
                  ></Input>
                  <Text
                    mt={isLargerThan480 ? '16px' : '8px'}
                    fontWeight="400"
                    color={'#fff'}
                  >
                    {t('header.web2Login.autoRegister')}
                  </Text>
                </Box>
                <Button
                  mt={isLargerThan480 ? '32px' : '24px'}
                  borderRadius="28px"
                  backgroundColor="black"
                  color="white"
                  width="100%"
                  _hover={{ bg: 'rgba(0,0,0,0.85)' }}
                  isLoading={buttonLoading}
                  loadingText={t('header.web2Login.verifyCodeSending')}
                  onClick={handleGetEmailValidCode}
                >
                  {t('header.web2Login.getVerifyCode')}
                </Button>
              </Flex>
            )}
            {/* 第二步 */}
            {step === 2 && (
              <Flex
                fontSize={styleMap.contentFontSize}
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  {/* 标题 */}
                  <Text fontSize={styleMap.titleFontSize} fontWeight={600}>
                    {t('header.web2Login.enterVerifyCode')}
                  </Text>
                  <Text mt="8px" color="rgba(0,0,0,0.25);">
                    {t('header.web2Login.verifyCodeSended')} {email}
                  </Text>
                </Box>
                {/* 输入验证码的6个框框 */}
                <Flex
                  mt={isLargerThan480 ? '80px' : '36px'}
                  justifyContent="space-between"
                >
                  <PinInput placeholder="" onChange={handlePinInputChange}>
                    <PinInputField {...styleMap.pinInputFieldSize} />
                    <PinInputField {...styleMap.pinInputFieldSize} />
                    <PinInputField {...styleMap.pinInputFieldSize} />
                    <PinInputField {...styleMap.pinInputFieldSize} />
                    <PinInputField {...styleMap.pinInputFieldSize} />
                    {/* <PinInputField {...styleMap.pinInputFieldSize} /> */}
                  </PinInput>
                </Flex>
                <Button
                  mt={isLargerThan480 ? '100px' : '24px'}
                  lineHeight="56px"
                  borderRadius="28px"
                  backgroundColor="black"
                  color="white"
                  width="100%"
                  _hover={{ bg: 'rgba(0,0,0,0.85)' }}
                  isLoading={buttonLoading}
                  onClick={handleClickLogin}
                >
                  {t('header.web2Login.login')}
                </Button>
              </Flex>
            )}
            {/* 第三步 */}
            {step === 3 && (
              <Flex
                fontSize={styleMap.contentFontSize}
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  {/* 标题 */}
                  <Text fontSize={styleMap.titleFontSize} fontWeight={600}>
                    你有钱包吗？
                  </Text>
                  <Text mt="8px" color="rgba(0,0,0,0.25);">
                    跳过后会自动为你创建钱包账户，你可以在设置中随时调整你的账户
                  </Text>
                </Box>
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button
                      mt={isLargerThan480 ? '32px' : '24px'}
                      borderRadius="28px"
                      backgroundColor="black"
                      color="white"
                      width="100%"
                      _hover={{ bg: 'rgba(0,0,0,0.85)' }}
                      onClick={() => {
                        handleModalClose();
                        openConnectModal();
                      }}
                    >
                      是的，关联我的钱包
                    </Button>
                  )}
                </ConnectButton.Custom>
                <Button
                  mt={isLargerThan480 ? '24px' : '12px'}
                  borderRadius="28px"
                  width="100%"
                  onClick={handleModalClose}
                >
                  没有，跳过此步骤
                </Button>
              </Flex>
            )}
            {/* 选择其他方式 */}
            {
              // 第一步都显示
              (false &&
                (~[1].indexOf(step) ||
                  // 第二步只有在移动端才显示
                  (step === 2 && !isLargerThan480)) && (
                  <Box mt={isLargerThan480 ? '48px' : '30px'}>
                    {(isLargerThan480 && <Divider />) || null}
                    <Text
                      textAlign="center"
                      mt="30px"
                      fontSize={isLargerThan480 ? '20px' : '12px'}
                      fontWeight={600}
                    >
                      选择其他方式
                    </Text>
                    <Flex
                      mt="16px"
                      justifyContent={isLargerThan480 ? '' : 'space-evenly'}
                    >
                      {isLargerThan480 ? (
                        <Button
                          w="138px"
                          h="48px"
                          leftIcon={<Text>12</Text>}
                          variant="outline"
                          border="1px solid rgba(0,0,0,0.2)"
                          // onClick={handleDiscordLogin}
                        >
                          Discord
                        </Button>
                      ) : (
                        <IconButton
                          colorScheme="white"
                          aria-label="Call Sage"
                          fontSize="20px"
                          icon={
                            <Flex direction="column">
                              <Image
                                w="32px"
                                h="32px"
                                src="https://bit.ly/dan-abramov"
                                alt="Discord"
                              />
                              <Text color="black" fontSize="10px">
                                Discord
                              </Text>
                            </Flex>
                          }
                          // onClick={handleDiscordLogin}
                        />
                      )}
                    </Flex>
                  </Box>
                )) ||
                null
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export const BindWeb3WalletModal = forwardRef(
  (
    props: {
      onConfirm: () => void;
      onCancel: () => void;
    },
    ref,
  ) => {
    const { onConfirm, onCancel } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useUserData();
    const { address: accountAddress } = useAccount();
    const t = useTranslations('common');

    useImperativeHandle(ref, () => ({
      open: onOpen,
      close: onClose,
    }));

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onCancel}
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('header.web2Login.bindWeb3Wallet')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {t('header.web2Login.bindWeb3WalletQuestion')
                .replace('__email__', userData?.login_email || '')
                .replace('__address__', accountAddress || '')}
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => {
                  onCancel();
                  onClose();
                }}
              >
                {t('cancel')}
              </Button>
              <Button onClick={onConfirm}>{t('confirm')}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

export const BindWeb3WalletFailModal = forwardRef(
  (
    props: {
      onConfirm: () => void;
      onCancel: () => void;
    },
    ref,
  ) => {
    const { onConfirm, onCancel } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useUserData();
    const t = useTranslations('common');

    useImperativeHandle(ref, () => ({
      open: onOpen,
      close: onClose,
    }));

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onCancel}
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('header.web2Login.bindFail')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {t('header.web2Login.bindWeb3WalletFailTip').replace(
                '__email__',
                userData?.login_email || '',
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => {
                  onCancel();
                  onClose();
                }}
              >
                {t('header.web2Login.bindWeb3WalletFailCancel')}
              </Button>
              <Button onClick={onConfirm}>
                {t('header.web2Login.bindWeb3WalletFailConfirm')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  },
);
