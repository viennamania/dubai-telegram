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


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon


function ProfilePage() {

    const searchParams = useSearchParams();

    const center = searchParams.get("center");
    //const telegramId = searchParams.get("telegramId");


    const account = useActiveAccount();


    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });


    const router = useRouter();



    const address = account?.address;

    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  



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

        const response = await fetch("/api/user/checkUserByNickname", {
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


            const response = await fetch("/api/user/updateUser", {
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

            const response = await fetch("/api/user/setUserVerified", {
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

        const response = await fetch("/api/user/updateUserTelegramId", {
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
                // /api/user/updateUser
                // walletAddress, erc721ContractAddress

                if (!erc721ContractAddress) {
                    throw new Error('Failed to deploy ERC721 contract');
                }


                const response = await fetch('/api/user/updateUserErc721Contract', {
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

            const response = await fetch("/api/wallet/getTransfersByWalletAddress", {
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

            //console.log("getTransfers data", data);


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

        // interval
        const interval = setInterval(() => {
            if (address) {
                getTransfers();
            }
        } , 5000);

        return () => clearInterval(interval);

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


            // send DUBAI
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

                alert('USDT sent successfully');

                setSendAmount('');

                const result = await balanceOf({
                    contract,
                    address: address,
                });

                //console.log(result);

                setBalance( Number(result) / 10 ** 18 );

            } else {

                alert('Failed to send DUBAI');

            }  


        } catch (error) {
            
            console.error("error", error);

            alert('Failed to send DUBAI');
        }

        setSending(false);
    };





    return (

        <main
            className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto"
        >

            <AutoConnect
                client={client}
                wallets={[wallet]}
                timeout={15000}
            />


            <div className="py-0 w-full">

                {/* sticky header */}
                <div className="sticky top-0 z-50
                    bg-zinc-800 bg-opacity-90
                    backdrop-blur-md
                    p-4 rounded-lg
                    w-full flex flex-row items-center justify-between">

                    {/* title */}
                    <div className="text-2xl font-semibold text-zinc-100">
                        {/*나의 지갑*/}
                        {/* english */}
                        My Wallet

                    </div>
                </div>

        
 

                <div className="w-full flex flex-col items-start justify-center space-y-4">

                    <div className="w-full flex justify-center mt-5">
                        {address ? (
                            <div className="w-full flex flex-row gap-2 items-center justify-between">

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
                                    My wallet: {shortenAddress(address)}
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address);
                                        //alert('지갑주소가 복사되었습니다.');
                                        alert('Wallet address copied to clipboard');
                                    }}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    Copy
                                </Button>
                                
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                {/*연결된 지갑이 없습니다. 지갑을 연결해 주세요.*/}
                                No connected wallet. Please connect your wallet.
                            </p>
                        )}      
                    </div>


                    {loadingUser && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                {/*로딩중...*/}
                                Loading...
                            </div>
                        </div>
                    )}

                    {loadingError && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            {/* 새로고침 버튼 */}
                            <button
                                onClick={() => {
                                    window.location.reload();
                                }}
                                className="bg-green-500 text-zinc-100 p-2 rounded"
                            >
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <span className="text-lg font-semibold">
                                        {/*새로고침*/}
                                        Refresh
                                    </span>
                                </div>
                            </button>
                        </div>
                    )}

                    <div className='w-full flex flex-col gap-4 items-start justify-center'>


                        {address && (

                            <div className='w-full flex flex-col gap-4 items-start justify-center'>

                                
                                
                                <div className='w-full flex flex-row gap-2 items-center justify-between'>

                                    <Image
                                        src="/logo-tether.png"
                                        alt="USDT"
                                        width={30}
                                        height={30}
                                        className="rounded"
                                    />                                


                                    <div className="flex flex-row gap-2 items-end justify-between">

                                        <div className="flex flex-row items-end justify-start">
                                            <span className="text-6xl text-green-500 font-semibold">
                                                {
                                                    Number(balance).toFixed(2).split('.')[0]
                                                }.
                                            </span>
                                            <span className="text-2xl text-green-500">
                                                {
                                                    Number(balance).toFixed(2).split('.')[1]
                                                }
                                            </span>
                                        </div>
                                        <span className="text-green-500 text-2xl font-semibold">
                                            DUBAI
                                        </span>

                                    </div>
                                </div>





                                {/* send DUBAI */}

                                <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                                    
                                    <div className="flex flex-row gap-2 items-center justify-between">
                                        {/* dot */}
                                        <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                                        <span className="text-lg font-semibold text-zinc-800">
                                            {/*USDT 보내기*/}
                                            Send DUBAI
                                        </span>
                                    </div>


                                    <div className='w-full flex flex-col xl:flex-row gap-2 items-start justify-between'>
                                        <input
                                            disabled={sending}
                                            className="p-2 w-full text-zinc-100 bg-zinc-800 rounded text-6xl font-semibold"
                                            placeholder="0.00"
                                            type='number'

                                            value={

                                                sendAmount
                                                
                                            }

                                            onChange={(e) => {


                                                if (isNaN(Number(e.target.value))) {
                                                    //alert('숫자만 입력해주세요');
                                                    alert('Please enter a number');
                                                    return;
                                                }

                                                if (Number(e.target.value) < 0) {
                                                    //alert('0보다 작은 숫자는 입력할 수 없습니다');
                                                    alert('Please enter a number greater than 0');
                                                    return;
                                                }



                                                //setSendAmount(Number(e.target.value));

                                                // check floating point is less than 6

                                                // check input number less than balance

                                                if (Number(e.target.value) > balance) {
                                                    //alert('잔액보다 많은 금액을 보낼 수 없습니다');
                                                    alert('You cannot send more than your balance');
                                                    return;
                                                }


                                                setSendAmount(
                                                    //parseFloat(e.target.value)
                                                    //Number(e.target.value)
                                                    e.target.value
                                                );

                                            }}
                                        />
                                        <input
                                            disabled={sending}
                                            className="p-2 w-full text-zinc-100 bg-zinc-800 rounded text-sm font-semibold"
                                            ///placeholder="받는 사람 지갑주소(0x로 시작)"
                                            placeholder="Recipient wallet (start with 0x)"
                                            type='text'
                                            onChange={(e) => {
                                                // cheack prefix is "0x"

                                                setToWalletAddress(e.target.value);
                                            }}
                                        />

                                        <div className="mt-5 w-full flex flex-row gap-2 items-center justify-end">
                                            <button
                                                disabled={sending || !sendAmount || !toWalletAddress}
                                                onClick={() => {
                                                    //confirm('USDT를 보내시겠습니까?') &&
                                                    confirm('Are you sure you want to send DUBAI?') &&
                                                    sendUsdt();
                                                }}
                                                className={`p-2 bg-blue-500 text-zinc-100 rounded
                                                    ${sending || !sendAmount || !toWalletAddress
                                                     ? 'opacity-50' : ''}`
                                                }
                                            >
                                                <div className='flex flex-row gap-2 items-center justify-between'>
                                                    {sending && (
                                                        <Image
                                                            src="/loading.png"
                                                            alt="Send"
                                                            width={25}
                                                            height={25}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    <span className='text-lg font-semibold'>
                                                        {/*보내기*/}
                                                        Send
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/*
                                <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                                    <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                        {Send_USDT}
                                    </div>
                                    <div className='flex flex-col xl:flex-row gap-2 items-start justify-between'>
                                        <input
                                            className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                            placeholder="0.00"
                                            type='number'
                                            onChange={(e) => {
                                                setAmount(Number(e.target.value));
                                            }}
                                        />
                                        <input
                                            className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                            placeholder="받는 사람 지갑주소"
                                            type='text'
                                            onChange={(e) => {
                                                setRecipient({
                                                    ...recipient,
                                                    walletAddress: e.target.value,
                                                });
                                            }}
                                        />
                                        <button
                                            disabled={sending}
                                            onClick={() => {
                                                sendUsdt();
                                            }}
                                            className={`p-2 bg-blue-500 text-zinc-100 rounded ${sending ? 'opacity-50' : ''}`}
                                        >
                                            <div className='flex flex-row gap-2 items-center justify-between'>
                                                {sending && (
                                                    <Image
                                                        src="/loading.png"
                                                        alt="Send"
                                                        width={25}
                                                        height={25}
                                                        className="animate-spin"
                                                    />
                                                )}
                                                <span className='text-lg font-semibold'>
                                                    보내기
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                */}
                                
                                {/* wallet address and copy button */}
                                {/*
                                <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                                    <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                        입금용 지갑주소(Polygon)
                                    </div>
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                            {address.substring(0, 6)}...{address.substring(address.length - 4, address.length)}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(address);
                                                
                                                //toast.success('지갑주소가 복사되었습니다');

                                            }}
                                            className="p-2 bg-blue-500 text-zinc-100 rounded"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                */}


                            </div>

                        )}
                        
                    </div>

                    {/* 거래 내역 보기 */}
                    {/* polygon scan */}
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
                                <span className="text-sm font-semibold">
                                    {/*폴리스캔에서 거래내역 보기*/}
                                    View transaction history on Polygonscan
                                </span>
                            </div>

                        </Button>
                    </div>



                    {/*transfers*/}
                    {/* table view */}
                    {/* if transfers.sendReceive === send, then display "보내기" */}
                    {/* if transfers.sendReceive === receive, then display "받기" */}
                    
                    <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>


                        <div className="w-full flex flex-row gap-2 items-center justify-between">

                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                                <span className="text-lg font-semibold text-zinc-800">
                                    {/*최근 10개 거래내역*/}
                                    Recent 10 transactions
                                </span>
                            </div>

                            {loadingTransfers && (
                                <div className="flex flex-row gap-2 items-center justify-end">
                                    <Image
                                        src="/loading.png"
                                        alt="Loading"
                                        width={25}
                                        height={25}
                                        className="animate-spin"
                                    />
                                </div>
                            )}

                        </div>


                        {!loadingTransfers && transfers?.length === 0 && (
                            <span className="text-sm text-zinc-800">
                                {/*거래내역이 없습니다.*/}
                                No transaction history.
                            </span>
                        )}

                        {/*!loadingTransfers && transfers?.length > 0 && (*/}



                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">
                                            <span className="text-green-500 text-sm font-semibold">
                                            +
                                            </span>
                                            <span className="text-zinc-100 text-sm font-semibold">
                                            /
                                            </span>
                                            <span className="text-red-500 text-sm font-semibold">
                                            -
                                            </span>
                                        </th>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">
                                            {/*상대방*/}
                                            {/* english */}
                                            Other User
                                        </th>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">
                                            {/*수량(USDT)*/}
                                            {/* english */}
                                            Amount (USDT)
                                        </th>
                                        <th className="p-2 bg-zinc-800 text-zinc-100 text-sm font-semibold">
                                            {/*시간*/}
                                            {/* english */}
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transfers.map((transfer, index) => (
                                        <tr key={index}>
                                            <td className="p-2 text-lg text-zinc-800 font-semibold">
                                                {
                                                    transfer.sendOrReceive === "send" ? (
                                                        <span className="text-red-500">-</span>
                                                    ) : (
                                                        <span className="text-green-500">+</span>
                                                    )
                                                }
                                            </td>
                                            {transfer.sendOrReceive === "send" ? (
                                                <td className="p-2 text-sm text-zinc-800">
                                                    {
                                                        transfer?.otherUser?.nickname
                                                        ? (
                                                            <div className="flex flex-col gap-1 items-center justify-center">
                                                           

                                                                <Image
                                                                    src={transfer?.otherUser?.avatar || "/profile-default.png"}
                                                                    alt="Avatar"
                                                                    width={50}
                                                                    height={50}
                                                                    className="rounded-full"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            

                                                                {transfer?.otherUser?.nickname}
                                                            </div>
                                                        )
                                                        :
                                                        transfer.transferData.toAddress.slice(0, 6) + '...'
                                                    }
                                                </td>
                                            ) : (
                                                <td className="p-2 text-sm text-zinc-800">
                                                    {
                                                        transfer?.otherUser?.nickname
                                                        ? (
                                                            <div className="flex flex-col gap-1 items-center justify-center">
                                                                <Image
                                                                    src={transfer?.otherUser?.avatar || '/profile-default.png'}
                                                                    alt="Avatar"
                                                                    width={50}
                                                                    height={50}
                                                                    className="rounded-full"

                                                                    style={{
                                                                        objectFit: 'cover',
                                                                    }}
                                                                

                                                                />
                                                                {transfer?.otherUser?.nickname}
                                                            </div>
                                                        )
                                                        :
                                                        transfer.transferData.fromAddress.slice(0, 6) + '...'
                                                    }
                                                </td>
                                            )}
                                            {/* monospace font */}
                                            <td className="p-2">

                                                <div className="flex flex-row items-end justify-end">
                                                    <span className="text-2xl text-green-500 font-semibold text-right"
                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                            Number(transfer.transferData.value / 10 ** 18).toFixed(2).split('.')[0]
                                                        }
                                                    </span>
                                                    <span className="text-sm text-black text-right"
                                                    >
                                                        .
                                                    </span>
                                                    <span className="text-sm text-green-500 text-right"

                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                            Number(transfer.transferData.value / 10 ** 18).toFixed(2).split('.')[1]
                                                        }
                                                    </span>
                                                </div>


                                            </td>
                                            <td className="p-2 text-xs text-zinc-800 font-semibold text-right">
                                        

                                                {


                                                    (
                                                        new Date().getTime() - transfer.transferData.timestamp
                                                    ) < 60000 ?
                                                        //"방금 전"
                                                        "Just now"
                                                        : (
                                                        (
                                                            new Date().getTime() - transfer.transferData.timestamp
                                                        ) < 3600000 ? 
                                                        Math.floor(
                                                            (new Date().getTime() - transfer.transferData.timestamp) / 60000
                                                        ) +
                                                        //"분 전"
                                                        "minutes ago"
                                                        : (
                                                            (
                                                                new Date().getTime() - transfer.transferData.timestamp
                                                            ) < 86400000 ? 
                                                            Math.floor(
                                                                (new Date().getTime() - transfer.transferData.timestamp) / 3600000
                                                            ) +
                                                            //"시간 전"
                                                            "hours ago"
                                                            : (
                                                                (
                                                                    new Date().getTime() - transfer.transferData.timestamp
                                                                ) < 604800000 ? 
                                                                Math.floor(
                                                                    (new Date().getTime() - transfer.transferData.timestamp) / 86400000
                                                                ) +
                                                                //"일 전"
                                                                "days ago"
                                                                : (
                                                                    (
                                                                        new Date().getTime() - transfer.transferData.timestamp
                                                                    ) < 2592000000 ? 
                                                                    Math.floor(
                                                                        (new Date().getTime() - transfer.transferData.timestamp) / 604800000
                                                                    ) +
                                                                    //"주 전"
                                                                    "weeks ago"
                                                                    : (
                                                                        (
                                                                            new Date().getTime() - transfer.transferData.timestamp
                                                                        ) < 31536000000 ? 
                                                                        Math.floor(
                                                                            (new Date().getTime() - transfer.transferData.timestamp) / 2592000000
                                                                        ) +
                                                                        //"달 전"
                                                                        "months ago"
                                                                        : (
                                                                            Math.floor(
                                                                                (new Date().getTime() - transfer.transferData.timestamp) / 31536000000
                                                                            ) +
                                                                            //"년 전"
                                                                            "years ago"
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

                        {/*}) */}

                    



                    </div>
                    
                   

                    




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