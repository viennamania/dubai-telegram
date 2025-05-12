"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@headlessui/react";
import { client, wallet } from "../constants";

import {
  AutoConnect,
  ConnectButton,
} from "thirdweb/react";

import { useEffect, useState, Suspense } from "react";


import {
  useRouter,
  useSearchParams,
} from "next//navigation";

import {
  polygon,
  arbitrum,
  ethereum,
} from "thirdweb/chains";

import {
  getContract,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";



const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon


function HomeContent() {

  const searchParams = useSearchParams();

  const center = searchParams.get('center');


  ///console.log('center', center);

  const router = useRouter();

  
  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain: polygon,
    address: contractAddress,
  });



  const address = account?.address;


  // test address
  //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";






    const [totalTradingAccountBalance, setTotalTradingAccountBalance] = useState(0);
  

    const [applications, setApplications] = useState([] as any[]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoadingApplications(true);
            const response = await fetch("/api/agent/getApplicationsForCenter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    center: center,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching agents");
                setLoadingApplications(false);
                return;
            }

            const data = await response.json();

            ////console.log("getApplicationsForCenter data", data);
            //setAgentBotSummaryList(data.resultSummany);


            setApplications(data.result.applications);

            setTotalTradingAccountBalance( data.result.totalTradingAccountBalance );

            setLoadingApplications(false);


        };

        if (address && center) {
            fetchData();
        }
    }, [address, center]);






  const [balance, setBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getBalance = async () => {

      if (!address) {
          return;
      }
      
      const result = await balanceOf({
        contract,
        address: address,
      });

  
      //console.log(result);

      if (!result) return;
  
      setBalance( Number(result) / 10 ** 6 );

    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract]);










  // getAllUsersTelegramIdByCenter

  const [users, setUsers] = useState([] as any[]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
          setLoadingUsers(true);
          const response = await fetch("/api/user/getAllUsersTelegramIdByCenter", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  center: center,
              }),
          });

          if (!response.ok) {
              console.error("Error fetching users");
              setLoadingUsers(false);
              return;
          }

          const data = await response.json();

          //console.log("getAllUsersTelegramIdByCenter data", data);
          //setAgentBotSummaryList(data.resultSummany);

          setUsers(data.result);

          setLoadingUsers(false);

      };

      if (center) {
          fetchData();
      }
  }, [center]);




  
  return (

    
   
    <main
      className="
        p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto
      "

      style={{
        backgroundImage: "url('/mobile-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="py-20">
        {/*
        <Header />
        */}

        <AutoConnect
          client={client}
          wallets={[wallet]}
          timeout={15000}
        />

        
        {/*
        <div className="flex justify-center mb-5">
          {address ? 
            (
              <> 
                <Button
                  onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}`)}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  내 지갑주소: {shortenAddress(address)}
                </Button>  
              </>
            ) 
          : (
              <p className="text-sm text-zinc-400">
                연결된 지갑이 없습니다. 지갑을 연결해 주세요.
              </p>
            )}      
        </div>
        */}


        {/*
        <div className='mb-10 w-full flex flex-col gap-4 items-start justify-center'>


          {address && (

              <div className='w-full flex flex-col gap-4 items-start justify-center'>

                  <div className='w-full flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>
                  
                      <div className=" flex flex-col xl:flex-row items-center justify-start gap-5">
                          <Image
                          src="/icon-wallet-live.gif"
                          alt="Wallet"
                          width={65}
                          height={25}
                          className="rounded"
                          />

                      </div>
                      
                      <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                          내 자산
                      </div>
                      <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                          {
                              Number(balance).toFixed(2)
                          } USDT
                      </div>
                  </div>


                  {totalTradingAccountBalance > 0 && (
                  <div className='w-full flex flex-col gap-2
                  items-start justify-between border border-gray-300 p-4 rounded-lg'>
                      <div className="w-full flex flex-row items-center gap-2">
                          <span className='w-1/2 text-sm text-gray-800 font-semibold'>
                              시작된 Bot: 
                          </span>
                          <span className='
                            w-1/2 text-right
                            text-xl text-green-500 font-semibold bg-green-100 p-2 rounded'>
                          
                          {
                              applications.filter((item) => item.accountConfig?.data.roleType === "2").length
                          }
                          </span>
                      </div>

                      <div className="w-full flex flex-row items-center gap-2">
                          <span className='w-1/2 text-sm font-semibold text-gray-800'>
                              총 거래 계정 잔고: 
                          </span>
                          <span className='
                            w-1/2 text-right
                            text-xl text-green-500 font-semibold bg-green-100 p-2 rounded'>
                              {
                                  Number(totalTradingAccountBalance).toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                  })
                              }
                          </span>
                      </div>
                    </div>
                  )}



              </div>

          )}

        </div>
        */}








        {/*
        {address && !userCenter && (
          <MenuItem
            title="나의 프로필 설정"
            href={`/profile?center=${center}&telegramId=${telegramId}`}
            description="나의 프로필을 설정합니다."
          />
        )}
        */}

        {/* button goto center */}
        <div className="flex flex-row gap-2 items-center justify-between">
          <Button
            onClick={() => {
              router.push(`/center?center=${center}`);
            }}
            className="p-2 bg-blue-500 text-zinc-100 rounded"
          >
            센터 보상내역 보러가기
          </Button>
        </div>



        


        {/* user list */}
        {/* table */}
        <div className='mt-5 mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
          
            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                회원 목록
            </div>
          {address && (
            <>          
              {loadingUsers ? (
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                </div>
              ) : (
                <table className="w-full">
                    <thead>
                        <tr className="bg-zinc-800 text-zinc-100">
                            <th className="p-2">회원아이디</th>
                            <th className="p-2">매직아이디</th>
                            <th className="p-2">센터장</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="bg-zinc-800 text-zinc-100">
                                <td className="p-2">{user.nickname}</td>
                                <td className="p-2">
                                  {user.telegramId}
                                </td>
                                <td className="p-2 text-center">
                                  {user.centerOwner && (
                                    <span className="text-green-500">O</span>
                                  )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              )}
            </>
          )}
        </div>


        {/* 나의 소속 센터 봇 */}
        {/*
        {address && userCenter && (
          <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
              <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                  나의 소속 센터 봇
              </div>
              <div className='flex flex-row gap-2 items-center justify-between'>
                  <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-sm font-semibold">
                      {userCenter}
                  </div>
                
                  <button
                      onClick={() => {
                          navigator.clipboard.writeText(
                            'https://t.me/' + userCenter
                          );
                          //toast.success('센터명이 복사되었습니다');
                      }}
                      className="p-2 bg-blue-500 text-zinc-100 rounded"
                  >
                    복사
                  </button>

              </div>

              {isCenterOwner && (
                <span className="p-2 text-sm bg-green-500 text-zinc-100 rounded">
                  센터 소유자 입니다.
                </span>
              )}
          </div>
        )}
        */}





      </div>
    </main>
  );
}






export default function Home() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <HomeContent />
      </Suspense>
  );
}