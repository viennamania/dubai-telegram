'use client';
import React, { useEffect, useState, Suspense } from "react";

import { toast } from 'react-toastify';


import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { deployERC721Contract } from 'thirdweb/deploys';

/*
import {
    getOwnedNFTs,
    mintTo,
    transferFrom,
} from "thirdweb/extensions/erc721";
*/
// erc1155
import {
    safeTransferFrom,
    claimTo,
    getOwnedNFTs,
} from "thirdweb/extensions/erc1155";



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

import {
    allowance,
    approve,
    balanceOf
} from "thirdweb/extensions/erc20";


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
import { token } from "thirdweb/extensions/vote";
import { N } from "ethers";


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon


function AgentPage() {

    const searchParams = useSearchParams();

    const center = searchParams.get('center');

 

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

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    center: center,
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

                setIsCenterOwner(
                    data.result.centerOwner === true
                );

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
            }),
        });


        const data = await response?.json();


        //console.log("checkNicknameIsDuplicate data", data);

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
                    telegramId: "",
                }),
            });

            const data = await response.json();

            //console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                //toast.success('Nickname saved');

            } else {
                //toast.error('Error saving nickname');
            }
        }

        setLoadingSetUserData(false);

        
    }




    const erc1155ContractAddress = "0xE6BeA856Cd054945cE7A9252B2dc360703841028";

    const price = 105;

    // claim NFT
    const [claimingNft, setClaimingNft] = useState(false);
    const [messageClaimingNft, setMessageClaimingNft] = useState("");
    const claimNft = async (contractAddress: string, tokenId: string) => {

        if (claimingNft) {
            //toast.error('이미 실행중입니다');
            setMessageClaimingNft('이미 실행중입니다.');
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            setMessageClaimingNft('지갑을 먼저 연결해주세요.');
            return;
        }

        if (balance < price) {
            //toast.error('USDT 잔액이 부족합니다');
            setMessageClaimingNft('USDT 잔액이 부족합니다.');
            return;
        }


        setMessageClaimingNft('NFT 발행중입니다.');

        setClaimingNft(true);

        let allowanceAmount = 0;

        try {

            const erc1155Contract = getContract({
                client,
                chain: polygon,
                address: contractAddress,
            });


            // // ERC20: transfer amount exceeds allowance

            const result =
            await allowance({
                contract: contract,
                owner: address as string,
                spender: erc1155ContractAddress,
            });

            //console.log("result", result);
            allowanceAmount = Number(result);

            if (allowanceAmount < price * 10 ** 18) {
                
                //throw new Error('USDT 토큰을 먼저 채굴 NFT 발행 계약에 승인해주세요');

                // approve

                const transactionApprove = approve({
                    contract: contract,
                    spender: erc1155ContractAddress,
                    amount: price * 10 ** 18,
                });

                const transactionResultApprove = await sendAndConfirmTransaction({
                    account: account as any,
                    transaction: transactionApprove,
                });

                if (!transactionResultApprove) {
                    throw new Error('USDT 토큰을 먼저 채굴 NFT 발행 계약에 승인해주세요.');
                }

            }



            const transaction = claimTo({
                contract: erc1155Contract,


                //tokenId: BigInt(tokenId),

                tokenId: 0n,


                to: address as string,
                ///amount: 1n,

                quantity: 1n,

            });

            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,
            });

            if (!transactionResult) {
                throw new Error('NFT 발행 실패. 관리자에게 문의해주세요.');
            }

            setMessageClaimingNft('NFT 발행을 완료했습니다.');

            alert('NFT 발행을 완료했습니다.');

            
            // fetch the NFTs again
            setLoadingOwnedNfts(true);
            const nfts = await getOwnedNFTs({
                contract: erc1155Contract,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);


            // fetch transfers again
            setLoadingTransfers(true);
            const response = await fetch("/api/wallet/getTransfersByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    limit: 2,
                    page: 0,
                    walletAddress: address,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setTransfers(data.result?.transfers);
            }
            setLoadingTransfers(false);
            


        } catch (error) {

            if (error instanceof Error) {
                setMessageClaimingNft('NFT 발행 실패:' + error.message
                    + " allowanceAmount: " + allowanceAmount);

                //alert('NFT 발행 실패:' + error.message);

                // ERC20: transfer amount exceeds allowance

            } else {
                setMessageClaimingNft('NFT 발행 실패: 알 수 없는 오류');

                //alert('NFT 발행 실패: 알 수 없는 오류');
            }
        }

        setClaimingNft(false);


    }




    // getOwnedNFTs
    //const [ownedNfts, setOwnedNfts] = useState([] as any[]);






    const [ownedNfts, setOwnedNfts] = useState([] as any[]);
    const [loadingOwnedNfts, setLoadingOwnedNfts] = useState(false);

    useEffect(() => {
        const fetchOwnedNFTs = async () => {

            setLoadingOwnedNfts(true);
            const contractErc1155 = getContract({
                client,
                chain: polygon,
                address: erc1155ContractAddress,
            });

            const nfts = await getOwnedNFTs({
                contract: contractErc1155,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);

        };

        if (address) {
            fetchOwnedNFTs();
        }
    }, [address, erc1155ContractAddress]);


    //console.log("ownedNfts", ownedNfts);


    // safeTransferFrom
    // transfer NFT
    /*
    const [transferringNft, setTransferringNft] = useState(false);
    const [messageTransferringNft, setMessageTransferringNft] = useState("");

    const [toAddress, setToAddress] = useState("");
    const [sendAmount, setSendAmount] = useState("");
    */

    // array of transferingNft
    // array of messageTransferringNft
    // array of toAddress
    // array of sendAmount
    // array of tokenId

    const [transferringNft, setTransferringNft] = useState([] as boolean[]);
    useEffect(() => {
        setTransferringNft(ownedNfts.map(() => false));
    } , [ownedNfts]);

    const [messageTransferringNft, setMessageTransferringNft] = useState([] as string[]);
    useEffect(() => {
        setMessageTransferringNft(ownedNfts.map(() => ""));
    } , [ownedNfts]);

    const [toAddress, setToAddress] = useState([] as string[]);
    useEffect(() => {
        setToAddress(ownedNfts.map(() => ""));
    } , [ownedNfts]);

    const [sendAmount, setSendAmount] = useState([] as string[]);
    useEffect(() => {
        setSendAmount(ownedNfts.map(() => ""));
    } , [ownedNfts]);


    /*
    const [tokenId, setTokenId] = useState([] as string[]);
    useEffect(() => {
        setTokenId(ownedNfts.map(() => ""));
    } , [ownedNfts]);
    */
    //const [tokenId, setTokenId] = useState("");

        




    



    const transferNft = async (
        index: number,
        tokenId: string,
    ) => {

    
        if (transferringNft[index]) {
            //toast.error('이미 실행중입니다');
            messageTransferringNft[index] = '이미 실행중입니다.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            messageTransferringNft[index] = '지갑을 먼저 연결해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (!toAddress[index]) {
            //toast.error('수신자 주소를 입력해주세요');
            messageTransferringNft[index] = '수신자 주소를 입력해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (!sendAmount[index]) {
            //toast.error('전송할 양을 입력해주세요');
            messageTransferringNft[index] = '전송할 양을 입력해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (Number(sendAmount[index]) <= 0) {
            //toast.error('전송할 양을 입력해주세요');
            messageTransferringNft[index] = '전송할 양을 입력해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (Number(sendAmount[index]) > Number(ownedNfts[index].balance)) {
            //toast.error('보유한 양보다 많이 전송할 수 없습니다');
            messageTransferringNft[index] = '보유한 양보다 많이 전송할 수 없습니다.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }



    
        

        try {

            const erc1155Contract = getContract({
                client,
                chain: polygon,
                address: erc1155ContractAddress,
            });

            const optionalData = '0x';
            const transaction = safeTransferFrom({
                contract: erc1155Contract,
                from: address as string,
                to: toAddress[index],
                tokenId: BigInt(tokenId),
                value: BigInt(sendAmount[index]),
                data: optionalData,
            });


            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,
            });

            if (!transactionResult) {
                throw new Error('NFT 전송 실패. 관리자에게 문의해주세요.');
            }

            //setMessageTransferringNft('NFT 전송을 완ㄹ했습니다.');

            messageTransferringNft[index] = 'NFT 전송을 완료했습니다.';
            setMessageTransferringNft([...messageTransferringNft]);

            alert('NFT 전송을 완료했습니다.');

            //setSendAmount('');
            //setToAddress('');

            setSendAmount(sendAmount.map(() => ""));
            setToAddress(toAddress.map(() => ""));

            


            // fetch the NFTs again
            setLoadingOwnedNfts(true);
            const nfts = await getOwnedNFTs({
                contract: erc1155Contract,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);

            // fetch transfers again
            /*
            setLoadingTransfers(true);
            const response = await fetch("/api/wallet/getTransfersByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    limit: 2,
                    page: 0,
                    walletAddress: address,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setTransfers(data.result?.transfers);
            }
            setLoadingTransfers(false);
            */


        } catch (error) {

            if (error instanceof Error) {
                messageTransferringNft[index] = 'NFT 전송 실패:' + error.message;
                setMessageTransferringNft([...messageTransferringNft]);

                //setMessageTransferringNft('NFT 전송 실패:' + error.message);

                //alert('NFT 전송 실패:' + error.message);

            } else {
                messageTransferringNft[index] = 'NFT 전송 실패: 알 수 없는 오류';
                setMessageTransferringNft([...messageTransferringNft]);

                //setMessageTransferringNft('NFT 전송 실패: 알 수 없는 오류');

                //alert('NFT 전송 실패: 알 수 없는 오류');
            }

        }

        ///setTransferringNft(false);
        transferringNft[index] = false;



    }



    // /api/wallet/getTransfersByWalletAddress
    const [transfers, setTransfers] = useState([] as any[]);
    const [loadingTransfers, setLoadingTransfers] = useState(false);
    useEffect(() => {
        const fetchTransfers = async () => {
            setLoadingTransfers(true);

            const response = await fetch("/api/wallet/getTransfersByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    limit: 2,
                    page: 0,
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                setLoadingTransfers(false);
                return;
            }

            const data = await response.json();

            console.log("data", data);

            if (data.result) {
                setTransfers(data.result?.transfers);
            } else {
                setTransfers([]);
            }

            setLoadingTransfers(false);
        };

        if (address) {
            fetchTransfers();
        }
    } , [address]);

    /*
    {
        "_id": "67a85ce3537afb93e116d201",
        "user": {
            "_id": "67860b48c7ec01ab07b82a95",
            "telegramId": "441516803",
            "walletAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440"
        },
        "sendOrReceive": "send",
        "transferData": {
            "transactionHash": "0x58348ae8a94819d950b41a89b1f8b3fc7cfce424f377b1a1ca7c5a85f4123d2c",
            "transactionIndex": 19,
            "fromAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
            "toAddress": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
            "value": "1000000",
            "timestamp": 1739087064000,
            "_id": "67a85ce3537afb93e116d200"
        }
    }   
    */




    
    /* 서비스 죵료 */
    /*
    return (

        <main

           
            className="p-4 pb-28 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto
                bg-zinc-900 bg-opacity-90 backdrop-blur-md
                rounded-lg shadow-xl"
        >
            <div className="w-full text-center text-4xl text-white font-bold">
                서비스 종료
            </div>
        </main>

    )
    */
    



    return (

        <main

           
            className="p-4 pb-28 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto
                bg-zinc-900 bg-opacity-90 backdrop-blur-md
                rounded-lg shadow-xl"


            /*
            style={{
                backgroundImage: "url('/noah100.png')"

                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            */
            /* background image */


        >



            <div className="py-0 w-full">

                <AutoConnect
                    client={client}
                    wallets={[wallet]}
                    timeout={15000}
                />

                {/* sticky header */}
                <div className="sticky top-0 z-50
                    bg-zinc-800 bg-opacity-90
                    backdrop-blur-md
                    p-4 rounded-lg
                    w-full flex flex-row items-center justify-between">

                    {/* title */}
                    <div className="text-2xl font-semibold text-zinc-100">
                        나의 NOAH 채굴 NFT
                    </div>
                </div>
        
                <div className="w-full mt-5 flex flex-col items-start justify-center space-y-4">

                    
                    
                    <div className="w-full flex justify-center mt-5">
                        {address ? (
                            <div className="w-full flex flex-row gap-2 items-center justify-between">

                                <div className="flex flex-col xl:flex-row items-center justify-start gap-5
                                bg-white bg-opacity-90
                                rounded-lg">
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
                                    내 지갑주소: {shortenAddress(address as string)}
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address as string);
                                        alert('지갑주소가 복사되었습니다.');
                                    }}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    복사
                                </Button>
                                
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                연결된 지갑이 없습니다. 지갑을 연결해 주세요.
                            </p>
                        )}      
                    </div>


                    {/* usdt balance */}
                    {address && (

                        <div className="w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-200
                            p-4 rounded-lg">

                            
                            
                            
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
                                        <span className="text-4xl text-green-500 font-semibold">
                                            {
                                                Number(balance).toFixed(6).split('.')[0]
                                            }.
                                        </span>
                                        <span className="text-2xl text-green-500 font-semibold">
                                            {
                                                Number(balance).toFixed(6).split('.')[1]
                                            }
                                        </span>
                                    </div>
                                    <span className="text-green-500 text-2xl font-semibold">
                                        USDT
                                    </span>

                                </div>
                            </div>



                            {/* 전송내역 (최신 5개) */}
                            {loadingTransfers && (
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <Image
                                        src="/loading.png"
                                        alt="loading"
                                        width={30}
                                        height={30}
                                        className="animate-spin"
                                    />
                                    <span className="text-lg text-zinc-400 font-semibold">
                                        전송내역을 불러오는 중입니다...
                                    </span>
                                </div>
                            )}

                            {!loadingTransfers && transfers.length === 0 && (
                                <div className="w-full flex flex-col gap-2 items-start justify-between
                                    border border-gray-200
                                    p-4 rounded-lg">

                                    {transfers.length === 0 && (
                                        <span className="text-lg text-zinc-400 font-semibold">
                                            전송내역이 없습니다.
                                        </span>
                                    )}

                                </div>
                            )}

                            {!loadingTransfers && transfers.length > 0 && (
                                <div className="w-full flex flex-col gap-2 items-start justify-between">

                                    <div className="w-full flex flex-row gap-2 items-center justify-between">
                                        <div className="text-sm text-zinc-100
                                        border-b border-gray-200
                                        p-2 rounded-lg">
                                            전송내역 (최신 2개)
                                        </div>
                                    </div>

                                    {transfers.map((transfer, index) => (
                                        <div key={index} className="w-full flex flex-row gap-2 items-center justify-between">

                                            <div className="flex flex-row gap-2 items-center justify-between">
                                                {transfer.sendOrReceive === 'send' && (
                                                    <div className="w-24   flex flex-row gap-2 items-center justify-between">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        {/* otherUser?.avatar */}
                                                        {transfer?.otherUser?.avatar && (
                                                            <Image
                                                                src={transfer.otherUser.avatar}
                                                                alt="Avatar"
                                                                width={20}
                                                                height={20}
                                                                className="rounded"
                                                            />
                                                        )}
                                                        <span className="text-sm text-red-500">
                                                            보내기
                                                        </span>
                                                    </div>
                                                )}
                                                {transfer.sendOrReceive === 'receive' && (
                                                    <div className=" w-20 flex flex-row gap-2 items-center justify-between">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        {/* otherUser?.avatar */}
                                                        {transfer?.otherUser?.avatar && (
                                                            <Image
                                                                src={transfer.otherUser.avatar}
                                                                alt="Avatar"
                                                                width={20}
                                                                height={20}
                                                                className="rounded"
                                                            />
                                                        )}
                                                        <span className="text-sm text-green-500">
                                                            받기
                                                        </span>
                                                    </div>
                                                )}
                                                {/* monospace font style */}
                                                <span
                                                    className="w-28 text-sm text-zinc-100 text-right"
                                                    style={{
                                                        fontFamily: 'monospace',
                                                    }}
                                                >
                                                    {
                                                        Number(transfer.transferData.value / 10 ** 18).toFixed(6)
                                                    } USDT
                                                </span>
                                            </div>

                                            <div className="flex flex-row gap-2 items-center justify-between">
                                                <span className="text-sm text-zinc-100">
                                                    {
                                                        //transfer.transferData.timestamp
                                                        //new Date(transfer.transferData.timestamp).toLocaleString()
                                                        // time ago, just now, 1 minute ago, 1 hour ago, 1 day ago



                                                        (new Date().getTime() - transfer.transferData.timestamp) / 1000 < 60 && ('방금')
                                                        || (new Date().getTime() - transfer.transferData.timestamp) / 1000 / 60 < 60 && (Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 1000 / 60) + '분 전')
                                                        || (new Date().getTime() - transfer.transferData.timestamp) / 1000 / 60 / 60 < 24 && (Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 1000 / 60 / 60) + '시간 전')
                                                        || (new Date().getTime() - transfer.transferData.timestamp) / 1000 / 60 / 60 / 24 < 1 && (Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 1000 / 60 / 60 / 24) + '일 전')
                                                        || new Date(transfer.transferData.timestamp).toLocaleString()


                                                    }
                                                </span>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}


                        </div>
                    )}

                




                    {/* claim NFT */}
                    {address && (
                        <div className="w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg">
                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-sm text-zinc-100 font-semibold">
                                    NOAH 채굴 NFT 발행
                                </div>
                            </div>

                            {/* 보유하고 있는 USDT로 NOAH 채굴 NFT를 직접 발행받을 수 있습니다. */}
                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-yellow-500 font-semibold">
                                    보유하고 있는 USDT로 NOAH 채굴 NFT를 직접 발행받을 수 있습니다.
                                </span>
                            </div>
                            <span className="text-lg text-zinc-400 font-semibold">
                                NOAH 채굴 NFT를 발행받을려면 아래 버튼을 클릭하세요.
                            </span>
                            <button
                                disabled={claimingNft}
                                onClick={() =>
                                    confirm("NOAH 채굴 NFT를 발행하시겠습니까?") &&
                                    claimNft(erc1155ContractAddress, "0"
                                )}
                                className={`
                                    ${claimingNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                    p-2 rounded-lg text-sm font-semibold
                                `}
                            >
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    {claimingNft && (
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className="animate-spin"
                                        />
                                    )}
                                    {claimingNft && 'NOAH 채굴 NFT 발행중...'}
                                    {!claimingNft && 'NOAH 채굴 NFT 발행하기'}
                                </div>
                            </button>
                            
                            {messageClaimingNft && (
                                <span className="text-lg text-green-500 font-semibold">
                                    {messageClaimingNft}
                                </span>
                            )}

                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-yellow-500 font-semibold">
                                    NOAH 채굴 NFT 발행 금액은 {price} USDT 입니다.
                                </span>
                            </div>
                            {/* 지갑에 USDT가 있어야 발행 가능합니다. */}
                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-yellow-500 font-semibold">
                                    지갑에 USDT가 있어야 발행 가능합니다.
                                </span>
                            </div>

                        </div>
                    )}




                    {/* if not centerOwner show message */}
                    {/* NFT를 발행받을려면 센터장에게 문의하세요. */}
                    {/*
                    {address && userCode && !isCenterOwner && (
                        <div className='w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                AI 에이전트 NFT 발행
                            </div>
                            <span className='text-lg font-semibold'>
                                AI 에이전트 NFT를 발행받을려면 센터장에게 문의하세요.
                            </span>
                        </div>
                    )}
                        */}


                    {/* if centerOwner show message */}
                    {/* AI 에이전트 계약주소 생성하기 */}
                    {/*
                        address && userCode && !erc721ContractAddress && isCenterOwner && (
                    <>



                        {address && userCode && !erc721ContractAddress && (

    
                            <button
                                disabled={loadingDeployErc721Contract}
                                onClick={deployErc721Contract}
                                className={`
                                    ${loadingDeployErc721Contract ? 'bg-gray-300 text-gray-400' : 'bg-green-500 text-zinc-100'}
                                    p-2 rounded-lg text-sm font-semibold
                                `}
                            >
                                <div className='flex flex-row gap-2 items-center justify-center'>

                                    {address && loadingDeployErc721Contract && (
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className='animate-spin'
                                        />
                                    )}
                                    {address && loadingDeployErc721Contract && 'AI 에이전트 계약주소 생성중...'}
                                    {address && !erc721ContractAddress && !loadingDeployErc721Contract && 'AI 에이전트 계약주소 생성하기'}
    
                                </div>

                            </button>

                        )}

                    </>
                    )*/}



                    {/* My Referral Code */}
                    {/* address */}
                    {
                        address && userCode && erc721ContractAddress && isCenterOwner && (

                        <div className='w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>

                            <div className='w-full flex flex-row gap-2 items-center justify-between'>
                                <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    교환권 계약주소
                                </div>

                                <span className='text-xs xl:text-lg font-semibold'>
                                    {erc721ContractAddress.substring(0, 6) + '...' + erc721ContractAddress.substring(erc721ContractAddress.length - 4)}
                                </span>




                                {/* https://opensea.io/assets/matic/0xC1F501331E5d471230189E4A57E5268f10d0072A */}
                                {/* open new window */}
                                
                                <button
                                    onClick={() => {
                                        window.open('https://opensea.io/assets/matic/' + erc721ContractAddress);
                                    }}
                                    className="bg-blue-500 text-zinc-100 p-2 rounded-lg text-sm font-semibold"
                                >
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <Image
                                            src="/logo-opensea.png"
                                            alt="OpenSea"
                                            width={30}
                                            height={30}
                                            className="rounded-lg"
                                        />
                                        <span className="text-sm font-semibold">
                                            오픈씨에서 보기
                                        </span>
                                    </div>
                                </button>
                                


                                {/* verified icon */}

                                <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                />


                            </div>

                            

                            {/* mint AI Agent NFT */}
                            {/*
                            <div className='w-full flex flex-col gap-2 items-start justify-between
                                bg-yellow-100 border border-gray-300
                                p-4 rounded-lg'>
                                
                                <span className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    AI 에이전트 NFT 발행
                                </span>

                                <div className='flex flex-col xl:flex-row gap-2 items-start justify-between'>
                                    <input 
                                        className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                        placeholder="에이전트 이름"
                                        type='text'
                                        onChange={(e) => {
                                            setAgentName(e.target.value);
                                        }}
                                        value={agentName}
                                    />
                                    <input 
                                        className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                        placeholder="에이전트 설명"
                                        type='text'
                                        onChange={(e) => {
                                            setAgentDescription(e.target.value);
                                        }}
                                        value={agentDescription}
                                    />
                                </div>

                                <button
                                    disabled={mintingAgentNft}
                                    onClick={mintAgentNft}
                                    className={`
                                        ${mintingAgentNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                        p-2 rounded-sm text-sm font-semibold
                                    `}
                                >
                                    <div className='flex flex-row gap-2 items-center justify-center'>
                                       
                                        {mintingAgentNft && (
                                            <Image
                                                src="/loading.png"
                                                alt="loding"
                                                width={30}
                                                height={30}
                                                className='animate-spin'
                                            />
                                        )}
                                        {mintingAgentNft && 'AI 에이전트 NFT 발행중...'}
                                        {!mintingAgentNft && 'AI 에이전트 NFT 발행하기'}
                                    </div>
                                </button>

                                {messageMintingAgentNft && (
                                    <span className='text-lg font-semibold text-red-500
                                        border border-gray-300 p-4 rounded-lg'>
                                        {messageMintingAgentNft}
                                    </span>
                                )}

                                {ganeratingAgentImage && (
                                    <div className='flex flex-row gap-2 items-center justify-center'>
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className='animate-spin'
                                        />
                                        <span className='text-xs font-semibold'>
                                            AI 에이전트 이미지 생성중...
                                        </span>
                                    </div>
                                )}

                                {agentImage && (
                                    <Image
                                        src={agentImage}
                                        alt="AI Agent"
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                )}

                            </div>
                            */}


                        </div>

                    )}
      

                    {/* owned NFTs */}
                    <div className="w-full flex flex-col gap-2 items-center justify-between
                        border border-gray-800
                        p-4 rounded-lg">
                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                            {/* dot */}
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="text-sm text-zinc-100 font-semibold">
                                소유한 NOAH 채굴 NFT
                            </div>
                        </div>

                        {loadingOwnedNfts && (
                            <div className="w-full flex flex-row gap-2 items-center justify-center">
                                <Image
                                    src="/loading.png"
                                    alt="loding"
                                    width={30}
                                    height={30}
                                    className="animate-spin"
                                />
                                <span className="text-lg font-semibold text-zinc-400">
                                    NOAH 채굴 NFT 불러오는 중...
                                </span>
                            </div>
                        )}

 
                        {ownedNfts.length === 0 && !loadingOwnedNfts && (
                            <div className="w-full flex flex-row gap-2 items-center justify-center">
                                <span className="text-lg font-semibold text-zinc-400">
                                    소유한 NOAH 채굴 NFT가 없습니다.
                                </span>
                            </div>
                        )}


                        {!loadingOwnedNfts && ownedNfts.length > 0 && (
                            <div className="w-full flex flex-col gap-10 items-center justify-between">
                                {ownedNfts.map((nft, index) => (
                                    <div key={index} className="w-full flex flex-col gap-2 items-center justify-between p-4
                                        border border-gray-200
                                        rounded-lg">


                                        <div className="text-xl text-zinc-100 font-semibold">
                                            {nft.metadata?.name}
                                        </div>
                                        
                                        <div className="text-4xl text-green-500 font-semibold">
                                            {
                                                // nft.quantityOwned is bigint
                                                nft.quantityOwned.toString()
                                            }개
                                        </div>

                                        
                                        {/* metadata?.animation_url */}
                                        {/* ipfs://QmZzvZ to https://ipfs.io/ipfs/QmZzvZ */}
                                        {/* video */}
                                        {/*
                                        <div className="w-full flex flex-col gap-2 items-center justify-between">
                                            <video
                                                src={nft.metadata?.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                                //controls
                                                autoPlay
                                                loop
                                                className="rounded-lg"
                                            />
                                        </div>
                                        */}

                                        <div className="w-full flex flex-col gap-2 items-center justify-between
                                            border border-gray-800
                                            rounded-lg">
                                            {/* opensea */}
                                            <button
                                                onClick={() => {
                                                    window.open('https://opensea.io/assets/matic/' + erc1155ContractAddress + '/0');
                                                }}
                                                className="p-2 rounded hover:bg-gray-300"
                                            >
                                                <Image
                                                    src="/logo-opensea.png"
                                                    alt="OpenSea"
                                                    width={30}
                                                    height={30}
                                                    className="rounded-lg"
                                                />
                                            </button>
                                            <div className="w-full flex flex-col gap-2 items-center justify-between">
                                                {/*
                                                <Image
                                                    src={nft.metadata?.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                                    alt="NFT"
                                                    width={500}
                                                    height={500}
                                                    className="rounded-lg"
                                                />
                                                */}
                                                {/*
                                                <video
                                                    src={
                                                        nft.metadata?.animation_url.startsWith('ipfs://') ?
                                                        'https://ipfs.io/ipfs/' + nft.metadata?.animation_url.slice(7) :
                                                        nft.metadata?.animation_url
                                                    }
                                                    autoPlay
                                                    loop
                                                    muted
                                                    controls
                                                    className="w-full rounded-lg border border-gray-300"
                                                />
                                                */}


                                                {nft.id.toString() === "0" && (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full rounded-lg"
                                                    >
                                                        <source src="/noah-100-blue-mining.mp4" type="video/mp4" />
                                                    </video>
                                                )}

                                                {nft.id.toString() === "1" && (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full rounded-lg"
                                                    >
                                                        <source src="/noah-300-green-mining.mp4" type="video/mp4" />
                                                    </video>
                                                )}

                                                {nft.id.toString() === "2" && (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full rounded-lg"
                                                    >
                                                        <source src="/noah-500-red-mining.mp4" type="video/mp4" />
                                                    </video>
                                                )}

                                                {nft.id.toString() === "3" && (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full rounded-lg"
                                                    >
                                                        <source src="/noah-1000-purple-mining.mp4" type="video/mp4" />
                                                    </video>
                                                )}

                                                {nft.id.toString() === "4" && (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full rounded-lg"
                                                    >
                                                        <source src="/noah-5000-orange-mining.mp4" type="video/mp4" />
                                                    </video>
                                                )}

                                                {nft.id.toString() === "5" && (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full rounded-lg"
                                                    >
                                                        <source src="/noah-10000-gold-mining.mp4" type="video/mp4" />
                                                    </video>
                                                )}




                                            </div>
                                        </div>


                                        {/* transfer NFT */}
                                        <div className="mt-5 w-full flex flex-col gap-2 items-center justify-between
                                            border border-gray-800
                                            rounded-lg">
                                            
                                            <div className="w-full flex flex-row gap-2 items-center justify-start
                                                border-b border-gray-200
                                                p-2 rounded-lg">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-zinc-100 font-semibold">
                                                    NOAH 채굴 NFT 전송
                                                </span>
                                            </div>

                                            {/*
                                            채굴 NFT를 전송하면 소유자의 모든 권리를 이전하는 것에 동의하는 것입니다.
                                            */}
                                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                                {/* dot */}
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <span className="text-sm text-red-500 font-semibold">
                                                    NOAH 채굴 NFT를 전송하면 소유자의 모든 권리를 이전하는 것에 동의하는 것입니다.
                                                </span>
                                            </div>


                                            <span className="text-sm text-zinc-400 font-semibold">
                                               NOAH 채굴 NFT를 전송받을 주소와 수량을 입력하세요.
                                            </span>




                                            <input
                                                className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                placeholder="주소"
                                                type='text'
                                                onChange={(e) => {
                                                    //setToAddress(e.target.value);
                                                    //toAddress[index] = e.target.value;

                                                    setToAddress(toAddress.map((value, idx) => {
                                                        if (idx === index) {
                                                            return e.target.value;
                                                        } else {
                                                            return value;
                                                        }
                                                    }));

                                                }}
                                                value={
                                                    toAddress[index]
                                                }
                                            />
                                            <input
                                                className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                placeholder="수량"
                                                type='number'
                                                onChange={(e) => {

                                                    //setSendAmount(e.target.value);
                                                    //sendAmount[index] = e.target.value;

                                                    setSendAmount(sendAmount.map((value, idx) => {
                                                        if (idx === index) {
                                                            return e.target.value;
                                                        } else {
                                                            return value;
                                                        }
                                                    }));

                                                    
                                                }}
                                                value={
                                                    sendAmount[index]
                                                }

                                            />
                                            <button
                                                /*
                                                disabled={
                                                    transferringNft
                                                    || !toAddress
                                                    || !sendAmount
                                                    || Number(sendAmount) > Number(nft.quantityOwned.toString())
                                                }
                                                */
                                                disabled={transferringNft[index]
                                                    || !toAddress[index]
                                                    || !sendAmount[index]
                                                    || Number(sendAmount[index]) > Number(nft.quantityOwned.toString())
                                                }


                                                
                                                onClick={() =>
                                                    confirm("NOAH 채굴 NFT를 전송하시겠습니까?") &&
                                                    
                                                    transferNft(
                                                        index,
                                                        nft.id.toString(),
                                                    )
                                                }
                                                /*
                                                className={`
                                                    ${transferringNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                                    p-2 rounded-lg text-sm font-semibold
                                                `}
                                                */
                                                className={`
                                                    ${transferringNft[index] ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                                    p-2 rounded-lg text-sm font-semibold
                                                `}

                                            >
                                                {/*
                                                <div className="flex flex-row gap-2 items-center justify-center">
                                                    {transferringNft && (
                                                        <Image
                                                            src="/loading.png"
                                                            alt="loding"
                                                            width={30}
                                                            height={30}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    {transferringNft && 'NOAH 채굴 NFT 전송중...'}
                                                    {!transferringNft && 'NOAH 채굴 NFT 전송하기'}
                                                </div>
                                                */}
                                                <div className="flex flex-row gap-2 items-center justify-center">
                                                    {transferringNft[index] && (
                                                        <Image
                                                            src="/loading.png"
                                                            alt="loding"
                                                            width={30}
                                                            height={30}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    {transferringNft[index] && 'NOAH 채굴 NFT 전송중...'}
                                                    {!transferringNft[index] && 'NOAH 채굴 NFT 전송하기'}
                                                </div>


                                            </button>

                                            {/*
                                            {messageTransferringNft && (
                                                <span className="text-lg text-green-500 font-semibold">
                                                    {messageTransferringNft}
                                                </span>
                                            )}
                                            */}
                                            {messageTransferringNft[index] && (
                                                <span className="text-lg text-green-500 font-semibold">
                                                    {messageTransferringNft[index]}
                                                </span>
                                            )}

                                        </div>




                                    </div>
                                ))}
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



  export default function Agent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AgentPage />
        </Suspense>
    );
  }