"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "../constants";

import {
  AutoConnect,
  ConnectButton,
} from "thirdweb/react";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

import { useSearchParams } from "next/navigation";

import {
  polygon,
  arbitrum,
  ethereum,
} from "thirdweb/chains";

import {
  getContract,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
import { add } from "thirdweb/extensions/thirdweb";
 



//const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon

const contractAddress = "0x542197103Ca1398db86026Be0a85bc8DcE83e440"; // NOAH-K on Polygon


function HomeContent() {

  const searchParams = useSearchParams();

  const marketingCenter = searchParams.get('marketingCenter');

  const center = searchParams.get('center');


  console.log('center', center);


  
  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain: polygon,
    address: contractAddress,
  });



  ////const address = account?.address;


  // test address
  const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";



  // select center
  const [selectCenter, setSelectCenter] = useState(center);





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
  
      setBalance( Number(result) / 10 ** 18 );

    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract]);




  // get centerList
  /*
  const [centerList, setCenterList] = useState([] as any[]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
          setLoadingCenters(true);
          const response = await fetch("/api/userNoahk/getAllCenters", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  limit: 100,
                  page: 0,
                  marketingCenter: marketingCenter,
              }),
          });

          if (!response.ok) {
              console.error("Error fetching centers");
              setLoadingCenters(false);
              return;
          }

          const data = await response.json();



          setCenterList(data.result);

          setLoadingCenters(false);

      };

      marketingCenter && fetchData();

  }, [marketingCenter]);
  */



  // select user by walletAddress
  const [selectUser, setSelectUser] = useState(null);

  // get agnetNft
  const [agentNft, setAgentNft] = useState<any[]>([]);
  const [loadingAgentNft, setLoadingAgentNft] = useState(false);


  const [applicationData, setApplicationData] = useState(null);

  const [userBalance, setUserBalance] = useState(0);


  useEffect(() => {

      const fetchNfts = async () => {
          setLoadingAgentNft(true);
          const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  walletAddress: selectUser,
              }),
          });

          if (!response.ok) {
              console.error("Error fetching agentNft");
              setLoadingAgentNft(false);
              return;
          }

          const data = await response.json();

          //console.log("getAgentNft data", data);
          /*
          [
            {

                "name": "미자부자다",
                "tokenUri": "https://alchemy.mypinata.cloud/ipfs/QmPdQJ5HjqvVSbqqsMno5HrAatopNw8UEBRSdg7cqEPdGu/0",
                "image": {
                    "thumbnailUrl": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/matic-mainnet/c0dfa75257307f42ad3d6467ba13563a",
                },
            },

        ]
          */

          setAgentNft(data.result.ownedNfts);

          setLoadingAgentNft(false);

      };

      // fetch one application by walletAddress
      /*
      const fetchApplication = async () => {

        const response = await fetch("/api/agent/getOneApplication", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: selectUser,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching application");
            return;
        }

        const data = await response.json();

        console.log("getOneApplication data", data);

        setApplicationData(data.result);


      }
      */




      const getBalance = async () => {
        
        if (!selectUser) {
            return;
        }
        
        const result = await balanceOf({
          contract,
          address: selectUser,
        });

    
        console.log(result);

        if (!result) return;
    
        setUserBalance( Number(result) / 10 ** 18 );

      }





      if (selectUser) {

        fetchNfts();

        //fetchApplication();

        getBalance();

      }

  }, [selectUser]);



  const [searchNickname, setSearchNickname] = useState("");

  // getAllUsersTelegramIdByCenter

  const [users, setUsers] = useState([] as any[]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
          setLoadingUsers(true);
          const response = await fetch("/api/userNoahk/getAllUsersTelegramIdByCenter", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  center: selectCenter,
                  searchNickname: searchNickname,
              }),
          });

          if (!response.ok) {
              console.error("Error fetching users");
              setLoadingUsers(false);
              return;
          }

          const data = await response.json();

          //console.log("getAllUsersTelegramIdByCenter data", data);

          //console.log("getAllUsersTelegramIdByCenter data", data);
          //setAgentBotSummaryList(data.resultSummany);


          setUsers(data?.result);

          setLoadingUsers(false);

      };

      if (selectCenter) {
          fetchData();
      }

  }, [selectCenter]);





  // airDrop
  const [amountAirDrop, setAmountAirDrop] = useState(0);
  const [loadingAirDrop, setLoadingAirDrop] = useState(false);
  const airDrop = async (amountAirDrop: number) => {

      setLoadingAirDrop(true);
      const response = await fetch("/api/settlement/airdrop", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              amount: amountAirDrop,
              center: selectCenter,
          }),
      });

      if (!response.ok) {
          console.error("Error airdropping");
          setLoadingAirDrop(false);
          return;
      }

      const data = await response.json();

      //console.log("airdrop data", data);

      if (data?.result) {
          alert("에어드롭이 완료되었습니다.");
      }


      setLoadingAirDrop(false);

  };


  // send erc20 to address
  const [amountSend, setAmountSend] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const send = async () => {
    
      setLoadingSend(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/settlement/sendToUserTelegramId", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              amount: amountSend,
              userTelegramId: toAddress,
          }),
      });

      if (!response.ok) {
          console.error("Error sending");
          setLoadingSend(false);
          return;
      }

      const data = await response.json();

      console.log("send data", data);

      if (data?.result) {
          alert("전송이 완료되었습니다.");
      } else {
          alert("전송에 실패했습니다.");
      }

      setLoadingSend(false);

  }



  
  return (

    
   
    <main
      className="
        w-full
        min-h-screen
        flex flex-col
        items-center
        justify-start
        bg-zinc-900
        gap-10
        px-5
        "
    >
      <div className="py-10 w-full flex flex-col gap-10 items-center justify-center">
        {/*
        <Header />
        */}

          {/* 메뉴선택 */}
          {/* 회원관리 / 구매관리 */}
          {/* 회원관리 /console-noah */}
          {/* 구매관리: /kr/my-buy-noahk?walletAddress=0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C */}

          <div className="flex flex-row gap-2 items-center justify-between">
            <Link href="/console-noah?center=noah_wallet_bot">
              
              <Button
                className="bg-green-500 text-zinc-100 p-2 rounded"
              >
                회원관리
              </Button>

            </Link>

            <Link href="/kr/my-buy-noahk?walletAddress=0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C">
              
              <Button
                className="bg-gray-700 text-zinc-100 p-2 rounded"
              >
                구매관리
              </Button>

            </Link>

          </div>


        {/*
        <AutoConnect
          client={client}
          wallets={[wallet]}
          timeout={15000}
        />
        */}

        
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
                          } DUBAI
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







        {/* if marketingCenter is "owin", link to @magic_wallet_cs */}
        {/*
        {marketingCenter === "owin" && (
          <div className=" w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg">
            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
              {marketingCenter}{' '}마케팅 센터 텔레그램
            </div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <Button
                onClick={() => (window as any).Telegram.WebApp.openLink(`https://t.me/magic_wallet_cs`)}
                className="
                  inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                "
              >
                @magic_wallet_cs 텔레그램
              </Button>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`https://t.me/magic_wallet_cs`);
                  alert(`https://t.me/magic_wallet_cs 복사되었습니다.`);
                }}
                className="
                  inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                "
              >
                복사
              </Button>
            </div>
          </div>
        )}
        */}



        {/* if marketingCenter is "exms", link to @exms_cs */}
        {/*
        {marketingCenter === "exms" && (
          <div className=" w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg">
            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
              {marketingCenter}{' '}마케팅 센터 텔레그램
            </div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <Button
                onClick={() => (window as any).Telegram.WebApp.openLink(`https://t.me/exms_cs`)}
                className="
                  inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                "
              >
                @exms_cs 텔레그램
              </Button>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`https://t.me/exms_cs`);
                  alert(`https://t.me/exms_cs 복사되었습니다.`);
                }}
                className="
                  inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                "
              >
                복사
              </Button>
            </div>
          </div>
        )}
        */}
        
  

        {/* send to user telegramId */}
        {/* input amountSend */}
        {/*
        {address && (
          <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                텔레그램 사용자에게 NOAH-K 포인트 전송
            </div>
            <div className="w-full flex flex-row gap-2 items-start justify-between">
                <input
                  disabled={loadingSend}
                  onChange={(e) => {
                    setAmountSend(Number(e.target.value));
                  }}
                  type="number"
                  placeholder="전송할 NOAH-K 포인트"
                  className="w-36 p-2 rounded border border-gray-300"
                />
                <input
                  disabled={loadingSend}
                  onChange={(e) => {
                    setToAddress(e.target.value);
                  }}
                  type="text"
                  placeholder="텔레그램 ID"
                  className="w-36 p-2 rounded border border-gray-300"
                />
                <Button
                  disabled={loadingSend}
                  onClick={() => {
                    // send
                    ///confirm("전송하시겠습니까?") && send();
                  }}
                  className={`${loadingSend ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                >
                  {loadingSend ? "전송중..." : "전송"}
                </Button>
            </div>
          </div>
        )}
        */}

      



        <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>

          {selectCenter && (
            <span className="bg-green-500 text-xl text-zinc-100 p-2 rounded">
                {"@"+selectCenter}
            </span>
          )}


          {/* user list */}
          {/* table */}
          <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
            
            <div className="flex flex-row gap-2 items-center justify-between">

              <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                  텔레그램 회원 목록
              </div>

              {/* searchNickname */}
              <input
                disabled={loadingUsers}
                onChange={(e) => {
                  setSearchNickname(e.target.value);
                }}
                type="text"
                placeholder="닉네임 검색"
                className="w-36 p-2 rounded border border-gray-300"
              />
              {/* search button */}
              <Button
                disabled={loadingUsers}
                onClick={() => {
                  
                  const getUsers = async () => {
                    setLoadingUsers(true);
                    const response = await fetch("/api/userNoahk/getAllUsersTelegramIdByCenter", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            center: selectCenter,
                            searchNickname: searchNickname,
                        }),
                    });

                    if (!response.ok) {
                        console.error("Error fetching users");
                        setLoadingUsers(false);
                        return;
                    }

                    const data = await response.json();

                    //console.log("getAllUsersTelegramIdByCenter data", data);

                    //console.log("getAllUsersTelegramIdByCenter data", data);
                    //setAgentBotSummaryList(data.resultSummany);


                    setUsers(data?.result);

                    setLoadingUsers(false);

                  };

                  getUsers();



                }}
                className={`${loadingUsers ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                
                {loadingUsers ? "로딩중..." : "검색"}
              </Button>




              {/* 에어드롭 DUBAI */}
              {/* input amountAirDrop */}
              {/*
              {address && !loadingUsers && users.length > 0 && (

                <div className="flex flex-row gap-2 items-center justify-between">

                  <span className="text-lg text-gray-800 font-semibold bg-gray-100 p-2 rounded">
                    회원수: {users.length}
                  </span>

                  <input
                    disabled={loadingAirDrop}

                    onChange={(e) => {
                      setAmountAirDrop(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="에어드롭 DUBAI"
                    className=" w-36  p-2 rounded border border-gray-300"
                  />

                  <Button
                    disabled={loadingAirDrop}
                    onClick={() => {
                      // airDrop
                      confirm("에어드롭을 진행하시겠습니까?") && airDrop(
                        amountAirDrop
                      );



                    }}
                    className={`${loadingAirDrop ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                  >
                    {loadingAirDrop ? "로딩중..." : "에어드롭"}
                  </Button>
                </div>
              
              )}
              */}
                


            </div>

            <div className="w-full flex flex-col gap-2 items-start justify-between">
            
              {address && (
                <>          
                  {loadingUsers ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (

                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-800 text-zinc-100">
                                <th className="p-2">회원아이디</th>
                                <th className="p-2">TID</th>
                                <th className="p-2">지갑주소</th>
                                <th className="p-2">핸드폰번호</th>
                                <th className="p-2">판매자정보</th>
                                <th className="p-2">가상계좌</th>
                                <th className="p-2">자산</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user, index) => (
                                <tr
                                  key={index}
                                  className={`${selectUser === user?.walletAddress ? "bg-green-500 text-zinc-100" : "bg-zinc-800 text-zinc-100"}`}
                                >
                                    <td className="p-2">
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <Image
                                          src={user?.avatar || "/icon-anonymous.png"}
                                          alt={user?.nickname}
                                          width={50}
                                          height={50}
                                          className="rounded w-10 h-10"
                                        />
                                        <span className="text-sm">
                                          {user?.nickname}
                                        </span>
                                      </div>
                                    </td>
                                    {/* telegram id */}
                                    <td className="p-2">
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          {user?.telegramId}
                                        </span>
                                      </div>
                                    </td>

                                    <td className="p-2">
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          {user?.walletAddress?.slice(0, 6) + "..."}
                                        </span>
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(user?.walletAddress);
                                            alert(`${user?.walletAddress} 복사되었습니다.`);
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          복사
                                        </Button>
                                      </div>
                                    </td>


                                    <td className="p-2 text-center">
                                      <span className="text-sm">
                                        {user?.mobile}
                                      </span>
                                    </td>

                                    <td className="p-2 text-center">
                                      <span className="text-sm">
                                        {
                                          user?.seller?.bankInfo?.bankName
                                        }
                                        <br />
                                        {
                                          user?.seller?.bankInfo?.accountNumber
                                        }
                                        <br />
                                        {
                                          user?.seller?.bankInfo?.accountHolder
                                        }
                                      </span>
                                    </td>

                                    <td className="p-2 text-center">
                                      <span className="text-sm">
                                        {
                                          user?.virtualAccount ? (
                                            <>
                                              제주은행<br />
                                              {user?.virtualAccount}<br />
                                              스타이움엑스 (가상)
                                            </>
                                          ) : (
                                            <span className="text-red-500">
                                            가상계좌 없음
                                            </span>
                                          )
                                        }
                                      </span>
                                    </td>

                                    <td className="p-2 text-center">
                                      <input
                                        type="radio"
                                        id={user?.walletAddress}
                                        name="user"
                                        value={user?.telegramId}
                                        checked={selectUser === user?.walletAddress}
                                        onChange={() => {
                                            setSelectUser(user?.walletAddress);
                                        }}
                                        className="w-4 h-4"
                                      />
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                  )}
                </>
              )}


            
              {selectUser && (
                <div className="w-full flex flex-col gap-2 items-start justify-between">

                  {/* user balance */}
                  <div className="w-full flex flex-row gap-2 items-center justify-start">
                    <span className="text-2xl text-green-500 font-semibold">
                      잔고: {
                        Number(userBalance).toFixed(0)
                      } NOAH-K
                    </span>
                  </div>

                  {loadingAgentNft ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-2 items-start justify-between">
                        <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                            에이전트 NFT 목록
                        </div>

                          {agentNft && agentNft.length === 0 && (
                              <div className="w-full flex flex-col items-center justify-center">
                                  <span className="text-sm text-gray-400">
                                      NFT가 없습니다.
                                  </span>
                              </div>
                          )}

                          <div className="w-full grid grid-cols-2 xl:grid-cols-8 gap-2 items-start justify-between">
                          

                            {agentNft && agentNft.map((nft : any, index : number) => (
                                <div
                                    key={index}
                                    className="flex flex-row gap-2 items-center justify-between"
                                >
                                    <div className="
                                      border border-gray-300 p-4 rounded-lg
                                      flex flex-col gap-1 items-center justify-start">

                                        <div className="flex flex-col gap-2 items-start justify-between">
                                          <span className="text-sm">
                                            {nft.name && nft.name.slice(0, 10) + "..."}
                                          </span>
                                          <span className="text-sm text-gray-400">
                                            {nft.description && nft.description.slice(0, 10) + "..."}
                                          </span>
                                        </div>

                                        <div className="flex flex-row gap-2 items-center justify-start">


                                          <Image
                                            src={nft?.image?.thumbnailUrl || "/icon-nft.png"}
                                            alt={nft?.name}
                                            width={200}
                                            height={200}
                                            className="rounded w-10 h-10"
                                          />
                                        
                                          <Button
                                            onClick={() => {
                                                (window as any).Telegram.WebApp.openLink(
                                                  "https://opensea.io/assets/matic/" + nft.contract.address + "/" + nft.tokenId
                                                );
                                            }}
                                            className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                            "
                                          >
                                            <div className="flex flex-row gap-2 items-center justify-start">
                                              <Image
                                                src="/logo-opensea.png"
                                                alt="OpenSea"
                                                width={20}
                                                height={20}
                                                className="rounded"
                                              />
                                            </div>
                                          </Button>

                                        </div>

                                    </div>




                                    {nft.name === "MasterBot" ? (
                                      <span className="text-sm text-green-500 font-semibold bg-green-100 p-2 rounded">
                                        마스터봇
                                      </span>
                                    ) : (

                                    <>    
                                      {/* copy telegram link */}
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              "https://t.me/" + selectCenter + "/?start=" + nft.contract.address + "_" + nft.tokenId
                                            );
                                            alert(`레퍼럴 링크 복사되었습니다.`);
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          레퍼럴 복사하기
                                        </Button>
                                      </div>
                                    </>


                                    )}


                                </div>
                            ))}

                        </div>
                    </div>
                  )}
                </div>

              )}

            </div>

          </div>


        </div>



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