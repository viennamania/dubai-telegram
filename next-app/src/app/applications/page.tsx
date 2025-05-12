'use client';
import React, { useEffect, useState, Suspense } from "react";


import { toast } from 'react-hot-toast';


import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
    polygon,
    arbitrum,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,
    useConnectModal,
    AutoConnect,
} from "thirdweb/react";

import {
	client,
    wallet,
} from "../constants";

import Image from 'next/image';

//import GearSetupIcon from "@/components/gearSetupIcon";

//import Uploader from '@/components/uploader';
//import { add } from 'thirdweb/extensions/farcaster/keyGateway';




import {
    useRouter,
    useSearchParams
  }from "next//navigation";



const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon



function ApplicationsPage({ params }: any) {


    // get params from the URL

    const searchParams = useSearchParams();

    const center = searchParams.get('center');




    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });
    

    


    const router = useRouter();


    const account = useActiveAccount();

    const address = account?.address;
  
    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  


    const [balance, setBalance] = useState(0);

    useEffect(() => {
  
      if (!address) return;
      // get the balance
  
  
      if (!contract) {
        return;
      }
  
      const getBalance = async () => {
  
        try {
          const result = await balanceOf({
            contract,
            address: address,
          });
      
          //console.log(result);
      
          setBalance( Number(result) / 10 ** 18 );
  
        } catch (error) {
          console.error("Error getting balance", error);
        }
  
      };
  
      if (address) getBalance();
  
      // get the balance in the interval
      /*
      const interval = setInterval(() => {
        getBalance();
      }, 1000);
  
  
      return () => clearInterval(interval);
        */
  
    } , [address, contract]);



    


    
    const [nickname, setNickname] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [userCode, setUserCode] = useState("");

 

    const [userMasterBotContractAddress, setUserMasterBotContractAddress] = useState("");



    ///console.log("address", address);

    useEffect(() => {
        const fetchData = async () => {

            if (!address) {
                return;
            }

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
                setUserCode(data.result.id);
                setUserMasterBotContractAddress(data.result.masterBotContractAddress);

            }
        };

        fetchData();
    }, [address]);



    const [agentBotSummaryList, setAgentBotSummaryList] = useState([] as any[]);



    const [totalTradingAccountBalance, setTotalTradingAccountBalance] = useState(0);

    // get all applications
    const [isAdmin, setIsAdmin] = useState(false);

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
                    center: center,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching agents");
                setLoadingApplications(false);
                return;
            }

            const data = await response.json();

            console.log("getApplicationsForCenter data", data);
            //setAgentBotSummaryList(data.resultSummany);


            setApplications(data.result.applications);

            setTotalTradingAccountBalance( data.result.totalTradingAccountBalance );

            setLoadingApplications(false);

            setIsAdmin(true);

        };

        if (address && center) {
            fetchData();
        }
    }, [address, center]);






    const [myAgent, setMyAgent] = useState({} as any);
    useEffect(() => {
        const fetchData = async () => {
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
                return;
            }

            const data = await response.json();

            //console.log("data", data);

            setMyAgent(data.result);

        };
        fetchData();
    } , [address]);




    // get agentBot NFT for application
    const [checkingAgentBotNftList, setCheckingAgentBotNftList] = useState([] as any[]);
    const [agentBotNftList, setAgentBotNftList] = useState([] as any[]);

    useEffect(() => {
        setCheckingAgentBotNftList(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    checking: false,
                }
            })
        );

        setAgentBotNftList(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    agentBotNft: item.agentBotNft,
                };
            })
        );
    } , [applications]);

    const checkAgentBotNft = async (
        applicationId: number,
        agentBot: string,
        agentBotNumber: number,
    ) => {

        if (!agentBot) {
            toast.error("Agent Bot을 선택해 주세요.");
            return;
        }

        /*
        if (!agentBotNumber) {
            toast.error("Agent Bot Number를 입력해 주세요.");
            return;
        }
        */

        if (!applicationId) {
            toast.error("신청 ID를 입력해 주세요.");
            return;
        }

        setCheckingAgentBotNftList(
            checkingAgentBotNftList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: true,
                    }
                } else {
                    return item;
                }
            }
        ));
        

        // updateApplicationAgentBotNft
        const response = await fetch("/api/agent/updateApplicationAgentBotNft", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicationId: applicationId,

                agentBot: agentBot,
                agentBotNumber: agentBotNumber,

                //agentBotNft: nft721?.metadata
            }),
        });

        if (!response.ok) {
            console.error("Error updating agent bot NFT");
            return;
        }

        const data = await response.json();

        ///console.log("data", data);

        setAgentBotNftList(
            agentBotNftList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        agentBotNft: data.result,
                    }
                } else {
                    return item;
                }
            })
        );





        setCheckingAgentBotNftList(
            checkingAgentBotNftList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: false,
                    }
                } else {
                    return item;
                }
            }
        ));

    };



    // check api access key and secret key for each application
    const [checkingApiAccessKeyList, setCheckingApiAccessKeyList] = useState([] as any[]);
    const [apiAccessKeyList, setApiAccessKeyList] = useState([] as any[]);

    useEffect(() => {
        setCheckingApiAccessKeyList(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    checking: false,
                }
            })
        );

        setApiAccessKeyList(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    apiAccessKey: item.apiAccessKey,
                    apiSecretKey: item.apiSecretKey,
                    apiPassword: item.apiPassword,
                };
            })
        );
    }

    , [applications]);


    const checkApiAccessKey = async (
        applicationId: number,
        apiAccessKey: string,
        apiSecretKey: string,
        apiPassword: string,
    ) => {

        if (!apiAccessKey) {
            toast.error("API Access Key를 입력해 주세요.");
            return;
        }

        if (!apiSecretKey) {
            toast.error("API Secret Key를 입력해 주세요.");
            return;
        }

        if (!apiPassword) {
            toast.error("API Password를 입력해 주세요.");
            return;
        }

        if (!applicationId) {
            toast.error("신청 ID를 입력해 주세요.");
            return;
        }

        setCheckingApiAccessKeyList(
            checkingApiAccessKeyList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: true,
                    }
                } else {
                    return item;
                }
            }
        ));


       // api updateUID
       const response = await fetch("/api/okx/updateUID", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicationId: applicationId,
                apiAccessKey: apiAccessKey,
                apiSecretKey: apiSecretKey,
                apiPassword: apiPassword,

            }),
        });

        if (!response.ok) {
            console.error("Error checking api access key");
            return;
        }

        const data = await response.json();

        //console.log("updateHtxUID data", data);

        if (data.result?.status === "ok") {

            if (data.result?.okxUid === "0") {
                toast.error("API Access Key를 확인할 수 없습니다.");
            } else {

                toast.success("API Access Key가 확인되었습니다.");
            }

            //console.log("data.result", data.result);

            // update application
            setApplications(
                applications.map((item) => {
                    if (item.id === applicationId) {
                        return {
                            ...item,
                            okxUid: data.result?.okxUid,
                            accountConfig: data.result?.accountConfig,
                        }
                    } else {
                        return item;
                    }
                })
            );

        } else {
            toast.error("API Access Key를 확인할 수 없습니다.");
        }
        

        setCheckingApiAccessKeyList(
            checkingApiAccessKeyList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: false,
                    }
                } else {
                    return item;
                }
            }
        ));


    }



















    // check tradingAccountBalance for each application
    const [checkingTradingAccountBalanceList, setCheckingTradingAccountBalanceList] = useState([] as any[]);
    const [tradingAccountBalanceList, setTradingAccountBalanceList] = useState([] as any[]);

    useEffect(() => {
        setCheckingTradingAccountBalanceList(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    checking: false,
                }
            })
        );

        setTradingAccountBalanceList(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    tradingAccountBalance: item.tradingAccountBalance,
                };
            })
        );
    } , [applications]);

    const checkTradingAccountBalance = async (
        applicationId: number,
        apiAccessKey: string,
        apiSecretKey: string,
        apiPassword: string,
    ) => {

        if (!apiAccessKey) {
            toast.error("API Access Key를 입력해 주세요.");
            return;
        }

        if (!apiSecretKey) {
            toast.error("API Secret Key를 입력해 주세요.");
            return;
        }

        if (!apiPassword) {
            toast.error("API Password를 입력해 주세요.");
            return;
        }

        if (!applicationId) {
            toast.error("신청 ID를 입력해 주세요.");
            return;
        }

        setCheckingTradingAccountBalanceList(
            checkingTradingAccountBalanceList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: true,
                    }
                } else {
                    return item;
                }
            }
        ));

        const response = await fetch("/api/okx/getTradingAccountBalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiAccessKey: apiAccessKey,
                apiSecretKey: apiSecretKey,
                apiPassword: apiPassword,
                applicationId: applicationId,
            }),
        });

        const data = await response.json();

        //console.log("data.result", data.result);

        if (data.result?.status === "ok") {

            setTradingAccountBalanceList(
                tradingAccountBalanceList.map((item) => {
                    if (item.applicationId === applicationId) {
                        return {
                            applicationId: applicationId,
                            tradingAccountBalance: data.result?.tradingAccountBalance,
                        }
                    } else {
                        return item;
                    }
                })
            );

            toast.success("거래 계정 잔고가 확인되었습니다.");
        } else {
            toast.error("거래 계정 잔고를 확인할 수 없습니다.");
        }

        setCheckingTradingAccountBalanceList(
            checkingTradingAccountBalanceList.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: false,
                    }
                } else {
                    return item;
                }
            }
        ));

    };












    // check htx asset valuation for each htxUid
    const [checkingHtxAssetValuationForAgent, setCheckingHtxAssetValuationForAgent] = useState([] as any[]);
    const [htxAssetValuationForAgent, setHtxAssetValuationForAgent] = useState([] as any[]);

    useEffect(() => {
        setCheckingHtxAssetValuationForAgent(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    checking: false,
                }
            })
        );

        setHtxAssetValuationForAgent(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    assetValuation: item.assetValuation,
                };
            })
        );
    } , [applications]);

    const checkOkxAssetValuation = async (
        applicationId: number,
        okxAccessKey: string,
        okxSecretKey: string,
        okxPassword: string,
    ) => {

        if (!okxAccessKey) {
            toast.error("OKXAccess Key를 입력해 주세요.");
            return;
        }

        if (!okxSecretKey) {
            toast.error("OKXSecret Key를 입력해 주세요.");
            return;
        }

        if (!okxPassword) {
            toast.error("OKXPassword를 입력해 주세요.");
            return;
        }

        if (!applicationId) {
            toast.error("신청 ID를 입력해 주세요.");
            return;
        }

        setCheckingHtxAssetValuationForAgent(
            checkingHtxAssetValuationForAgent.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: true,
                    }
                } else {
                    return item;
                }
            }
        ));


        const response = await fetch("/api/okx/getAssetValuation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiAccessKey: okxAccessKey,
                apiSecretKey: okxSecretKey,
                apiPassword: okxPassword,
                applicationId: applicationId,
            }),
        });

        const data = await response.json();

        

        ///console.log("getAssetValuation data.result", data.result);


        if (data.result?.status === "ok") {

            setHtxAssetValuationForAgent(
                htxAssetValuationForAgent.map((item) => {
                    if (item.applicationId === applicationId) {
                        return {
                            applicationId: applicationId,
                            assetValuation: data.result?.assetValuation,
                        }
                    } else {
                        return item;
                    }
                })
            );

            toast.success("OKX자산 가치가 확인되었습니다.");
        } else {
            toast.error("OKX자산 가치를 확인할 수 없습니다.");
        }

        setCheckingHtxAssetValuationForAgent(
            checkingHtxAssetValuationForAgent.map((item) => {
                if (item.applicationId === applicationId) {
                    return {
                        applicationId: applicationId,
                        checking: false,
                    }
                } else {
                    return item;
                }
            }
        ));

    };










    // check account balance for each accountId

    //const [accountBalanceList, setAccountBalanceList] = useState([] as any[]);

    const [accountBalanceListForAgent, setAccountBalanceListForAgent] = useState([] as any[]);

    //const [checkingAccountBalance, setCheckingAccountBalance] = useState(false);


    const [checkingAccountBalanceForAgent, setCheckingAccountBalanceForAgent] = useState([] as any[]);


    const checkAccountBalance = async (
        htxAccessKey: string,
        htxSecretKey: string,
        accountId: string,
    ) => {

        if (htxAccessKey === "") {
            toast.error("OKX Access Key를 입력해 주세요.");
            return;
        }

        if (htxSecretKey === "") {
            toast.error("OKX Secret Key를 입력해 주세요.");
            return;
        }

        setCheckingAccountBalanceForAgent(
            checkingAccountBalanceForAgent.map((item) => {
                if (item.accountId === accountId) {
                    return true;
                } else {
                    return item;
                }
            })
        );


        const response = await fetch("/api/agent/getBalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                htxAccessKey: htxAccessKey,
                htxSecretKey: htxSecretKey,
                accountId: accountId,
                currency: "usdt",
            }),
        });

        const data = await response.json();

        ///console.log("data.result", data.result);

        if (data.result?.status === "ok") {
            
            ///{ currency: 'usdt', balance: '0.00117522' }, { currency: 'htx', balance: '0.00000000' }

            setAccountBalanceListForAgent(
                accountBalanceListForAgent.map((item) => {
                    if (item.accountId === accountId) {
                        return data.result?.data;
                    } else {
                        return item;
                    }
                })
            );



            toast.success("OKX 계정 잔고가 확인되었습니다.");
        } else {
            toast.error("OKX 계정 잔고를 확인할 수 없습니다.");
        }

        setCheckingAccountBalanceForAgent(
            checkingAccountBalanceForAgent.map((item) => {
                if (item.accountId === accountId) {
                    return false;
                } else {
                    return item;
                }
            })
        );

    };






    // check user info from wallet address
    const [checkingUserInfoList, setCheckingUserInfoList] = useState([] as any[]);
    const [userInfoList, setUserInfoList] = useState([] as any[]);
    useEffect(() => {
        setCheckingUserInfoList(
            applications.map((item) => {
                return {
                    walletAddress: item.walletAddress,
                    checking: false,
                }
            })
        );

        setUserInfoList(
            applications.map((item) => {
                return {
                    walletAddress: item.walletAddress,
                    bankName: "",
                    bankAccount: "",
                    userHolder: "",
                };
            })
        );
    } , [applications]);




  
    // queryUnifiedAccountAssets
    const [checkingUnifiedAccountAssets, setCheckingUnifiedAccountAssets] = useState([] as any[]);
    const [unifiedAccountAssets, setUnifiedAccountAssets] = useState([] as any[]);
    useEffect(() => {
        setCheckingUnifiedAccountAssets(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    checking: false,
                }
            })
        );

        setUnifiedAccountAssets(
            applications.map((item) => {
                return {
                    applicationId: item.id,
                    assets: [],
                };
            })
        );
    } , [applications]);




    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">


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


                <div className="flex flex-col items-start justify-center space-y-4">




 
                    {/* applications table */}

                        <div className='mt-10 w-full flex flex-col gap-5'>



                            {/* center */}
                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                {/* 'https://t.me/' */}
                                <button
                                    onClick={() => {
                                        window.open('https://t.me/' + center, '_blank');
                                    }}
                                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    <div className='flex flex-row items-center gap-2'>
                                        <Image
                                            src="/logo-telegram.webp"
                                            alt="Telegram"
                                            width={30}
                                            height={30}
                                            className='rounded-lg'
                                        />
                                        <span className='text-sm font-semibold'>
                                            {center}
                                        </span>
                                    </div>
                                </button>

                            </div>




                            <div className='flex flex-row items-center gap-2'>
                                
                                <Image
                                    src="/logo-exchange-okx.png"
                                    alt="OKX"
                                    width={50}
                                    height={50}
                                />
                                <span className='text-lg font-semibold text-gray-800'>
                                    OKX 신청목록
                                </span>

                                {/* reload button */}
                                <button
                                    onClick={() => {
                                        const fetchData = async () => {

                                            setLoadingApplications(true);
                                            const response = await fetch("/api/agent/getApplicationsForCenter", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    walletAddress: address,
                                                    center: center,
                                                }),
                                            });

                                            if (!response.ok) {
                                                console.error("Error fetching agents");
                                                setLoadingApplications(false);
                                                return;
                                            }

                                            const data = await response.json();

                                            const total = data.result.totalCount;

                                            setApplications(data.result.applications);

                                            setIsAdmin(true);

                                            setLoadingApplications(false);

                                        };
                                        fetchData();
                                    }}
                                    disabled={loadingApplications}
                                    className={`${loadingApplications ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                        hover:bg-blue-600
                                    `}
                                >
                                    {loadingApplications ? "Loading..." : "Reload"}
                                </button>
                            </div>


  

                            {loadingApplications && (
                                <div className='w-full flex flex-col items-center justify-center'>
                                    <Image
                                        src="/loading.png"
                                        alt="Loading"
                                        width={50}
                                        height={50}
                                        className='animate-spin'
                                    />
                                </div>
                            )}

                            <div className='w-full flex flex-col gap-5'>


                                {address && !loadingApplications && applications.length === 0 ? (
                                    <div className='w-full flex flex-col items-center justify-center gap-2'>
                                        <span className='text-lg text-gray-800'>
                                            권한이 없습니다. 관리자에게 문의하세요.
                                        </span>
                                    </div>
                                ) : (
                                    <div className='flex flex-row items-center gap-2'>
                                        <span className='text-lg text-gray-800'>
                                            총 {applications.length}개의 신청이 있습니다.
                                        </span>

                                    </div>

                                )}




                                {/* goto copy trading account */}
                                {/* https://www.okx.com/copy-trading/account/BA5BC36A6EDAB9E1 */}
                                <div className='w-full flex flex-col gap-2'>
                                    <span className='text-lg text-gray-800'>
                                        <a
                                            href="https://www.okx.com/copy-trading/account/BA5BC36A6EDAB9E1"
                                            target="_blank"
                                            className='text-blue-500'
                                        >
                                            Copy Trading Account 바로가기
                                        </a>
                                    </span>
                                </div>


                                {/* totalTradingAccountBalance */}
                                {totalTradingAccountBalance > 0 && (
                                    <div className='w-full flex flex-col gap-2'>
                                        {/* startTrading is exist count */}
                                        <div className="w-full flex flex-row items-center gap-2">
                                            <span className='text-sm text-gray-800 font-semibold'>
                                                시작된 Bot: 
                                            </span>
                                            <span className='text-2xl text-green-500 font-semibold'>
                                            {
                                                applications.filter((item) => item.accountConfig?.data.roleType === "2").length
                                            }
                                            </span>
                                        </div>

                                        {/* totalTradingAccountBalance */}
                                        <div className="w-full flex flex-row items-center gap-2">
                                            <span className='text-sm font-semibold text-gray-800'>
                                                총 거래 계정 잔고: 
                                            </span>
                                            <span className='text-2xl text-green-500 font-semibold'>
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


                                {address && agentBotSummaryList.length > 0 && (
                                    <div className='w-full flex flex-col gap-5'>

                                        <div className='flex flex-row items-center gap-2'>
                                            <span className='text-lg font-semibold text-gray-800'>
                                                Center Bot Summary
                                            </span>
                                        </div>

                                        <div className='w-full grid grid-cols-2 xl:grid-cols-5 gap-5'>

                                            {agentBotSummaryList.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className={`w-full flex flex-col gap-5
                                                    border border-gray-300 p-4 rounded-lg bg-gray-100
                                                    `}
                                                >
                                                    <div className='w-full flex flex-col items-start justify-between gap-2'>
                                                        <span className='text-sm font-semibold text-gray-800'>
                                                            {item._id}
                                                        </span>
                                                        <span className='text-sm text-gray-800'>
                                                            거래 계정 수: {item?.tradingAccountBalanceCount}개
                                                        </span>
                                                        <span className='text-sm text-gray-800'>
                                                            총 잔고: {
                                                                Number(item?.tradingAccountBalanceSum).toLocaleString('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'USD'
                                                                })
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>

                                    </div>
                                )}





                                <div className='w-full grid grid-cols-1 xl:grid-cols-3 gap-5'>

                                    {address && !loadingApplications && applications.map((application) => (
                                        <div
                                            key={application._id}
                                            className={`w-full flex flex-col gap-5
                                            border border-gray-300 p-4 rounded-lg bg-gray-100

                                            ${application?.accountConfig?.data.roleType === "2" ? "border-2 border-green-500" : ""}

                                            `}
                                        >

                                           {/* 신청번호, 신청일자 */}
                                           <div className='w-full flex flex-col items-start justify-between gap-2
                                                border-b border-gray-300 pb-2
                                            '>
                                                <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                    <span className='text-lg font-semibold text-gray-800'>
                                                        신청번호: #{application.id}
                                                    </span>

                                                    {application?.accountConfig?.data.roleType === "2" && (
                                                        <Image
                                                            src="/icon-trading-live.gif"
                                                            alt="Trading"
                                                            width={80}
                                                            height={30}
                                                        />
                                                    )}


                                                </div>
                                                {/*
                                                <span className='text-sm text-gray-800'>
                                                    신청일자: {
                                                        new Date(application.createdAt).toLocaleString()
                                                    }
                                                </span>  
                                                */}

                                                {/* time ago */}
                                                <span className='text-xs text-gray-800'>
                                                {
                                                    new Date().getTime() - new Date(application.createdAt).getTime() < 1000 * 60 ? (
                                                    ' ' + Math.floor((new Date().getTime() - new Date(application.createdAt).getTime()) / 1000) + ' ' + '초 전'
                                                    ) :
                                                    new Date().getTime() - new Date(application.createdAt).getTime() < 1000 * 60 * 60 ? (
                                                    ' ' + Math.floor((new Date().getTime() - new Date(application.createdAt).getTime()) / 1000 / 60) + ' ' + '분 전'
                                                    ) : (
                                                    ' ' + Math.floor((new Date().getTime() - new Date(application.createdAt).getTime()) / 1000 / 60 / 60) + ' ' + '시간 전'
                                                    )
                                                }
                                                </span>                                              

                                            </div>



                                            {/* agentBot and agentBotNumber */}
                                            <div className='w-full flex flex-row items-start justify-between gap-2
                                                border-b border-gray-300 pb-2
                                            '>

                                                <div className='w-full flex flex-col gap-2'>

                                                    {/* goto button for detail page */}
                                                    <button
                                                        onClick={() => {
                                                            router.push('/' + params.lang + '/' + params.chain + '/agent/' + application.agentBot + '/' + application.agentBotNumber);
                                                        }}
                                                        className="p-2 bg-blue-500 text-zinc-100 rounded
                                                        hover:bg-blue-600"
                                                    >
                                                        <span className='text-xs xl:text-sm font-semibold'>
                                                            에이전트 상세보기
                                                        </span>
                                                    </button>

                                                    <div className='mt-5 flex flex-col gap-2'>
                                                        <span className='text-xs text-yellow-800'>
                                                            AI 에이전트 계약주소
                                                        </span>
                                                        <span className='text-xs text-gray-800'>
                                                            {application.agentBot.slice(0, 6)}...{application.agentBot.slice(-4)}
                                                        </span>
                                                        <span className='text-xs text-yellow-800'>
                                                            AI 에이전트 계약번호
                                                        </span>
                                                        <span className='text-lg text-gray-800'>
                                                            #{application.agentBotNumber}
                                                        </span>
                                                    </div>

                                                </div>

                                                {!agentBotNftList.find((item) => item.applicationId === application.id)?.agentBotNft ? (
                                                    <button
                                                        onClick={() => {
                                                            checkAgentBotNft(application.id, application.agentBot, application.agentBotNumber);
                                                        }}
                                                        disabled={checkingAgentBotNftList.find((item) => item.applicationId === application.id)?.checking}
                                                        className={`${checkingAgentBotNftList.find((item) => item.applicationId === application.id)?.checking ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                                            hover:bg-blue-600
                                                        `}
                                                    >
                                                        {checkingAgentBotNftList.find((item) => item.applicationId === application.id)?.checking ? "Checking..." : "Check NFT"}
                                                    </button>
                                                ) : (
                                                    <div className='w-full h-56 flex flex-col gap-1
                                                        items-center justify-center
                                                        bg-gray-200 p-2 rounded-lg border border-gray-300
                                                    '>

                                                        {/* opensea */}
                                                        <button
                                                            onClick={() => {
                                                                window.open('https://opensea.io/assets/matic/' + application.agentBot + '/' + application.agentBotNumber);
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

                                                        <span className='text-lg text-yellow-800'>
                                                            {agentBotNftList.find((item) => item.applicationId === application.id)?.agentBotNft?.name || ""}
                                                        </span>
                                                        <span className='text-xs text-gray-800'>
                                                            {agentBotNftList.find((item) => item.applicationId === application.id)?.agentBotNft?.description || ""}
                                                        </span>
                                                        <Image
                                                            src={agentBotNftList.find((item) => item.applicationId === application.id)?.agentBotNft?.image?.thumbnailUrl || ""}
                                                            alt="NFT"
                                                            width={100}
                                                            height={100}
                                                            className='rounded-lg w-full h-full'
                                                        />
                                                    </div>
                                                )}


                                            </div>


                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        OKX UID
                                                    </span>

                                                    {
                                                        application?.okxUid === "0"
                                                        ? (
                                                            <span className='text-lg text-red-800 font-semibold'>
                                                                API Access Key 오류
                                                            </span>
                                                        )
                                                        : (
                                                            <span className='text-sm text-gray-800'>
                                                                {application.okxUid}
                                                            </span>
                                                        )
                      
                                                        
                                                    }

                                                </div>

                                                {/* checkApiAccessKey */}
                                                {
                                                (!application.okxUid || application.okxUid === "0") ? (
                                                    <button
                                                        onClick={() => {
                                                            checkApiAccessKey(
                                                                application.id,
                                                                application.apiAccessKey,
                                                                application.apiSecretKey,
                                                                application.apiPassword,
                                                            );
                                                        }}
                                                        disabled={checkingApiAccessKeyList.find((item) => item.applicationId === application.id)?.checking}
                                                        className={`${checkingApiAccessKeyList.find((item) => item.applicationId === application.id)?.checking ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                                            hover:bg-blue-600
                                                        `}
                                                    >
                                                        {checkingApiAccessKeyList.find((item) => item.applicationId === application.id)?.checking ? "Updating..." : "Update UID"}
                                                    </button>
                                                )
                                                :
                                                (
                                                    <div className='flex flex-col gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(application?.okxUid);
                                                                toast.success("Copied to clipboard");
                                                            }}
                                                            className="bg-gray-500 text-white p-2 rounded-lg
                                                                hover:bg-gray-600
                                                            "
                                                        >
                                                            Copy
                                                        </button>
                                                        {/*
                                                        <button
                                                            onClick={() => {
                                                                checkApiAccessKey(
                                                                    application.id,
                                                                    application.apiAccessKey,
                                                                    application.apiSecretKey,
                                                                    application.apiPassword,
                                                                );
                                                            }}
                                                            disabled={checkingApiAccessKeyList.find((item) => item.applicationId === application.id)?.checking}
                                                            className={`${checkingApiAccessKeyList.find((item) => item.applicationId === application.id)?.checking ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                                                hover:bg-blue-600
                                                            `}
                                                        >
                                                            {checkingApiAccessKeyList.find((item) => item.applicationId === application.id)?.checking ? "Updating..." : "Update UID"}
                                                        </button>
                                                        */}


                                                    </div>
                                                )}
                                            </div>


                                            {/* accountConfig */}
                                            {application?.accountConfig && (
                                                <div className='w-full flex flex-col items-start justify-between gap-2'>
                                                    <div className='flex flex-col gap-2'>
                                                        <span className='text-xs text-yellow-800'>
                                                            KYC Level
                                                        </span>
                                                        <div className='flex flex-row items-center gap-2'>
                                                            <span className='text-sm text-gray-800'>
                                                                {application.accountConfig.data.kycLv}
                                                            </span>
                                                            {application.accountConfig.data.kycLv === "0" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    본인 인증 필요
                                                                </span>
                                                            ) : (
                                                                <div className='flex flex-row items-center gap-2'>
                                                                    <span className='text-lg text-green-800 font-semibold'>
                                                                        본인 인증 완료
                                                                    </span>
                                                                    <Image
                                                                        src="/verified.png"
                                                                        alt="Verified"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* acctLv */}
                                                    {/*
                                                    1: Spot mode
                                                    2: Spot and futures mode
                                                    3: Multi-currency margin
                                                    4: Portfolio margin
                                                    */}
                                                    <div className='flex flex-col gap-2'>
                                                        <span className='text-xs text-yellow-800'>
                                                            Account mode
                                                        </span>
                                                        <div className='flex flex-row items-center gap-2'>
                                                            <span className='text-sm text-gray-800'>
                                                                {application.accountConfig.data.acctLv}
                                                            </span>
                                                            {application.accountConfig.data.acctLv === "1" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    Spot mode
                                                                </span>
                                                            ) : application.accountConfig.data.acctLv === "2" ? (
                                                                <div className='flex flex-row items-center gap-2'>
                                                                    <span className='text-lg text-green-800 font-semibold'>
                                                                        Spot and futures mode
                                                                    </span>
                                                                    <Image
                                                                        src="/verified.png"
                                                                        alt="Verified"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </div>
                                                            ) : application.accountConfig.data.acctLv === "3" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    Multi-currency margin
                                                                </span>
                                                            ) : application.accountConfig.data.acctLv === "4" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    Portfolio margin
                                                                </span>
                                                            ) : (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    Unknown
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/*
                                                    roleType
                                                    0: General user
                                                    1: Leading trader
                                                    2: Copy trader
                                                    3: API trader
                                                    */}
                                                    <div className='flex flex-col gap-2'>
                                                        <span className='text-xs text-yellow-800'>
                                                            Role type
                                                        </span>
                                                        <div className='flex flex-row items-center gap-2'>
                                                            <span className='text-sm text-gray-800'>
                                                                {application.accountConfig.data.roleType}
                                                            </span>
                                                            {application.accountConfig.data.roleType === "0" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    General user
                                                                </span>
                                                            ) : application.accountConfig.data.roleType === "1" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    Leading trader
                                                                </span>
                                                            ) : application.accountConfig.data.roleType === "2" ? (
                                                                <div className='flex flex-row items-center gap-2'>
                                                                    <span className='text-lg text-green-800 font-semibold'>
                                                                        Copy trader
                                                                    </span>
                                                                    <Image
                                                                        src="/verified.png"
                                                                        alt="Verified"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </div>
                                                            ) : application.accountConfig.data.roleType === "3" ? (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    API trader
                                                                </span>
                                                            ) : (
                                                                <span className='text-lg text-red-800 font-semibold'>
                                                                    Unknown
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>




                                                </div>
                                            )}



                                            {/* tradingAccountBalance */}
                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        OKX Trading Balance
                                                    </span>
                                                    <span className='text-4xl text-green-800 font-semibold'>
                                                        {
                                                            Number(tradingAccountBalanceList.find((item) => item.applicationId === application.id)?.tradingAccountBalance?.balance)
                                                            .toLocaleString('en-US', {
                                                                style: 'currency',
                                                                currency: 'USD'
                                                            })
                                                        }
                                                    </span>
                                                    {/* convert timestamp to date */}
                                                    <span className='text-xs text-gray-800'>
                                                        {tradingAccountBalanceList.find((item) => item.applicationId === application.id)?.tradingAccountBalance?.timestamp
                                                        ? new Date(tradingAccountBalanceList.find((item) => item.applicationId === application.id)?.tradingAccountBalance?.timestamp).toLocaleString()
                                                        : ""
                                                        }
                                                    </span>
                                                </div>
                                                {/*
                                                <button
                                                    onClick={() => {
                                                        checkTradingAccountBalance(
                                                            application.id,
                                                            application.apiAccessKey,
                                                            application.apiSecretKey,
                                                            application.apiPassword,
                                                        );
                                                    }}
                                                    disabled={
                                                        checkingTradingAccountBalanceList.find((item) => item.applicationId === application.id)?.checking
                                                    }
                                                    className={`${checkingTradingAccountBalanceList.find((item) => item.applicationId === application.id)?.checking ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                                        hover:bg-blue-600
                                                    `}
                                                >
                                                    {checkingTradingAccountBalanceList.find((item) => item.applicationId === application.id)?.checking ? "Updating..." : "Update"}
                                                </button>
                                                */}
                                            </div>



                                            {/* asset valuation */}
                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        OKX Funding Balance
                                                    </span>
                                                    <span className='text-sm text-gray-800'>
                                                        {htxAssetValuationForAgent.find((item) => item.applicationId === application.id)?.assetValuation?.balance || 0} $(USD)
                                                    </span>
                                                    {/* convert timestamp to date */}
                                                    <span className='text-xs text-gray-800'>
                                                        {htxAssetValuationForAgent.find((item) => item.applicationId === application.id)?.assetValuation?.timestamp
                                                        ? new Date(htxAssetValuationForAgent.find((item) => item.applicationId === application.id)?.assetValuation?.timestamp).toLocaleString()
                                                        : ""
                                                        }
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        checkOkxAssetValuation(
                                                            application.id,
                                                            application.apiAccessKey,
                                                            application.apiSecretKey,
                                                            application.apiPassword,
                                                        );
                                                    }}
                                                    disabled={
                                                        checkingHtxAssetValuationForAgent.find((item) => item?.applicationId === application.id)?.checking
                                                    }
                                                    className={`${checkingHtxAssetValuationForAgent.find((item) => item?.applicationId === application.id)?.checking ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                                        hover:bg-blue-600
                                                    `}
                                                >
                                                    {checkingHtxAssetValuationForAgent.find((item) => item?.applicationId === application.id)?.checking ? "Updating..." : "Update"}
                                                </button>
                                            </div>





                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        닉네임
                                                    </span>
                                                    <span className='text-sm text-gray-800'>
                                                        {application.userName}
                                                    </span>
                                                </div>
                                                {/* copy button */}
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.userPhoneNumber);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >  
                                                    Copy
                                                </button>
                                            </div>

                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        핸드폰번호
                                                    </span>
                                                    <span className='text-sm text-gray-800'>
                                                        {application.userPhoneNumber}
                                                    </span>
                                                </div>
                                                {/* copy button */}
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.userPhoneNumber);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >
                                                    Copy
                                                </button>
                                            </div>

                                            
                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        이메일주소
                                                    </span>
                                                    <span className='text-sm text-gray-800'>
                                                        {application.userEmail}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.userEmail);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            


                                            {/*
                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        OKX DUBAI(TRON) 지갑주소
                                                    </span>
                                                    <span className='text-xs text-gray-800'>
                                                        {application.htxUsdtWalletAddress.slice(0, 10)}...{application.htxUsdtWalletAddress.slice(-10)}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.htxUsdtWalletAddress);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            */}

                                            
                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        매직월렛 DUBAI 지갑주소
                                                    </span>
                                                    <span className='text-xs text-gray-800'>
                                                        {application.walletAddress.slice(0, 10)}...{application.walletAddress.slice(-10)}
                                                    </span>
                                                </div>
                                                {/* copy button */}
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.walletAddress);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >
                                                    Copy
                                                </button>
                                            </div>


                                            {/*
                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <span className='text-sm text-gray-800'>
                                                    API Access Key: {application.apiAccessKey}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.apiAccessKey);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        

                                            

                                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                <span className='text-sm text-gray-800'>
                                                    API Secret Key: {application.apiSecretKey}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(application.apiSecretKey);
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className="bg-gray-500 text-white p-2 rounded-lg
                                                        hover:bg-gray-600
                                                    "
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            */}








                                            {/*
                                            <div className='w-full flex flex-col items-start justify-between gap-2'>
                                                
                                                <div className='w-full flex flex-row items-center justify-between gap-2'>
                                                    <span className='text-xs text-yellow-800'>
                                                        OKX 포지션 리스트
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            getPositionList(
                                                                application.id,
                                                                application.apiAccessKey,
                                                                application.apiSecretKey,
                                                            );
                                                        }}
                                                        disabled={
                                                            checkingPositionList.find((item) => item.applicationId === application.id)?.checking
                                                        }
                                                        className={`${checkingPositionList.find((item) => item.applicationId === application.id)?.checking ? "bg-gray-500" : "bg-blue-500"} text-white p-2 rounded-lg
                                                            hover:bg-blue-600
                                                        `}
                                                    >
                                                        {checkingPositionList.find((item) => item.applicationId === application.id)?.checking ? "Checking..." : "Check"}
                                                    </button>

                                                </div>


                                                <span className='text-xs text-gray-800'>
                                                    {positionList.find((item) => item.applicationId === application.id)?.timestamp
                                                    ? new Date(positionList.find((item) => item.applicationId === application.id)?.timestamp).toLocaleString()
                                                    : ""
                                                    }
                                                </span>

                                                {positionList.find((item) => item.applicationId === application.id)?.status
                                                ? (

                                                    <table className='w-full text-xs text-gray-800
                                                        border border-gray-300 rounded-lg p-2 shadow-md bg-white divide-y divide-gray-300
                                                    '>
                                                        <thead
                                                            className='bg-gray-200 text-xs
                                                            w-full rounded-lg
                                                            '
                                                        >

                                                            <tr className='bg-gray-200 
                                                                border border-gray-300
                                                            '>
                                                                <th className='text-center
                                                                    border border-gray-300
                                                                '>
                                                                    Contract<br/>Side
                                                                </th>
                                                                <th className='text-center
                                                                    border border-gray-300
                                                                '>
                                                                    Volumn<br/>Margin<br/>Profit<br/>Rate
                                                                </th>
                                                                <th className='text-center
                                                                    border border-gray-300
                                                                '>
                                                                    Price
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody
                                                            className='divide-y divide-gray-300'
                                                        >
                                                            {positionList.find((item) => item.applicationId === application.id)?.positions.map((position : any) => (
                                                                <tr key={position.contract_code}
                                                                    className='border border-gray-300 bg-white
                                                                    hover:bg-gray-100
                                                                    '
                                                                >
                                                                    <td className='text-right
                                                                        border border-gray-300
                                                                        p-2
                                                                    '>
                                                                        <span className='text-xs text-gray-800 font-semibold'>
                                                                        {/// ETH-USDT  delete -USDT
                                                                            position.contract_code.replace("-USDT", "")
                                                                        }
                                                                        </span><br/>

                                                                        {
                                                                            position.position_side === "long" ? (
                                                                                <span className='text-green-500 font-semibold'>
                                                                                    Long
                                                                                </span>
                                                                            ) : (
                                                                                <span className='text-red-500 font-semibold'>
                                                                                    Short
                                                                                </span>
                                                                            )
                                                                        }
                                                                        
                                                                    </td>
                                                                    <td className='text-right
                                                                        border border-gray-300
                                                                        p-2
                                                                    '>
                                                                        {position.volume}<br/>

                                                                        {Number(position.position_margin).toFixed(2)}<br/>
                                                                
                                                                        {Number(position.profit).toFixed(2)}<br/>

                                                                        {Number(position.profit_rate).toFixed(2)}%
                                                                    </td>
                                                                    <td className='text-right
                                                                        border border-gray-300
                                                                        p-2
                                                                    '>
                                                                        {position.liquidation_price}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                ) : (

                                                    <span className='text-lg text-red-500 font-semibold'>
                                                        
                                                    </span>

                                                )}

                                            </div>
                                            */}
                                            


                
                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>
                    

                 




                </div>




            </div>

        </main>

    );

}

          


  export default function Agent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ApplicationsPage />
        </Suspense>
    );
  }

