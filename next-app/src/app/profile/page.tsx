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
import Link from "next/link";

import { smartWallet, inAppWallet } from "thirdweb/wallets";


import Image from 'next/image';

//import Uploader from '@/components/uploader';

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


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon


function ProfilePage() {

    const searchParams = useSearchParams();

    const center = searchParams.get("center");
    const telegramId = searchParams.get("telegramId");


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

    const [isValideTelegramId, setIsValideTelegramId] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            const data = await response.json();

            ///console.log("data", data);

            if (data.result) {
                setNickname(data.result.nickname);
                
                data.result.avatar && setAvatar(data.result.avatar);
                

                setUserCode(data.result.id);

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

            //toast.error("닉네임은 5자 이상 10자 이하로 입력해주세요");
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            //toast.error("닉네임은 영문 소문자와 숫자만 입력해주세요");
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
            //toast.error('닉네임을 먼저 설정해주세요');
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



   /* my NFTs */
   const [myNfts, setMyNfts] = useState([] as any[]);


   
   useEffect(() => {


       const getMyNFTs = async () => {

            
           try {

                /*
                const contract = getContract({
                     client,
                     chain: polygon,
                     address: erc721ContractAddress,
                });


                
                const nfts = await getOwnedNFTs({
                    contract: contract,
                    owner: address as string,
                });

                console.log("nfts=======", nfts);

                setMyNfts( nfts );
                */

                /*
                setMyNfts([
                    {
                         name: "AI Agent",
                         description: "This is AI Agent",
                         image: "https://owinwallet.com/logo-aiagent.png",
                    },
                ]);
                */


                // api /api/agent/getAgentNFTByWalletAddress

                const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to get NFTs');
                }

                const data = await response.json();

                ///console.log("myOwnedNfts====", data.result);

                if (data.result) {
                    setMyNfts(data.result.ownedNfts);
                } else {
                    setMyNfts([]);
                }
                
                   
   


           } catch (error) {
               console.error("Error getting NFTs", error);
           }
           

       };

       if (address ) {
           getMyNFTs();
       }

   }
   , [ address ]);
   


   console.log("myNfts", myNfts);




    const [agentName, setAgentName] = useState("");
    const [agentDescription, setAgentDescription] = useState("");


    const [agentImage, setAgentImage] = useState("https://owinwallet.com/logo-aiagent.png");
    const [ganeratingAgentImage, setGeneratingAgentImage] = useState(false);


    const [mintingAgentNft, setMintingAgentNft] = useState(false);
    const [messageMintingAgentNft, setMessageMintingAgentNft] = useState("");
    const mintAgentNft = async () => {

        if (mintingAgentNft) {
            //toast.error('이미 실행중입니다');
            setMessageMintingAgentNft('이미 실행중입니다');
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            setMessageMintingAgentNft('지갑을 먼저 연결해주세요');
            return;
        }

        if (!erc721ContractAddress) {
            //toast.error('AI 에이전트 계약주소를 먼저 생성해주세요');
            setMessageMintingAgentNft('AI 에이전트 계약주소를 먼저 생성해주세요');
            return;
        }

        if (agentName.length < 5 || agentName.length > 15) {
            //toast.error('에이전트 이름은 5자 이상 15자 이하로 입력해주세요');
            setMessageMintingAgentNft('에이전트 이름은 5자 이상 15자 이하로 입력해주세요');
            return;
        }

        if (agentDescription.length < 5 || agentDescription.length > 100) {
            //toast.error('에이전트 설명은 5자 이상 100자 이하로 입력해주세요');
            setMessageMintingAgentNft('에이전트 설명은 5자 이상 100자 이하로 입력해주세요');
            return;
        }

        if (!agentImage) {
            //toast.error('에이전트 이미지를 선택해주세요');
            setMessageMintingAgentNft('에이전트 이미지를 선택해주세요');
            return;
        }


        setMessageMintingAgentNft('AI 에이전트 NFT 발행중입니다');


        setMintingAgentNft(true);

        try {


            setGeneratingAgentImage(true);


            setMessageMintingAgentNft('AI 에이전트 이미지 생성중입니다');

            // genrate image from api
            // /api/ai/generateImage

            const responseGenerateImage = await fetch("/api/ai/generateImageAgent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    englishPrompt: "",
                }),
            });

            const dataGenerateImage = await responseGenerateImage.json();

            const imageUrl = dataGenerateImage?.result?.imageUrl;
        
            if (!imageUrl) {

                setGeneratingAgentImage(false);

                throw new Error('Failed to generate image');
            }


            setGeneratingAgentImage(false);
            setAgentImage(imageUrl);


            setMessageMintingAgentNft('AI 에이전트 NFT 발행중입니다');

            const contract = getContract({
                client,
                chain: polygon,
                address: erc721ContractAddress,

              });


            const transaction = mintTo({
                contract: contract,
                to: address as string,
                nft: {
                    name: agentName,
                    description: agentDescription,

                    ////image: agentImage,
                    image: imageUrl,

                },
            });

            //await sendTransaction({ transaction, account: activeAccount as any });



            //setActiveAccount(smartConnectWallet);

            const transactionResult = await sendAndConfirmTransaction({
                transaction: transaction,
                account: account as any,

                ///////account: smartConnectWallet as any,
            });

            //console.log("transactionResult", transactionResult);


            if (!transactionResult) {
                throw new Error('AI 에이전트 NFT 발행 실패. 관리자에게 문의해주세요');
            }

            setMessageMintingAgentNft('AI 에이전트 NFT 발행 완료');


            // fetch the NFTs again
            const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    //erc721ContractAddress: erc721ContractAddress,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    setMyNfts(data.result.ownedNfts);
                } else {
                    setMyNfts([]);
                }
            }

            setAgentName("");
            setAgentDescription("");

            ///toast.success('AI 에이전트 NFT 발행 완료');




        } catch (error) {
            console.error("mintAgentNft error", error);

            ///toast.error('AI 에이전트 NFT 발행 실패');

            setMessageMintingAgentNft('AI 에이전트 NFT 발행 실패');
        }

        setMintingAgentNft(false);

        setAgentImage("https://owinwallet.com/logo-aiagent.png");

    }




    return (

        <main
            className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto"
            style={{
                backgroundImage: "url('/mobile-background-profile.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
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
                    {/* 돌아가기 버튼 */}
                    <button
                        onClick={() => {
                            router.back();
                        }}
                        className="p-2 bg-gray-500 text-white rounded"
                    >
                        <div className='flex flex-row gap-2 items-center justify-center'>
                            <Image
                                src="/icon-back.png"
                                alt="Back"
                                width={20}
                                height={20}
                                className="rounded-lg"
                            />
                            <span className='text-lg font-semibold'>
                                돌아가기
                            </span>
                        </div>
                    </button>
                </div>

        
 

                <div className="mt-5 flex flex-col items-start justify-center space-y-4">

                    <div className='flex flex-row items-center space-x-4'>
                        <Image
                            src="/logo-tbot.webp"
                            alt="Profile Picture"
                            width={50}
                            height={50}
                            className="rounded-full"  
                        />
                        <div className="text-2xl font-semibold">
                            나의 프로필
                        </div>
                    </div>

                    <div className="flex justify-center mb-20">
                        {address ? (
                            <> 
                                <Button
                                onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}`)}
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                내 지갑주소: {shortenAddress(address)}
                                </Button>  
                            </>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                연결된 지갑이 없습니다. 지갑을 연결해 주세요.
                            </p>
                        )}      
                    </div>




                
                    <div className='w-full flex flex-col gap-4 items-start justify-center'>


                        {address && (

                            <div className='w-full flex flex-col gap-4 items-start justify-center'>


                                {/* send DUBAI */}
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
                                                    {Pay_USDT}
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


                    {userCode && isValideTelegramId && (
                        <div className='w-full flex flex-row gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                텔레그램 ID
                            </div>
                            <div className='flex flex-row gap-2 items-center justify-between'>
                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {telegramId}
                                </div>
                            </div>

                            {isCenterOwner && (
                                <span className='text-xs font-semibold text-green-500'>
                                    센터 소유자 입니다.
                                </span>
                            )}
                        </div>
                    )}

                    {userCode && !isValideTelegramId && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <span className='text-sm font-semibold text-gray-500'>
                                    텔레그램 ID
                                </span>
                                <span className='text-lg font-semibold text-blue-500'>
                                    {telegramId}
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    setUserTelegramId();
                                }}
                                disabled={loadingSetUserTelegramId}
                                className={`
                                    ${loadingSetUserTelegramId ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                    p-2 rounded-lg text-sm font-semibold
                                    w-64 mt-5
                                `}
                            >
                                {loadingSetUserTelegramId ? "텔레그램 ID 저장중..." : "텔레그램 ID 저장하기"}
                            </button>
    
                        </div>
                    )}



                    {/* 닉네임을 저장하면 나의 소속 센터 봇가 설정됩니다 */}
                    {address && !userCenter && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                닉네임을 저장하면 나의 소속 센터 봇이 설정됩니다
                            </div>

                            {/* center */}
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

                    

                    <div className='w-full  flex flex-col gap-5 '>


                        {address && userCode && (
                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    내 닉네임
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {nickname}
                                </div>

                                
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
                            <div className=' flex flex-col xl:flex-row gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>

                                <div
                                    className="bg-green-500 text-sm text-zinc-100 p-2 rounded"
                                >
                                    {!userCode ? "닉네임 설정" :
                                        nicknameEdit ? "수정할 내 닉네임" : "새로운 닉네임"
                                    }
                                </div>

                                <div className='flex flex-col gap-2 items-start justify-between'>
                                    <input
                                        disabled={!address}
                                        className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-2xl font-semibold"
                                        placeholder="닉네임"
                                        
                                        //value={nickname}
                                        value={editedNickname}

                                        type='text'
                                        onChange={(e) => {
                                            // check if the value is a number
                                            // check if the value is alphanumeric and lowercase

                                            if (!/^[a-z0-9]*$/.test(e.target.value)) {
                                                //toast.error('닉네임은 영문 소문자와 숫자만 입력해주세요');
                                                return;
                                            }
                                            if ( e.target.value.length > 10) {
                                                //toast.error('닉네임은 10자 이하로 입력해주세요');
                                                return;
                                            }

                                            //setNickname(e.target.value);

                                            setEditedNickname(e.target.value);

                                            checkNicknameIsDuplicate(e.target.value);

                                        } }
                                    />

                                    {editedNickname && isNicknameDuplicate && (
                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                            <span className='text-xs font-semibold text-red-500'>
                                                이미 사용중인 닉네임입니다.
                                            </span>
                                        </div>
                                    )}

                                    {editedNickname
                                    && !isNicknameDuplicate
                                    && editedNickname.length >= 5
                                    && (
                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                            <span className='text-xs font-semibold text-green-500'>
                                                사용가능한 닉네임입니다.
                                            </span>
                                        </div>
                                    )}
                                </div>


                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <span className='text-xs font-semibold'>
                                        닉네임은 5자 이상 10자 이하로 입력해주세요
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
                                        ? 'bg-gray-300 text-gray-400'
                                        : 'bg-blue-500 text-zinc-100'}

                                        p-2 rounded-lg text-sm font-semibold
                                        w-64 mt-5
                                    `}
                                    onClick={() => {
                                        setUserData();
                                    }}
                                >
                                    {loadingSetUserData ? "저장중..." : "저장"}
                                    
                                </button>

                                

                            </div>
                        )}


                        {userCode && (
                            <div className='flex flex-row xl:flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    내 프로필 이미지
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    <Uploader
                                        lang='kr'
                                        walletAddress={address as string}
                                    />
                                </div>

                            </div>
                        )}


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