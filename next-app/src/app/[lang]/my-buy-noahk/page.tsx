'use client';

import { useState, useEffect } from "react";




import {
  accountAbstraction,
  client,
  wallet,
  editionDropContract,
  editionDropTokenId,
} from "../../constants";

import {
    getContract,
    sendAndConfirmTransaction,
} from "thirdweb";



import {
    polygon,
} from "thirdweb/chains";


import {
  AutoConnect,
  //ConnectButton,
  useActiveAccount,
} from "thirdweb/react";



import Image from 'next/image';


import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
  useRouter,
  useSearchParams,
} from "next//navigation";

//import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../dictionaries";



import Link from "next/link";
import { Button } from "@headlessui/react";


interface SellOrder {
  _id: string;
  createdAt: string;
  walletAddress: string;
  nickname: string;
  avatar: string;
  trades: number;
  price: number;
  available: number;
  limit: string;
  paymentMethods: string[];

  sellAmount: number;
  krwAmount: number;
  rate: number;



  seller: any;

  tradeId: string;
  status: string;
  acceptedAt: string;
  paymentRequestedAt: string;
  paymentConfirmedAt: string;
  cancelledAt: string;


  buyer: any;

  canceller: string;

  escrowTransactionHash: string;
  transactionHash: string;

  virtualAccount: string;
}







//const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon

//const contractAddressArbitrum = "0x2f2a2543B76A4166549F7aab2e75Bef0aefC5B0f"; // USDT on Arbitrum

const contractAddress = "0x9948328fa1813037a37F3d35C0b1e009d6d9a563"; // NOAH-K on Polygon




export default function Index({ params }: any) {

 

  const [data, setData] = useState({
    title: "",
    description: "",

    menu : {
      buy: "",
      sell: "",
      trade: "",
      chat: "",
      history: "",
      settings: "",
    },

    Go_Home: "",
    Buy: "",
    Sell: "",
    Amount: "",
    Price: "",
    Total: "",
    Orders: "",
    Trades: "",
    Search_my_trades: "",

    Seller: "",
    Buyer: "",
    Me: "",

    Buy_USDT: "",
    Rate: "",
    Payment: "",
    Bank_Transfer: "",

    I_agree_to_the_terms_of_trade: "",
    I_agree_to_cancel_the_trade: "",

    Opened_at: "",
    Cancelled_at: "",
    Completed_at: "",

    Waiting_for_seller_to_deposit: "",

    to_escrow: "",
    If_the_seller_does_not_deposit_the_USDT_to_escrow: "",
    this_trade_will_be_cancelled_in: "",

    Cancel_My_Trade: "",


    Order_accepted_successfully: "",
    Order_has_been_cancelled: "",
    My_Order: "",

    hours: "",
    minutes: "",
    seconds: "",

    hours_ago: "",
    minutes_ago: "",
    seconds_ago: "",

    Order_Opened: "",
    Trade_Started: "",
    Expires_in: "",

    Accepting_Order: "",

    Escrow: "",

    Chat_with_Seller: "",
    Chat_with_Buyer: "",

    Table_View: "",

    TID: "",

    Status: "",

    My_Balance: "",

    Anonymous: "",
  

  } );

  useEffect(() => {
      async function fetchData() {
          const dictionary = await getDictionary(params.lang);
          setData(dictionary);
      }
      fetchData();
  }, [params.lang]);

  const {
    title,
    description,
    menu,
    Go_Home,
    Buy,
    Sell,
    Amount,
    Price,
    Total,
    Orders,
    Trades,
    Search_my_trades,

    Seller,
    Buyer,
    Me,

    Buy_USDT,
    Rate,
    Payment,
    Bank_Transfer,
    I_agree_to_the_terms_of_trade,
    I_agree_to_cancel_the_trade,

    Opened_at,
    Cancelled_at,
    Completed_at,

    Waiting_for_seller_to_deposit,

    to_escrow,

    If_the_seller_does_not_deposit_the_USDT_to_escrow,
    this_trade_will_be_cancelled_in,

    Cancel_My_Trade,

    Order_accepted_successfully,
    Order_has_been_cancelled,
    My_Order,

    hours,
    minutes,
    seconds,

    hours_ago,
    minutes_ago,
    seconds_ago,

    Order_Opened,
    Trade_Started,
    Expires_in,

    Accepting_Order,

    Escrow,

    Chat_with_Seller,
    Chat_with_Buyer,

    Table_View,

    TID,

    Status,

    My_Balance,

    Anonymous,


  } = data;




    const searchParams = useSearchParams();

    const center = searchParams.get('center');

    /*
    const [params, setParams] = useState({ center: '' });

  
    useEffect(() => {
        const center = searchParams.get('center') || '';
        setParams({ center });
    }, [searchParams]);
    */
  

    /*
    const account = useActiveAccount() as any;
    */

    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });

    /*
    const address = account?.address;
    */
   


    const address = searchParams.get('walletAddress') || '';
  
      
  




    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  



    const router = useRouter();



    
    const [balance, setBalance] = useState(0);


    useEffect(() => {
  
      // get the balance
      const getBalance = async () => {
        const result = await balanceOf({
          contract,
          address: address,
        });
    
        //console.log(result);
    
        setBalance( Number(result) / 10 ** 18 );
  
      };
  
      if (address) getBalance();
  
      const interval = setInterval(() => {
        if (address) getBalance();
      } , 1000);

      return () => clearInterval(interval);
  
    } , [address, contract]);
    





  /*
  const [nativeBalance, setNativeBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getBalance = async () => {

      ///console.log('getBalance address', address);

      
      const result = await balanceOf({
        contract,
        address: address || "",
      });

  
      //console.log(result);
  
      setBalance( Number(result) / 10 ** 18 );


      await fetch('/api/userNoahk/getBalanceByWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: params.chain,
          walletAddress: address,
        }),
      })

      .then(response => response.json())

      .then(data => {
          setNativeBalance(data.result?.displayValue);
      });



    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract, params.chain]);
  */



  const [escrowWalletAddress, setEscrowWalletAddress] = useState('');
  const [makeingEscrowWallet, setMakeingEscrowWallet] = useState(false);

  const makeEscrowWallet = async () => {
      
    if (!address) {
      
      //toast.error('Please connect your wallet');
      alert('Please connect your wallet');

      return;
    }


    setMakeingEscrowWallet(true);

    fetch('/api/orderNoahk/getEscrowWalletAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang: params.lang,
        chain: params.chain,
        walletAddress: address,
        isSmartAccount: false
      }),
    })
    .then(response => response.json())
    .then(data => {
        
        //console.log('getEscrowWalletAddress data.result', data.result);


        if (data.result) {
          setEscrowWalletAddress(data.result.escrowWalletAddress);
        } else {
          
          //toast.error('Escrow wallet address has been failed');
          alert('Escrow wallet address has been failed');

        }
    })
    .finally(() => {
      setMakeingEscrowWallet(false);
    });

  }

 
  /*
  const [escrowBalance, setEscrowBalance] = useState(0);
  const [escrowNativeBalance, setEscrowNativeBalance] = useState(0);
  useEffect(() => {

    const getEscrowBalance = async () => {

      if (!address) {
        setEscrowBalance(0);
        return;
      }

      if (!escrowWalletAddress || escrowWalletAddress === '') return;


      const result = await balanceOf({
        contract,
        address: escrowWalletAddress,
      });

  
      setEscrowBalance( Number(result) / 10 ** 18 );




      await fetch('/api/userNoahK/getBalanceByWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: params.chain,
          walletAddress: escrowWalletAddress,
        }),
      })
      .then(response => response.json())
      .then(data => {
          setEscrowNativeBalance(data.result?.displayValue);
      });

    };

    getEscrowBalance();

    const interval = setInterval(() => {
      getEscrowBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, escrowWalletAddress, contract, params.chain]);
  */



  // get User by wallet address

  const [user, setUser] = useState<any>(null);
  useEffect(() => {

    if (!address) {
        return;
    }

    fetch('/api/userNoahk/getUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            walletAddress: address,
        }),
    })
    .then(response => response.json())
    .then(data => {
        ///console.log('data', data);
        setUser(data.result);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  } , [address]);










    const [isModalOpen, setModalOpen] = useState(false);

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    


    const [searchMyTrades, setSearchMyTrades] = useState(false);


    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);

    useEffect(() => {

        /*
        fetch('/api/order/getAllSellOrdersForBuyer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              
            }),
        })
        .then(response => response.json())
        .then(data => {
            ///console.log('data', data);
            setSellOrders(data.result.orders);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        */

        const fetchSellOrders = async () => {


            const response = await fetch('/api/orderNoahk/getAllSellOrdersForBuyer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(

                  {
                    walletAddress: address,
                    searchMyTrades: true,
                  }

              ),
            });


            if (!response.ok) {
                //toast.error('Failed to fetch sell orders');
                alert('Failed to fetch sell orders');
                return;
            }


            const data = await response.json();

            
            setSellOrders(data.result.orders);

            // exclude my sell orders
            //setSellOrders(data.result.orders.filter((item: any) => item.walletAddress !== address));



        }

        fetchSellOrders();

        
        const interval = setInterval(() => {
            fetchSellOrders();
        }, 10000);


        return () => clearInterval(interval);
        



    } , [address, searchMyTrades]);


    


    /* agreement for trade */
    const [agreementForTrade, setAgreementForTrade] = useState([] as boolean[]);
    useEffect(() => {
        setAgreementForTrade (
            sellOrders.map((item, idx) => {
                return false;
            })
        );
    } , [sellOrders]);
    
    
    //const [acceptingSellOrder, setAcceptingSellOrder] = useState(false);

    const [acceptingSellOrder, setAcceptingSellOrder] = useState([] as boolean[]);

    useEffect(() => {
        setAcceptingSellOrder (
            sellOrders.map((item, idx) => {
                return false;
            })
        );
    } , [sellOrders]);


    const acceptSellOrder = (
      index: number,
      orderId: string,
      smsNumber: string,
    ) => {

        if (!address) {

            //toast.error('Please connect your wallet');
            alert('Please connect your wallet');

            return;
        }

        setAcceptingSellOrder (
            sellOrders.map((item, idx) => {
                if (idx === index) {
                    return true;
                } else {
                    return false;
                }
            })
        );


        fetch('/api/orderNoahk/acceptSellOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lang: params.lang,
                chain: params.chain,
                orderId: orderId,
                buyerWalletAddress: address,
                buyerNickname: user ? user.nickname : '',
                buyerAvatar: user ? user.avatar : '',

                //buyerMobile: user.mobile,
                buyerMobile: smsNumber,

            }),
        })
        .then(response => response.json())
        .then(data => {

            console.log('data', data);

            //setSellOrders(data.result.orders);
            //openModal();

            //toast.success(Order_accepted_successfully);
            alert(Order_accepted_successfully);



            fetch('/api/orderNoahk/getAllSellOrdersForBuyer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                  {
                    walletAddress: address,
                    searchMyTrades: true,
                  }
                ),
            })
            .then(response => response.json())
            .then(data => {
                ///console.log('data', data);
                setSellOrders(data.result.orders);

                            // exclude my sell orders
                ///setSellOrders(data.result.orders.filter((item: any) => item.walletAddress !== address));

            })

        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            setAcceptingSellOrder (
                sellOrders.map((item, idx) => {
                    return false;
                })
            );
        } );


    }



  // agreement for cancel trade
  const [agreementForCancelTrade, setAgreementForCancelTrade] = useState([] as boolean[]);
  useEffect(() => {
    setAgreementForCancelTrade(
      sellOrders.map(() => false)
    );
  } , [sellOrders]);





    // cancel sell order state
    const [cancellings, setCancellings] = useState([] as boolean[]);
    useEffect(() => {
      setCancellings(sellOrders.map(() => false));
    }, [sellOrders]);



    const cancelTrade = async (orderId: string, index: number) => {



      if (cancellings[index]) {
        return;
      }



      setCancellings(cancellings.map((item, i) => i === index ? true : item));

      const response = await fetch('/api/orderNoahk/cancelTradeByBuyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          walletAddress: address
        })
      });

      const data = await response.json();

      ///console.log('data', data);

      if (data.result) {

        //toast.success(Order_has_been_cancelled);
        alert(Order_has_been_cancelled);

        await fetch('/api/orderNoahk/getAllSellOrdersForBuyer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              walletAddress: address,
              searchMyTrades: true,
            }
          )
        }).then(async (response) => {
          const data = await response.json();
          //console.log('data', data);
          if (data.result) {
            setSellOrders(data.result.orders);
          }
        });

      } else {
        //toast.error('Order has been failed');
        alert('Order has been failed');
      }

      setCancellings(cancellings.map((item, i) => i === index ? false : item));

    }


  


    // check table view or card view
    const [tableView, setTableView] = useState(false);





    // /api/wallet/getTransfersNoahkByWalletAddress
    const [transfers, setTransfers] = useState<any[]>([]);
    const [loadingTransfers, setLoadingTransfers] = useState(false);
    useEffect(() => {
      




      const fetchTransfers = async () => {

        if (!address) {
          return;
        }
  

        setLoadingTransfers(true);

        fetch('/api/wallet/getTransfersNoahkByWalletAddress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
          }),
        })
        .then(response => response.json())
        .then(data => {
            setTransfers(data.result.transfers);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            setLoadingTransfers(false);
        });

      }

      fetchTransfers();

      const interval = setInterval(() => {
        fetchTransfers();
      } , 5000);

      return () => clearInterval(interval);


    } , [address]);

    //console.log('transfers', transfers);
    /*
    {
      "_id": "67a8108d3570161531bd05a8",
      "user": {
          "_id": "67a7fe589785b6b27cad008e",
          "nickname": "noahk",
          "mobile": "",
          "telegramId": "",
          "center": "noah_wallet_bot",
          "walletAddress": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C"
      },
      "sendOrReceive": "receive",
      "transferData": {
          "transactionHash": "0x4313c895111b1389b401c6c23e119e5bdba2abbda26484c06cac3b1f661e79ad",
          "transactionIndex": 24,
          "fromAddress": "0x8c0Fe9Cc307e758B825e10319B92FC96fE13Dd87",
          "toAddress": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
          "value": "1000000000000000000",
          "timestamp": 1739067529000,
          "_id": "67a8108d3570161531bd05a7"
      }
  }
    */





    return (

      <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-2xl mx-auto">

        {/*
        <AutoConnect
            client={client}
            wallets={[wallet]}
            timeout={15000}
        />
        */}





        <div className="py-0 w-full">

          <div className="w-full flex flex-col items-center justify-center space-y-4">


            <div className="mt-5 flex flex-row gap-2 items-center justify-between">
              <Link href="/console-noah?center=noah_wallet_bot">
                
                <Button
                  className="bg-gray-700 text-zinc-100 p-2 rounded"
                >
                  회원관리
                </Button>

              </Link>

              <Link href="/kr/my-buy-noahk?walletAddress=0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C">
                
                <Button
                  className="bg-green-500 text-white p-2 rounded"
                >
                  구매관리
                </Button>

              </Link>

            </div>


              <div className='flex flex-row items-center space-x-4'>
                  <Image
                    src="/trade-buy.png"
                    alt="buy"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />

                  <div className="text-2xl font-semibold">
                    NOAH-K 포인트 구매내역

                  </div>

              </div>

              
                <div className="w-full flex flex-col items-center justify-between gap-2
                  border border-gray-800
                  p-4 rounded-lg">

                  {/* wallet address 지갑주소 */}
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {
                        address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
                      }
                    </span>
                    {/* copy button */}
                    <button
                      className="text-sm bg-zinc-800 text-white px-2 py-1 rounded-md hover:bg-zinc-900"
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        alert('지갑주소가 복사되었습니다');
                      }}
                    >
                      복사
                    </button>
                  </div>

                  <div className='flex flex-row items-center justify-between gap-2'>

                      <Image
                          src="/logo-noahk-erc20.png"
                          alt="noah-k"
                          width={30}
                          height={30}
                          className="rounded"
                      />                                


                      <div className="flex flex-row gap-2 items-center justify-between">

                          <span className="p-2 text-green-500 text-4xl font-semibold"> 
                              {
                                  Number(balance).toFixed(0)
                              }
                          </span>
                          <span className="p-2 text-gray-500 text-lg font-semibold">NOAH-K</span>

                      </div>
                  </div>

                  {/* transfer history */}
                  <div className="w-full flex flex-col items-center justify-between gap-2">
                    <div className="text-lg font-semibold text-gray-400">
                      거래내역 (최근 10개)
                    </div>

                    <div className="w-full overflow-x-auto">
                      <table className="w-full table-auto border-collapse border border-zinc-800 rounded-md">
                        <thead className="bg-zinc-800 text-white">
                          <tr>
                            <th className="p-2">보내기/받기</th>
                            <th className="p-2">보낸지갑</th>
                            <th className="p-2">받은지갑</th>
                            <th className="p-2">수량</th>
                            <th className="p-2">날짜</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transfers.map((item, index) => (
                            <tr key={index} className={`
                              ${index % 2 === 0 ? 'bg-zinc-700' : 'bg-zinc-800'}
                            `}>
                              
                              {item.sendOrReceive === 'send' ? (
                                <td className="p-2 text-sm text-red-500 text-left pl-5">보내기</td>
                              ) : (
                                <td className="p-2 text-sm text-green-500 text-left pl-5">받기</td>
                              )}
                             
                              
                              <td className="p-2 text-sm text-gray-400 text-left pl-5">
                                {item?.sellOrder ?
                                  item.sellOrder?.nickName + ' (거래번호#' + item.sellOrder?.tradeId + ' 에스크로지갑)'
                                  :
                                  item.transferData.fromAddress.substring(0, 6) + '...' + item.transferData.fromAddress.substring(item.transferData.fromAddress.length - 4, item.transferData.fromAddress.length)}
                              </td>

                              <td className="p-2 text-sm text-gray-400 text-left pl-5">
                                {item.transferData.toAddress.substring(0, 6) + '...' + item.transferData.toAddress.substring(item.transferData.toAddress.length - 4, item.transferData.toAddress.length)}
                              </td>
                              <td className="p-2 text-xl font-semibold text-green-500 text-right pr-5">

                                {
                                Number(item.transferData.value) / 10 ** 18
                                }
                              </td>
                              <td className="p-2 text-sm text-gray-400 text-center">
                                {new Date(item.transferData.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
                





                <div className="w-full flex flex-row items-between justify-center gap-2">

                  <div className=" flex flex-row items-center justify-between gap-5">





                    <div className="ml-5 flex flex-col gap-2 items-start justify-end">
                      <div className="flex flex-row items-center gap-2">
                        {Buyer}{' '}
                        <Image
                          src={user?.avatar || "/profile-default.png"}
                          alt="Avatar"
                          width={20}
                          height={20}
                          priority={true} // Added priority property
                          className="rounded-full"
                          style={{
                              objectFit: 'cover',
                              width: '20px',
                              height: '20px',
                          }}
                        />
                        <div className="text-lg font-semibold text-gray-400">
                          {
                            user && user.nickname ? user.nickname : Anonymous
                          }
                          </div>
                      </div>
                      {/* checkbox for search my trades */}
                      {/*
                      <div className="flex flex-row items-center gap-2">
                        <input
                          disabled={!address}
                          type="checkbox"
                          checked={searchMyTrades}
                          onChange={(e) => setSearchMyTrades(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <label className="text-sm text-zinc-400">{Search_my_trades}</label>
                      </div>
                      */}

                    </div>



                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Total}</div>
                      <div className="text-xl font-semibold text-gray-400">
                        {sellOrders.length} 
                      </div>
                      
                    </div>

                    {/*}
                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Sell}</div>
                      <div className="text-xl font-semibold text-gray-400">
                        {sellOrders.filter((item) => item.status === 'ordered').length}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Trades}</div>
                      <div className="text-xl font-semibold text-gray-400">

                        {
                          //sellOrders.filter((item) => item.status === 'accepted').length
                          sellOrders.filter((item) => item.status === 'accepted' || item.status === 'paymentRequested').length

                        }

                      </div>
                    </div>
                    */}




                  </div>


                  <div className="ml-10 flex flex-col items-center gap-2">
                    {/* reload button */}
                    <button
                      className="text-sm bg-zinc-800 text-white px-2 py-1 rounded-md hover:bg-zinc-900"
                      onClick={() => {
                        fetch('/api/orderNoahk/getAllSellOrdersForBuyer', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(
                            {
                              walletAddress: address,
                              searchMyTrades: true,
                            }
                          ),
                        })
                        .then(response => response.json())
                        .then(data => {
                            ///console.log('data', data);
                            setSellOrders(data.result.orders);
                        })
                      }}
                    >
                      새로고침
                    </button>

                    {/* select table view or card view */}
                    {/*
                    <div className="flex flex-row items-center space-x-4">
                        <div className="text-sm">{Table_View}</div>
                        <input
                          type="checkbox"
                          checked={tableView}
                          onChange={(e) => setTableView(e.target.checked)}
                          className="w-5 h-5 rounded-full"
                        />
                    </div>
                    */}

                  </div>





                </div>



                {/* table view is horizontal scroll */}
                {tableView ? (


                  <div className="w-full overflow-x-auto">

                    <table className=" w-full table-auto border-collapse border border-zinc-800 rounded-md">

                      <thead
                        className="bg-zinc-800 text-white"
                      >
                        <tr>
                          <th className="p-2">{Order_Opened}</th>
                          <th className="p-2">{Seller}</th>
                          <th className="p-2">{Price}</th>
                          <th className="p-2">{Amount}</th>
                          <th className="p-2">{Payment}</th>
                          <th className="p-2">{Status}</th>
                          <th className="p-2">{Trades}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {sellOrders.map((item, index) => (
                          <tr key={index} className={`
                            ${index % 2 === 0 ? 'bg-zinc-700' : 'bg-zinc-800'}
                          `}>

                            <td className="p-2">
                              <div className="text-sm text-zinc-400">
                                {params.lang === 'kr' ? (
                                  <p>{
                                    new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 ? (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000) + ' ' + seconds_ago
                                    ) :
                                    new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 ? (
                                    ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                    ) : (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                    )
                                  }{' '}{Order_Opened}</p>
                                ) : (
                                  <p>{Order_Opened} {
                                    new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 ? (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000) + ' ' + seconds_ago
                                    ) :
                                    new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 ? (
                                    ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                    ) : (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                    )
                                  }</p>
                                )}
                              </div>
                            </td>
                            
                            <td className="p-2">
                              <div className="flex flex-row items-center gap-2">
                                <Image
                                  src={item.avatar || "/profile-default.png"}
                                  alt="Avatar"
                                  width={32}
                                  height={32}
                                  priority={true} // Added priority property
                                  className="rounded-full"
                                  style={{
                                      objectFit: 'cover',
                                      width: '32px',
                                      height: '32px',
                                  }}
                                />
                                <div className="flex flex-col gap-2 items-start">
                                  <div className="text-lg font-semibold text-white">
                                    {item.walletAddress === address ? '나' : item.nickname}
                                  </div>
                                  <div className="text-sm text-zinc-400">
                                    {item.walletAddress === address ? '나' : item.tradeId ? item.tradeId : ''}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="text-sm font-semibold text-white">
                                {
                                  // currency
                                  Number(item.krwAmount).toLocaleString('ko-KR', {
                                    style: 'currency',
                                    currency: 'KRW',
                                  })
                                }
                              </div>
                              <div className="text-sm font-semibold text-white">
                              {Rate}{' '}{Number(item.krwAmount / item.sellAmount).toFixed(2)}
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="text-sm font-semibold text-white">
                                {item.sellAmount} NOAH-K
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="text-sm font-semibold text-white">
                                {item.seller?.bankInfo.bankName}
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="flex flex-row items-center gap-2">
                                {/* status */}
                                {item.status === 'ordered' && (
                                  <div className="text-sm text-zinc-400">
                                    {Order_Opened}
                                  </div>
                                )}


                                {item.status === 'accepted' && (
                                  <div className="text-sm text-green-500">

                                    {params.lang === 'kr' ? (
                                      <p>{
                                        new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 ? (
                                          ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000) + ' ' + seconds_ago
                                        ) :
                                        new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 * 60 ? (
                                        ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                        ) : (
                                          ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                        )
                                      }{' '}{Trade_Started}</p>
                                    ) : (
                                      <p>{Trade_Started} {
                                        new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 ? (
                                          ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000) + ' ' + seconds_ago
                                        ) :
                                        new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 * 60 ? (
                                        ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                        ) : (
                                          ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                        )
                                      }</p>
                                    )}


                                  </div>
                                )}

                                {item.status === 'paymentRequested' && (
                                  <div className="text-sm text-green-500">
                                    {Waiting_for_seller_to_deposit}
                                  </div>
                                )}

                                {item.status === 'cancelled' && (
                                  <div className="text-sm text-red-600">
                                    {Cancelled_at}
                                  </div>
                                )}

                                {item.status === 'completed' && (
                                  <div className="text-sm text-green-500">
                                    {Completed_at}
                                  </div>
                                )}

                              </div>
                            </td>

                            <td className="p-2">

                              {item.status === 'accepted' && item.buyer && item.buyer.walletAddress === address && (
                                <div className="flex flex-row items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={agreementForCancelTrade[index]}
                                    onChange={(e) => {
                                      setAgreementForCancelTrade(
                                        agreementForCancelTrade.map((item, idx) => idx === index ? e.target.checked : item)
                                      );
                                    }}
                                    className="w-10 h-10
                                      border border-gray-800 rounded-md
                                    "
                                  />
                                  <button
                                    disabled={cancellings[index] || !agreementForCancelTrade[index]}
                                    className={`
                                      ${cancellings[index] || !agreementForCancelTrade[index] ?
                                        'bg-zinc-800 text-zinc-400' : 'bg-red-500 text-white'
                                      }
                                      px-2 py-1 rounded-md hover:bg-red-600
                                    `}
                                      
                                    onClick={() => {
                                      cancelTrade(item._id, index);
                                    }}
                                  >
                                    {cancellings[index] && (
                                      <Image
                                        src="/loading.png"
                                        alt="Loading"
                                        width={20}
                                        height={20}
                                        className="animate-spin"
                                      />
                                    )}
                                    {!cancellings[index] && 
                                      Cancel_My_Trade
                                    }
                                  </button>
                                </div>
                              )}

                              {item.status === 'ordered' && item.walletAddress !== address && (
                                <div className="flex flex-row items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={agreementForTrade[index]}
                                    onChange={(e) => {
                                      setAgreementForTrade(
                                        agreementForTrade.map((item, idx) => idx === index ? e.target.checked : item)
                                      );
                                    }}
                                    className="w-10 h-10
                                      border border-gray-800 rounded-md
                                    "
                                  />
                                  {/*
                                  <button
                                    disabled={acceptingSellOrder[index] || !agreementForTrade[index]}
                                    className={`
                                      ${acceptingSellOrder[index] || !agreementForTrade[index] ?
                                        'bg-zinc-800 text-zinc-400' : 'bg-green-500 text-white'}
                                      px-2 py-1 rounded-md hover:bg-green-600
                                    `}
                                    onClick={() => {
                                      acceptSellOrder(index, item._id, "");
                                    }}
                                  >
                                    {acceptingSellOrder[index] && (
                                      <Image
                                        src="/loading.png"
                                        alt="Loading"
                                        width={20}
                                        height={20}
                                        className="animate-spin"
                                      />
                                    )}
                                    {!acceptingSellOrder[index] && 
                                      Buy
                                    }
                                    
                                  </button>
                                  */}
                                </div>
                              )}

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>


                ) : (

                  <div className="w-full grid gap-4 lg:grid-cols-2 xl:grid-cols-4 justify-center
                    mt-4 p-0
                  ">

                      {sellOrders.map((item, index) => (
          
                        <div
                          key={index}
                          className="relative flex flex-col items-center justify-center"
                        >


                          {/*item.status === 'ordered' && (new Date().getTime() - new Date(item.createdAt).getTime() > 1000 * 60 * 60 * 24) && (
                            <div className="absolute inset-0 flex justify-center items-center z-10
                              bg-black bg-opacity-50
                            ">
                              <Image
                                src="/icon-expired.png"
                                alt="Expired"
                                width={100}
                                height={100}
                                className="opacity-20"
                              />
                            </div>
                          )*/}

                          {item.status === 'cancelled' && (
                            <div className="absolute inset-0 flex justify-center items-center z-10
                              bg-black bg-opacity-50
                            ">
                              <Image
                                src="/icon-cancelled.png"
                                alt="Cancelled"
                                width={100}
                                height={100}
                                className="opacity-20"
                              />
                            </div>
                          )}


                          <article

                              className={` w-96 xl:w-full h-full
                                ${item.walletAddress === address ? 'border-green-500' : 'border-gray-200'}

                                ${item.status === 'accepted' || item.status === 'paymentRequested' ? 'border-red-600' : 'border-gray-200'}

                                p-4 rounded-md border bg-gray-800
                            `}
                          >

                            {item.status === 'ordered' && (

    
                              <div className="w-full flex flex-col gpa-2 items-start justify-start">


                                  <div className="w-full flex flex-row items-center justify-between gap-2">

                                    <div className="flex flex-row items-center gap-2">

                                      {/* if createdAt is recent 1 hours, show new badge */}
                                      {new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 && (
                                        <Image
                                          src="/icon-new.png"
                                          alt="New"
                                          width={28}
                                          height={28}
                                        />
                                      )}

                                      <Image
                                        src="/icon-public-sale.png"
                                        alt="Public Sale"
                                        width={28}
                                        height={28}
                                      />

                                    

                                      {params.lang === 'kr' ? (

                                        <p className="text-sm text-zinc-400">

                                        
                                          {

                                            new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 ? (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000) + ' ' + seconds_ago
                                            ) :
                                            new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 ? (
                                            ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                            ) : (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                            )
                                          }{' '}{Order_Opened} 

                                        </p>
                                        
                                        ) : (

                                          <p className="text-sm text-zinc-400">


                                        
                                          {Order_Opened}{' '}{

                                            new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 ? (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000) + ' ' + seconds_ago
                                            ) :
                                            new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 ? (
                                            ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                            ) : (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                            )
                                          }



                                        </p>


                                      )}

                                    </div>



                                    {/* share button */}
                                    {/*
                                    <button
                                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                                      onClick={() => {

                                        window.open(`https://gold.goodtether.com/${params.lang}/sell-usdt/${item._id}`, '_blank');

                                      }}
                                    >
                                      <Image
                                        src="/icon-share.png"
                                        alt="Share"
                                        width={20}
                                        height={20}
                                      />
                                    </button>
                                    */}


                                  </div>


                                  {24 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) > 0 ? (

                                    <div className="mt-2 flex flex-row items-center space-x-2">
                                      <Image
                                        src="/icon-timer.webp"
                                        alt="Timer"
                                        width={28}
                                        height={28}
                                      />
                                      <p className="text-sm text-zinc-400">{Expires_in} {
      
                                        24 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) - 1

                                        } {hours} {
                                          60 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) % 60
                                        } {minutes}

                                      </p>
                                    </div>

                                  ) : (
                                    <div className="mt-2 flex flex-row items-center space-x-2">
                                      {/*
                                      <Image
                                        src="/icon-timer.webp"
                                        alt="Expired"
                                        width={28}
                                        height={28}
                                      />
                                      <p className="text-sm text-zinc-400">Expired</p>
                                      */}
                                    </div>
                                  )}
      
                              </div>

                            )}



                            { (item.status === 'accepted' || item.status === 'paymentRequested' || item.status === 'cancelled') && (
                                
                              <div className={`
                                

                                mb-4 flex flex-row items-center justify-between gap-2
                                 bg-white text-black p-2 rounded-md

                                `}>
                                  
                                  
                                  <Image
                                    src="/icon-trade.png"
                                    alt="Trade"
                                    width={32}
                                    height={32}
                                    className="rounded-lg animate-spin"
                                  />
                                  
                                  <div className="flex flex-col items-start justify-start gap-2">
                                    <p className="text-lg font-semibold text-green-500 ">
                                      거래번호:{' '}#{item.tradeId}
                                    </p>

                                    {item.status === 'cancelled' ? (
                                      <p className="ml-2 text-sm text-zinc-400">
                                        {new Date(item.acceptedAt).toLocaleString()}
                                      </p>
                                    ) : (
                                      
                                      <>
                                        {params.lang === 'kr' ? (

                                          <p className="text-sm text-zinc-800">

                                          
                                            {new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 ? (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000) + ' ' + seconds_ago
                                            ) :
                                            new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 * 60 ? (
                                            ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                            ) : (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                            )
                                            }{' '}{/*Trade_Started*/}

                                          </p>



                                        ) : (

                                          <p className="ml-2 text-sm text-zinc-400">

                                            {Trade_Started} {
                                              new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 ? (
                                                ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000) + ' ' + seconds_ago
                                              ) :
                                              new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 * 60 ? (
                                              ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                              ) : (
                                                ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                              )
                                            }

                                          </p>

                                        )}




                                      </>
                                    
                                    )}

                                  </div>


                                  {/* if status is accepted, show "구매신청상태" */}
                                  {item.status === 'accepted' && (
                                    <span className=" w-36 text-sm bg-green-500 text-white px-2 py-1 rounded-md">
                                      판매자<br />에스크로진행중
                                    </span>
                                  )}

                                  {item.status === 'paymentRequested' && (
                                    <div className="w-36 flex flex-col items-start justify-start gap-2">
                                      
                                      <div className="flex flex-row items-center gap-2">
                                        <Image
                                          src="/verified.png"
                                          alt="Verified"
                                          width={20}
                                          height={20}
                                        />
                                        <span className="text-sm text-red-500">
                                          에스크로완료
                                        </span>
                                      </div>

                                      <span className="w-full text-sm bg-green-500 text-white px-2 py-1 rounded-md">
                                        판매자<br />입금확인중
                                      </span>
                                    </div>
                                  )}

                           

                                </div>
                            )}


                            {item.status === 'paymentConfirmed' && (
                              <div className="flex flex-row xl:flex-col items-center justify-between gap-2
                                bg-green-500 text-white p-2 rounded-md
                              ">
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src='/icon-completed.png'
                                    alt='payment completed'
                                    width={20}
                                    height={20}
                                  />
                                  {/* 거래번호 */}
                                  <span className="text-lg font-semibold">
                                    거래번호: {' '}#{item.tradeId}
                                  </span>
                                </div>

                                {/* 거래완료 */}
                                  <span className="text-sm font-semibold text-white">
                                    거래완료상태
                                  </span>

                              </div>
                            )}


                              {/*
                              
                              {item.acceptedAt && (
                                <p className="mb-2 text-sm text-zinc-400">
                                  Trade started at {new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()}
                                </p>
                              )}
                              */}




                            {item.status === 'cancelled' && (
                                <div className="mt-4 flex flex-row items-center gap-2">
                                  <Image
                                    src='/icon-cancelled.webp'
                                    alt='cancel'
                                    width={20}
                                    height={20}
                                  />
                                  <p className="text-sm text-red-500">
                                    {Cancelled_at} {
                                      new Date(item.cancelledAt).toLocaleDateString() + ' ' + new Date(item.cancelledAt).toLocaleTimeString()
                                    }
                                  </p>
                                </div>
                              )}




                    

                              <div className="mt-4 flex flex-col items-center justify-center gap-2">

                                <div className="mt-2 flex flex-row items-start gap-2">

                                  <p className="text-2xl font-semibold text-green-500">
                                    {item.sellAmount}{' '}NOAH-K
                                  </p>
                                  <p className="text-lg font-semibold text-white">{Rate}: {

                                    Number(item.krwAmount / item.sellAmount).toFixed(2)

                                    }</p>
                                </div>



                                <p className="text-2xl text-yellow-500 font-semibold">
                                  {Price}: {
                                    // currency
                                  
                                    Number(item.krwAmount).toLocaleString('ko-KR', {
                                      style: 'currency',
                                      currency: 'KRW',
                                    })

                                  }
                                </p>


                              </div>

                      
                              {address && item.buyer && item.buyer.walletAddress === address ? (

                                <div className="mt-4 flex flex-col items-start justify-start gap-2">
                                
                                  <span className="text-sm font-semibold text-white">
                                    {Payment}:
                                  </span>


                                  <div className="mt-2 flex flex-row items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                                    <p className="text-sm text-zinc-400">
                                      걸제은행:{' '}
                                      
                                      {
                                      item.seller?.bankInfo.bankName === "090" ? "카카오뱅크" :
                                      item.seller?.bankInfo.bankName === "089" ? "케이뱅크" :
                                      item.seller?.bankInfo.bankName === "092" ? "토스뱅크" :

                                      item.seller?.bankInfo.bankName === "004" ? "국민은행" :
                                      item.seller?.bankInfo.bankName === "020" ? "우리은행" :
                                      item.seller?.bankInfo.bankName === "088" ? "신한은행" :
                                      item.seller?.bankInfo.bankName === "011" ? "농협" :
                                      item.seller?.bankInfo.bankName === "003" ? "기업은행" :
                                      item.seller?.bankInfo.bankName === "081" ? "하나은행" :
                                      item.seller?.bankInfo.bankName === "002" ? "외환은행" :
                                      item.seller?.bankInfo.bankName === "032" ? "부산은행" :
                                      item.seller?.bankInfo.bankName === "031" ? "대구은행" :
                                      item.seller?.bankInfo.bankName === "037" ? "전북은행" :
                                      item.seller?.bankInfo.bankName === "071" ? "경북은행" :
                                      item.seller?.bankInfo.bankName === "034" ? "광주은행" :
                                      item.seller?.bankInfo.bankName === "071" ? "우체국" :
                                      item.seller?.bankInfo.bankName === "007" ? "수협" :
                                      item.seller?.bankInfo.bankName === "027" ? "씨티은행" :
                                      item.seller?.bankInfo.bankName === "055" ? "대신은행" :
                                      item.seller?.bankInfo.bankName === "054" ? "동양종합금융" :
                                      item.seller?.bankInfo.bankName === "230" ? "미래에셋증권" :

                                      item.seller?.bankInfo.bankName

                                      
                                      }{' '}


                                      {item.seller?.bankInfo.accountNumber}{' '}
                                      {item.seller?.bankInfo.accountHolder}
                                    </p>
                                  </div>
                                  

                                  {/* 입금자명 depositName */}
                                  <div className="mt-2 flex flex-row items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                                    <p className="text-sm text-zinc-400">
                                      입금자명:{' '}{item?.buyer?.depositName}
                                    </p>
                                  </div>
                                    
                                </div>

                              ) : (

                                <div className="mt-4 mb-4 flex flex-col items-start text-sm
                                  text-zinc-400
                                ">
                                  {Payment}: {Bank_Transfer} (
                                    {item.seller?.bankInfo.bankName}
                                    {' '}{item.seller?.bankInfo.accountNumber.slice(0, 5)}****
                                    {' '}{item.seller?.bankInfo.accountHolder.slice(0, 1)}**
                                    )
                                </div>

                              )}

                  

                              <div className="mt-5 flex flex-col items-start justify-start gap-2">
                                <p className="flex items-center gap-2">

                                  <Image
                                      src={item.avatar || '/profile-default.png'}
                                      alt="Avatar"
                                      width={25}
                                      height={25}
                                      priority={true} // Added priority property
                                      className="rounded-full"
                                      style={{
                                          objectFit: 'cover',
                                          width: '25px',
                                          height: '25px',
                                      }}
                                  />

                                  <div className="flex items-center space-x-2
                                    text-lg font-semibold text-white
                                  ">
                                    {Seller}:
                                  </div>

                                  <h2 className="text-lg font-semibold
                                    text-white
                                  ">
                                    {item.walletAddress === address ? '나' : item.nickname}
                                  
                                  </h2>

                                  <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                  />

                                  <Image
                                    src="/best-seller.png"
                                    alt="Best Seller"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                  />

                                </p>


                                {/*
                                {address && item.walletAddress !== address && item.buyer && item.buyer.walletAddress === address && (
                                  <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        //console.log('Buy USDT');
                                        // go to chat
                                        // close modal
                                        //closeModal();
                                        ///goChat(item._id, item.tradeId);

                                        router.push(`/${params.lang}/${params.chain}/sell-usdt/${item._id}`);

                                    }}
                                  >
                                    {Chat_with_Seller + ' ' + item.nickname}
                                  </button>
                                )}
                                */}


                              </div>




                              {/* buyer cancelled the trade */}
                              {item.status === 'cancelled' && (
                                <div className="mt-4 flex flex-col gap-2 items-start justify-center">
                                  <div className="flex flex-row items-center gap-2">
                                    <Image
                                      src={item.buyer.avatar || "/profile-default.png"}
                                      alt="Profile Image"
                                      width={32}
                                      height={32}
                                      priority={true} // Added priority property
                                      className="rounded-full"
                                      style={{
                                          objectFit: 'cover',
                                          width: '32px',
                                          height: '32px',
                                      }}
                                    />
                                    <p className="text-sm text-red-500 font-semibold">
                                      {Buyer}: {
                                        address && item.buyer.walletAddress === address ? Me :
                                        address && item.buyer.nickname ? item.buyer.nickname : Anonymous
                                      }
                                    </p>
  
                                  </div>


                                </div>
                              )}



                              {/*
                              item?.buyer && (item.status === 'accepted' || item.status === 'paymentRequested') && (
                          
                               
                                
                               <div className="mt-4 flex flex-row items-center gap-2">
                                  <Image
                                    src={item?.buyer?.avatar || "/profile-default.png"}
                                    alt="Profile Image"
                                    width={32}
                                    height={32}
                                    priority={true} // Added priority property
                                    className="rounded-full"
                                    style={{
                                        objectFit: 'cover',
                                        width: '32px',
                                        height: '32px',
                                    }}
                                  />
                                  <p className="text-xl text-green-500 font-semibold">
                                    {Buyer}: {
                                      item?.buyer?.walletAddress === address ? Me :
                                      item?.buyer?.nickname?.substring(0, 1) + '***'
                                    }
                                  </p>
                                  <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                  />
                                </div>
                              
                              )
                                */}
                            

                              {/* waiting for escrow */}
                              {item.status === 'accepted' && (



                                <div className="mt-4 flex flex-col gap-2 items-center justify-start">


                                    
                                    
                                  <div className="mt-4 flex flex-row gap-2 items-center justify-start">

                                    {/*
                                    <Image
                                      src="/loading.png"
                                      alt="Escrow"
                                      width={32}
                                      height={32}
                                      className="animate-spin"
                                    />
                                    */}

                                    <div className="flex flex-col gap-2 items-start">
                                      {/*
                                      <span>
                                        {Waiting_for_seller_to_deposit} {item.sellAmount} NOAH-K {to_escrow}...
                                      </span>
                                      */}

                                      <div className="flex flex-row items-center gap-2">
                                        {/* dot */}
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-zinc-400">
                                        판매자가 에스크로에 {item.sellAmount} NOAH-K를 입금하기를 기다리는 중입니다.
                                        </span>
                                      </div>

                                      <div className="flex flex-row items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-zinc-400">
                                        에스크로에 입급이 완료되면 거래가 시작되며 구매자에게 결제요청 알림이 전송됩니다.
                                        </span>
                                      </div>

                                      {/*
                                      <span className="text-sm text-zinc-400">

                                        {If_the_seller_does_not_deposit_the_USDT_to_escrow},

                                        {this_trade_will_be_cancelled_in} {

                                          (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) > 0
                                          ? (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) + ' ' + hours
                                          : (60 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) % 60) + ' ' + minutes

                                        } 

                                      </span>
                                      */}






                                    </div>
                                  </div>





                                  {item.buyer.walletAddress === address && (

                                    <div className="mt-4 flex flex-col items-center justify-center gap-2">


                                    {/*

                                      <div className="flex flex-row items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={agreementForCancelTrade[index]}
                                          onChange={(e) => {
                                            setAgreementForCancelTrade(
                                              sellOrders.map((item, idx) => {
                                                if (idx === index) {
                                                  return e.target.checked;
                                                } else {
                                                  return false;
                                                }
                                              })
                                            );
                                          }}
                                        />
                                        <label className="text-sm text-zinc-400">
                                          {I_agree_to_cancel_the_trade}
                                        </label>
                                      </div>


                                      <div className="mt-5 flex flex-row items-center gap-2">

                                        <button
                                          disabled={cancellings[index] || !agreementForCancelTrade[index]}
                                          className={`text-sm bg-red-500 text-white px-2 py-1 rounded-md ${cancellings[index] || !agreementForCancelTrade[index] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                                          onClick={() => {
                                            // api call
                                            // cancelSellOrder

                                            cancelTrade(item._id, index);

                                          }}
                                        >

                                          <div className="flex flex-row items-center gap-2 px-2 py-1">
                                            {cancellings[index] ? (
                                              <div className="
                                                w-4 h-4
                                                border-2 border-zinc-800
                                                rounded-full
                                                animate-spin
                                              ">
                                                <Image
                                                  src="/loading.png"
                                                  alt="loading"
                                                  width={16}
                                                  height={16}
                                                />
                                              </div>
                                            ) : (
                                              <Image
                                                src="/icon-cancelled.png"
                                                alt="Cancel"
                                                width={16}
                                                height={16}
                                              />
                                            )}
                                            {Cancel_My_Trade}
                                          </div>
                                            
                                        
                                        </button>
                                      </div>

                                      */}

                                    </div>

                                  )}


                                </div>
                              )}

                              {/* waiting for payment */}
                              {item.status === 'paymentRequested' && (

                                  <div className="mt-4 flex flex-col gap-2 items-start justify-start">

                                    <div className="flex flex-row items-center gap-2">

                                      <Image
                                        src="/smart-contract.png"
                                        alt="Smart Contract"
                                        width={32}
                                        height={32}
                                      />
                                      <span className="text-sm text-zinc-400">
                                        {Escrow}: {item.sellAmount} NOAH-K
                                      </span>
                                      <button
                                        className="bg-white text-black px-2 py-2 rounded-md"
                                        onClick={() => {
                              
                                            params.chain === 'arbitrum' ? window.open(`https://arbiscan.io/tx/${item.escrowTransactionHash}`) : window.open(`https://polygonscan.com/tx/${item.escrowTransactionHash}`);
                                            


                                        }}
                                      >
                                        <Image
                                          src={params.chain === 'arbitrum' ? '/logo-arbitrum.png' : '/logo-polygon.png'}
                                          alt="Chain"
                                          width={20}
                                          height={20}
                                        />
                                      </button>
                                    </div>

                                    <div className="flex flex-col gap-2 items-start justify-start">

                                      {/* rotate loading icon */}
                                      {/*
                                      <Image
                                        src="/loading.png"
                                        alt="Escrow"
                                        width={32}
                                        height={32}
                                        className="animate-spin"
                                      />
                                      */}
                                      {/*
                                      <div>
                                        Waiting for buyer to send {
                                      item.krwAmount.toLocaleString('ko-KR', {
                                        style: 'currency',
                                        currency: 'KRW',
                                      })} to seller...
                                      </div>
                                      */}
                                    
                                      {/* 판매자가 입급을 확인중입니다. */}
                                      {/* 판매자 결제계좌로 입금을 해야합니다. */}

                                      <div className="flex flex-row items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-zinc-400">
                                          판매자가 입급을 확인중입니다.
                                        </span>
                                      </div>
                                      <div className="flex flex-row items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-zinc-400">
                                          판매자 결제계좌로 입금을 해야합니다.
                                        </span>
                                      </div>

                                    </div>


                                  </div>
                              )}



                            





                              {item.status === 'ordered' && (
                                <>

                                {acceptingSellOrder[index] ? (

                                  <div className="flex flex-row items-center gap-2">
                                    <Image
                                      src='/loading.png'
                                      alt='loading'
                                      width={35}
                                      height={35}
                                      className="animate-spin"
                                    />
                                    <div>{Accepting_Order}...</div>
                                  </div>


                                ) : (
                                  <>
                                    
                                    {item.walletAddress === address ? (
                                      <div className="flex flex-col space-y-4">
                                        {My_Order}
                                      </div>
                                    ) : (
                                      <div className="w-full flex items-center justify-center">

                                        {item.status === 'ordered' && (
                                          
                                          // check if the order is expired
                                          new Date().getTime() - new Date(item.createdAt).getTime() > 1000 * 60 * 60 * 24

                                        ) ? (

                                          <>
                                            {/*
                                            <Image
                                              src="/icon-expired.png"
                                              alt="Expired"
                                              width={80}
                                              height={80}
                                            />
                                            */}
                                        
                                        </>
                                        ) : (

                                          <div className="mt-4 flex flex-col items-start justify-start gap-2">



                                            {/* agreement for trade */}
                                            <div className="flex flex-row items-center space-x-2">
                                              <input
                                                disabled={!address}
                                                type="checkbox"
                                                checked={agreementForTrade[index]}
                                                onChange={(e) => {
                                                    setAgreementForTrade(
                                                        sellOrders.map((item, idx) => {
                                                            if (idx === index) {
                                                                return e.target.checked;
                                                            } else {
                                                                return false;
                                                            }
                                                        })
                                                    );
                                                }}
                                                className="w-10 h-10
                                                  border border-gray-800 rounded-md
                                                "
                                              />
                                              <label className="text-sm text-zinc-400">
                                                
                                                {/*I_agree_to_the_terms_of_trade*/}
                                                거래조건에 동의하면 체크해주세요

                                              </label>
                                            </div>

                                            <div className="flex flex-row items-center justify-center gap-2">
                                              {/* dot */}
                                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                              <span className="text-sm text-zinc-400">
                                                구매자는 구매신청을 한후에 취소할수 없습니다.
                                              </span>
                                            </div>
                                            <div className="flex flex-row items-center justify-center gap-2">
                                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                              <span className="text-sm text-zinc-400">
                                                구매신청후에 거래를 완료하지 않으면 판매자에게 부정거래 회원으로 표시됩니다.
                                              </span>
                                            </div>

                                            <div className="w-full flex flex-row items-center justify-center gap-2">
                                              <button
                                                disabled={!address || !agreementForTrade[index]}
                                                className={`m-10 text-lg text-white px-4 py-2 rounded-md
                                                  ${!address || !agreementForTrade[index] ? 'bg-zinc-800' : 'bg-green-500 hover:bg-green-600'}
                                                  `}
                                                onClick={() => {
      
                                                  confirm('구매신청을 한후에 취소할수 없으며 구매신청후에 거래를 완료하지 않으면 판매자에게 부정거래 회원으로 표시됩니다. 정말로 구매신청을 하시겠습니까?') &&
                                                  acceptSellOrder(index, item._id, "");
                                              

                                                }}
                                              >
                                                {item.sellAmount} NOAH-K 구매하기
                                              </button>
                                            </div>


                                          </div>

                                        )}

                                      </div>



                                      )}

                                    </>

                                  )}

                                </>

                              )}



                          </article>




                          {/* status */}
                          {/*
                          <div className="absolute bottom-4 right-4 flex flex-row items-start justify-start">
                            <div className="text-xs text-zinc-400">
                              {item.status === 'ordered' ? 'Order opened at ' + new Date(item.createdAt).toLocaleString()
                              : item.status === 'accepted' ? 'Trade started at ' + new Date(item.acceptedAt).toLocaleString()
                              : item.status === 'paymentRequested' ? 'Payment requested at ' + new Date(item.paymentRequestedAt).toLocaleString()
                              : item.status === 'cancelled' ? 'Trade cancelled at ' + new Date(item.cancelledAt).toLocaleString()
                              : item.status === 'paymentConfirmed' ? 'Trade completed at ' + new Date(item.paymentConfirmedAt).toLocaleString()
                              : 'Unknown'}
                            </div>
                          </div>
                          */}






                        </div>
                  
                      ))}

                  </div>

                )}

            


            </div>

        

            
          </div>


        </main>

    );


};

