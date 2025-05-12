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
} from "../constants";

import {
    useRouter,
    useSearchParams,
} from "next//navigation";


const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon


function AgentPage() {

    const searchParams = useSearchParams();

    const center = searchParams.get('center');

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



    

    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);



    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;


    const [isAgent, setIsAgent] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [erc721ContractAddress, setErc721ContractAddress] = useState("0x2B5f93B4384ebdded630Cf5f0b825b7d58Cf76Bd");

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
                ////setErc721ContractAddress(data.result.erc721ContractAddress);

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
        if (confirm("NFT 계약주소를 생성하시겠습니까?")) {

            setLoadingDeployErc721Contract(true);


            try {

                /*
                const contractAddress = await deployERC721Contract({
                        chain,
                        client,
                        account,
                        type: "DropERC721",
                        params: {
                        name: "MyNFT",
                        description: "My NFT contract",
                        symbol: "NFT",
                        });
                                        */


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
                
                ///toast.success('NFT 계약주소 생성 완료');

            } catch (error) {
                console.error("deployErc721Contract error", error);

                if (error instanceof Error) {
                    alert('NFT 계약주소 생성 실패.' + error.message);
                } else {
                    alert('NFT 계약주소 생성 실패: 알 수 없는 오류');
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
   , [ address ]);

   
    const [agentName, setAgentName] = useState("");
    const [agentDescription, setAgentDescription] = useState("");


    const [agentImage, setAgentImage] = useState("");
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
            //toast.error('NFT 계약주소를 먼저 생성해주세요');
            setMessageMintingAgentNft('NFT 계약주소를 먼저 생성해주세요');
            return;
        }

        /*
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
        */

        if (
            confirm("추천코드 NFT를 발행하시겠습니까?") === false
        ) {
            return;
        }


        setMessageMintingAgentNft('NFT 발행중입니다');


        setMintingAgentNft(true);

        try {


            setGeneratingAgentImage(true);


            setMessageMintingAgentNft('NFT 이미지 생성중입니다');

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


            setMessageMintingAgentNft('NFT 발행중입니다');


            /*
            const contract = getContract({
                client,
                chain: polygon,
                address: erc721ContractAddress,

              });

            
            //const nftName = "Affiliate AI Agent";
            // nftName is random number and lower character mixed, length is 10 characters
            // nftName is 10 characters

            const nftName = Math.random().toString(36).substring(2, 12);

            //const nftName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);


            const nftDesscription = "This is Affiliate AI Agent";
            const transaction = mintTo({
                contract: contract,
                to: address as string,
                nft: {
                    name: nftName,
                    description: nftDesscription,

                    ////image: agentImage,
                    image: imageUrl,

                },
            });
            

            
            //const transaction = mintTo({
            //    contract: contract,
            //    to: address as string,
            //    nft: {
            //        name: agentName,
            //        description: agentDescription,

                    ////image: agentImage,
            //        image: imageUrl,

            //    },
            //});
            

            //await sendTransaction({ transaction, account: activeAccount as any });



            //setActiveAccount(smartConnectWallet);

            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,

                ///////account: smartConnectWallet as any,
            });

            */


            // api call

            const nftName = Math.random().toString(36).substring(2, 12);

            const nftDesscription = "This is Affiliate AI Agent";


            const response = await fetch("/api/affiliation/mintAgentNft", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    erc721ContractAddress: erc721ContractAddress,
                    name: nftName,
                    description: nftDesscription,
                    image: imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to mint NFT');
            }

            const data = await response.json();

            const transactionHash = data.result;


            console.log("transactionHash", transactionHash);


            if (!transactionHash) {
                throw new Error('NFT 발행 실패. 관리자에게 문의해주세요');
            }

            setMessageMintingAgentNft('NFT 발행 완료');


            // fetch the NFTs again
            const responseNft = await fetch("/api/agent/getAgentNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    //erc721ContractAddress: erc721ContractAddress,
                }),
            });

            if (responseNft.ok) {
                const data = await responseNft.json();
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
                setMessageMintingAgentNft('NFT 발행 실패:' + error.message);
            } else {
                setMessageMintingAgentNft('NFT 발행 실패: 알 수 없는 오류');
            }
        }

        setMintingAgentNft(false);

        setAgentImage("");

    }




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

            const transaction = transferFrom({
                contract: contract,
                from: address as string,
                to: to,
                tokenId: BigInt(tokenId),
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
            const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
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
                if (data.result) {
                    
                    //setMyNfts(data.result.ownedNfts);
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

                {/* sticky header */}
                <div className="sticky top-0 z-50
                    bg-zinc-800 bg-opacity-90
                    backdrop-blur-md
                    p-4 rounded-lg
                    w-full flex flex-row items-center justify-between">

                    {/* title */}
                    <div className="text-2xl font-semibold text-zinc-100">
                        추천코드 관리
                    </div>
                </div>
        
                <div className="mt-5 flex flex-col items-start justify-center space-y-4">

                    
                    
                    <div className="flex justify-center mt-5">
                        {address ? (
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



                    <div className='w-full  flex flex-col gap-5 '>

                        {/* profile picture */}
      

                        {address && userCode && (
                            <div className='flex flex-row gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>


                                <div className="flex flex-row gap-2 items-center justify-between">
                                    {/* dot */}
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className='text-lg font-semibold'>
                                        회원아이디
                                    </span>
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {nickname}
                                </div>

                                {isCenterOwner && (
                                    <div className="p-2 bg-green-500 rounded text-zinc-100 text-xl font-semibold">
                                        센터장
                                    </div>
                                )}

                                <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                />


                                
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
                                추천코드 발행
                            </div>
                            <span className='text-lg font-semibold'>
                                추천코드를 발행받을려면 센터장에게 문의하세요.
                            </span>
                        </div>
                    )}
                    */}


                    {/* if centerOwner show message */}
                    {/* AI 에이전트 계약주소 생성하기 */}
                    {
                        ////address && userCode && !erc721ContractAddress && isCenterOwner && (

                        address && userCode && !erc721ContractAddress && (

                    <>

    
                        <button
                            disabled={loadingDeployErc721Contract}
                            onClick={deployErc721Contract}
                            className={`
                                ${loadingDeployErc721Contract ? 'bg-gray-300 text-gray-400' : 'bg-green-500 text-zinc-100'}
                                p-2 rounded-lg text-sm font-semibold
                            `}
                        >
                            <div className='flex flex-row gap-2 items-center justify-center'>
                                {/* rotating icon */}
                                {address && loadingDeployErc721Contract && (
                                    <Image
                                        src="/loading.png"
                                        alt="loding"
                                        width={30}
                                        height={30}
                                        className='animate-spin'
                                    />
                                )}
                                {address && loadingDeployErc721Contract && 'NFT 계약주소 생성중...'}
                                {address && !erc721ContractAddress && !loadingDeployErc721Contract && 'NFT 계약주소 생성하기'}

                            </div>

                        </button>


                    </>
                    )}

                    {/* My Referral Code */}
                    {/* address */}
                    {
                        //address && userCode && erc721ContractAddress && isCenterOwner && (

                        address && userCode && erc721ContractAddress && (


                        <div className='w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>

                            <div className='w-full flex flex-row gap-2 items-center justify-between'>

                                <div className="flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className='text-lg font-semibold'>
                                        NFT 계약주소
                                    </span>
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

                            
                            
                            <div className='w-full flex flex-col gap-2 items-start justify-between'>

                                {/*
                                <div className="flex flex-row items-center justify-start gap-5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm xl:text-lg font-semibold">
                                        추천코드로 회원가입을 유치하면 가입보상으로 1 USDT를 받습니다.
                                    </span>
                                </div>
                                <div className="flex flex-row items-center justify-start gap-5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm xl:text-lg font-semibold">
                                        가입한 회원의 채굴보상에서 28%를 채굴보상으로 받습니다.
                                    </span>
                                </div>
                                */}
                                <div className="flex flex-row items-center justify-start gap-5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm xl:text-lg font-semibold">
                                        NFT 소유권을 이전하면 이전한 이후부터 채굴보상은 이전 받은 소유자에게 지급됩니다.
                                    </span>
                                </div>

                            </div>
                            




                            {/* mint AI Agent NFT */}
                            <div className='w-full flex flex-col gap-2 items-start justify-between
                                bg-yellow-100 border border-gray-300
                                p-4 rounded-lg'>
                                

                                <div className="flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className='text-lg font-semibold'>
                                        추천코드 발행
                                    </span>
                                </div>

                                {/*
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
                                */}

                                <button
                                    disabled={mintingAgentNft}
                                    onClick={

    
                                        mintAgentNft

                                    }
                                    className={`
                                        ${mintingAgentNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                        p-2 rounded-sm text-sm font-semibold
                                    `}
                                >
                                    <div className='flex flex-row gap-2 items-center justify-center'>
                                        {/* rotating icon */}
                                        {mintingAgentNft && (
                                            <Image
                                                src="/loading.png"
                                                alt="loding"
                                                width={30}
                                                height={30}
                                                className='animate-spin'
                                            />
                                        )}
                                        {mintingAgentNft && 'NFT 발행중...'}
                                        {!mintingAgentNft && 'NFT 발행하기'}
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
                                            NFT 이미지 생성중...
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


                        </div>

                    )}



                        

                    {address && myNfts && myNfts.length > 0 && (

                        <div className='w-full flex flex-col gap-2 items-start justify-between'>

                                {/* my NFTs */}
                                <div className='mt-10 w-full flex flex-row gap-2 items-start justify-between'>

                                    <div className='flex flex-row items-center justify-start gap-2'>
                                        {/* dot */}
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-lg font-semibold">
                                            추천코드
                                        </span>
                                    </div>

                                    <div className='flex flex-row items-center justify-start gap-2'>
                                        <button
                                            onClick={() => {
                                                // fetch the NFTs again
                                                const getMyNFTs = async () => {

                                                    setLoadingMyNfts(true);
                                                    try {
                                                        const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
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
                                            새로고침
                                        </button>
                                    </div>
                                
                                </div>

                                {loadingMyNfts && (
                                    <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                        <span className='text-lg font-semibold text-green-500'>
                                            NFT를 불러오는 중입니다.
                                        </span>
                                    </div>
                                )}



                                {address && myNfts.length === 0 && (
                                    <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                        <span className='text-lg font-semibold text-red-500'>
                                            NFT가 없습니다.
                                        </span>
                                    </div>
                                )}


                                <div className='w-full grid grid-cols-1 xl:grid-cols-3 gap-2'>


                                    {address && myNfts?.map((nft, index) => (
                                        <div
                                            key={index}
                                            className='w-full flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg
                                            bg-gray-800 bg-opacity-90'
                                        >

                                            <div className="w-full flex flex-row items-start justify-between gap-2">
                                            
                                                <button
                                                    onClick={() => {
                                                        window.open('https://opensea.io/assets/matic/' + nft.contract.address + '/' + nft.tokenId);
                                                    }}
                                                    className="p-2 bg-blue-500 text-zinc-100 rounded
                                                    hover:bg-blue-600
                                                    " 
                                                >
                                                    <Image
                                                        src="/logo-opensea.png"
                                                        alt="OpenSea"
                                                        width={30}
                                                        height={30}
                                                        className="rounded-lg"
                                                    />
                                                </button>


                                                <button
                                                    onClick={() => {
                                                        router.push('/affiliation/' + nft.contract.address + '/' + nft.tokenId);
                                                    }}
                                                    className="p-2 bg-blue-500 text-zinc-100 rounded
                                                    hover:bg-blue-600 text-lg font-semibold"
                                                >
                                                        상세보기
                                                </button>


                                                {/* referral link button */}
                                                
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            /*
                                                            referralUrl + '/?center=' + center +
                                                            '&agent=' + nft.contract.address + 
                                                            '&tokenId=' + nft.tokenId
                                                            */
                                                            //'t.me/ppump_orry_bot?start=' + nft.contract.address + '_' + nft.tokenId

                                                            't.me/' + userCenter + '?start=' + nft.contract.address + '_' + nft.tokenId
                                                        );
                                                        //toast.success('추천코드 URL 복사 완료');
                                                        alert('추천코드 복사되었습니다.');
                                                    }}
                                                    className="p-2 bg-blue-500 text-zinc-100 rounded
                                                    hover:bg-blue-600 text-lg font-semibold"
                                                >
                                                    추천코드 복사하기
                                                </button>

                                            </div>
   


                                            <div className='mt-5 w-full flex flex-row gap-2 items-start justify-between'>
                                                
                                                
                                                <div className="w-28 flex flex-row gap-2 items-center justify-start">
                                                    <Image
                                                        src={nft?.image?.originalUrl}
                                                        alt="NFT"
                                                        width={500}
                                                        height={500}
                                                        className="rounded-lg"
                                                    />
                                                </div>

                                                <div className='flex flex-col gap-2 items-start justify-between'>
                                                    {/* contract address */}
                                                    <div className='text-sm font-semibold text-yellow-500'>
                                                        계약주소: {nft?.contract?.address && nft.contract.address.substring(0, 6) + '...' + nft.contract.address.substring(nft.contract.address.length - 4)}
                                                    </div>
                                                    <div className='text-xl font-semibold text-yellow-500'>
                                                        계약번호: #{nft?.tokenId?.length > 10 ? nft.tokenId.slice(0, 10) + '...' : nft.tokenId}
                                                    </div>
                                                    <div className='text-lg font-semibold text-green-500'>
                                                        이름: {nft?.name}
                                                    </div>
                                                    {/*
                                                    <div className='text-xs font-semibold text-green-500'>
                                                        설명: {nft?.description}
                                                    </div>
                                                    */}

                                                </div>

                                            </div>

                                            {/* transfer NFT */}
                                            
                                            <div className='mt-5 w-full flex flex-col gap-2 items-end justify-between'>
                                                
                                                <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                                    <span className='text-sm text-red-500 font-semibold'>
                                                        소유권 이전하기
                                                    </span>
                                                    <div className='flex flex-row items-center justify-start gap-2'>
                                                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                                        <span className='text-sm text-gray-400 font-semibold'>
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
                                                <button
                                                    
                                                    disabled={transferingNftList.find((item) => 
                                                        item?.contractAddress === nft.contract.address && item.tokenId === nft.tokenId
                                                    )?.transferring}

                                                    onClick={() => {
                                                        transferNft(nft.contract.address, nft.tokenId);
                                                    }}
                                                    className={`p-2 bg-blue-500 text-zinc-100 rounded
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
                                                            NFT 전송하기
                                                        </span>
                                                    </div>

                                                </button>

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