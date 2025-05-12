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

import { balanceOf } from "thirdweb/extensions/erc20";


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


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon


function AgentPage() {

    const searchParams = useSearchParams();

    const center = searchParams.get('center');


    ////const tokenId = searchParams.get('tokenId');
    const tokenId = "2";
 

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

                ///console.log("erc721ContractAddress", erc721ContractAddress);

                // save the contract address to the database
                // /api/user/updateUser
                // walletAddress, erc721ContractAddress

                if (!erc721ContractAddress) {
                    throw new Error('Failed to deploy ERC721 contract');
                }


                ///console.log("erc721ContractAddress", erc721ContractAddress);



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

                if (error instanceof Error) {
                    alert('AI 에이전트 계약주소 생성 실패.' + error.message);
                } else {
                    alert('AI 에이전트 계약주소 생성 실패: 알 수 없는 오류');
                }


            }

            setLoadingDeployErc721Contract(false);

        }
  
    };



   /* my NFTs */
   const [myNfts, setMyNfts] = useState([] as any[]);

   const [loadingMyNfts, setLoadingMyNfts] = useState(false);

   
   useEffect(() => {


       const getMyNFTs = async () => {

              if (!address) {
                return;
              }

              setLoadingMyNfts(true);

            
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
                
                const response = await fetch("/api/nftNoah/getNFTByWalletAddress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tokenId: tokenId,
                        walletAddress: address,
                    }),
                });

                if (!response.ok) {

                    setLoadingMyNfts(false);
                    throw new Error('Failed to get NFTs');

                }

                const data = await response.json();

                //console.log("myOwnedNfts====", data.result);




                if (data.result) {
                    // exclude name is "MasgerBot"
                    const filteredNfts = data.result.ownedNfts.filter((nft : any) => {

                        if (nft.name === "MasterBot") {
                            return false;
                        }

                        return true;
                    });

                    //console.log("filteredNfts", filteredNfts);

                    setMyNfts(filteredNfts);



                    //setMyNfts(data.result.ownedNfts);
                } else {
                    setMyNfts([]);
                }

                
                setLoadingMyNfts(false);
   


           } catch (error) {
               console.error("Error getting NFTs", error);
           }
           

           setLoadingMyNfts(false);

       };

       if (address ) {
           getMyNFTs();
       }

   }
   , [ address, tokenId ]);



   
    const [agentName, setAgentName] = useState("");
    const [agentDescription, setAgentDescription] = useState("");


    const [agentImage, setAgentImage] = useState("");
    const [ganeratingAgentImage, setGeneratingAgentImage] = useState(false);

   /*
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
                account: account as any,
                transaction: transaction,

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
                    // exclude name is "MasgerBot"
                    const filteredNfts = data.result.ownedNfts.filter((nft : any) => {

                        if (nft.name === "MasterBot") {
                            return false;
                        }

                        return true;
                    });

                    setMyNfts(filteredNfts);



                } else {
                    setMyNfts([]);
                }
            }

            setAgentName("");
            setAgentDescription("");

            ///toast.success('AI 에이전트 NFT 발행 완료');




        } catch (error) {
            //console.error("mintAgentNft error", error);

            ///toast.error('AI 에이전트 NFT 발행 실패');

            if (error instanceof Error) {
                setMessageMintingAgentNft('AI 에이전트 NFT 발행 실패:' + error.message);
            } else {
                setMessageMintingAgentNft('AI 에이전트 NFT 발행 실패: 알 수 없는 오류');
            }
        }

        setMintingAgentNft(false);

        setAgentImage("");

    }
        */




    // transfer NFT
    const [transferingNftList, setTransferingNftList] = useState([] as any[]);

    // initailize transferingNftList for myNfts
    useEffect(() => {
        if (myNfts) {
            setTransferingNftList(myNfts.map((nft) => {
                return {
                    contractAddress: nft.contract.address,
                    tokenId: nft.tokenId,
                    transferring: false,
                };
            }));
        }
    }, [myNfts]);


    ///console.log("transferingNftList", transferingNftList);


    const [sendAmountList, setSendAmountList] = useState([] as any[]);
    useEffect(() => {
        if (myNfts) {
            setSendAmountList(myNfts.map((nft) => {
                return {
                    contractAddress: nft.contract.address,
                    tokenId: nft.tokenId,
                    amount: 0,
                };
            }));
        }
    }, [myNfts]);



    // toAddress array
    const [toAddressList, setToAddressList] = useState([] as any[]);
    useEffect(() => {
        if (myNfts) {
            setToAddressList(myNfts.map((nft) => {
                return {
                    contractAddress: nft.contract.address,
                    tokenId: nft.tokenId,
                    to: "",
                };
            }));
        }
    } , [myNfts]);



    const transferNft = async (contractAddress: string, tokenId: string) => {

        if (transferingNftList.find((item) =>
            item.contractAddress === contractAddress && item.tokenId === tokenId
        ).transferring) {
            return;
        }

        


        if (confirm(
            "NFT를 다른 사용자에게 전송하시겠습니까?"
        ) === false) {
            return;
        }



        setTransferingNftList(transferingNftList.map((item) => {
            if (item.contractAddress === contractAddress && item.tokenId === tokenId) {
                return {
                    ...item,
                    transferring: true,
                };
            }
        }));

        const to = toAddressList.find((item) => 
            item.contractAddress === contractAddress && item.tokenId === tokenId
        ).to;

        try {

            const contract = getContract({
                client,
                chain: polygon,
                address: contractAddress,
            });

            /*
            const transaction = transferFrom({
                contract: contract,
                from: address as string,
                to: to,
                tokenId: BigInt(tokenId),
            });
            */
            /*
            const transaction = safeTransferFrom({
                contract, // the erc1155 contract
                from: "0x...", // owner's wallet address
                to: "0x...", // recipient address
                tokenId: 0n,
                value: quantity,
                data: optionalData,
              });
            */

            const value = sendAmountList.find((item) =>
                item.contractAddress === contractAddress && item.tokenId === tokenId
            ).amount;

            const optionalData = "0x";

            const transaction = safeTransferFrom({
                contract: contract,
                from: address as string,
                to: to,
                tokenId: BigInt(tokenId),
                
                //value: 1n,

                value: BigInt(value),


                data: optionalData,
            });





            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,

            });

            if (!transactionResult) {
                throw new Error('Failed to transfer NFT');
            }

            setTransferingNftList(transferingNftList.map((item) => {
                if (item.contractAddress === contractAddress && item.tokenId === tokenId) {
                    return {
                        ...item,
                        transferring: false,
                    };
                }
            }));

            alert('NFT 전송 완료');




            // fetch the NFTs again
            const response = await fetch("/api/nftNoah/getNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tokenId: tokenId,
                    walletAddress: address,
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

            // fetch the user transfer history
            const responseUserTransferHistory = await fetch("/api/nftNoah/getAllTransferByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    tokenId: tokenId,
                }),
            });

            if (responseUserTransferHistory.ok) {
                const dataUserTransferHistory = await responseUserTransferHistory.json();
                if (dataUserTransferHistory.transfers) {
                    setUserTransferHistory(dataUserTransferHistory.transfers);
                }
            }

        } catch (error) {
            console.error("transferNft error", error);

            setTransferingNftList(transferingNftList.map((item) => {
                if (item.contractAddress === contractAddress && item.tokenId === tokenId) {
                    return {
                        ...item,
                        transferring: false,
                    };
                }
            }));

            if (error instanceof Error) {
                alert('Failed to transfer NFT:' + error.message);
            } else {
                alert('Failed to transfer NFT: unknown error');
            }
        }



    }



    // userTransferHistory
    // /api/transferNoahNft/getAllTransferByWalletAddress
    const [userTransferHistory, setUserTransferHistory] = useState([] as any[]);
    const [loadingUserTransferHistory, setLoadingUserTransferHistory] = useState(false);
    useEffect(() => {
        
        const getUserTransferHistory = async () => {

            if (!address) {
                return;
            }

            setLoadingUserTransferHistory(true);

            try {

                const response = await fetch("/api/nftNoah/getAllTransferByWalletAddress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                        tokenId: tokenId,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();

                    ///console.log("data", data);

                    if (data.transfers) {
                        setUserTransferHistory(data.transfers);
                    } else {
                        setUserTransferHistory([]);
                    }

                } else {
                    setUserTransferHistory([]);
                }

            } catch (error) {
                console.error("getUserTransferHistory error", error);
            }

            setLoadingUserTransferHistory(false);

        };

        if (address) {
            getUserTransferHistory();
        }

    } , [address, tokenId]);


    //console.log("userTransferHistory", userTransferHistory);



    /*
    {
    "sendOrReceive": "receive",
    "transferData": {
        "transactionHash": "0xb36df6f32163328db5d6d406f6d694288fcc762b2c8818ac0131e60b2b7ee6cb",
        "transactionIndex": 38,
        "fromAddress": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
        "toAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
        
    },
        "timestamp": 1738913143000,
        "_id": "67a5b57f925df6708de2dd88"
    }    
    */




    // background image

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
                        나의 NOAH-K 교환권 NFT
                    </div>
                </div>
        
                <div className="mt-5 flex flex-col items-start justify-center space-y-4">

                    
                    
                    <div className="flex justify-center mt-5">
                        {address ? (
                            <div className="flex flex-row gap-2 items-center justify-between">

                                <div className="flex flex-row gap-2 items-center justify-between
                                    bg-gray-200 bg-opacity-90
                                    p-2 rounded-lg">
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
                                    내 지갑주소: {shortenAddress(address)}
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address);
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
      

                    {address && myNfts && myNfts.length > 0 && (

                        <div className='w-full flex flex-col gap-2 items-start justify-between'>

                                {/* my NFTs */}
                                <div className='mt-10 flex flex-row gap-2 items-start justify-between'>
                         

                                    <div className='flex flex-row items-center justify-start gap-2'>
                                        <button
                                            onClick={() => {
                                                // fetch the NFTs again
                                                const getMyNFTs = async () => {

                                                    setLoadingMyNfts(true);
                                                    try {
                                                        const response = await fetch("/api/nftNoah/getNFTByWalletAddress", {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({
                                                                tokenId: tokenId,
                                                                walletAddress: address,
                                                            }),
                                                        });

                                                        if (response.ok) {
                                                            const data = await response.json();
                                                            if (data.result) {
                                                                ///setMyNfts(data.result.ownedNfts);

                                                                // exclude name is "MasgerBot"
                                                                const filteredNfts = data.result.ownedNfts.filter((nft : any) => {
                                                                    

                                                                    if (nft.name === "MasterBot") {
                                                                        return false;
                                                                    }

                                                                    return true;
                                                                });

                                                                setMyNfts(filteredNfts);

                                                            } else {
                                                                setMyNfts([]);
                                                            }
                                                        }



                                                    } catch (error) {
                                                        console.error("Error getting NFTs", error);
                                                    }

                                                    setLoadingMyNfts(false);
                                                };

                                                getMyNFTs();
                                            }}
                                            className="p-2 bg-blue-500 text-sm text-zinc-100 rounded"
                                        >
                                            새로 읽어오기
                                        </button>
                                    </div>
                                
                                </div>

                                {loadingMyNfts && (
                                    <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                        <span className='text-lg font-semibold text-green-500'>
                                            NOAH-K 교환권 NFT를 불러오는 중입니다.
                                        </span>
                                    </div>
                                )}



                                {address && myNfts.length === 0 && (
                                    <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                        <span className='text-lg font-semibold text-red-500'>
                                            NOAH-K 교환권 NFT를 보유하고 있지 않습니다.
                                        </span>
                                    </div>
                                )}


                                <div className='w-full grid grid-cols-1 xl:grid-cols-3 gap-2'>


                                    {address && myNfts?.map((nft, index) => (
                                        <div
                                            key={index}
                                            className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                                            bg-zinc-100'
                                        >

                                            <div className='w-full flex flex-row gap-2 items-center justify-between'>

                                                <button
                                                    onClick={() => {
                                                        window.open('https://opensea.io/assets/matic/' + nft.contract.address + '/' + nft.tokenId);
                                                    }}
                                                    className="flex flex-row gap-2 items-center justify-center p-2 bg-zinc-800 text-zinc-100 rounded
                                                    hover:bg-zinc-700 text-sm font-semibold"
                                                >
                                                    <Image
                                                        src="/logo-opensea.png"
                                                        alt="OpenSea"
                                                        width={30}
                                                        height={30}
                                                        className="rounded-lg"
                                                    />
                                                    <span className='text-sm font-semibold'>
                                                        OpenSea에서 보기
                                                    </span>
                                                </button>

                                                    
              


                                            </div>


                                            <div className='w-full flex flex-col gap-2 items-center justify-between'>



                                                <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                                    {/* contract address */}
                                                    <div className='text-sm font-semibold'>
                                                        계약주소: {nft?.contract?.address && nft.contract.address.substring(0, 6) + '...' + nft.contract.address.substring(nft.contract.address.length - 4)}
                                                    </div>
                                                    <div className='text-2xl font-semibold text-blue-500'>
                                                        계약번호: #{nft?.tokenId?.length > 10 ? nft.tokenId.slice(0, 10) + '...' : nft.tokenId}
                                                    </div>
                                                    <div className='text-2xl font-semibold text-green-500'>
                                                        {nft?.name}
                                                    </div>
                                                    {nft?.description && (
                                                        <div className='text-sm font-semibold'>
                                                            설명: {nft?.description}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>


                                            {/* raw: {
    tokenUri: 'ipfs://QmbNFNUVRd5bazcyD4sRQMUc7viRUFbTGbu78YBnqUhb1D/0',
    metadata: {
      image: 'ipfs://QmcCLL23zDwsEMwCTnLYmzPCEAhjn9Bp9Ckh7Wkpn4sHZi/1.png',
      external_url: '',
      animation_url: 'ipfs://QmcCLL23zDwsEMwCTnLYmzPCEAhjn9Bp9Ckh7Wkpn4sHZi/0.mp4',
      background_color: '',
      name: '100 NOAH',
      description: '',
      customImage: '',
      customAnimationUrl: ''
    },
    error: undefined
  },}
    */}
                                            {/* raw.metadata.animation_url */}
                                            {/* ipfs to https://ipfs.io/ipfs/ */}

                                            {nft?.raw?.metadata?.animation_url ? (
                                                <div className='w-full flex flex-col gap-2 items-center justify-between'>
                                                    <video
                                                        /*
                                                        src={
                                                            nft?.raw?.metadata?.animation_url.startsWith('ipfs://') ?
                                                            'https://ipfs.io/ipfs/' + nft?.raw?.metadata?.animation_url.slice(7) :
                                                            nft?.raw?.metadata?.animation_url
                                                        }
                                                        */
                                                        src="/noah10000.mp4"
                                                        autoPlay
                                                        loop
                                                        muted
                                                        controls
                                                        className="w-full rounded-lg border border-gray-300"
                                                    />
                                                </div>
                                            ) : (
                                                <Image
                                                    src={nft?.image?.originalUrl}
                                                    alt="NFT"
                                                    width={500}
                                                    height={500}
                                                    className="w-full rounded-lg border border-gray-300"
                                                />
                                            )}


                                            {/* balance */}
                                            {/* 수량 */}
                                            <div className='mt-5 w-full flex flex-col gap-2 items-end justify-between'>
                                                <span className='text-4xl font-semibold text-green-500'>
                                                    수량: {
                                                        Number(nft?.balance).toLocaleString()
                                                    }
                                                </span>
                                            </div>

                                            {/* transfer NFT */}
                                            
                                            
                                            <div className='w-full flex flex-col gap-2 items-end justify-between'>
                                                
                                                <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                                    <span className='text-sm text-red-500 font-semibold'>
                                                        소유권 이전하기
                                                    </span>
                                                    <div className='flex flex-row items-center justify-start gap-2'>
                                                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                                        <span className='text-xs text-gray-800'>
                                                            소유권을 이전하면 소유자 권리를 모두 이전하는 것에 동의하는 것입니다.
                                                        </span>
                                                    </div>
                                                </div>
                                        
                                                
                                                <input
                                                    className="p-2 w-full text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                    placeholder="받는 사람 지갑주소"
                                                    type='text'

                                                    value={toAddressList.find((item) =>
                                                        item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                    )?.to}

                                                    onChange={(e) => {
                                                        setToAddressList(toAddressList.map((item) => {

                                                            if (item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId) {
                                                                return {
                                                                    ...item,
                                                                    to: e.target.value,
                                                                };
                                                            } else {
                                                                return item;
                                                            }
                                                        }));
                                                    }}
                                                />
                                                {/* 수량 */}

                                                <div className="flex flex-row gap-2 items-center justify-between">
                                                    
                                                    <input
                                                        className=" w-48 flex p-2 text-zinc-100 bg-zinc-800 rounded text-2xl font-semibold text-center"
                                                        placeholder="수량"
                                                        type='number'

                                                        value={sendAmountList.find((item) =>
                                                            item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                        )?.amount}

                                                        onChange={(e) => {

                                                            setSendAmountList(sendAmountList.map((item) => {

                                                                if (item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId) {
                                                                    return {
                                                                        ...item,
                                                                        amount: e.target.value,
                                                                    };
                                                                } else {
                                                                    return item;
                                                                }
                                                            }));
                                                        }}
                                                    />


                                                    <button
                                                        
                                                        disabled={transferingNftList.find((item) => 
                                                            item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                        )?.transferring}

                                                        onClick={() => {
                                                            transferNft(nft.contract.address, nft.tokenId);
                                                        }}
                                                        className={`
                                                            
                                                            flex p-2 bg-blue-500 text-zinc-100 rounded
                                                        ${transferingNftList.find((item) => 
                                                            item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                        )?.transferring ? 'opacity-50' : ''}
                                                        `}
                                                    >
                                                        <div className='flex flex-row gap-2 items-center justify-between'>
                                                            {transferingNftList.find((item) =>
                                                                item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                            )?.transferring && (

                                                                <Image
                                                                    src="/loading.png"
                                                                    alt="Send"
                                                                    width={25}
                                                                    height={25}
                                                                    className="animate-spin"
                                                                />
                                                            )}
                                                            <span className='text-lg font-semibold'>
                                                                {transferingNftList.find((item) =>
                                                                    item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                                )?.transferring ? '전송중...' : '전송하기'}
                                                            </span>
                                                        </div>

                                                    </button>

                                                </div>

                                    
                                            </div>

                                        </div>


                                    ))}
                                </div>


                        </div>


                    )}



                    {/* userTransferHistory */}
                    {address && loadingUserTransferHistory && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-green-500'>
                                전송 기록을 불러오는 중입니다.
                            </span>
                        </div>
                    )}

                    {address && userTransferHistory && userTransferHistory.length > 0 && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between'>

                            <div className='w-full flex flex-row gap-2 items-center justify-start'>
                                {/* dot */}
                                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                {/* title */}
                                <span className='text-sm font-semibold text-green-500'>
                                    전송 기록
                                </span>
                            </div>

                            <div className='w-full grid grid-cols-1 xl:grid-cols-3 gap-2'>

                                {userTransferHistory.map((transfer, index) => (
                                    <div
                                        key={index}
                                        className={`w-full flex flex-col gap-2 items-start justify-between
                                            ${transfer.sendOrReceive === 'send' ? 'bg-red-100' : 'bg-green-100'}
                                            border border-gray-300 p-4 rounded-lg`}
                                    >

                                        <div className='w-full flex flex-row gap-2 items-center justify-between'>
                                            <div className='text-sm font-semibold'>
                                                {
                                                    transfer.sendOrReceive === 'send' ? (
                                                        <div className="flex flex-row gap-2 items-center justify-start">
                                                            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                                            <span className='text-red-500 text-sm font-semibold'>
                                                                보내기
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-row gap-2 items-center justify-start">
                                                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                                            <span className='text-green-500 text-sm font-semibold'>
                                                                받기
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className='text-sm font-semibold'>
                                                {
                                                    //transfer.transferData.timestamp
                                                    //new Date(transfer.transferData.timestamp).toLocaleString()
                                                    // 방금, 1분전, 1시간전, 1일전, 1주전, 1달전, 1년전

                                                    (new Date().getTime() - transfer.transferData.timestamp) < 60000 ? '방금' :
                                                    (new Date().getTime() - transfer.transferData.timestamp) < 3600000 ? Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 60000) + '분 전' :
                                                    (new Date().getTime() - transfer.transferData.timestamp) < 86400000 ? Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 3600000) + '시간 전' :
                                                    (new Date().getTime() - transfer.transferData.timestamp) < 604800000 ? Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 86400000) + '일 전' :
                                                    (new Date().getTime() - transfer.transferData.timestamp) < 2592000000 ? Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 604800000) + '주 전' :
                                                    (new Date().getTime() - transfer.transferData.timestamp) < 31536000000 ? Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 2592000000) + '달 전' :
                                                    Math.floor((new Date().getTime() - transfer.transferData.timestamp) / 31536000000) + '년 전'
                                                    
                                                }
                                            </div>
                                        </div>

                                        {transfer.sendOrReceive === 'send' && (
                                            <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                                <div className='text-sm font-semibold'>
                                                    받은사람: {transfer.transferData.toAddress.slice(0, 6) + '...' + transfer.transferData.toAddress.slice(transfer.transferData.toAddress.length - 4)}
                                                </div>
                                            </div>
                                        )}

                                        {transfer.sendOrReceive === 'receive' && (
                                            <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                                <div className='text-sm font-semibold'>
                                                    보낸사람: {transfer.transferData.fromAddress.slice(0, 6) + '...' + transfer.transferData.fromAddress.slice(transfer.transferData.fromAddress.length - 4)}
                                                </div>
                                            </div>
                                        )}
                                        {/* amount */}
                                        {/* 수량 */}
                                        <div className='w-full flex flex-col gap-2 items-end justify-between'>
                                            <span className='text-4xl font-semibold text-green-500'>
                                                {
                                                    //transfer.transferData.amount.toLocaleString()
                                                    transfer.transferData?.amount
                                                    ? Number(transfer.transferData.amount).toLocaleString()
                                                    : 0
                                                }
                                            </span>
                                        </div>


                                    </div>
                                ))}

                            </div>

                        </div>
                    )}     



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