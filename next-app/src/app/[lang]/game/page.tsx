'use client';
import React, { useEffect, useState, Suspense } from "react";

import { toast } from 'react-toastify';


import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { deployERC721Contract } from 'thirdweb/deploys';

import {
    getOwnedNFTs,
    mintTo,
    transferFrom,
} from "thirdweb/extensions/erc721";


import {
    polygon,
    arbitrum,
    ethereum,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,

    useConnectedWallets,
    useSetActiveWallet,

    AutoConnect,

} from "thirdweb/react";

import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";

import Link from "next/link";

import { smartWallet, inAppWallet } from "thirdweb/wallets";


import Image from 'next/image';

//import Uploader from '@/components/uploader';

import { balanceOf } from "thirdweb/extensions/erc20";


import {
	accountAbstraction,
	client,
    wallet,
	editionDropContract,
	editionDropTokenId,
} from "../../constants";

import {
    useRouter,
    useSearchParams,
} from "next//navigation";


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon



function AgentPage() {

    const searchParams = useSearchParams();

    ///const address = searchParams.get('walletAddress');

    //const center = searchParams.get('center');

    /*
    const [params, setParams] = useState({ center: '' });

  
    useEffect(() => {
        const center = searchParams.get('center') || '';
        setParams({ center });
    }, [searchParams]);
    */
 

    const account = useActiveAccount();


    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });
    

    const router = useRouter();


    const address = account?.address;
  
    // test address
    ///const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  






    const [balance, setBalance] = useState(0);
    useEffect(() => {
  
      // get the balance
      const getBalance = async () => {

        if (!address) {
            return;
        }
  
        ///console.log('getBalance address', address);
  
        
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




    
    const [nickname, setNickname] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [userCode, setUserCode] = useState("");



    const [masterBot, setMasterBot] = useState({} as any);


    //console.log("address", address);

    const [loadingUserData, setLoadingUserData] = useState(false);
    const [isLoadingUserDataError, setIsLoadingUserDataError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            if (!address) {
                return;
            }

            setLoadingUserData(true);

            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching user");

                setIsLoadingUserDataError(true);

                setLoadingUserData(false);
                return;
            }

            const data = await response.json();

            //console.log("data", data);


            if (data.result) {
                setNickname(data.result.nickname);
                setUserCode(data.result.id);

                setMasterBot(data.result.masterBot);

            }

            setLoadingUserData(false);
        };

        fetchData();
    }, [address]);






    /*
        settlements

        {
        "applicationId": 945194,
        "timestamp": "2025-01-15T00:32:31.295Z",
        "settlementClaim": {
            "settlementTradingVolume": 23432.23
            "totalSettlementTradingVolume": 23432.23
            "okxUid": "650230456906336098",
            "masterInsentive": "2.69895320",
            "masterWalletAddress": "0xfD6c58c58029212a5f181EA324cBC6051c7161EF",
        }
        }
      */





    const [myAgent, setMyAgent] = useState({} as any);
    const [myAgentNFT, setMyAgentNFT] = useState({} as any);

    const [loadingMyAgent, setLoadingMyAgent] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoadingMyAgent(true);
            const response = await fetch("/api/agent/getMyAgent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching my agent");
                setLoadingMyAgent(false);
                return;
            }

            const data = await response.json();

            ////console.log("getMyAgent data=========", data);

            if (data.result) {

                setMyAgent(data.result);


                const erc721ContractAddress = data.result.agentBot;
                const tokenId = data.result.agentBotNumber;

                const fetchedNFT = await fetch("/api/agent/getAgentNFTByContractAddressAndTokenId", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        erc721ContractAddress: erc721ContractAddress,
                        tokenId: tokenId,
                    }),
                });

                if (!fetchedNFT.ok) {
                    console.error("Error fetching NFT");
                    setLoadingMyAgent(false);
                    return;
                }


                const nftData = await fetchedNFT.json();

                setMyAgentNFT(nftData.result);

                
            }

            setLoadingMyAgent(false);


        };

        address && fetchData();

    } , [address]);




    // getSettlementHistoryByMasterWalletAddress
    const [settlementHistory, setSettlementHistory] = useState([] as any[]);
    const [loadingSettlementHistory, setLoadingSettlementHistory] = useState(false);
    const getSettlementHistory = async () => {
        
        setLoadingSettlementHistory(true);

        const response = await fetch("/api/agent/getSettlementHistoryByMasterWalletAddress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                limit: 10,
                page: 0,
                walletAddress: address,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching settlement history");
            setLoadingSettlementHistory(false);
            return;
        }

        const data = await response.json();

        ///console.log("data", data);

        if (data.settlements) {
            setSettlementHistory(data.settlements);
        } else {
            setSettlementHistory([]);
        }

        setLoadingSettlementHistory(false);

    }

    useEffect(() => {
        address && getSettlementHistory();
    } , [address]);




    const [statisticsDaily, setStatisticsDaily] = useState([] as any[]);

    const [loadingStatisticsDaily, setLoadingStatisticsDaily] = useState(false);

    const [averageTradingAccountBalanceDaily, setAverageTradingAccountBalanceDaily] = useState(0);

    const [sumMasterBotProfit, setSumMasterBotProfit] = useState(0);

    useEffect(() => {

        const getStatisticsDaily = async () => {
            
            setLoadingStatisticsDaily(true);

            const response = await fetch("/api/settlement/statistics/dailyByMasterWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    masterWalletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error('Error fetching data');

                setLoadingStatisticsDaily(false);
                return;
            }

            const data = await response.json();

            ///console.log("getStatisticsDaily data", data);

            //setStatisticsDaily(data.statisticsDaily);

            const tradingVolumeDaily = data.result.tradingVolume;

            const tradingAccountBalanceDaily = data.result.tradingAccountBalance;

            // select average from tradingAccountBalanceDaily where tradingAccountBalanceDaily.average > 0

            let sumTradingAccountBalanceDaily = 0;
            let countTradingAccountBalanceDaily = 0;
            for (let i = 0; i < tradingAccountBalanceDaily?.length; i++) {
                if (tradingAccountBalanceDaily[i].average > 0) {
                    sumTradingAccountBalanceDaily += tradingAccountBalanceDaily[i].average;
                    countTradingAccountBalanceDaily++;
                }
            }

            setAverageTradingAccountBalanceDaily(sumTradingAccountBalanceDaily / countTradingAccountBalanceDaily);


            let sumMasterBotProfit = 0;

            for (let i = 0; i < tradingAccountBalanceDaily?.length; i++) {
                if (tradingAccountBalanceDaily[i].average > 0) {

                    // find tradingVolumenDaily where yearmonthday is the same


                    tradingVolumeDaily?.map((item: any) => {
                        if (item._id.yearmonthday === tradingAccountBalanceDaily[i]._id.yearmonthday) {
                            
                            sumMasterBotProfit += item.masterReward / tradingAccountBalanceDaily[i].average * 100;

                        }
                    } );

                }
            }
            setSumMasterBotProfit(sumMasterBotProfit);

            //console.log("sumMasterBotProfit", sumMasterBotProfit);
            ///console.log("averageTradingAccountBalanceDaily", averageTradingAccountBalanceDaily);


            //setStatisticsDaily(tradingVolumenDaily);


            const merged = tradingVolumeDaily?.map((item: any) => {
                const tradingAccountBalance = tradingAccountBalanceDaily?.find((item2: any) => item2._id.yearmonthday === item._id.yearmonthday);
        
                return {
                    ...item,
                    tradingAccountBalance: tradingAccountBalance?.average || 0,
                };
            });

            ///console.log("merged", merged);

            /*
            {
                "_id": {
                    "yearmonthday": "2025-01-19",
                    "claimedTradingVolume": 432.11999999999534
                },
                "tradingAccountBalance": 42.271692100295574
}
            */

            setStatisticsDaily(merged);






            setLoadingStatisticsDaily(false);

        }

        address && getStatisticsDaily();

    } , [address]);



    return (

        <main
            className="p-4 pb-28 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto"
            style={{
                backgroundImage: "url('/mobile-background-nft.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
        >

            <div className="py-0 w-full">
        
                
                <AutoConnect
                    client={client}
                    wallets={[wallet]}
                    timeout={15000}
                />


                <div className="mt-5 flex flex-col items-start justify-center space-y-4">


                    
                    <div className="flex justify-center mt-5">
                        {address ? (

                            <div className="flex flex-col gap-2 items-start justify-between">

                            <div className="flex flex-row gap-2 items-center justify-between">

                                <div className=" flex flex-col xl:flex-row items-center justify-start gap-5">
                                    <Image
                                    src="/icon-wallet-live.gif"
                                    alt="Wallet"
                                    width={50}
                                    height={25}
                                    className="rounded"
                                    />
                                </div>

                                
                                <Button
                                    onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}`)}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    
                                    {/* english */}
                                    Wallet Address: {shortenAddress(address)}
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address);
                                        //alert('지갑주소가 복사되었습니다.');
                                        // english
                                        alert('Wallet address copied.');
                                    }}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    Copy
                                </Button>

                                {/* polygon scan */}
                                <Button
                                    onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}`)}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    <Image
                                        src="/logo-polygon.png"
                                        alt="Polygon"
                                        width={20}
                                        height={20}
                                        className="rounded"
                                    />
                                </Button>
                                
                            </div>

                            <div className='w-full flex flex-row gap-2 items-center justify-between
                                border border-gray-800
                                p-4 rounded-lg'>

                                <Image
                                    src="/logo-tether.png"
                                    alt="USDT"
                                    width={30}
                                    height={30}
                                    className="rounded"
                                />                                


                                <div className="flex flex-row gap-2 items-center justify-between">

                                    <span className="p-2 text-green-500 text-4xl font-semibold"> 
                                        {
                                            Number(balance).toFixed(6)
                                        }
                                    </span>
                                    <span className="p-2 text-gray-500 text-lg font-semibold">USDT</span>

                                </div>
                            </div>


                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                {/* 연결된 지갑이 없습니다. 지갑을 연결해 주세요. */}
                                {/* english */}
                                No connected wallet. Please connect your wallet.
                                
                            </p>
                        )}      
                    </div>


                    {address
                    && !loadingUserData && !isLoadingUserDataError
                    && !userCode && !nickname && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-red-500'>
                                {/* 닉네임이 없습니다. 닉네임을 만들어 주세요. */}
                                {/* english */}
                                No nickname. Please create a nickname.

                            </span>

                        </div>
                    )}


                    {/* image */}
                    {/* logo-game-welcome.png */}

                    {loadingUserData && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-gray-800'>

                                {/* 정보를 불러오는 중입니다. */}
                                {/* english */}
                                Loading user data.
                            </span>
                        </div>
                    )}

                    {/* Coming Soon */}

                    {/*
                    <span className='text-lg font-semibold text-red-500'>
                        Coming Soon
                    </span>

                    <Image
                        src="/logo-game-welcome.png"
                        alt="Welcome"
                        width={500}
                        height={500}
                        className="rounded-lg w-full"
                    />
                    */}

                    {/* https://taptaptap-seven.vercel.app/play/ */}
                    {/* iframe */}
                    
                    <iframe
                        src="https://taptaptap-seven.vercel.app/play/"
                        className="w-full h-96"
                    >
                    </iframe>









                </div>


                {/* select agent */}



            </div>

        </main>

    );

}

          




function Header(
    {
        center,
        agent,
        tokenId,
    } : {
        center: string
        agent: string
        tokenId: string
    }
) {

    const router = useRouter();
  
  
    return (
      <header className="flex flex-col items-center mb-5 md:mb-10">
  
        {/* header menu */}
        <div className="w-full flex flex-row justify-between items-center gap-2
          bg-green-500 p-4 rounded-lg mb-5
        ">
            {/* logo */}
            <button
                onClick={() => {
                    router.push(
                        '/kr/polygon/?agent=' + agent + '&tokenId=' + tokenId + '&center=' + center
                    );
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/logo-marketing-center.webp"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                        OWIN
                    </span>
                </div>
            </button>


            <div className="flex flex-row gap-2 items-center">

            </div>

        </div>
        
      </header>
    );
  }




    export default function Agent() {
      return (
          <Suspense fallback={<div>Loading...</div>}>
              <AgentPage />
          </Suspense>
      );
    }