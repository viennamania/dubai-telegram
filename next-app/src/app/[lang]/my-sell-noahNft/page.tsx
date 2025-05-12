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







const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon

//const contractAddressArbitrum = "0x2f2a2543B76A4166549F7aab2e75Bef0aefC5B0f"; // USDT on Arbitrum

//const contractAddress = "0x9948328fa1813037a37F3d35C0b1e009d6d9a563"; // NOAH-K on Polygon




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
    
        setBalance( Number(result) / 10 ** 6 );
  
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





  // get User by wallet address

  const [user, setUser] = useState<any>(null);
  useEffect(() => {

    if (!address) {
        return;
    }

    fetch('/api/user/getUser', {
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


    











  // agreement for cancel trade
  const [agreementForCancelTrade, setAgreementForCancelTrade] = useState([] as boolean[]);
  useEffect(() => {
    setAgreementForCancelTrade(
      sellOrders.map(() => false)
    );
  } , [sellOrders]);





  


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



    // /api/orderNft/getAllBuyOrders

    const [buyOrders, setBuyOrders] = useState<any[]>([]);
    const [loadingBuyOrders, setLoadingBuyOrders] = useState(false);
    useEffect(() => {

      const fetchBuyOrders = async () => {

        setLoadingBuyOrders(true);

        fetch('/api/orderNft/getAllBuyOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        })
        .then(response => response.json())
        .then(data => {
            setBuyOrders(data.result.orders);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            setLoadingBuyOrders(false);
        });

      }

      fetchBuyOrders();

    } , []);

    //console.log('buyOrders', buyOrders);

    /*
    {

    "tradeId": "257182",

    "buyer": {

        "nickname": "genie",

    },
    "orderInfo": {
        "walletAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
        "contractAddress": "0xE6BeA856Cd054945cE7A9252B2dc360703841028",
        "tokenId": "1",
        "usdtPrice": 300,
        "fee": 0.05,
        "tax": 0.1,
        "rate": 1500,
        "krwPrice": 537075,
        "paymentInfo": {
            "bankName": "국민은행",
            "accountHolder": "김철수",
            "accountNumber": "123-456-7890"
        },
        "depositName": "홍길동"
    },

    "createdAt": "2025-02-11T04:18:39.697Z",
    "status": "ordered"
    }
    */




    /* agreement for trade */
    const [agreementForTrade, setAgreementForTrade] = useState([] as boolean[]);
    useEffect(() => {
        setAgreementForTrade (
            sellOrders.map((item, idx) => {
                return false;
            })
        );
    } , [buyOrders]);
    

    const [acceptingBuyOrder, setAcceptingBuyOrder] = useState([] as boolean[]);
    useEffect(() => {
        setAcceptingBuyOrder (
            buyOrders.map((item, idx) => {
                return false;
            })
        );
    } , [buyOrders]);
    

    const acceptBuyOrder = (
      index: number,
      tradeId: string,
    ) => {

      if (!address) {

        //toast.error('Please connect your wallet');
        alert('Please connect your wallet');

        return;
      }

      setAcceptingBuyOrder (
          sellOrders.map((item, idx) => {
              if (idx === index) {
                  return true;
              } else {
                  return false;
              }
          })
      );

      fetch('/api/orderNft/acceptBuyOrder', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              lang: params.lang,
              chain: params.chain,
              tradeId: tradeId,
              seller: {
                  walletAddress: address,
                  nickname: user ? user.nickname : '',
                  avatar: user ? user.avatar : '',
              },
          }),
      })
      .then(response => response.json())
      .then(data => {

          //console.log('data', data);

          //setSellOrders(data.result.orders);
          //openModal();

          //toast.success(Order_accepted_successfully);
          alert("주문을 성공적으로 수락했습니다");

          fetch('/api/orderNft/getAllBuyOrders', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
              }),
          })
          .then(response => response.json())
          .then(data => {
              setBuyOrders(data.result.orders);
          })

      })
      .catch((error) => {
          console.error('Error:', error);
          alert('주문을 수락하는데 실패했습니다');
      })
      .finally(() => {
          setAcceptingBuyOrder (
              sellOrders.map((item, idx) => {
                  return false;
              })
          );
      });

    }




    // cancel sell order state
    const [cancellings, setCancellings] = useState([] as boolean[]);
    useEffect(() => {
      setCancellings(buyOrders.map(() => false));
    } , [buyOrders]);


    const cancelTrade = async (tradeId: string, index: number) => {

      if (cancellings[index]) {
        return;
      }



      setCancellings(cancellings.map((item, i) => i === index ? true : item));

      const response = await fetch('/api/orderNft/cancelTradeBySeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tradeId: tradeId,
        })
      });

      if (!response.ok) {
        //toast.error('Failed to cancel trade');
        alert('거래취소에 실패했습니다');
        setCancellings(cancellings.map((item, i) => i === index ? false : item));
        return;
      }

      const data = await response.json();

      ///console.log('data', data);

      if (data.result) {

        //toast.success(Order_has_been_cancelled);
        alert(Order_has_been_cancelled);

        await fetch('/api/orderNft/getAllBuyOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        })
        .then(response => response.json())
        .then(data => {
            setBuyOrders(data.result.orders);
        })



      } else {
        //toast.error('Order has been failed');
        alert('거래취소에 실패했습니다');
      }

      setCancellings(cancellings.map((item, i) => i === index ? false : item));

    }





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


              <div className='flex flex-row items-center space-x-4'>
                  <Image
                    src="/trade-sell.png"
                    alt="buy"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />

                  <div className="text-2xl font-semibold">
                    NOAH 채굴 NFT 판매내역

                  </div>

              </div>

              {/* noah-100-blue-mining.mp4
              noah-300-green-mining.mp4
              noah-500-red-mining.mp4
              noah-1000-purple-mining.mp4
              noah-5000-orange-mining.mp4
              noah-10000-gold-mining.mp4
              */}
              <div className="flex flex-row items-center gap-2">

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  width={100}
                  height={100}
                >
                  <source src="/noah-100-blue-mining.mp4" type="video/mp4" />
                </video>

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  width={100}
                  height={100}
                >
                  <source src="/noah-300-green-mining.mp4" type="video/mp4" />
                </video>

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  width={100}
                  height={100}
                >
                  <source src="/noah-500-red-mining.mp4" type="video/mp4" />
                </video>

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  width={100}
                  height={100}
                >
                  <source src="/noah-1000-purple-mining.mp4" type="video/mp4" />
                </video>

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  width={100}
                  height={100}
                >
                  <source src="/noah-5000-orange-mining.mp4" type="video/mp4" />
                </video>

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  width={100}
                  height={100}
                >
                  <source src="/noah-10000-gold-mining.mp4" type="video/mp4" />
                </video>





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

                  <div className='flex flex-row items-center justify-center gap-2'>

                      <Image
                          src="/logo-tether.png"
                          alt="USDT"
                          width={30}
                          height={30}
                          className="rounded"
                      />                                


                      <div className="flex flex-col xl:flex-row gap-2 items-center justify-between">

                          <div className="flex flex-row items-center gap-2">
                            <span className="text-green-500 text-4xl font-semibold"> 
                                {
                                    Number(balance).toFixed(6)
                                }
                            </span>
                            <span className="text-gray-500 text-lg font-semibold">USDT</span>
                          </div>


                          <a
                              href={`https://polygonscan.com/token/${contractAddress}?a=${address}`}
                              target="_blank"
                              className="text-sm text-gray-400
                              border border-gray-800 rounded-md p-2"
                          >
                              Polygon Scan
                          </a>
                      </div>
                  </div>



                </div>
                





                <div className="w-full flex flex-row items-between justify-center gap-2">

                  <div className=" flex flex-row items-center justify-between gap-5">





                    <div className="ml-5 flex flex-col gap-2 items-start justify-end">
                      <div className="flex flex-row items-center gap-2">
                        {Seller}{' '}
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
                        {buyOrders.length} 
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
                      disabled={loadingBuyOrders}
                      className="text-sm bg-zinc-800 text-white px-2 py-1 rounded-md hover:bg-zinc-900"
                      onClick={() => {

                        setLoadingBuyOrders(true);
                        fetch('/api/orderNft/getAllBuyOrders', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                          }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            setBuyOrders(data.result.orders);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                        setLoadingBuyOrders(false);
                      }}
                    >
                      {loadingBuyOrders ? 'Loading...' : 'Reload'}
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


                  <div className="w-full overflow-x-auto">

                    <table className=" w-full table-auto border-collapse border border-zinc-800 rounded-md">

                      <thead
                        className="bg-zinc-800 text-white"
                      >
                        <tr>
                          <th className="p-2">구매신청일</th>
                          <th className="p-2">거래번호</th>
                          <th className="p-2">{Buyer}</th>
                          <th className="p-2">구매상품</th>
                          <th className="p-2">{Price}</th>
                          <th className="p-2">{Amount}</th>
                          <th className="p-2">{Payment}</th>
                          <th className="p-2">입금자명</th>
                          <th className="p-2">{Status}</th>
                          <th className="p-2">{Trades}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {buyOrders.map((item, index) => (
                          <tr key={index} className={`
                            ${index % 2 === 0 ? 'bg-zinc-700' : 'bg-zinc-800'}
                          `}>

                            <td className="p-2">
                              <div className="text-sm text-zinc-200">
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
                                  }</p>
                                ) : (
                                  <p>{
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

                            {/* trade id */}
                            <td className="p-2">
                              <div className="text-lg text-green-500 font-semibold">
                                #{item.tradeId}
                              </div>
                            </td>
                            
                            <td className="p-2">
                              <div className="flex flex-col gap-2 items-start">
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={item?.buyer?.avatar || "/profile-default.png"}
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
                                      {item.walletAddress === address ? '나' : item?.buyer?.nickname}
                                    </div>
                                  </div>
                                </div>

                                {/* wallet address 지갑주소 */}
                                <div className="flex flex-row items-center gap-2">
                                  <span className="text-sm text-gray-400">
                                    {
                                      item.walletAddress.substring(0, 6) + '...' + item.walletAddress.substring(item.walletAddress.length - 4, item.walletAddress.length)
                                    }
                                  </span>
                                  {/* copy button */}
                                  <button
                                    className="text-sm bg-zinc-800 text-white px-2 py-1 rounded-md hover:bg-zinc-900"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.walletAddress);
                                      alert('지갑주소가 복사되었습니다');
                                    }}
                                  >
                                    복사
                                  </button>
                                </div>
                              </div>

                            </td>

                            {/* NFT */}
                            <td className="p-2">



                                {item.orderInfo?.tokenId === '0' && (
                                  <div className="flex flex-row items-center gap-2">                              
                                    <video
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="rounded-lg"
                                      width={50}
                                      height={50}
                                    >
                                      <source src="/noah-100-blue-mining.mp4" type="video/mp4" />
                                    </video>
                                    <span className="text-sm font-semibold text-white">100 NOAH 채굴 NFT</span>
                                  </div>
                                )}

                                {item.orderInfo?.tokenId === '1' && (
                                  <div className="flex flex-row items-center gap-2">                              
                                    <video
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="rounded-lg"
                                      width={50}
                                      height={50}
                                    >
                                      <source src="/noah-300-green-mining.mp4" type="video/mp4" />
                                    </video>
                                    <span className="text-sm font-semibold text-white">300 NOAH 채굴 NFT</span>
                                  </div>
                                )}

                                {item.orderInfo?.tokenId === '2' && (
                                  <div className="flex flex-row items-center gap-2">                              
                                    <video
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="rounded-lg"
                                      width={50}
                                      height={50}
                                    >
                                      <source src="/noah-500-red-mining.mp4" type="video/mp4" />
                                    </video>
                                    <span className="text-sm font-semibold text-white">500 NOAH 채굴 NFT</span>
                                  </div>
                                )}

                                {item.orderInfo?.tokenId === '3' && (
                                  <div className="flex flex-row items-center gap-2">                              
                                    <video
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="rounded-lg"
                                      width={50}
                                      height={50}
                                    >
                                      <source src="/noah-1000-purple-mining.mp4" type="video/mp4" />
                                    </video>
                                    <span className="text-sm font-semibold text-white">1000 NOAH 채굴 NFT</span>
                                  </div>
                                )}

                                {item.orderInfo?.tokenId === '4' && (
                                  <div className="flex flex-row items-center gap-2">                              
                                    <video
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="rounded-lg"
                                      width={50}
                                      height={50}
                                    >
                                      <source src="/noah-5000-orange-mining.mp4" type="video/mp4" />
                                    </video>
                                    <span className="text-sm font-semibold text-white">5000 NOAH 채굴 NFT</span>
                                  </div>
                                )}


                                {item.orderInfo?.tokenId === '5' && (
                                  <div className="flex flex-row items-center gap-2">                              
                                    <video
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="rounded-lg"
                                      width={50}
                                      height={50}
                                    >
                                      <source src="/noah-10000-gold-mining.mp4" type="video/mp4" />
                                    </video>
                                    <span className="text-sm font-semibold text-white">10000 NOAH 채굴 NFT</span>
                                  </div>
                                )}

                            </td>

                            <td className="p-2">
                              <div className="flex flex-col gap-2 items-start">
                              
                                
                                <span className="text-lg font-semibold text-white">
                                  {
                                    // currency
                                    Number(item?.orderInfo?.krwPrice).toLocaleString('ko-KR', {
                                      style: 'currency',
                                      currency: 'KRW',
                                    })
                                  }
                                </span>
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="text-sm font-semibold text-white">
                                1 개
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="text-sm font-semibold text-white">
                                {item?.orderInfo?.paymentInfo?.bankName}{' '}{item?.orderInfo?.paymentInfo?.accountNumber}<br />
                                {item?.orderInfo?.paymentInfo?.accountHolder}
                              </div>
                            </td>

                            {/* deposit name */}
                            <td className="p-2">
                              <div className="text-sm font-semibold text-white">
                                {item?.orderInfo?.depositName}
                              </div>
                            </td>

                            <td className="p-2">
                              <div className="flex flex-row items-center gap-2">
                                {/* status */}
                                {item.status === 'ordered' && (
                                  <div className="text-sm text-yellow-500">
                                    구매신청
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

                                {item.status === 'paymentConfirmed' && (
                                  <div className="text-sm text-green-500">
                                    {Completed_at}
                                  </div>
                                )}

                              </div>
                            </td>

                            <td className="p-2 flex flex-col items-center justify-center gap-2">

                              {/*item.status === 'accepted' && item.buyer && item.buyer.walletAddress === address && (*/}
                              {item.status === 'ordered' && (
                                <div className="flex flex-row items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={agreementForCancelTrade[index]}
                                    onChange={(e) => {
                                      setAgreementForCancelTrade(
                                        agreementForCancelTrade.map((item, idx) => idx === index ? e.target.checked : item)
                                      );
                                    }}
                                    className="w-5 h-5
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
                                      cancelTrade(item.tradeId, index);
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
                                      "거래취소"
                                    }
                                  </button>
                                </div>
                              )}

                              {/*item.status === 'ordered' && item.walletAddress !== address && (*/}

                              {item.status === 'ordered' && (
                                <div className="flex flex-row items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={agreementForTrade[index]}
                                    onChange={(e) => {
                                      setAgreementForTrade(
                                        agreementForTrade.map((item, idx) => idx === index ? e.target.checked : item)
                                      );
                                    }}
                                    className="w-5 h-5
                                      border border-gray-800 rounded-md
                                    "
                                  />
                                  {/* acceptBuyOrder */}
                                  <button
                                    disabled={acceptingBuyOrder[index] || !agreementForTrade[index]}
                                    className={`
                                      ${acceptingBuyOrder[index] || !agreementForTrade[index] ?
                                        'bg-zinc-800 text-zinc-400' : 'bg-green-500 text-white'}
                                      px-2 py-1 rounded-md hover:bg-green-600
                                    `}
                                    onClick={() => {
                                      acceptBuyOrder(index, item.tradeId);
                                    }}
                                  >
                                    {acceptingBuyOrder[index] && (
                                      <Image
                                        src="/loading.png"
                                        alt="Loading"
                                        width={20}
                                        height={20}
                                        className="animate-spin"
                                      />
                                    )}
                                    {!acceptingBuyOrder[index] && 
                                      "입금확인"
                                    }
                                  </button>
                                  
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



            </div>

        

            
          </div>


        </main>

    );


};

