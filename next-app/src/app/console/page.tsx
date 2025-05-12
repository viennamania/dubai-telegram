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
 



const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon


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



  ///const address = account?.address;


  // test address
  const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";



    // select center
    const [selectCenter, setSelectCenter] = useState(center);



    const [totalTradingAccountCount, setTotalTradingAccountCount] = useState(0);
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
                    center: selectCenter,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching agents");

                setApplications([]);
                setTotalTradingAccountCount(0);
                setTotalTradingAccountBalance(0);


                setLoadingApplications(false);
                return;
            }

            const data = await response.json();

            //console.log("getApplicationsForCenter data", data);


            //console.log("getApplicationsForCenter data", data);

            //console.log("getApplicationsForCenter data", data);
            /*
            {
                "totalCount": 19,
                "totalTradingAccountBalance": 1044.213837901115,
                "applications": [
                    {
                        "id": 178454,
                        "userName": "oskao",
                        "tradingAccountBalance": {
                            "balance": "0",
                            "timestamp": 1736386769818
                        },

                        "agentBotNft": {
                            "name": "adsf asdf",
                            "image": {
                                "thumbnailUrl": "https://ipfs.io/ipfs/QmZ8",
                              },
                            }
                        },
          

                        

                    },
                  ]
            }
            */


            setApplications(data?.result?.applications);



            setTotalTradingAccountCount( data?.result?.totalCount );
            setTotalTradingAccountBalance( data?.result?.totalTradingAccountBalance );

            setLoadingApplications(false);


        };

        if (address && selectCenter) {
            fetchData();
        }
    }, [address, selectCenter]);






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
  const [centerList, setCenterList] = useState([] as any[]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
          setLoadingCenters(true);
          const response = await fetch("/api/user/getAllCenters", {
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

          //console.log("getAllCenters data", data);
          /*
          [
            {
                "_id": "owin_anawin_bot",
                "count": 3
            },
            {
                "_id": "owin_kingkong_bot",
                "count": 1
            },

          ]
          */

          setCenterList(data.result);

          setLoadingCenters(false);

      };

      marketingCenter && fetchData();

  }, [marketingCenter]);




  // select user by walletAddress
  const [selectUser, setSelectUser] = useState(null);

  // get agnetNft
  const [agentNft, setAgentNft] = useState<any[]>([]);
  const [loadingAgentNft, setLoadingAgentNft] = useState(false);


  const [applicationData, setApplicationData] = useState(null);


  const [granderbyNft, setGranderbyNft] = useState([] as any[]);


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



      const fetchGranderbyNfts = async () => {

        setLoadingAgentNft(true);


        const response = await fetch("/api/granderby/getAgentNFTByWalletAddress", {
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

        setGranderbyNft(data.result.ownedNfts);


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








      if (selectUser) {

        fetchNfts();

        fetchGranderbyNfts();

        //fetchApplication();

      }

  }, [selectUser]);




  // getAllUsersTelegramIdByCenter


  const [searchNickname, setSearchNickname] = useState("");
  

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
                  limit: 100,
                  page: 0,
                  center: selectCenter,
                  //searchNickname: searchNickname,
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


          setUsers(data?.result);

          setLoadingUsers(false);

      };

      if (selectCenter) {
          fetchData();
      }

  }, [selectCenter, ]);


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

  const [toTelegramId, setToTelegramId] = useState("");
  const [amountSend, setAmountSend] = useState(0);
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
            userTelegramId: toTelegramId,
            amount: amountSend,
          }),
      });

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setLoadingSend(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);

      if (data?.result) {
          alert("전송이 완료되었습니다.");
      } else {
          alert("전송에 실패했습니다.");
      }

      setLoadingSend(false);

  }



  // send roulette game to all users
  const [sendingRouletteAll, setSendingRouletteAll] = useState(false);
  const sendRouletteAll = async () => {
    
      setSendingRouletteAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game/sendRouletteAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });

      console.log("sendRouletteAll response", response);

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingRouletteAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");


      setSendingRouletteAll(false);

  }




  // send roulette game to all users
  const [sendingCebienGameAll, setSendingCebienGameAll] = useState(false);
  const sendCebienGameAll = async () => {
    
    setSendingCebienGameAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game-cebien/sendRouletteAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });



      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingCebienGameAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");


      setSendingCebienGameAll(false);

  }



  // send race game to all users
  const [sendingRaceGameAll, setSendingRaceGameAll] = useState(false);
  const sendRaceGameAll = async () => {
    
      setSendingRaceGameAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game/sendRaceGameAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });

      console.log("sendRaceGameAll response", response);

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingRaceGameAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");


      setSendingRaceGameAll(false);

  }





  // send roulette game
  const [sendRouletteTelegramId, setSendRouletteTelegramId] = useState("");
  const [sendRouletteAmount, setSendRouletteAmount] = useState(0);

  const [sendingRoulette, setSendingRoulette] = useState(false);
  const sendRoulette = async () => {
    
      setSendingRoulette(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game/sendToUserTelegramId", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userTelegramId: sendRouletteTelegramId,
            amount: sendRouletteAmount,
          }),
      });

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingRoulette(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);

      if (data?.result) {
          alert("전송이 완료되었습니다.");
      } else {
          alert("전송에 실패했습니다.");
      }

      setSendingRoulette(false);

  }




  // send survey to all users
  const [sendingSurveyAll, setSendingSurveyAll] = useState(false);

  const sendSurveyAll = async () => {
    
      setSendingSurveyAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/poll/sendPollAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });

      console.log("sendSurveyAll response", response);

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingSurveyAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");

      setSendingSurveyAll(false);

  }


  
  return (

    
   
    <main
      className="
        p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-xl mx-auto
        bg-cover bg-center bg-no-repeat
        "
    >
      <div className="py-20 w-full flex flex-col gap-10 items-center justify-center">
        {/*
        <Header />
        */}
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







        {/* if marketingCenter is "owin", link to @magic_wallet_cs */}
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
              {/* copy telegram link */}
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

        {/* if marketingCenter is "exms", link to @exms_cs */}
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
              {/* copy telegram link */}
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
        

              {/* refresh button */}

              


        {/* center list and select center */}
        {/* radio checkboxes */}
        <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
            
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                  텔레그램 센터 선택
              </div>

            </div>
            
            <div className='w-full flex flex-col gap-2 items-start justify-between'>
                {loadingCenters ? (
                  <div className="w-full flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                  </div>
                ) : (
                  <div className='w-full grid grid-cols-1 xl:grid-cols-3 gap-2 items-start justify-between'>
                      {centerList.map((center, index) => (
                          <div
                            key={index}
                            className={`
                              flex flex-row gap-2 items-center justify-between
                              p-2 rounded
                              cursor-pointer
                              ${selectCenter === center._id ? "bg-green-500 text-zinc-100" : "bg-zinc-800 text-zinc-100"}
                            `}
                              
                              
                          >
                              <input
                                  type="radio"
                                  id={center._id}
                                  name="center"
                                  value={center._id}
                                  checked={selectCenter === center._id}
                                  onChange={() => {
                                      setSelectCenter(center._id);
                                      setSelectUser(null);
                                      setUsers([]);

                                  }}
                              />
                              <div className="flex flex-row gap-2 items-center justify-between">
                                <span className="text-sm bg-gray-800 text-zinc-100 p-2 rounded">
                                    @{center._id}
                                </span>
                                <span className="text-sm text-gray-800 font-semibold bg-gray-100 p-2 rounded">
                                    {center.count}
                                </span>
                              </div>

                              <div className="flex flex-col xl:flex-col gap-2 items-start justify-start">
                                {/* link to telegram */}
                                <Button
                                  onClick={() => (window as any).Telegram.WebApp.openLink(`https://t.me/${center._id}`)}
                                  className="
                                    inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-xs font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                  "
                                >
                                  텔레그램
                                </Button>

                                {/* copy telegram link */}
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`https://t.me/${center._id}`);
                                    alert(`https://t.me/${center._id} 복사되었습니다.`);
                                  }}
                                  className="
                                    inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-xs font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                  "
                                >
                                  복사
                                </Button>
                              </div>

                          </div>
                      ))}
                  </div>
                )}
            </div>


        </div>
      

        {/* send to user telegramId */}
        {/* input amountSend */}
        {address && (

          <div className="flex flex-col xl:flex-row gap-2 items-center justify-between">

            <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
              

              <div className="flex flex-row gap-2 items-center justify-between">
                {/* dot */}
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-800 font-semibold">
                    홀짝 게임 전송
                </span>
              </div>

              <div className="w-full flex flex-row gap-2 items-start justify-between">
                  <input
                    disabled={sendingRoulette}
                    onChange={(e) => {
                      setSendRouletteAmount(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="전송 USDT"
                    className="w-36 p-2 rounded border border-gray-300"
                  />
                  <input
                    disabled={sendingRoulette}
                    onChange={(e) => {
                      setSendRouletteTelegramId(e.target.value);
                    }}
                    value={sendRouletteTelegramId}
                    type="text"
                    placeholder="텔레그램 ID"
                    className="w-36 p-2 rounded border border-gray-300"
                  />
                  <Button
                    disabled={sendingRoulette}
                    onClick={() => {
                      // send
                      confirm("전송하시겠습니까?") && sendRoulette();
                    }}
                    className={`${sendingRoulette ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                  >
                    {sendingRoulette ? "전송중..." : "전송"}
                  </Button>
              </div>
            </div>


            <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
              

              <div className="flex flex-row gap-2 items-center justify-between">
                {/* dot */}
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-800 font-semibold">
                    USDT 전송
                </span>
              </div>

              <div className="w-full flex flex-row gap-2 items-start justify-between">
                  <input
                    disabled={loadingSend}
                    onChange={(e) => {
                      setAmountSend(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="전송 USDT"
                    className="w-36 p-2 rounded border border-gray-300"
                  />
                  <input
                    disabled={loadingSend}
                    onChange={(e) => {
                      setToTelegramId(e.target.value);
                    }}
                    value={toTelegramId}
                    type="text"
                    placeholder="텔레그램 ID"
                    className="w-36 p-2 rounded border border-gray-300"
                  />
                  <Button
                    disabled={loadingSend}
                    onClick={() => {
                      // send
                      confirm("전송하시겠습니까?") && send();
                    }}
                    className={`${loadingSend ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                  >
                    {loadingSend ? "전송중..." : "전송"}
                  </Button>
              </div>
            </div>

          </div>
        )}



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

              <div className="flex flex-row gap-2 items-center justify-start">
                {/* dot */}
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-800 font-semibold">
                    텔레그램 회원 목록
                </span>
              </div>

              {/* 에어드롭 USDT */}
              {/* input amountAirDrop */}
              {address && !loadingUsers && users?.length > 0 && (

                <div className="flex flex-row gap-2 items-center justify-between">

                  {/* 회원수 */}
                  <span className="text-lg text-gray-800 font-semibold bg-gray-100 p-2 rounded">
                    회원수: {users?.length}
                  </span>

                </div>
              
              )}

              {/* searchNickname */}
              <div className="flex flex-row gap-2 items-center justify-end">
                <input
                  disabled={loadingUsers}
                  onChange={(e) => {
                    setSearchNickname(e.target.value);
                  }}
                  type="text"
                  placeholder="회원아이디"
                  className="w-36 p-2 rounded border border-gray-300"
                />
                <Button
                  disabled={loadingUsers}
                  onClick={() => {
                    // search
                    //setSelectUser(null);
                    //setUsers([]);

                    const fetchData = async () => {
                      setLoadingUsers(true);
                      const response = await fetch("/api/user/getAllUsersTelegramIdByCenter", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                              limit: 100,
                              page: 0,
                              center: selectCenter,
                              searchNickname,
                          }),
                      });

                      if (!response.ok) {
                          console.error("Error fetching users");
                          setLoadingUsers(false);
                          return;
                      }

                      const data = await response.json();

                      setUsers(data?.result);

                      setLoadingUsers(false);

                    };

                    fetchData();

                  }}
                  className={`${loadingUsers ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                >
                  {loadingUsers ? "로딩중..." : "검색"}
                </Button>
              </div>
        
            </div>

            {/* 전체회원에게 설문조사 보내기 */}
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingSurveyAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendSurveyAll();
                }}
                className={`${sendingSurveyAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingSurveyAll ? "전송중..." : "전체회원에게 설문조사 보내기"}
              </Button>
            </div>


            {/* 전체회원에게 게임 보내기 */}
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingRouletteAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendRouletteAll();
                }}
                className={`${sendingRouletteAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingRouletteAll ? "전송중..." : "전체회원에게 USDT 홀짝게임 보내기"}
              </Button>
            </div>


            {/* 전체회원에게 CEBIEN 홀짝게임 보내기 */}
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingCebienGameAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendCebienGameAll();
                }}
                className={`${sendingCebienGameAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingCebienGameAll ? "전송중..." : "전체회원에게 CEBIEN 홀짝게임 보내기"}
              </Button>
            </div>


            {/* 전체회원에게 경마게임 보내기 */}
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingRaceGameAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendRaceGameAll();
                }}
                className={`${sendingRaceGameAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingRaceGameAll ? "전송중..." : "전체회원에게 경마게임 보내기"}
              </Button>
            </div>


            <div className="w-full flex flex-row gap-2 items-start justify-end">
                <input
                    disabled={loadingAirDrop}

                    onChange={(e) => {
                      setAmountAirDrop(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="에어드롭 USDT"
                    className=" w-36  p-2 rounded border border-gray-300"
                  />
                  {/* button airDrop */}
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


            <div className="w-full flex flex-col gap-2 items-start justify-between">
            
              {
                address && (
              

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
                                <th className="p-2">등록일</th>
                                <th className="p-2">TID</th>
                                <th className="p-2">지갑주소</th>
                                <th className="p-2">레퍼럴코드</th>
                                <th className="p-2">센터장</th>
                                <th className="p-2">NFT</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
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
                                          className="rounded w-6 h-6"
                                        />
                                        <span className="text-sm">
                                          {user?.nickname}
                                        </span>
                                      </div>
                                    
                                    </td>

                                    <td className="p-2">
                                      
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          {
                                            //user?.createdAt
                                            new Date(user?.createdAt).toLocaleString()
                                          }
                                        </span>
                                      </div>
                                    </td>

                                    <td className="p-2">
                                      
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          {user?.telegramId}
                                        </span>
                                        {/*
                                        <Button
                                          onClick={() => {
                                            (window as any).Telegram.WebApp.openLink(
                                              "https://t.me/" + user?.telegramId
                                            );
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          텔레그램
                                        </Button>
                                        */}
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


                                    <td className="p-2">

                                      
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          
                                          {user?.referralCode?.slice(0, 6) + "..." + user?.referralCode?.slice(-6)}

                                        </span>
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              "t.me/" + selectCenter + "/?start=" + user?.referralCode
                                            );
                                            alert(`${user?.referralCode} 복사되었습니다.`);
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          복사
                                        </Button>

                                        <Button
                                          onClick={() => {
                                            (window as any).Telegram.WebApp.openLink(
                                              "https://opensea.io/assets/matic/" + user?.referralCode?.split("_")[0] + "/" + user?.referralCode?.split("_")[1]
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
                                      


                                    </td>

                                    <td className="p-2 text-center">
                                      {user?.centerOwner && (
                                        <span className="text-white font-semibold bg-green-500 p-1 rounded">
                                          O
                                        </span>
                                      )}
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


            
              {
                selectUser && (

                <>


                  {loadingAgentNft ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (


                    <div className="w-full flex flex-col gap-2 items-start justify-between">
                        <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                            에이전트 NFT 목록
                        </div>
                        <div className="w-full grid grid-cols-8 gap-5 items-start justify-between">
                            {agentNft && agentNft.length === 0 && (
                                <div className="w-full flex flex-col items-center justify-center">
                                    <span className="text-sm text-gray-400">
                                        NFT가 없습니다.
                                    </span>
                                </div>
                            )}

                            {agentNft && agentNft.map((nft : any, index : number) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 items-center justify-between"
                                >
                                    <div className="
                                      border border-gray-300 p-4 rounded-lg
                                      flex flex-col gap-1 items-center justify-start">

                                        <div className="flex flex-col gap-2 items-start justify-between">
                                          {/* tokenId */}
                                          <span className="text-sm">
                                            번호: #{nft.tokenId}
                                          </span>
                                          <span className="text-sm">
                                            {nft.name && nft.name?.slice(0, 10) + "..."}
                                          </span>
                                          <span className="text-sm text-gray-400">
                                            {nft.description && nft.description?.slice(0, 10) + "..."}
                                          </span>
                                        </div>

                                        <div className="flex flex-row gap-2 items-center justify-start">


                                          <Image
                                            src={nft?.image?.thumbnailUrl || "/icon-nft.png"}
                                            alt={nft?.name}
                                            width={100}
                                            height={100}
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



                                </div>
                            ))}

                        </div>
                    </div>





                  )}



                  {loadingAgentNft ? (
                    <div className="mt-5 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (


                    <div className="mt-5 w-full flex flex-col gap-2 items-start justify-between">
                        <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                            GRANDERBY NFT 목록
                        </div>
                        <div className="w-full grid grid-cols-8 gap-2 items-start justify-between">

                            {granderbyNft && granderbyNft.length === 0 && (
                                <div className="w-full flex flex-col items-center justify-center">
                                    <span className="text-sm text-gray-400">
                                        NFT가 없습니다.
                                    </span>
                                </div>
                            )}

                            {granderbyNft && granderbyNft.map((nft : any, index : number) => (
                                <div
                                    key={index}
                                    className="flex flex-row gap-2 items-center justify-between"
                                >
                                    <div className="
                                      border border-gray-300 p-4 rounded-lg
                                      flex flex-col gap-1 items-center justify-start">

                                        <div className="flex flex-col gap-2 items-start justify-between">
                                          {/* tokenId */}
                                          <span className="text-sm">
                                            번호: #{nft.tokenId}
                                          </span>
                                          <span className="text-sm">
                                            {nft.name && nft.name?.slice(0, 10) + "..."}
                                          </span>
                                          <span className="text-sm text-gray-400">
                                            {nft.description && nft.description?.slice(0, 10) + "..."}
                                          </span>
                                        </div>

                                        <div className="flex flex-row gap-2 items-center justify-start">


                                          <Image
                                            src={nft?.image?.thumbnailUrl || "/icon-nft.png"}
                                            alt={nft?.name}
                                            width={100}
                                            height={100}
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


                                </div>
                            ))}

                        </div>
                    </div>





                  )}





                </>

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