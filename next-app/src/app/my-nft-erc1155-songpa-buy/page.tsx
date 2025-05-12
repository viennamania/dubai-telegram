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


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon


function AgentPage() {

    const searchParams = useSearchParams();

    const center = searchParams.get('center');


    const tokenId = searchParams.get('tokenId') || "0";
 

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
  

    const [nftName, setNftName] = useState(
        [
            "100 NOAH 채굴 NFT",
            "300 NOAH 채굴 NFT",
            "500 NOAH 채굴 NFT",
            "1000 NOAH 채굴 NFT",
            "5000 NOAH 채굴 NFT",
            "10000 NOAH 채굴 NFT",

        ]
    );


    {/* token id */}
    const [seletedTokenId, setSeletedTokenId] = useState("0");


    //const usdtPrice = 100;
    const [usdtPrice, setUsdtPrice] = useState(100);
    // fee 5%
    const fee = 0.05;

    const rate = 1500;
    // tax 10%
    const tax = 0.1;

    // 소수점 버림
    /*
    const krwPrice = Math.floor(
        (usdtPrice + usdtPrice * fee) * (1 + tax) * rate
    );
    */

    //const buyPrice = 179025;

    const [krwPrice, setKrwPrice] = useState(0);
    useEffect(() => {

        if (seletedTokenId === "0") {
            setUsdtPrice(100);
            setKrwPrice(Math.floor(
                (100 + 100 * fee) * (1 + tax) * rate
            ));
        } else if (seletedTokenId === "1") {
            setUsdtPrice(300);
            setKrwPrice(Math.floor(
                (300 + 300 * fee) * (1 + tax) * rate
            ));
        } else if (seletedTokenId === "2") {
            setUsdtPrice(500);
            setKrwPrice(Math.floor(
                (500 + 500 * fee) * (1 + tax) * rate
            ));
        } else if (seletedTokenId === "3") {
            setUsdtPrice(1000);
            setKrwPrice(Math.floor(
                (1000 + 1000 * fee) * (1 + tax) * rate
            ));
        } else if (seletedTokenId === "4") {
            setUsdtPrice(5000);
            setKrwPrice(Math.floor(
                (5000 + 5000 * fee) * (1 + tax) * rate
            ));
        } else if (seletedTokenId === "5") {
            setUsdtPrice(10000);
            setKrwPrice(Math.floor(
                (10000 + 10000 * fee) * (1 + tax) * rate
            ));
        }


    }, [seletedTokenId]);




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




    const erc1155ContractAddress = "0xE6BeA856Cd054945cE7A9252B2dc360703841028";



    // api/orderNft/getBuyOrdersByWalletAddress

    const [loadingBuyOrders, setLoadingBuyOrders] = useState(false);
    const [buyOrders, setBuyOrders] = useState([] as any[]);
    useEffect(() => {
        const fetchBuyOrders = async () => {
            setLoadingBuyOrders(true);

            const response = await fetch("/api/orderNft/getBuyOrdersByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                setLoadingBuyOrders(false);
                return;
            }

            const data = await response.json();

            console.log("getBuyOrdersByWalletAddress data", data);

            if (data.result) {
                setBuyOrders(data.result?.orders);
            } else {
                setBuyOrders([]);
            }

            setLoadingBuyOrders(false);
        };

        if (address) {
            fetchBuyOrders();
        }
    } , [address]);



    // claim NFT
    /*
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



        
        if (balance < 100) {
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

            const price = 100;

            if (allowanceAmount < price * 10 ** 18) {
                
                //throw new Error('USDT 토큰을 먼저 채굴 NFT 구매신청 계약에 승인해주세요');

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
                    throw new Error('USDT 토큰을 먼저 채굴 NFT 구매신청 계약에 승인해주세요.');
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

            //alert('NFT 발행 완료');

            
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
    */


    // 구매신청
    /*
            // /api/orderNft/setBuyOrder
        
        const response = await fetch("/api/orderNft/setBuyOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
                contractAddress: contractAddress,
                tokenId: tokenId,
                usdtPrice: usdtPrice,
                fee: fee,
                tax: tax,
                rate: rate,
                krwPrice: krwPrice,
            }),
        });
        



        alert(
            "NFT 구매신청을 완료했습니다."
        )
        */
    {/* 결제계좌 */}
    {/* 농협 301 0346 1572 11 (주)엘투엘 */}
    {/* 농협 301 0346 1572 11 (주)엘투엘 */}
    const paymentInfo = {
        bankName: "농협",
        accountHolder: "(주)엘투엘",
        accountNumber: "301-0346-1572-11",
    };


    {/* 입금자명 */}
    const [depositName, setDepositName] = useState("");


    const [buyOrdering, setBuyOrdering] = useState(false);
    const [messageBuyOrdering, setMessageBuyOrdering] = useState("");

    const buyOrder = async () => {
        
        if (buyOrdering) {
            //toast.error('이미 실행중입니다');
            setMessageBuyOrdering('이미 실행중입니다.');
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            setMessageBuyOrdering('지갑을 먼저 연결해주세요.');
            return;
        }



        setMessageBuyOrdering('NFT 구매신청중입니다.');

        setBuyOrdering(true);

        try {

            const response = await fetch("/api/orderNft/setBuyOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    contractAddress: erc1155ContractAddress,
                    tokenId: seletedTokenId,
                    usdtPrice: usdtPrice,
                    fee: fee,
                    tax: tax,
                    rate: rate,
                    krwPrice: krwPrice,
                    paymentInfo: paymentInfo,
                    depositName: depositName,
                }),
            });

            const data = await response.json();

            console.log("data", data);

            if (data.result) {

                setMessageBuyOrdering('NFT 구매신청을 완료했습니다.');

                alert('NFT 구매신청을 완료했습니다.');

                // fetch buyOrders again
                setLoadingBuyOrders(true);
                const response = await fetch("/api/orderNft/getBuyOrdersByWalletAddress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setBuyOrders(data.result?.orders);
                }
                setLoadingBuyOrders(false);



            } else {
                setMessageBuyOrdering('NFT 구매신청 실패: 알 수 없는 오류');

                //alert('NFT 구매신청 실패: 알 수 없는 오류');
            }

        } catch (error) {

            if (error instanceof Error) {
                setMessageBuyOrdering('NFT 구매신청 실패:' + error.message);

                //alert('NFT 구매신청 실패:' + error.message);

            } else {
                setMessageBuyOrdering('NFT 구매신청 실패: 알 수 없는 오류');

                //alert('NFT 구매신청 실패: 알 수 없는 오류');
            }

        }

        setBuyOrdering(false);

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
    const [transferringNft, setTransferringNft] = useState(false);
    const [messageTransferringNft, setMessageTransferringNft] = useState("");

    const [toAddress, setToAddress] = useState("");
    const [sendAmount, setSendAmount] = useState("");


    const transferNft = async (
        contractAddress: string,
        tokenId: string,
        //toAddress: string,
        //amount: string,
    ) => {
        
        if (transferringNft) {
            //toast.error('이미 실행중입니다');
            setMessageTransferringNft('이미 실행중입니다.');
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            setMessageTransferringNft('지갑을 먼저 연결해주세요.');
            return;
        }

        setMessageTransferringNft('NFT 전송중입니다.');

        setTransferringNft(true);

        try {

            const erc1155Contract = getContract({
                client,
                chain: polygon,
                address: contractAddress,
            });

            const optionalData = '0x';
            const transaction = safeTransferFrom({
                contract: erc1155Contract,
                from: address as string,
                to: toAddress,
                tokenId: BigInt(tokenId),
                value: BigInt(sendAmount),
                data: optionalData,
            });


            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,
            });

            if (!transactionResult) {
                throw new Error('NFT 전송 실패. 관리자에게 문의해주세요.');
            }

            setMessageTransferringNft('NFT 전송 완료');

            //alert('NFT 전송 완료');

            setSendAmount('');
            setToAddress('');
            


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
                setMessageTransferringNft('NFT 전송 실패:' + error.message);

                //alert('NFT 전송 실패:' + error.message);

            } else {
                setMessageTransferringNft('NFT 전송 실패: 알 수 없는 오류');

                //alert('NFT 전송 실패: 알 수 없는 오류');
            }

        }

        setTransferringNft(false);


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
                    {/*address && (

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
                                                Number(balance).toFixed(2).split('.')[0]
                                            }.
                                        </span>
                                        <span className="text-2xl text-green-500 font-semibold">
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
                                                    <div className="w-20 flex flex-row gap-2 items-center justify-between">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>

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
                                                <span className="w-28 text-sm text-zinc-100 text-right">
                                                    {
                                                        transfer.transferData.value / 10 ** 18
                                                    } DUBAI
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
                        )/*}

                    
                    */}
                    
                    
                    {/* buyOders status is "ordered" count check 0 */}

                    {address
                    && !loadingBuyOrders
                    && buyOrders.filter((order) => order.status === "ordered").length === 0 && (

                        <div className="w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-200
                            p-4 rounded-lg">
                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-sm text-zinc-100 font-semibold">
                                    NOAH 채굴 NFT 구매신청
                                </div>
                            </div>

                            {/* 구매할 NOAH 채굴 NFT를 선택해주세요. */}
                            <span className="text-lg text-yellow-500 font-semibold">
                                구매할 NOAH 채굴 NFT를 선택해주세요.
                            </span>

                            {/* selected token id */}
                            {/* noah-100-blue.jpeg => setUsdtPrice(100) */}
                            {/* noah-300-green.jpeg => setUsdtPrice(300) */}
                            {/* noah-500-red.jpeg => setUsdtPrice(500) */}
                            {/* noah-1000-purple.jpeg => setUsdtPrice(1000) */}
                            {/* noah-5000-orange.jpeg => setUsdtPrice(5000) */}
                            {/* noah-10000-gold.jpeg => setUsdtPrice(10000) */}
                            <div className="w-full grid grid-cols-3 gap-2 items-center justify-between">
                                <div
                                    onClick={() => setSeletedTokenId("0")}
                                    className={`
                                        ${seletedTokenId === "0" ? 'border border-green-500' : 'border border-gray-800'}
                                        p-2 rounded-lg cursor-pointer
                                    `}
                                >
                                    <video
                                        src="/noah-100-blue-mining.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="rounded-lg"
                                    />
                                </div>
                                <div
                                    onClick={() => setSeletedTokenId("1")}
                                    className={`
                                        ${seletedTokenId === "1" ? 'border border-green-500' : 'border border-gray-800'}
                                        p-2 rounded-lg cursor-pointer
                                    `}
                                >
                                    <video
                                        src="/noah-300-green-mining.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="rounded-lg"
                                    />
                                </div>
                                <div
                                    onClick={() => setSeletedTokenId("2")}
                                    className={`
                                        ${seletedTokenId === "2" ? 'border border-green-500' : 'border border-gray-800'}
                                        p-2 rounded-lg cursor-pointer
                                    `}
                                >
                                    <video
                                        src="/noah-500-red-mining.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="rounded-lg"
                                    />
                                </div>
                                <div
                                    onClick={() => setSeletedTokenId("3")}
                                    className={`
                                        ${seletedTokenId === "3" ? 'border border-green-500' : 'border border-gray-800'}
                                        p-2 rounded-lg cursor-pointer
                                    `}
                                >
                                    <video
                                        src="/noah-1000-purple-mining.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="rounded-lg"
                                    />
                                </div>
                                <div
                                    onClick={() => setSeletedTokenId("4")}
                                    className={`
                                        ${seletedTokenId === "4" ? 'border border-green-500' : 'border border-gray-800'}
                                        p-2 rounded-lg cursor-pointer
                                    `}
                                >
                                    <video
                                        src="/noah-5000-orange-mining.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="rounded-lg"
                                    />
                                </div>

                                <div
                                    onClick={() => setSeletedTokenId("5")}
                                    className={`
                                        ${seletedTokenId === "5" ? 'border border-green-500' : 'border border-gray-800'}
                                        p-2 rounded-lg cursor-pointer
                                    `}
                                >
                                    <video
                                        src="/noah-10000-gold-mining.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="rounded-lg"
                                    />
                                </div>

                            </div>


                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>

                                <span className="text-lg text-yellow-500 font-semibold">
                                    
                                    {/*채굴 NFT 구매신청은 100 DUBAI 당 1개씩 발행 가능합니다.*/}

                                    {seletedTokenId === "0" && '100 NOAH 채굴 NFT'
                                    || seletedTokenId === "1" && '300 NOAH 채굴 NFT'
                                    || seletedTokenId === "2" && '500 NOAH 채굴 NFT'
                                    || seletedTokenId === "3" && '1000 NOAH 채굴 NFT'
                                    || seletedTokenId === "4" && '5000 NOAH 채굴 NFT'
                                    || seletedTokenId === "5" && '10000 NOAH 채굴 NFT'
                                    }{' '} 1개 판매금액
                                </span>
                            </div>

                            <div className="w-full flex flex-row gap-2 items-center justify-between
                                border border-zinc-400 text-yellow-500
                                p-4 rounded-lg">
                                {usdtPrice * (1 + fee)} DUBAI<br />
                                ₩{
                                    Number(krwPrice).toLocaleString(

                                        //navigator.language
                                        'ko-KR'
                                    )
                                }(VAT포함)
                            </div>




                            <span className="text-lg text-zinc-400 font-semibold">
                                NOAH 채굴 NFT를 구매신청하려면 아래 계좌번호로 입금할 입금자명을 정확하게 입력해주세요.
                            </span>
                            
                            {/* 계좌번호 */}
                            <div className="w-full flex flex-col gap-2 items-start justify-between">
                                <span className="text-lg text-zinc-100 font-semibold">
                                    결제할 계좌번호
                                </span>
                                <span className="text-lg text-zinc-400 font-semibold">
                                    {paymentInfo.bankName} {paymentInfo.accountNumber} {paymentInfo.accountHolder}
                                </span>
                            </div>

                            {/* 입금자명 */}
                            <input
                                disabled={buyOrdering}
                                type="text"
                                value={depositName}
                                onChange={(e) => setDepositName(e.target.value)}
                                placeholder="입금자명을 입력해주세요"
                                className="w-full p-2 rounded-lg"
                            />

                            <div className="mt-5 flex flex-col gap-2 items-center justify-between">
                                <button
                                    disabled={buyOrdering || !depositName}
                                    onClick={() =>
                                        confirm("NOAH 채굴 NFT를 구매신청하시겠습니까?") &&
                                        buyOrder()
                                    }
                                    className={`
                                        ${buyOrdering || !depositName
                                         ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                        p-2 rounded-lg text-lg font-semibold
                                    `}
                                >
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        {buyOrdering && (
                                            <Image
                                                src="/loading.png"
                                                alt="loding"
                                                width={30}
                                                height={30}
                                                className="animate-spin"
                                            />
                                        )}
                                        {buyOrdering && 'NOAH 채굴 NFT 구매신청중...'}
                                        {!buyOrdering && 'NOAH 채굴 NFT 구매신청하기'}
                                    </div>
                                </button>

                                {messageBuyOrdering && (
                                    <span className="text-lg text-green-500 font-semibold">
                                        {messageBuyOrdering}
                                    </span>
                                )}

                            </div>


                            {/*
                            <button
                                disabled={claimingNft}
                                onClick={() =>
                                    confirm("채굴 NFT를 구매신청하시겠습니까?") &&
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
                                    {claimingNft && '채굴 NFT 구매신청중...'}
                                    {!claimingNft && '채굴 NFT 구매신청하기'}
                                </div>
                            </button>
                            
                            {messageClaimingNft && (
                                <span className="text-lg text-green-500 font-semibold">
                                    {messageClaimingNft}
                                </span>
                            )}
                                */}
                        


                        </div>
                    )}

                    {/* buyOders status is "ordered" count check > 0 */}
                    {/* buyOrders list */}
                    {/* 구매신청내역 */}
                    <div className="mt-10 w-full flex flex-col gap-2 items-center justify-between
                        border-t border-zinc-400 p-4 rounded-lg">

                        <div className="flex flex-col gap-2 items-center justify-between">
                            <span className="text-lg text-zinc-100 font-semibold">
                                NOAH 채굴 NFT 구매신청내역
                            </span>
                            {/* 새로고침 */}
                            <button
                                onClick={() => {
                                    
                                    
                                    const fetchBuyOrders = async () => {

                                        setLoadingBuyOrders(true);
                                        const response = await fetch("/api/orderNft/getBuyOrdersByWalletAddress", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                walletAddress: address,
                                            }),
                                        });
                                        if (response.ok) {
                                            const data = await response.json();
                                            setBuyOrders(data.result?.orders);
                                        }
                                        setLoadingBuyOrders(false);
                                    };

                                    fetchBuyOrders();

                                }}

                                className="bg-blue-500 text-zinc-100 p-2 rounded-lg text-sm font-semibold"
                            >
                                새로고침
                            </button>

                        </div>

                        {/* 구매신청내역이 없습니다. */}
                        {address && !loadingBuyOrders && buyOrders.length === 0 && (
                            <div className="w-full flex flex-col gap-2 items-start justify-between
                                border border-gray-800
                                p-4 rounded-lg">

                                <span className="text-lg text-zinc-400 font-semibold">
                                    구매신청내역이 없습니다.
                                </span>

                            </div>
                        )}

                        {/* 구매신청내역이 있습니다. */}
                        {/*{

    "tradeId": "396305",
=
    "orderInfo": {
        "walletAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
        "contractAddress": "0xE6BeA856Cd054945cE7A9252B2dc360703841028",
        "tokenId": "0",
        "usdtPrice": 100,
        "fee": 0.05,
        "tax": 0.1,
        "rate": 1500,
        "krwPrice": 179025
    },
    "createdAt": "2025-02-11T02:39:52.982Z",
    "status": "ordered"
}
                        */}
 
                        {address && !loadingBuyOrders && (

                            <div className="w-full flex flex-col gap-2 items-center justify-between">

                                {buyOrders.map((order, index) => (

                                    <>
                                        {order.status === 'paymentConfirmed' && (

                                       
                                            <div
                                                key={index}
                                                className="w-full flex flex-col gap-2 items-start justify-between
                                                border border-green-500
                                                p-4 rounded-lg"
                                            >
                                                {/* 거래번호 */}
                                                <div className="w-full flex flex-row gap-2 items-center justify-between">
                                                    <span className="text-lg text-green-500 font-semibold">
                                                        거래번호: #{order.tradeId}
                                                    </span>
                                                    {/* time ago */}
                                                    <span className="text-sm text-zinc-400 font-semibold">
                                                        {
                                                            (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 < 60 && ('방금')
                                                            || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 < 60 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60) + '분 전')
                                                            || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 < 24 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60) + '시간 전')
                                                            || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 / 24 < 1 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 / 24) + '일 전')
                                                            || new Date(order.createdAt).toLocaleString()
                                                        }
                                                    </span>
                                                </div>
                                                {/* toeknId is 0 => noah-100-blue-mining.mp4 */}
                                                {order.orderInfo.tokenId === "0" && (
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
                                                {order.orderInfo.tokenId === "1" && (
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
                                                {order.orderInfo.tokenId === "2" && (
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
                                                {order.orderInfo.tokenId === "3" && (
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
                                                {order.orderInfo.tokenId === "4" && (
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
                                                {order.orderInfo.tokenId === "5" && (
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
                                                {/* 거래완료 */}
                                                <div className="w-full flex flex-row gap-2 items-center justify-between">
                                                    <span className="text-lg text-green-500 font-semibold">
                                                        구매완료
                                                    </span>
                                                </div>
                                            </div>

                                        )}

                                        {order.status === 'cancelled' && (
                                            <div
                                                key={index}
                                                className="w-full flex flex-col gap-2 items-start justify-between
                                                border border-red-500
                                                p-4 rounded-lg"
                                            >
                                                {/* 거래번호 */}
                                                <div className="w-full flex flex-row gap-2 items-center justify-between">
                                                    <span className="text-lg text-red-500 font-semibold">
                                                        거래번호: #{order.tradeId}
                                                    </span>
                                                    {/* time ago */}
                                                    <span className="text-sm text-zinc-400 font-semibold">
                                                        {
                                                            (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 < 60 && ('방금')
                                                            || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 < 60 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60) + '분 전')
                                                            || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 < 24 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60) + '시간 전')
                                                            || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 / 24 < 1 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 / 24) + '일 전')
                                                            || new Date(order.createdAt).toLocaleString()
                                                        }
                                                    </span>
                                                </div>

                                                {/* toeknId is 0 => noah-100-blue.jpeg */}
                                                {order.orderInfo.tokenId === "0" && (
                                                    <Image
                                                        src="/noah-100-blue.jpeg"
                                                        alt="NOAH-100"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg"
                                                    />
                                                )}
                                                {order.orderInfo.tokenId === "1" && (
                                                    <Image
                                                        src="/noah-300-green.jpeg"
                                                        alt="NOAH-300"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg"
                                                    />
                                                )}
                                                {order.orderInfo.tokenId === "2" && (
                                                    <Image
                                                        src="/noah-500-red.jpeg"
                                                        alt="NOAH-500"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg"
                                                    />
                                                )}
                                                {order.orderInfo.tokenId === "3" && (
                                                    <Image
                                                        src="/noah-1000-purple.jpeg"
                                                        alt="NOAH-1000"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg"
                                                    />
                                                )}
                                                {order.orderInfo.tokenId === "4" && (
                                                    <Image
                                                        src="/noah-5000-orange.jpeg"
                                                        alt="NOAH-5000"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg"
                                                    />
                                                )}
                                                {order.orderInfo.tokenId === "5" && (
                                                    <Image
                                                        src="/noah-10000-gold.jpeg"
                                                        alt="NOAH-10000"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg"
                                                    />
                                                )}

                                                {/* 거래취소 */}
                                                <div className="w-full flex flex-row gap-2 items-center justify-between">
                                                    <span className="text-lg text-red-500 font-semibold">
                                                        거래취소
                                                    </span>
                                                </div>
                                            </div>
                                        )}


                                    {order.status === 'ordered' && (
                                    <div
                                        key={index}
                                        className="w-full flex flex-col gap-2 items-start justify-between
                                        border border-green-500
                                        p-4 rounded-lg"
                                    >
                                        {/* 거래번호 */}
                                        <div className="w-full flex flex-row gap-2 items-center justify-between">
                                            <span className="text-lg text-green-500 font-semibold">
                                                거래번호: #{order.tradeId}
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-between
                                            border-t border-green-500 p-2">
                                            <div className="flex flex-row gap-2 items-center justify-start">
                                                <span className="text-lg text-yellow-500 font-semibold">
                                                    구매신청
                                                </span>
                                                <span className="text-sm text-zinc-400 font-semibold">
                                                    {
                                                        //new Date(order.createdAt).toLocaleString()
                                                        // time age, just now, 1 minute ago, 1 hour ago, 1 day ago
                                                        (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 < 60 && ('방금')
                                                        || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 < 60 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60) + '분 전')
                                                        || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 < 24 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60) + '시간 전')
                                                        || (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 / 24 < 1 && (Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60 / 24) + '일 전')
                                                        || new Date(order.createdAt).toLocaleString()

                                                    }

                                                </span>
                                            </div>
                                        </div>

                                        


                                        {/* 구매신청한 NOAH 채굴 NFT */}
                                        {/* tokenId */}
                                        {/* 0 => noah-100-blue-mining.mp4 */}
                                        {/* 1 => noah-300-green-mining.mp4 */}
                                        <div className="w-full flex flex-row gap-2 items-center justify-between p-2">
                                            {order.orderInfo.tokenId === "0" && (
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
                                            {order.orderInfo.tokenId === "1" && (
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
                                            {order.orderInfo.tokenId === "2" && (
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
                                            {order.orderInfo.tokenId === "3" && (
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
                                            {order.orderInfo.tokenId === "4" && (
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
                                            {order.orderInfo.tokenId === "5" && (
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

                                        {/* 구매수량 */}
                                        <div className="w-full flex flex-row gap-2 items-center justify-between p-2">
                                            <span className="text-lg text-zinc-400 font-semibold">
                                                구매수량: 1개
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-between p-2">
                                            <span className="text-lg text-zinc-400 font-semibold">
                                                구매신청금액: ₩{
                                                    Number(order.orderInfo.krwPrice).toLocaleString(
                                                        'ko-KR'
                                                    )
                                                }
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-between p-2">
                                            <span className="text-lg text-zinc-400 font-semibold">
                                                구매신청상태: {
                                                    order.status === 'ordered' && '구매신청중'
                                                }
                                            </span>
                                        </div>

                                        {/* 결제할 계좌번호 */}
                                        <div className="w-full flex flex-col gap-2 items-start justify-between
                                            border-t border-green-500 p-2">
                                            <span className="text-lg text-zinc-400 font-semibold">
                                                결제할 계좌번호:
                                            </span>
                                            <span className="text-lg text-zinc-400 font-semibold">
                                                {paymentInfo.bankName} {paymentInfo.accountNumber} {paymentInfo.accountHolder}
                                            </span>
                                        </div>

                                        {/* 입금자명 */}
                                        <div className="w-full flex flex-row gap-2 items-center justify-between p-2">
                                            <span className="text-lg text-zinc-400 font-semibold">
                                                입금자명: {order.depositName}
                                            </span>
                                        </div>
                                        
                                        {/* 결제할 계좌번호로 신청한 입금자명으로 입급을 해주세요. */}
                                        {/* 입금확인후 NFT가 발행됩니다. */}

                                        <div className="w-full flex flex-col gap-2 items-start justify-between
                                            border-t border-green-500 p-2">
                                            <div className="flex flex-row gap-2 items-center justify-start">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div className="text-sm text-zinc-100 font-semibold">
                                                    결제할 계좌번호로 신청한 입금자명으로 입급을 해주세요.
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center justify-start">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div className="text-sm text-zinc-100 font-semibold">
                                                    입금확인후 NFT가 발행됩니다.
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    )}
                                    </>



                                ))}


                            </div>



                        )}

                    </div>



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
                                                <video
                                                    /*
                                                    src={
                                                        nft.metadata?.animation_url.startsWith('ipfs://') ?
                                                        'https://ipfs.io/ipfs/' + nft.metadata?.animation_url.slice(7) :
                                                        nft.metadata?.animation_url
                                                    }
                                                    */
                                                   // if nft.tokenId is 0 => noah-100-blue-mining.mp4
                                                   // if nft.tokenId is 1 => noah-300-green-mining.mp4
                                                   // if nft.tokenId is 2 => noah-500-red-mining.mp4
                                                   // if nft.tokenId is 3 => noah-1000-purple-mining.mp4
                                                   // if nft.tokenId is 4 => noah-5000-orange-mining.mp4
                                                   // if nft.tokenId is 5 => noah-10000-gold-mining.mp4
                                                   src={
                                                       nft.tokenId === "0" && '/noah-100-blue-mining.mp4'
                                                       || nft.tokenId === "1" && '/noah-300-green-mining.mp4'
                                                       || nft.tokenId === "2" && '/noah-500-red-mining.mp4'
                                                       || nft.tokenId === "3" && '/noah-1000-purple-mining.mp4'
                                                       || nft.tokenId === "4" && '/noah-5000-orange-mining.mp4'
                                                       || nft.tokenId === "5" && '/noah-10000-gold-mining.mp4'
                                                       || '/noah-100-blue-mining.mp4'
                                                   }
                                                   
                                                    autoPlay
                                                    loop
                                                    muted
                                                    controls
                                                    className="w-full rounded-lg border border-gray-300"
                                                />


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


                                            <span className="text-lg text-zinc-400 font-semibold">
                                                NOAH 채굴 NFT를 전송받을 주소와 수량을 입력하세요.
                                            </span>




                                            <input
                                                className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                placeholder="주소"
                                                type='text'
                                                onChange={(e) => {
                                                    setToAddress(e.target.value);
                                                }}
                                                value={toAddress}
                                            />
                                            <input
                                                className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                placeholder="수량"
                                                type='number'
                                                onChange={(e) => {

                                                    // only number
                                                    if (isNaN(Number(e.target.value))) {
                                                        return;
                                                    }

                                                    // less than balance
                                                    if (Number(e.target.value) > Number(nft.quantityOwned.toString())) {
                                                        return;
                                                    }

                                                    setSendAmount(e.target.value);
                                                    
                                                }}
                                                value={sendAmount}
                                            />
                                            <button
                                                disabled={
                                                    transferringNft
                                                    || !toAddress
                                                    || !sendAmount
                                                    || Number(sendAmount) > Number(nft.quantityOwned.toString())
                                                }
                                                
                                                onClick={() =>
                                                    confirm("NOAH 채굴 NFT를 전송하시겠습니까?") &&
                                                    transferNft(
                                                        erc1155ContractAddress,
                                                        "0",
                                                    )
                                                }
                                                className={`
                                                    ${transferringNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                                    p-2 rounded-lg text-sm font-semibold
                                                `}
                                            >
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
                                            </button>

                                            {messageTransferringNft && (
                                                <span className="text-lg text-green-500 font-semibold">
                                                    {messageTransferringNft}
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



  export default function Agent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AgentPage />
        </Suspense>
    );
  }