// nickname settings
'use client';
import React, { useEffect, useState, Suspense } from "react";

import { toast } from 'react-toastify';

import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
    createThirdwebClient,
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
    useRouter,
    useSearchParams,
} from "next//navigation";


import Uploader from '../components/uploader';
import { updateUser } from "@/lib/api/userNoahk";



/*
import {
	accountAbstraction,
	client,
    wallet,
	editionDropContract,
	editionDropTokenId,
} from "../constants";
*/


import { inAppWallet } from "thirdweb/wallets";


const clientForWeb3 = createThirdwebClient({
    clientId: "dfb94ef692c2f754a60d35aeb8604f3d",
});



const wallets = [
    inAppWallet({
      auth: {
        options: [
          "phone",
           
        ],
      },
    }),
  ];



const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon


function ProfilePage() {

    const searchParams = useSearchParams();

    const center = searchParams.get("center") || 'songpa';
    
    const paramTelegramId = searchParams.get("telegramId");


    const activeWallet = useActiveWallet();



    const account = useActiveAccount();


    const contract = getContract({
        //client,
        client: clientForWeb3,
        chain: polygon,
        address: contractAddress,
    });


    const router = useRouter();



    const address = account?.address;
  
  
    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
    //const address = "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C";
  

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
    
        setBalance( Number(result) / 10 ** 6 );
  
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



    
    const [user, setUser] = useState(null) as any;

    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);



    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;

    /*

        "seller": {
            "status": "confirmed",
            "bankInfo": {
            "bankName": "하나은행",
            "accountNumber": "01234567890",
            "accountHolder": "강하나"
            }
        },

    */




    const [isAgent, setIsAgent] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [erc721ContractAddress, setErc721ContractAddress] = useState("");

    const [userCenter, setUserCenter] = useState("");

    const [isCenterOwner, setIsCenterOwner] = useState(false);

    const [isValideTelegramId, setIsValideTelegramId] = useState(false);

    const [telegramId, setTelegramId] = useState(paramTelegramId || '');

    const [mobile, setMobile] = useState('');

    const [escrowWalletAddress, setEscrowWalletAddress] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/userNoahk/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            const data = await response.json();

            console.log("getUser data", data);



            if (data.result) {

                setUser(data.result);


                setNickname(data.result.nickname);
                
                data.result.avatar && setAvatar(data.result.avatar);
                

                setUserCode(data.result.id);

                setSeller(data.result.seller);

                setIsAgent(data.result.agent);

                setEscrowWalletAddress(data.result.escrowWalletAddress);
                

                ///setReferralCode(data.result.erc721ContractAddress);
                setErc721ContractAddress(data.result.erc721ContractAddress);

                setUserCenter(data.result.center);

                if (data.result?.centerOwner) {
                    setIsCenterOwner(true);
                }


                if (data.result.telegramId) {            
                    setTelegramId(data.result.telegramId);
                    setIsValideTelegramId(true);
                }

             



            } else {
                setNickname('');
                setAvatar('/profile-default.png');
                setUserCode('');
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

        };

        address &&
        fetchData();

    }, [address]);
    



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

            //toast.error("회원아이디는 5자 이상 10자 이하로 입력해주세요");
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            //toast.error("회원아이디는 영문 소문자와 숫자로 5자 이상 10자 이하로 입력해주세요.");
            return;
        }


        setLoadingSetUserData(true);

        if (nicknameEdit) {


            const response = await fetch("/api/userNoahk/updateUser", {
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



    // update User mobile
    // /api/userNoahk/updateUserMobile
    const [loadingSetUserMobile, setLoadingSetUserMobile] = useState(false);
    const setUserMobile = async () => {
        
        setLoadingSetUserMobile(true);

        const response = await fetch("/api/userNoahk/updateUserMobile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
                mobile: mobile,
            }),
        });

        if (response.status !== 200) {
            //toast.error('Error saving Mobile');
            alert('핸드폰번호 저장에 실패했습니다.');
            setLoadingSetUserMobile(false);
            return;
        }

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {
            //toast.success('Mobile saved');
            alert('핸드폰번호가 저장되었습니다.');

            // get user data
            const response = await fetch("/api/userNoahk/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (response.status === 200) {

                const data = await response.json();

                if (data.result) {
                    setUser(data.result);
                }

            }



        } else {
            //toast.error('Error saving Mobile');
            alert('핸드폰번호 저장에 실패했습니다.');
        }

        setLoadingSetUserMobile(false);

    }





    // setSeller

    const [errorMsgForSetSeller, setErrorMsgForSetSeller] = useState("");

    const [loadingSetSeller, setLoadingSetSeller] = useState(false);
    const setSellerInfo = async () => {

        setLoadingSetSeller(true);

        const response = await fetch("/api/userNoahk/updateSeller", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
                seller: seller,
            }),
        });

        if (response.status !== 200) {
            //toast.error('Error saving Seller info');
            alert('판매자 정보 저장에 실패했습니다.');
            setLoadingSetSeller(false);
            return;
        }

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {
            //toast.success('Seller info saved');
            alert('판매자 정보가 저장되었습니다.');

            // get user data
            const response = await fetch("/api/userNoahk/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (response.status === 200) {

                const data = await response.json();

                if (data.result) {
                    setErrorMsgForSetSeller("");

                    setUser(data.result);

                    setSeller(data.result.seller);


                }

            }


        } else {

            setErrorMsgForSetSeller(data.error);

            //toast.error('Error saving Seller info');
            alert('판매자 정보 저장에 실패했습니다.');
        }

        setLoadingSetSeller(false);

    }


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

            {/*
            <AutoConnect
                client={client}
                wallets={[wallet]}
                timeout={15000}
            />
            */}











            <div className="py-0 w-full">

                {/* sticky header */}
                <div className="sticky top-0 z-50
                    bg-zinc-800 bg-opacity-90
                    backdrop-blur-md
                    p-4 rounded-lg
                    w-full flex flex-row items-center justify-between">

                    {/* title */}
                    <div className="text-2xl font-semibold text-zinc-100">
                        가상계좌 관리
                    </div>
                </div>

        
 

                <div className="mt-5 flex flex-col items-start justify-center space-y-4">




                {!address && (

                    <div className="w-full flex flex-col justify-center items-start gap-2 p-2">

                        <ConnectButton
                            client={clientForWeb3}
                            wallets={wallets}
                            accountAbstraction={{
                            chain: polygon,
                            sponsorGas: true
                            }}
                            theme={"light"}
                            connectButton={{
                            label: "지갑 연결",
                            }}
                            connectModal={{
                            size: "wide", 
                            titleIcon: "https://shinemywinter.vercel.app/verified.png",                       
                            showThirdwebBranding: false,

                            }}
                            locale={"ko_KR"}
                            //locale={"en_US"}
                        />

                    </div>

                    )}

                    {address && (
                        <div className="w-full flex items-center justify-between gap-5">
                            <Image
                                src="/icon-wallet-live.gif"
                                alt="Wallet"
                                width={65}
                                height={25}
                                className="rounded"
                            />
                            {/* wallet address */}
                            <div className="flex flex-col gap-2
                            bg-zinc-800 bg-opacity-90
                            p-4 rounded-lg
                            ">
                                <span className="text-sm font-semibold text-gray-500">
                                    지갑주소
                                </span>
                                <span className="text-sm font-semibold text-gray-200">
                                    {shortenAddress(address)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {/* disconnect button */}
                                <button
                                    onClick={() => {
                                        confirm("지갑 연결을 해제하시겠습니까?") && activeWallet?.disconnect();
                                    }}
                                    className="bg-zinc-800 text-white p-2 rounded-lg"
                                >
                                지갑 연결 해제
                                </button>
                            </div>

                        </div>
                    )}



                    {userCode && isValideTelegramId && (
                        <div className='w-full flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                        bg-zinc-800 bg-opacity-90
                        '>
                            <div className="flex flex-row gap-2 items-center justify-between">
                                {/* dot */}
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-gray-200">
                                    텔레그램아이디
                                </span>
                            </div>

                            <div className='flex flex-row gap-2 items-center justify-between'>
                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {telegramId}
                                </div>
                            </div>
                            {/* 복사 버튼 */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(telegramId as string);
                                    alert('텔레그램아이디가 복사되었습니다.');
                                }}
                                className="p-2 bg-blue-500 text-zinc-100 rounded"
                            >
                                복사
                            </button>

                            {/*}
                            {isCenterOwner && (
                                <span className='text-sm font-semibold text-green-500'>
                                    센터 소유자 입니다.
                                </span>
                            )}
                            */}

                        </div>
                    )}



                    {/* 회원아이디을 저장하면 나의 소속 센터 봇가 설정됩니다 */}
                    {/*
                    {address && !userCenter && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                회원아이디을 저장하면 나의 소속 센터 봇이 설정됩니다
                            </div>
                            <span className='text-sm font-semibold text-gray-500'>
                                회원아이디는 영문 소문자와 숫자로 5자 이상 10자 이하로 입력해주세요.
                            </span>

                            <div className="flex flex-row gap-2 items-center justify-between">
                                <span className='text-sm font-semibold text-gray-500'>
                                    나의 소속 센터 봇:
                                </span>
                                <span className='text-lg font-semibold text-blue-500'>
                                    {center}
                                </span>
                            </div>

                        </div>
                    )}
                    */}

                    

                    <div className='w-full  flex flex-col gap-5 '>


                        {address && userCode && (

                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        회원아이디
                                    </span>
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {nickname}
                                </div>

                                {/* 복사 버튼 */}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(nickname);
                                        alert('회원아이디가 복사되었습니다.');
                                    }}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    복사
                                </button>

                                
                                <button
                                    onClick={() => {

                                        nicknameEdit ? setNicknameEdit(false) : setNicknameEdit(true);

                                    } }
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    {nicknameEdit ? "취소" : "수정"}
                                </button>

                                <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                />


                                
                            </div>
                        )}


                        { (address && (nicknameEdit || !userCode)) && (
                            <div className=' flex flex-col xl:flex-row gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>

                                <div className="flex flex-row gap-2 items-center justify-between">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span
                                        className="text-sm font-semibold text-gray-200"
                                    >
                                        {!userCode ? "회원아이디 설정" :
                                            nicknameEdit ? "수정할 내 회원아이디" : "새로운 회원아이디"
                                        }
                                    </span>
                                </div>


                                <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="영문 소문자와 숫자"
                                        
                                        //value={nickname}
                                        value={editedNickname}

                                        type='text'
                                        onChange={(e) => {
                                            // check if the value is a number
                                            // check if the value is alphanumeric and lowercase

                                            if (!/^[a-z0-9]*$/.test(e.target.value)) {
                                                //toast.error('회원아이디는 영문 소문자와 숫자로 5자 이상 10자 이하로 입력해주세요.');
                                                
                                                return;
                                            }
                                            if ( e.target.value.length > 10) {
                                                return;
                                            }

                                            //setNickname(e.target.value);

                                            setEditedNickname(e.target.value);

                                            checkNicknameIsDuplicate(e.target.value);

                                        } }
                                    />
                                    {/* display input length */}
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-zinc-100'>
                                            {editedNickname.length} / 10
                                        </span>
                                    </div>

                                    {editedNickname && isNicknameDuplicate && (
                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                            <span className='text-sm font-semibold text-red-500'>
                                                이미 사용중인 회원아이디입니다.
                                            </span>
                                        </div>
                                    )}

                                    {editedNickname
                                    && !isNicknameDuplicate
                                    && editedNickname.length >= 5
                                    && (
                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                            <span className='text-sm font-semibold text-green-500'>
                                                사용가능한 회원아이디입니다.
                                            </span>
                                        </div>
                                    )}
                                </div>


                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <span className='text-sm text-zinc-100 font-semibold'>

                                        회원아이디는 영문 소문자와 숫자로 5자 이상 10자 이하로 입력해주세요.

                                    </span>
                                </div>
                                <button
                                    disabled={
                                        !address
                                        || !editedNickname
                                        || editedNickname.length < 5
                                        || isNicknameDuplicate
                                        || loadingSetUserData
                                    }
                                    className={`
                                        ${!address
                                        || !editedNickname
                                        || editedNickname.length < 5
                                        || isNicknameDuplicate
                                        || loadingSetUserData
                                        ? 'bg-gray-500 text-zinc-100'
                                        : 'bg-blue-500 text-zinc-100'}

                                        p-2 rounded-lg text-sm font-semibold
                                        w-full mt-5
                                    `}
                                    onClick={() => {
                                        confirm('회원아이디를 저장하시겠습니까?') && setUserData();
                                    }}
                                >
                                    {loadingSetUserData ? "저장중..." : "저장"}
                                    
                                </button>

                                

                            </div>
                        )}

                        {/* 핸드폰번호 just view */}
                        {address && userCode && user?.mobile && (
                            <div className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        핸드폰번호
                                    </span>
                                </div>

                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                        {user?.mobile}
                                    </div>
                                </div>

                            </div>
                        )}

                            


                        {/* 핸드폰번호 저장하기 */}
                        {address && userCode && !user?.mobile && (
                            <div className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        핸드폰번호
                                    </span>
                                </div>

                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="핸드폰번호(01012345678)"
                                        
                                        value={mobile}

                                        type='number'
                                        onChange={(e) => {
                                            setMobile(e.target.value);
                                        } }
                                    />
                                </div>

                                {/* check if the mobile number is valid */}
                                {mobile && !/^\d{11}$/.test(mobile) ? (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-red-500'>
                                            핸드폰번호를 정확히 입력해주세요.
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                    {mobile.length > 0 && (
                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                            <span className='text-sm font-semibold text-green-500'>
                                                핸드폰번호가 정확히 입력되었습니다.
                                            </span>
                                        </div>
                                        )}
                                    </>
                                )}

                                <button
                                    disabled={
                                        !address
                                        || !mobile
                                        || loadingSetUserMobile
                                        || !/^\d{11}$/.test(mobile)
                                    }
                                    className={`
                                        ${!address
                                        || !mobile
                                        || loadingSetUserMobile
                                        || !/^\d{11}$/.test(mobile)
                                        ? 'bg-gray-500 text-zinc-100'
                                        : 'bg-blue-500 text-zinc-100'}

                                        p-2 rounded-lg text-sm font-semibold
                                        w-full mt-5
                                    `}
                                    onClick={() => {
                                        confirm('핸드폰번호를 저장하시겠습니까?') && setUserMobile();
                                    }}
                                >
                                    {loadingSetUserMobile ? "저장중..." : "저장"}
                                    
                                </button>

                            </div>
                        )}



                        {/* seller */}
                        {/* 판매자 은행정보 */}

                        {address && seller && seller && (

                            <div className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        판매자 은행정보
                                    </span>
                                </div>

                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                        {/*
                                           
                                            카카오뱅크: 090, 케이뱅크: 089, 토스뱅크: 092,

                                          국민은행: 004, 우리은행: 020, 신한은행: 088, 농협: 011, 기업은행: 003, 하나은행: 081, 외환은행: 002, 부산은행: 032, 대구은행: 031, 전북은행: 037, 경북은행: 071,
                                           광주은행: 034, 우체국: 071, 수협: 007, 씨티은행: 027, 대신은행: 055, 동양종합금융: 054, 

                                        */}  
                                        
                                        {
                                            seller?.bankInfo?.bankName === "090" ? "카카오뱅크" :
                                            seller?.bankInfo?.bankName === "089" ? "케이뱅크" :
                                            seller?.bankInfo?.bankName === "092" ? "토스뱅크" :
                                            seller?.bankInfo?.bankName === "004" ? "국민은행" :
                                            seller?.bankInfo?.bankName === "020" ? "우리은행" :
                                            seller?.bankInfo?.bankName === "088" ? "신한은행" :
                                            seller?.bankInfo?.bankName === "011" ? "농협" :
                                            seller?.bankInfo?.bankName === "003" ? "기업은행" :
                                            seller?.bankInfo?.bankName === "081" ? "하나은행" :
                                            seller?.bankInfo?.bankName === "002" ? "외환은행" :
                                            seller?.bankInfo?.bankName === "032" ? "부산은행" :
                                            seller?.bankInfo?.bankName === "031" ? "대구은행" :
                                            seller?.bankInfo?.bankName === "037" ? "전북은행" :
                                            seller?.bankInfo?.bankName === "071" ? "경북은행" :
                                            seller?.bankInfo?.bankName === "034" ? "광주은행" :
                                            seller?.bankInfo?.bankName === "071" ? "우체국" :
                                            seller?.bankInfo?.bankName === "007" ? "수협" :
                                            seller?.bankInfo?.bankName === "027" ? "씨티은행" :
                                            seller?.bankInfo?.bankName === "055" ? "대신은행" :
                                            seller?.bankInfo?.bankName === "054" ? "동양종합금융" :
                                            "기타"

       




                                        }
                                        {' '}{seller?.bankInfo?.accountNumber} {seller?.bankInfo?.accountHolder}
                                    </div>
                                </div>

                                {/* seller.status === 'confirmed' */}
                                {seller?.status === 'confirmed' && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-green-500'>
                                            판매자 정보가 확인되었습니다.
                                        </span>
                                    </div>
                                )}

                                {/* seller.status === 'pending' */}
                                {seller?.status === 'pending' && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-gray-500'>
                                            판매자 정보를 확인중입니다.
                                        </span>
                                    </div>
                                )}

                                {/* seller.status === 'rejected' */}
                                {seller?.status === 'rejected' && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-red-500'>
                                            판매자 정보가 거절되었습니다.
                                        </span>
                                    </div>
                                )}

                            </div>

                        )}

      
                        {/* 판매자 가상계좌 정보 virtualAccount */}
                        {address && (
                            <div className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        판매자 가상계좌 정보
                                    </span>
                                </div>

                                {user?.virtualAccount ? (
                                    <div className='flex flex-col gap-2 items-center justify-between'>
                                        {/* 제주은행 */}
                                        <span className='text-sm font-semibold text-gray-200'>
                                            은행: 제주은행
                                        </span>
                                        <div className="flex flex-row gap-2 items-center justify-between">
                                            <span className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                                게좌번호:{' '}{
                                                    user.virtualAccount
                                                }
                                            </span>
                                            {/* 복사 버튼 */}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(user.virtualAccount as string);
                                                    alert('가상계좌번호가 복사되었습니다.');
                                                }}
                                                className="p-2 bg-blue-500 text-zinc-100 rounded"
                                            >
                                                복사
                                            </button>
                                        </div>
                                        <span className='text-sm font-semibold text-gray-200'>
                                            예금주: 스타디움엑스 (가상)
                                        </span>

                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                            {/* dot */}
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className='text-sm font-semibold text-gray-200'>
                                                가상계좌는 입금전용이며 출금은 지갑에서 가능합니다.
                                            </span>
                                        </div>
                                        
                                    </div>
                                ) : (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-gray-200'>
                                        판매자 가상계좌 정보가 없습니다.
                                        </span>
                                    </div>
                                )}

                                {/* seller.status === 'confirmed' */}
                                {seller?.status === 'confirmed' && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-green-500'>
                                        판매자 가상계좌 정보가 확인되었습니다.
                                        </span>
                                    </div>
                                )}

                                {/* seller.status === 'pending' */}
                                {seller?.status === 'pending' && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-gray-500'>
                                        판매자 가상계좌 정보를 확인중입니다.
                                        </span>
                                    </div>
                                )}

                                {/* seller.status === 'rejected' */}
                                {seller?.status === 'rejected' && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-red-500'>
                                        판매자 가상계좌 정보가 거절되었습니다.
                                        </span>
                                    </div>
                                )}

                         
                            </div>

                        )}
                     



                        {/* 판매자 정보 저장하기 */}
                        {address && !user?.virtualAccount && (
                            <div className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        판매자 은행정보 저장하기
                                    </span>
                                </div>

                                <div className='flex flex-row gap-2 items-center justify-between'>

                                    {/*
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="은행명"
                                        
                                        value={seller?.bankInfo?.bankName}

                                        type='text'
                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo: {
                                                    ...seller?.bankInfo,
                                                    bankName: e.target.value,
                                                }
                                            });
                                        } }
                                    />
                                    */}

                                    {/*
                                    국민은행: 004, 우리은행: 020, 신한은행: 088, 농협: 011, 기업은행: 003, 하나은행: 081, 외환은행: 002, 부산은행: 032, 대구은행: 031, 전북은행: 037, 경북은행: 071, 부산은행: 032, 광주은행: 034, 우체국: 071, 수협: 007, 씨티은행: 027, 대신은행: 055, 동양종합금융: 054, 롯데카드: 062, 삼성카드: 029, 현대카드: 048, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카

                                    
                                    */}

                                    {/* select bank */}

                                    <select
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        value={seller?.bankInfo?.bankName}
                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo: {
                                                    ...seller?.bankInfo,
                                                    bankName: e.target.value,
                                                }
                                            });
                                        }}
                                    >
                                        <option value="" selected={seller?.bankInfo?.bankName === ""}>
                                            은행선택
                                        </option>
                                        <option value="090" selected={seller?.bankInfo?.bankName === "090"}>
                                            카카오뱅크
                                        </option>
                                        <option value="089" selected={seller?.bankInfo?.bankName === "089"}>
                                            케이뱅크
                                        </option>
                                        <option value="092" selected={seller?.bankInfo?.bankName === "092"}>
                                            토스뱅크
                                        </option>
                                        <option value="004" selected={seller?.bankInfo?.bankName === "004"}>
                                            국민은행
                                        </option>
                                        <option value="020" selected={seller?.bankInfo?.bankName === "020"}>
                                            우리은행
                                        </option>
                                        <option value="088" selected={seller?.bankInfo?.bankName === "088"}>
                                            신한은행
                                        </option>
                                        <option value="011" selected={seller?.bankInfo?.bankName === "011"}>
                                            농협
                                        </option>
                                        <option value="003" selected={seller?.bankInfo?.bankName === "003"}>
                                            기업은행
                                        </option>
                                        <option value="081" selected={seller?.bankInfo?.bankName === "081"}>
                                            하나은행
                                        </option>
                                        <option value="002" selected={seller?.bankInfo?.bankName === "002"}>
                                            외환은행
                                        </option>
                                        <option value="032" selected={seller?.bankInfo?.bankName === "032"}>
                                            부산은행
                                        </option>
                                        <option value="031" selected={seller?.bankInfo?.bankName === "031"}>
                                            대구은행
                                        </option>
                                        <option value="037" selected={seller?.bankInfo?.bankName === "037"}>
                                            전북은행
                                        </option>
                                        <option value="071" selected={seller?.bankInfo?.bankName === "071"}>
                                            경북은행
                                        </option>
                                        <option value="034" selected={seller?.bankInfo?.bankName === "034"}>
                                            광주은행
                                        </option>
                                        <option value="007" selected={seller?.bankInfo?.bankName === "007"}>
                                            수협
                                        </option>
                                        <option value="027" selected={seller?.bankInfo?.bankName === "027"}>
                                            씨티은행
                                        </option>
                                        <option value="055" selected={seller?.bankInfo?.bankName === "055"}>
                                            대신은행
                                        </option>
                                        <option value="054" selected={seller?.bankInfo?.bankName === "054"}>
                                            동양종합금융
                                        </option>


                                    </select>
                                




                                </div>
                                        

                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="계좌번호"
                                        
                                        value={seller?.bankInfo?.accountNumber}

                                        type='number'
                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo: {
                                                    ...seller?.bankInfo,
                                                    accountNumber: e.target.value,
                                                }
                                            });
                                        } }
                                    />
                                </div>

                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="예금주"
                                        
                                        value={seller?.bankInfo?.accountHolder}

                                        type='text'
                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo:
                                                {
                                                    ...seller?.bankInfo,
                                                    accountHolder: e.target.value,
                                                }
                                            });
                                        } }
                                    />
                                </div>

                                {/* 생년월일 941109 */}
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="생년월일(6자리)"
                                        
                                        value={seller?.bankInfo?.birth}

                                        type='number'
                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo:
                                                {
                                                    ...seller?.bankInfo,
                                                    birth: e.target.value,
                                                }
                                            });
                                        } }
                                    />
                                </div>

                                {/* gender 남성/여성 */}
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <select
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        value={seller?.bankInfo?.gender}

                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo:
                                                {
                                                    ...seller?.bankInfo,
                                                    gender: e.target.value,
                                                }
                                            });
                                        } }
                                    >
                                        <option value="">성별선택</option>
                                        <option value="1">남성</option>
                                        <option value="0">여성</option>
                                    </select>

                                </div>

                                {/* phoneNum */}
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-full text-2xl text-center font-semibold bg-zinc-800 rounded-lg text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"

                                        placeholder="전화번호"
                                        
                                        value={seller?.bankInfo?.phoneNum}

                                        type='number'
                                        onChange={(e) => {
                                            setSeller({
                                                ...seller,
                                                bankInfo:
                                                {
                                                    ...seller?.bankInfo,
                                                    phoneNum: e.target.value,
                                                }
                                            });
                                        } }
                                    />
                                </div>



                                {/* error message */}
                                {errorMsgForSetSeller && (
                                    <div className='flex flex-row gap-2 items-center justify-between'>
                                        <span className='text-sm font-semibold text-red-500'>
                                            {errorMsgForSetSeller}
                                        </span>
                                    </div>
                                )}



                                <button
                                    disabled={
                                        !address
                                        || !seller?.bankInfo?.bankName
                                        || !seller?.bankInfo?.accountNumber
                                        || !seller?.bankInfo?.accountHolder
                                        || !seller?.bankInfo?.birth
                                        || !seller?.bankInfo?.gender
                                        || !seller?.bankInfo?.phoneNum
                                        || loadingSetSeller
                                    }
                                    className={`
                                        ${!address
                                        || !seller?.bankInfo?.bankName
                                        || !seller?.bankInfo?.accountNumber
                                        || !seller?.bankInfo?.accountHolder
                                        || !seller?.bankInfo?.birth
                                        || !seller?.bankInfo?.gender
                                        || !seller?.bankInfo?.phoneNum
                                        || loadingSetSeller
                                        ? 'bg-gray-500 text-zinc-100'
                                        : 'bg-blue-500 text-zinc-100'}

                                        p-2 rounded-lg text-sm font-semibold
                                        w-full mt-5
                                    `}
                                    onClick={() => {
                                        confirm('판매자 정보를 저장하시겠습니까?') && setSellerInfo();
                                    }}
                                >
                                    {loadingSetSeller ? "저장중..." : "저장"}
                                </button>


                            

                            </div>
                        )}


                        {/* escrowWalletAddress */}
                        {/*
                        {address && escrowWalletAddress && (
                            <div className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                            bg-zinc-800 bg-opacity-90
                            '>
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-200">
                                        에스크로 지갑주소
                                    </span>
                                </div>

                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                        {
                                        escrowWalletAddress.slice(0, 6) + '...' + escrowWalletAddress.slice(-4)
                                        }
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(escrowWalletAddress as string);
                                        alert('에스크로 지갑주소가 복사되었습니다.');
                                    }}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    복사
                                </button>

                            </div>
                        )}
                        */}




                                            




                        {/*
                        {userCode && (
                            <div className='flex flex-row xl:flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    프로필 이미지
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    <Uploader
                                        lang='kr'
                                        walletAddress={address as string}
                                    />
                                </div>

                            </div>
                        )}
                        */}


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
                className="text-gray-600 hover:underline text-sm xl:text-lg"
                >
                TBOT
                </button>
                <button
                onClick={() => {
                    router.push('/profile?center=' + center + 'agent=' + agent + '&tokenId=' + tokenId);
                }}
                className="text-gray-600 hover:underline text-sm xl:text-lg"
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