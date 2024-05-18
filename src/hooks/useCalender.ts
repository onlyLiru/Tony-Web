import { useMemo, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import * as rebateApi from '@/services/rebate';
import { useUserDataValue } from '@/store';

// 获取给定年月的相关数据
function getCanlenderStaticData({ y, m }: { y: number; m: number }) {
  let currentDate = new Date();
  const currentYear = y || currentDate.getFullYear();
  const currentMonth = m || currentDate.getMonth() + 1;
  currentDate = new Date(currentYear, currentMonth, 0);
  const date = new Date(currentDate.setDate(1));
  const weekday = date.getDay();
  const date2 = new Date(currentYear, currentMonth, 0);
  const monthTotalDay: number = date2.getDate();
  return [weekday, monthTotalDay, currentMonth, currentYear];
}

export function useCalender(source: number) {
  const toast = useToast();
  const date = new Date();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [checkDays, setCheckDays] = useState<number[]>([]);
  const [todayChecked, setTodayChecked] = useState(false);
  const userData = useUserDataValue();
  const [dateInfo, setDateInfo] =
    useState<any>();

  const getDateInfo = async () => {
    const { data } = await rebateApi.getSignedInDate({
      year,
      month,
      source,
    });
    setDateInfo(data);
  }

  // 监听month
  useEffect(() => { 
    // 获取当前月份签到数据
    const getData = async () => {
      if (!userData?.wallet_address) return;
      try {
        setLoading(true);
        const { data } = await rebateApi.getSignedInDate({
          year,
          month,
          source,
        });
        getDateInfo();
        setLoading(false);
        const checkData = (data.sign_date || []).map((v: any) =>
          new Date(v * 1000).getDate(),
        );
        changeTodayCheckStatus(checkData || []);
        setCheckDays(checkData || []);
      } catch (error) {
        setErr(true);
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };
    setCheckDays([]);
    getData();
  }, [month, userData?.wallet_address]);

  const changeTodayCheckStatus = (data: number[]) => {
    const cy = date.getFullYear();
    const cm = date.getMonth() + 1;
    const cd = date.getDate();
    if (`${year}-${month}` === `${cy}-${cm}` && data.includes(cd)) {
      setTodayChecked(true);
    }
  };

  // 获取上个月份数据
  const getPrevMonth = () => {
    if (loading) return;
    const nmonth = month - 1;
    if (nmonth <= 0) {
      setYear((c) => c - 1);
      setMonth(12);
    } else {
      setMonth(nmonth);
    }
  };

  // 获取下个月份数据
  const getNextMonth = () => {
    if (loading) return;
    const nmonth = month + 1;
    if (nmonth > 12) {
      setYear((c) => c + 1);
      setMonth(1);
    } else {
      setMonth(nmonth);
    }
  };

  // 签到后将日期放入已签数组
  const addCheckDay = (num: number) => {
    const cy = date.getFullYear();
    const cm = date.getMonth() + 1;
    if (cy !== year || cm !== month) return;
    const newcheckDays = [...checkDays, num].sort((a, b) => a - b);
    changeTodayCheckStatus(newcheckDays);
    setCheckDays(newcheckDays);
  };

  // 获取当前月份第一天是星期几和月份总天数
  const [weekday, monthTotalDay] = useMemo(
    () => getCanlenderStaticData({ m: month, y: year }),
    [month, year],
  );

  // 显示月份向前切换按钮
  const hideNextIcon = useMemo(
    () => year >= date.getFullYear() && month >= date.getMonth() + 1,
    [month, year],
  );

  // 当前日期 xxxx-xx-xx eg: 2019-12-9
  const currentDay = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  return {
    loading,
    err,
    todayChecked,
    setTodayChecked,
    checkDays,
    currentDay,
    weekday,
    monthTotalDay,
    month,
    year,
    getPrevMonth,
    getNextMonth,
    hideNextIcon,
    addCheckDay,
    dateInfo,
    getDateInfo,
  };
}
