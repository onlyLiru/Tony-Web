/* eslint-disable @next/next/no-img-element */
import { useRequest } from 'ahooks';
import { getAllInfo } from '@/services/home';
import { useEffect, useState } from 'react';

const UUUPoint = () => {
  const [dataInfo, setDataInfo] = useState<any>({});

  const { runAsync } = useRequest(getAllInfo, {
    manual: true,
  });
  const getList = async () => {
    let data: any = [];
    try {
      data = await runAsync();
      setDataInfo(data.data);
      console.log(data.data);
    } catch (err) {
      console.log(err);
    }
    // data?.data?.list && updateList(handleSort(data.data.list, 'volIn7Days'));
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="max-w-[1200px] mx-auto flex justify-start items-center llg:flex-col">
      <div className="">
        <img
          className="w-[395px] h-auto lmd:w-[238px]"
          src="https://framerusercontent.com/images/IBjwc37u0Wl7ShmfDGhs87pPuHU.png"
          alt=""
        />
      </div>
      <div className="text-[#fff]">
        <div className="text-[65px] font-[900] llg:text-center leading-[60px] mb-[10px] mt-[150px] lmd:text-[42px] lmd:mb-[0] lmd:mt-[0px]">
          UUU Points
        </div>
        <div className="text-[38px] font-[300] llg:text-center lmd:text-[16px]">
          Reward for Community Members
        </div>
        <div className="text-[18px] grid grid-cols-3 llg:grid-cols-2 lmd:!grid-cols-1 text-center">
          <div className="mt-[35px] lmd:mt-[20px]">
            <div className="text-[34px] font-[700]  uuuTextBgImg">
              {dataInfo?.all_score_in?.toLocaleString() || 0}
            </div>
            <div className="text-[#999999] mt-[20px] lmd:mt-[5px]">
              Total UUU
            </div>
          </div>
          <div className="mt-[35px] lmd:mt-[20px]">
            <div className="text-[34px] font-[700] uuuTextBgImg">
              {dataInfo?.today_score_in?.toLocaleString() || 0}
            </div>
            <div className="text-[#999999] mt-[20px] lmd:mt-[5px]">
              Daily UUU rewards
            </div>
          </div>
          <div className="mt-[35px] lmd:mt-[20px]">
            <div className="text-[34px] font-[700] uuuTextBgImg">
              {dataInfo?.today_score_user?.toLocaleString() || 0}
            </div>
            <div className="text-[#999999] mt-[20px] lmd:mt-[5px]">
              Accounts
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-[70px] mb-[200px] lmd:mt-[40px] lmd:mb-[100px]">
          <div
            className="inline-block px-[46px] py-[12px] bg-[#ff700a] rounded-[40px] cursor-pointer select-none text-[32px] font-[700] border-transparent llg:text-[24px] border-[3px] hover:border-white"
            style={{ fontStyle: 'italic;' }}
            onClick={() => {
              window.open(`${window.location.origin}/rewards`, '_blank');
            }}
          >
            Get UUU
          </div>
        </div>
      </div>
    </div>
  );
};
export default UUUPoint;
