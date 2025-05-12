// nickname settings
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
    mintTo
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


} from "thirdweb/react";

import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { AutoConnect } from "thirdweb/react";

import Image from 'next/image';


import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 

import {
	accountAbstraction,
	client,
    wallet,
	editionDropContract,
	editionDropTokenId,
} from "../constants";

import {
    useRouter,
    useSearchParams,
} from "next//navigation";


import Uploader from '../components/uploader';
import { updateUser } from "@/lib/api/user";
import { send } from "@fal-ai/serverless-client/src/function";


//const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // NOAH-K 포인트 on Polygon

const contractAddress = "0x9948328fa1813037a37F3d35C0b1e009d6d9a563"; // NOAH-K on Polygon


function ProfilePage() {

    const searchParams = useSearchParams();

    const center = searchParams.get("center");
    //const telegramId = searchParams.get("telegramId");


    const address = searchParams.get("walletAddress");



    const account = useActiveAccount();


    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });


    const router = useRouter();







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


    ///console.log("balance", balance);



    
    const [nickname, setNickname] = useState("");
    const [editedNickname, setEditedNickname] = useState("");

    const [avatar, setAvatar] = useState("/profile-default.png");



    

    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);



    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;


    const [isAgent, setIsAgent] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [erc721ContractAddress, setErc721ContractAddress] = useState("");

    const [userCenter, setUserCenter] = useState("");

    const [isCenterOwner, setIsCenterOwner] = useState(false);

    const [telegramId, setTelegramId] = useState("");

    const [isValideTelegramId, setIsValideTelegramId] = useState(false);

    const [loadingUser, setLoadingUser] = useState(false);

    const [loadingError, setLoadingError] = useState(false);


    useEffect(() => {
        const fetchData = async () => {

            setLoadingUser(true);

            const response = await fetch("/api/userNoahk/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                setLoadingUser(false);

                setLoadingError(true);
                return;
            }

            const data = await response.json();

            ///console.log("data", data);

            if (data.result) {

                setLoadingError(false);

                setNickname(data.result.nickname);
                
                data.result.avatar && setAvatar(data.result.avatar);
                

                setUserCode(data.result.id);

                setTelegramId(data.result.telegramId);

                setSeller(data.result.seller);

                setIsAgent(data.result.agent);

                ///setReferralCode(data.result.erc721ContractAddress);
                setErc721ContractAddress(data.result.erc721ContractAddress);

                setUserCenter(data.result.center);

                if (data.result?.centerOwner) {
                    setIsCenterOwner(true);
                }
            

                if (data.result.telegramId) {
                    setIsValideTelegramId(true);
                }



            } else {

                setLoadingError(true);

                setNickname('');
                setAvatar('/profile-default.png');
                setUserCode('');
                setTelegramId('');
                setSeller(null);
                setEditedNickname('');
                
                //setAccountHolder('');

                //setAccountNumber('');
                //setBankName('');

                setIsAgent(false);

                setReferralCode('');

                setErc721ContractAddress('');

                setUserCenter('');
            }

            setLoadingUser(false);

        };

        address && center &&
        fetchData();

    }, [address, center]);
    



    // check user nickname duplicate


    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

    const checkNicknameIsDuplicate = async ( nickname: string ) => {

        const response = await fetch("/api/userNoahk/checkUserByNickname", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nickname: nickname,
                center: center,
            }),
        });


        const data = await response?.json();


        console.log("checkNicknameIsDuplicate data", data);

        if (data.result) {
            setIsNicknameDuplicate(true);
        } else {
            setIsNicknameDuplicate(false);
        }

    }




    const [loadingSetUserData, setLoadingSetUserData] = useState(false);

    const setUserData = async () => {


        // check nickname length and alphanumeric
        //if (nickname.length < 5 || nickname.length > 10) {

        if (editedNickname.length < 5 || editedNickname.length > 10) {

            //toast.error("회원아이디은 5자 이상 10자 이하로 입력해주세요");
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            //toast.error("회원아이디은 영문 소문자와 숫자만 입력해주세요");
            return;
        }


        setLoadingSetUserData(true);

        if (nicknameEdit) {


            const response = await fetch("/api/userNoahK/updateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                }),
            });

            const data = await response.json();

            ///console.log("updateUser data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                setIsValideTelegramId(true);
                

                //toast.success('Nickname saved');

            } else {

                //toast.error('You must enter different nickname');
            }


        } else {

            const response = await fetch("/api/userNoahk/setUserVerified", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,                    
                    //nickname: nickname,
                    nickname: editedNickname,
                    userType: "",
                    mobile: "",
                    telegramId: telegramId,
                    center: center,
                }),
            });

            const data = await response.json();

            //console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);
                setIsValideTelegramId(true);

                setNicknameEdit(false);
                setEditedNickname('');

                //toast.success('Nickname saved');

            } else {
                //toast.error('Error saving nickname');
            }
        }

        setLoadingSetUserData(false);

        
    }


    // update User telegramId
    const [loadingSetUserTelegramId, setLoadingSetUserTelegramId] = useState(false);
    const setUserTelegramId = async () => {
        
        setLoadingSetUserTelegramId(true);

        const response = await fetch("/api/userNoahk/updateUserTelegramId", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
                telegramId: telegramId,
            }),
        });

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {
            setIsValideTelegramId(true);
            //toast.success('Telegram ID saved');
        } else {
            //toast.error('Error saving Telegram ID');
        }

        setLoadingSetUserTelegramId(false);

    }


    const [loadingDeployErc721Contract, setLoadingDeployErc721Contract] = useState(false);
    const deployErc721Contract = async () => {

        console.log("deployErc721Contract=====================");

        console.log("address", address);
        console.log("userCode", userCode);
        console.log("loadingDeployErc721Contract", loadingDeployErc721Contract);
        console.log("balance", balance);

  
        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            return;
        }

        if (!userCode) {
            //console.log("userCode=====", userCode);
            //toast.error('회원아이디을 먼저 설정해주세요');
            return;
        }

        if (loadingDeployErc721Contract) {
            //toast.error('이미 실행중입니다');
            return;
        }
        
        //if (confirm("Are you sure you want to deploy ERC721 contract?")) {
        // chinese confirm
        if (confirm("AI 에이전트 계약주소를 생성하시겠습니까?")) {

            setLoadingDeployErc721Contract(true);


            try {


                const erc721ContractAddress = await deployERC721Contract({
                    chain: polygon,
                    client: client,
                    account: account as any,
            
                    /*  type ERC721ContractType =
                    | "DropERC721"
                    | "TokenERC721"
                    | "OpenEditionERC721";
                    */
            
                    ///type: "DropERC721",
            
                    type: "TokenERC721",
                    
                    
                    params: {
                        name: "AI Agent",
                        description: "This is AI Agent",
                        symbol: "AGENT",
                    },
            
                });

                console.log("erc721ContractAddress", erc721ContractAddress);

                // save the contract address to the database
                // /api/userNoahk/updateUser
                // walletAddress, erc721ContractAddress

                if (!erc721ContractAddress) {
                    throw new Error('Failed to deploy ERC721 contract');
                }


                const response = await fetch('/api/userNoahk/updateUserErc721Contract', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                        erc721ContractAddress: erc721ContractAddress,
                        center: center,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save ERC721 contract address');
                }

                ///const data = await response.json();

                ///console.log("data", data);


                //setReferralCode(erc721ContractAddress);

                setErc721ContractAddress(erc721ContractAddress);
                
                ///toast.success('AI 에이전트 계약주소 생성 완료');

            } catch (error) {
                console.error("deployErc721Contract error", error);
            }

            setLoadingDeployErc721Contract(false);

        }
  
    };





    // api /api/wallet/getTransfersByWalletAddress
    /*
    [
        {
            "sendOrReceive": "receive",
            "transferData": {
                "fromAddress": "0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2",
                "toAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
                "value": "2330038",
                "timestamp": 1736735829000
            }
        },
                {
            "sendOrReceive": "send",
            "transferData": {
                "fromAddress": "0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2",
                "toAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
                "value": "2330038",
                "timestamp": 1736735829000
            }
        },
    ]
    */

    const [loadingTransfers, setLoadingTransfers] = useState(false);
    const [transfers, setTransfers] = useState([] as any[]);

    
    useEffect(() => {
        
        const getTransfers = async () => {

            setLoadingTransfers(true);
            
            const response = await fetch("/api/wallet/getTransfersNoahkByWalletAddress", {
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
                setLoadingTransfers(false);
                return;
            }

            const data = await response.json();

            console.log("getTransfers data", data);


            if (data.result) {
                setTransfers(data.result.transfers);
            } else {
                setTransfers([]);
            }

            setLoadingTransfers(false);

        };

        if (address) {
            getTransfers();
        }

    } , [address]);
    



    // api /api/teleram/getMessagesByTelegramId
    useEffect(() => {
        
        const getMessages = async () => {

            const response = await fetch("/api/telegram/getMessagesByTelegramId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    telemgramId: telegramId.toString(),
                }),
            });

            const data = await response.json();

            ///console.log("getMessages data", data);

        };

        if (telegramId) {
            getMessages();
        }

    } , [telegramId]);





    const [toUserNickname, setToUserNickname] = useState("");
    const [isValidUserNickname, setIsValidUserNickname] = useState(false);

    useEffect(() => {
        
        const getToUser = async () => {

            const response = await fetch("/api/userNoahk/getUserByNickname", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nickname: toUserNickname,
                    center: center,
                }),
            });

            const data = await response.json();

            ///console.log("getToUser data", data);

            if (data.result) {
                setToWalletAddress(data.result.walletAddress);
                setIsValidUserNickname(true);
            } else {
                setToWalletAddress("");
                setIsValidUserNickname(false);
            }

        };

        if (toUserNickname) {
            getToUser();
        }

    } , [toUserNickname]);





    const [toWalletAddress, setToWalletAddress] = useState("");


    const [sendAmount, setSendAmount] = useState('');
    const [sending, setSending] = useState(false);



    const sendUsdt = async () => {
        if (sending) {
            return;
        }

        if (!address) {
            alert('Please connect wallet');
            return;
        }

        if (!sendAmount) {
            alert('Please enter amount');
            return;
        }

        setSending(true);

        try {


            // send NOAH-K 포인트
            // Call the extension function to prepare the transaction
            const transaction = transfer({
                contract: contract,
                to: toWalletAddress,
                amount: sendAmount,
            });
            
            const { transactionHash } = await sendTransaction({
                account: account as any,
                transaction,
            });

            
            if (transactionHash) {

                alert('NOAH-K 포인트를 성공적으로 보냈습니다');

                setSendAmount('');

                const result = await balanceOf({
                    contract,
                    address: address,
                });

                //console.log(result);

                setBalance( Number(result) / 10 ** 18 );

                // reload the transfers
                const response = await fetch("/api/wallet/getTransfersNoahkByWalletAddress", {
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
                    return;
                }

                const data = await response.json();

                //console.log("getTransfers data", data);

                if (data.result) {
                    setTransfers(data.result.transfers);
                } else {
                    setTransfers([]);
                }



            } else {

                alert('Failed to send NOAH-K 포인트');

            }  


        } catch (error) {
            
            console.error("error", error);

            alert('Failed to send NOAH-K 포인트');
        }

        setSending(false);
    };





    return (

        <main
            className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto"
            style={{
                backgroundImage: "url('/mobile-background-profile2.avif')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
        >


            <div className="py-0 w-full">

                {/* sticky header */}
                <div className="sticky top-0 z-50
                    bg-zinc-800 bg-opacity-90
                    backdrop-blur-md
                    p-4 rounded-lg
                    w-full flex flex-row items-center justify-between">

                    {/* title */}
                    <div className="text-2xl font-semibold text-zinc-100">
                        NOAH-K 포인트 거래내역
                    </div>
                </div>



 

                <div className="mt-5 flex flex-col items-start justify-center space-y-4">



                    {/* 거래 내역 보기 */}
                    {/* polygon scan */}
                    {/*}
                    <div className="w-full flex flex-row gap-2 items-center justify-end">
                        <Button
                            onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}/tokentxns#tokentxns`)}
                            className="bg-green-500 text-zinc-100 p-2 rounded
                                hover:bg-green-600
                            "
                        >
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <Image
                                    src="/logo-polygon.png"
                                    alt="Polygon"
                                    width={20}
                                    height={20}
                                    className="rounded"
                                />
                                <span className="text-lg font-semibold">
                                    폴리스캔에서 거래내역 보기
                                </span>
                            </div>

                        </Button>
                    </div>
                    */}



                    {/*transfers*/}
                    {/* table view */}
                    {/* if transfers.sendReceive === send, then display "보내기" */}
                    {/* if transfers.sendReceive === receive, then display "받기" */}

                    {loadingTransfers && (
                        <div className="w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg
                            bg-yellow-500 bg-opacity-50">
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                거래내역 로딩중...
                            </div>
                        </div>
                    )}

                    {transfers?.length > 0 && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-100 bg-opacity-90'>
                            
                            <div className="w-full flex flex-row gap-2 items-center justify-between">
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-lg font-semibold">
                                        거래내역
                                    </span>
                                </div>
                                {/* reload transfers button */}
                                <button
                                    onClick={() => {
                                        const getTransfers = async () => {

                                            setLoadingTransfers(true);
                                            
                                            const response = await fetch("/api/wallet/getTransfersNoahkByWalletAddress", {
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
                                                setLoadingTransfers(false);
                                                return;
                                            }

                                            const data = await response.json();

                                            console.log("getTransfers data", data);


                                            if (data.result) {
                                                setTransfers(data.result.transfers);
                                            } else {
                                                setTransfers([]);
                                            }

                                            setLoadingTransfers(false);

                                        }

                                        getTransfers();

                                    } }

                                    disabled={loadingTransfers}
                                    className={

                                        `p-2 bg-blue-500 text-zinc-100 rounded
                                        ${loadingTransfers ? 'opacity-50' : ''}`
                                    }
                                >
                                    <div className="flex flex-row gap-2 items-center justify-between">
                                        {loadingTransfers && (
                                            <Image
                                                src="/loading.png"
                                                alt="Send"
                                                width={25}
                                                height={25}
                                                className="animate-spin"
                                            />
                                        )}
                                        <span className="text-lg font-semibold">
                                            새로고침
                                        </span>
                                    </div>
                                </button>

                                    
                            </div>
                            

                            <table className="w-full">
                                <thead>
                                    <tr>
                                    <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">
                                            {/*+/-*/}
                                            {/* + is color green, - is color red */}
                                            <span className="text-green-500">+</span> / <span className="text-red-500">-</span>
                                        </th>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">지갑주소</th>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">수량</th>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">시간</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transfers.map((transfer, index) => (
                                        <tr
                                            key={index}
                                            className="
                                                border-b border-gray-800
                                                hover:bg-zinc-800 hover:bg-opacity-50
                                                transition-colors duration-100
                                            "
                                        >
                                            <td
                                                className="p-2 text-2xl text-zinc-800 font-semibold">


                                                {/*transfer.sendOrReceive === "send" ? "-" : "+"*/}
                                                {/* + is color green, - is color red */}

                                                {transfer.sendOrReceive === "send" ? (
                                                    <span className="text-red-500">-</span>
                                                ) : (
                                                    <span className="text-green-500">+</span>
                                                )}

                                            </td>

                                            {transfer.sendOrReceive === "send" ? (
                                                <td className="p-2">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-red-500">       
                                                            {shortenAddress(transfer.transferData.toAddress)}
                                                        </span>
                                                    </div>
                                                    {/* nickname */}
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-lg text-red-500">       
                                                            {transfer?.otherUser?.nickname}
                                                        </span>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td className="p-2">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-green-500">       
                                                            {shortenAddress(transfer.transferData.fromAddress)}
                                                        </span>
                                                    </div>
                                                    {/* nickname */}
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-lg text-green-500">       
                                                            {transfer?.otherUser?.nickname}
                                                        </span>
                                                    </div>
                                                </td>
                                            )}

                                            {/* monospace font */}
                                            <td className="p-2 text-xl text-blue-500 text-right"
                                                style={{
                                                    fontFamily: 'monospace',
                                                }}
                                            >
                                                {
                                                    //Number(transfer.transferData.value / 10 ** 18).toFixed(0)
                                                    Number(transfer.transferData.value / 10 ** 18).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                }

                                            </td>
                                            <td className="p-2 text-xs text-zinc-800 font-semibold text-right">
                                           

                                                {


                                                    (
                                                        new Date().getTime() - transfer.transferData.timestamp
                                                    ) < 60000 ? "방금 전" : (
                                                        (
                                                            new Date().getTime() - transfer.transferData.timestamp
                                                        ) < 3600000 ? 
                                                        Math.floor(
                                                            (new Date().getTime() - transfer.transferData.timestamp) / 60000
                                                        ) + "분 전" : (
                                                            (
                                                                new Date().getTime() - transfer.transferData.timestamp
                                                            ) < 86400000 ? 
                                                            Math.floor(
                                                                (new Date().getTime() - transfer.transferData.timestamp) / 3600000
                                                            ) + "시간 전" : (
                                                                (
                                                                    new Date().getTime() - transfer.transferData.timestamp
                                                                ) < 604800000 ? 
                                                                Math.floor(
                                                                    (new Date().getTime() - transfer.transferData.timestamp) / 86400000
                                                                ) + "일 전" : (
                                                                    (
                                                                        new Date().getTime() - transfer.transferData.timestamp
                                                                    ) < 2592000000 ? 
                                                                    Math.floor(
                                                                        (new Date().getTime() - transfer.transferData.timestamp) / 604800000
                                                                    ) + "주 전" : (
                                                                        (
                                                                            new Date().getTime() - transfer.transferData.timestamp
                                                                        ) < 31536000000 ? 
                                                                        Math.floor(
                                                                            (new Date().getTime() - transfer.transferData.timestamp) / 2592000000
                                                                        ) + "달 전" : (
                                                                            Math.floor(
                                                                                (new Date().getTime() - transfer.transferData.timestamp) / 31536000000
                                                                            ) + "년 전"
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )


                                                }
                                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    ) }

                    




                    
                   

                    




                </div>

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
                    router.push('/?center=' + center + '&agent=' + agent + '&tokenId=' + tokenId);
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/logo-aiagent.png"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                    AI Agent
                    </span>
                </div>
            </button>

            {/*}
            <div className="flex flex-row gap-2 items-center">
                <button
                onClick={() => {
                    router.push(
                        "/tbot?center=" + center + "agent=" + agent + "&tokenId=" + tokenId
                    );
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                TBOT
                </button>
                <button
                onClick={() => {
                    router.push('/profile?center=' + center + 'agent=' + agent + '&tokenId=' + tokenId);
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                SETTINGS
                </button>
            </div>
            */}


        </div>
        
      </header>
    );
  }



  export default function Profile() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfilePage />
        </Suspense>
    );
  }