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
}







//const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon
const contractAddressArbitrum = "0x2f2a2543B76A4166549F7aab2e75Bef0aefC5B0f"; // USDT on Arbitrum

const contractAddress = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d'; // CEBIEN on Polygon


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

    Buy_CEBIEN: "",
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

    Buy_CEBIEN,
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
   
  
      const account = useActiveAccount() as any;
  
  
      const contract = getContract({
          client,
          chain: polygon,
          address: contractAddress,
      });
      
  
      
  


    const address = account?.address;


    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  



    const router = useRouter();




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
  
      //setBalance( Number(result) / 10 ** 6 );

      setBalance( Number(result) / 10 ** 18 );



    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract, params.chain]);



  const [escrowWalletAddress, setEscrowWalletAddress] = useState('');
  const [makeingEscrowWallet, setMakeingEscrowWallet] = useState(false);

  const makeEscrowWallet = async () => {
      
    if (!address) {
      
      //toast.error('Please connect your wallet');
      alert('Please connect your wallet');

      return;
    }


    setMakeingEscrowWallet(true);

    fetch('/api/orderCebien/getEscrowWalletAddress', {
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

  
      setEscrowBalance( Number(result) / 10 ** 6 );




      await fetch('/api/user/getBalanceByWalletAddress', {
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

    


    //const [searchMyTrades, setSearchMyTrades] = useState(true);

    const [searchMyTrades, setSearchMyTrades] = useState(false);


    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);

    useEffect(() => {


        const fetchSellOrders = async () => {


            const response = await fetch('/api/orderCebien/getAllSellOrdersForBuyer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(

                  {
                    walletAddress: address,
                    searchMyTrades: searchMyTrades,
                  }

              ),
            });




            const data = await response.json();
            setSellOrders(data.result.orders);
        }

        fetchSellOrders();

        /*
        const interval = setInterval(() => {
            fetchSellOrders();
        }, 10000);


        return () => clearInterval(interval);
        */



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


        fetch('/api/orderCebien/acceptSellOrder', {
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



            fetch('/api/orderCebien/getAllSellOrdersForBuyer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(

                  {
                    walletAddress: address,
                    searchMyTrades: searchMyTrades,
                  }

              ),
            })
            .then(response => response.json())
            .then(data => {
                ///console.log('data', data);
                setSellOrders(data.result.orders);
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

      const response = await fetch('/api/orderCebien/cancelTradeByBuyer', {
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

        await fetch('/api/orderCebien/getAllSellOrdersForBuyer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(

            {
              walletAddress: address,
              searchMyTrades: searchMyTrades,
            }

          ),
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







    return (

      <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

        <AutoConnect
            client={client}
            wallets={[wallet]}
            timeout={15000}
        />

        <div className="py-0 w-full">

          <div className="flex flex-col items-start justify-center space-y-4">

              <div className='flex flex-row items-center space-x-4'>
                  <Image
                    src="/trade-buy.png"
                    alt="Buy"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />

                  <div className="text-2xl font-semibold">{Buy_CEBIEN}</div>

              </div>


                <div className="w-full flex flex-row items-center justify-between gap-2">
                  {/* my usdt balance */}
                  <div className='w-full flex flex-row gap-2 items-center justify-between
                      border border-gray-800
                      p-4 rounded-lg'>

                      <Image
                          src="/logo-token-cebien.png"
                          alt="CEBIEN"
                          width={30}
                          height={30}
                          className="rounded"
                      />                                


                      <div className="flex flex-row gap-2 items-center justify-between">

                          <span className="p-2 text-green-500 text-4xl font-semibold"> 
                              {
                                  Number(balance).toFixed(2)
                              }
                          </span>
                          <span className="p-2 text-gray-500 text-lg font-semibold">CEBIEN</span>

                      </div>
                  </div>
                </div>





                <div className="w-full flex flex-row items-between justify-start gap-2">

                  <div className="flex flex-row items-center  gap-2">

                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Total}</div>
                      <div className="text-xl font-semibold text-gray-400">
                        {sellOrders.length} 
                      </div>
                      
                    </div>

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



                    <div className="ml-5 flex flex-col gap-2 items-start justify-end">
                      <div className="flex flex-row items-center gap-2">
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

                  </div>


                  <div className="ml-10 flex flex-col items-center gap-2">
                    {/* reload button */}
                    <button
                      className="text-sm bg-zinc-800 text-white px-2 py-1 rounded-md hover:bg-zinc-900"
                      onClick={() => {
                        fetch('/api/orderCebien/getAllSellOrdersForBuyer', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(

                            {
                              walletAddress: address,
                              searchMyTrades: searchMyTrades,
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
                      Reload
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
                                    {item.walletAddress === address ? 'Me' : item.nickname}
                                  </div>
                                  <div className="text-sm text-zinc-400">
                                    {item.walletAddress === address ? 'Me' : item.tradeId ? item.tradeId : ''}
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
                                {item.sellAmount} CEBIEN
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
                                  />
                                  <button
                                    disabled={cancellings[index] || !agreementForCancelTrade[index]}
                                    className={`
                                      ${cancellings[index] || !agreementForCancelTrade[index] ?
                                        'bg-zinc-800 text-zinc-400' : 'bg-red-500 text-white'}
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

                  <div className="w-full grid gap-4 lg:grid-cols-2 xl:grid-cols-3 justify-center ">

                      {sellOrders.map((item, index) => (
          
                        <div
                          key={index}
                          className="relative flex flex-col items-center justify-center"
                        >


                          {item.status === 'ordered' && (new Date().getTime() - new Date(item.createdAt).getTime() > 1000 * 60 * 60 * 24) && (
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
                          )}

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
                              //key={index}
                              className={` w-96 xl:w-full h-full relative
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
                                ${item.status !== 'cancelled' && 'h-16'}

                                mb-4 flex flex-row items-center bg-zinc-800 px-2 py-1 rounded-md`}>
                                  <Image
                                    src="/icon-trade.png"
                                    alt="Trade"
                                    width={32}
                                    height={32}
                                  />


                                  <p className="text-sm font-semibold text-green-500 ">
                                    #{item.tradeId}
                                  </p>

                                  {item.status === 'cancelled' ? (
                                    <p className="ml-2 text-sm text-zinc-400">
                                      {new Date(item.acceptedAt).toLocaleString()}
                                    </p>
                                  ) : (
                                    
                                    <>
                                      {params.lang === 'kr' ? (

                                        <p className="ml-2 text-sm text-zinc-400">

                                        
                                          {new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 ? (
                                            ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000) + ' ' + seconds_ago
                                          ) :
                                          new Date().getTime() - new Date(item.acceptedAt).getTime() < 1000 * 60 * 60 ? (
                                          ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                          ) : (
                                            ' ' + Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                          )
                                          }{' '}{Trade_Started}

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




                    

                              <div className="mt-4 flex flex-col items-start">

                                <div className="mt-2 flex flex-row items-start gap-2">

                                  <p className="text-4xl font-semibold text-white">
                                    {item.sellAmount}{' '}CEBIEN
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

                    


{/*
                                    item.seller?.bankInfo.bankName === '090' ? '카카오뱅크' :
                                    item.seller?.bankInfo.bankName === '089' ? '케이뱅크' :
                                    item.seller?.bankInfo.bankName === '092' ? '토스뱅크' :

                                    item.seller?.bankInfo.bankName === '004' ? '국민은행' :
                                    item.seller?.bankInfo.bankName === '020' ? '우리은행' :
                                    item.seller?.bankInfo.bankName === '088' ? '신한은행' :
                                    item.seller?.bankInfo.bankName === '011' ? '농협' :
                                    item.seller?.bankInfo.bankName === '003' ? '기업은행' :
                                    item.seller?.bankInfo.bankName === '081' ? '하나은행' :
                                    item.seller?.bankInfo.bankName === '002' ? '외환은행' :
                                    item.seller?.bankInfo.bankName === '032' ? '부산은행' :
                                    item.seller?.bankInfo.bankName === '031' ? '대구은행' :
                                    item.seller?.bankInfo.bankName === '037' ? '전북은행' :
                                    item.seller?.bankInfo.bankName === '071' ? '경북은행' :
                                    item.seller?.bankInfo.bankName === '034' ? '광주은행' :
                                    item.seller?.bankInfo.bankName === '071' ? '우체국' :
                                    item.seller?.bankInfo.bankName === '007' ? '수협' :
                                    item.seller?.bankInfo.bankName === '027' ? '씨티은행' :
                                    item.seller?.bankInfo.bankName === '055' ? '대신은행' :
                                    item.seller?.bankInfo.bankName === '054' ? '동양종합금융' :
                                    item.seller?.bankInfo.bankName === '230' ? '미래에셋증권' :

                                    item.seller?.bankInfo.bankName
*/}

                              <div className="mt-4 mb-4 flex flex-col items-start text-sm
                                text-zinc-400
                              ">
                                {Payment}: (
                                  {
                                    item.seller?.bankInfo.bankName === '090' ? '카카오뱅크' :
                                    item.seller?.bankInfo.bankName === '089' ? '케이뱅크' :
                                    item.seller?.bankInfo.bankName === '092' ? '토스뱅크' :

                                    item.seller?.bankInfo.bankName === '004' ? '국민은행' :
                                    item.seller?.bankInfo.bankName === '020' ? '우리은행' :
                                    item.seller?.bankInfo.bankName === '088' ? '신한은행' :
                                    item.seller?.bankInfo.bankName === '011' ? '농협' :
                                    item.seller?.bankInfo.bankName === '003' ? '기업은행' :
                                    item.seller?.bankInfo.bankName === '081' ? '하나은행' :
                                    item.seller?.bankInfo.bankName === '002' ? '외환은행' :
                                    item.seller?.bankInfo.bankName === '032' ? '부산은행' :
                                    item.seller?.bankInfo.bankName === '031' ? '대구은행' :
                                    item.seller?.bankInfo.bankName === '037' ? '전북은행' :
                                    item.seller?.bankInfo.bankName === '071' ? '경북은행' :
                                    item.seller?.bankInfo.bankName === '034' ? '광주은행' :
                                    item.seller?.bankInfo.bankName === '071' ? '우체국' :
                                    item.seller?.bankInfo.bankName === '007' ? '수협' :
                                    item.seller?.bankInfo.bankName === '027' ? '씨티은행' :
                                    item.seller?.bankInfo.bankName === '055' ? '대신은행' :
                                    item.seller?.bankInfo.bankName === '054' ? '동양종합금융' :
                                    item.seller?.bankInfo.bankName === '230' ? '미래에셋증권' :

                                    item.seller?.bankInfo.bankName
                                  }
                                )
                              </div>



                              <div className="flex flex-col items-start justify-start gap-2">
                                <p className="flex items-center gap-2">

                                  <Image
                                      src={item.avatar || '/profile-default.png'}
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

                                  <div className="flex items-center space-x-2
                                    text-lg font-semibold text-white
                                  ">
                                    {Seller}:
                                  </div>

                                  <h2 className="text-lg font-semibold
                                    text-white
                                  ">
                                    {item.walletAddress === address ? 'Me' : item.nickname}
                                  
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



                              {item?.buyer && (item.status === 'accepted' || item.status === 'paymentRequested') && (
                          
                               
                                
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
                              
                              )}
                            

                              {/* waiting for escrow */}
                              {item.status === 'accepted' && (



                                <div className="mt-4 flex flex-col gap-2 items-center justify-start">


                                    
                                    
                                  <div className="mt-4 flex flex-row gap-2 items-center justify-start">
                                    <Image
                                      src="/loading.png"
                                      alt="Escrow"
                                      width={32}
                                      height={32}
                                      className="animate-spin"
                                    />

                                    <div className="flex flex-col gap-2 items-start">
                                      <span className="text-lg text-green-500 font-semibold">
                                        {Waiting_for_seller_to_deposit} {item.sellAmount} CEBIEN {to_escrow}...
                                      </span>

                                      <span className="text-sm text-zinc-400">

                                        {If_the_seller_does_not_deposit_the_USDT_to_escrow},

                                        {this_trade_will_be_cancelled_in} {

                                          (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) > 0
                                          ? (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) + ' ' + hours
                                          : (60 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) % 60) + ' ' + minutes

                                        } 

                                      </span>
                                    </div>
                                  </div>





                                  {item.buyer.walletAddress === address && (

                                    <div className="mt-4 flex flex-col items-center justify-center gap-2">



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
                                      <span className="text-lg text-green-500 font-semibold">
                                        {Escrow}: {item.sellAmount} CEBIEN
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

                                    <div className="flex flex-row gap-2 items-center justify-start">

                                      {/* rotate loading icon */}
                                    
                                      <Image
                                        src="/loading.png"
                                        alt="Escrow"
                                        width={32}
                                        height={32}
                                        className="animate-spin"
                                      />

                                      <div className="flex flex-col gap-2 items-start">
                                        <span className="text-lg text-green-500 font-semibold">
                                          판매자가 입금을 기다리는 중입니다. 아래 계좌로 입금을 완료하면 에스크로되어 있는 CEBIEN 이 구매자에게 전달됩니다.
                                        </span>
                                        <span className="text-lg text-zinc-400">
                                          입금액: {
                                            item.krwAmount.toLocaleString('ko-KR', {
                                              style: 'currency',
                                              currency: 'KRW',
                                            })
                                          }
                                        </span>
                                        {/* 입금은행 */}
                                        <span className="text-lg text-zinc-400">
                                          입금은행: {
                                            item.seller?.bankInfo.bankName === '090' ? '카카오뱅크' :
                                            item.seller?.bankInfo.bankName === '089' ? '케이뱅크' :
                                            item.seller?.bankInfo.bankName === '092' ? '토스뱅크' :

                                            item.seller?.bankInfo.bankName === '004' ? '국민은행' :
                                            item.seller?.bankInfo.bankName === '020' ? '우리은행' :
                                            item.seller?.bankInfo.bankName === '088' ? '신한은행' :
                                            item.seller?.bankInfo.bankName === '011' ? '농협' :
                                            item.seller?.bankInfo.bankName === '003' ? '기업은행' :
                                            item.seller?.bankInfo.bankName === '081' ? '하나은행' :
                                            item.seller?.bankInfo.bankName === '002' ? '외환은행' :
                                            item.seller?.bankInfo.bankName === '032' ? '부산은행' :
                                            item.seller?.bankInfo.bankName === '031' ? '대구은행' :
                                            item.seller?.bankInfo.bankName === '037' ? '전북은행' :
                                            item.seller?.bankInfo.bankName === '071' ? '경북은행' :
                                            item.seller?.bankInfo.bankName === '034' ? '광주은행' :
                                            item.seller?.bankInfo.bankName === '071' ? '우체국' :
                                            item.seller?.bankInfo.bankName === '007' ? '수협' :
                                            item.seller?.bankInfo.bankName === '027' ? '씨티은행' :
                                            item.seller?.bankInfo.bankName === '055' ? '대신은행' :
                                            item.seller?.bankInfo.bankName === '054' ? '동양종합금융' :
                                            item.seller?.bankInfo.bankName === '230' ? '미래에셋증권' :

                                            item.seller?.bankInfo.bankName
                                          }
                                        </span>
                                        {/* 입금계좌 */}
                                        <div className="flex flex-row items-center gap-2">
                                          <span className="text-lg text-zinc-400">
                                            입금계좌: {item.seller?.bankInfo.accountNumber}
                                          </span>
                                          {/* 복사 버튼 */}
                                          <button
                                            className="bg-white text-black px-2 py-1 rounded-md"
                                            onClick={() => {
                                              navigator.clipboard.writeText(item.seller?.bankInfo.accountNumber);
                                              alert('계좌번호가 복사되었습니다.');
                                            }}
                                          >
                                            <Image
                                              src="/icon-copy.png"
                                              alt="Copy"
                                              width={20}
                                              height={20}
                                            />
                                          </button>
                                        </div>
                                        {/* 입금자명 */}
                                        <div className="flex flex-row items-center gap-2">
                                          <span className="text-lg text-zinc-400">
                                            예금주명: {item.seller?.bankInfo.accountHolder}
                                          </span>
                                        </div>
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
                                    <span className="text-lg text-green-500 font-semibold">
                                      {Accepting_Order}...
                                    </span>
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

                                          <div className="mt-4 flex flex-col items-center justify-center">






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
                                              />
                                              <label className="text-sm text-zinc-400">
                                                {I_agree_to_the_terms_of_trade}
                                              </label>
                                            </div>

                                            <button
                                              disabled={!address || !agreementForTrade[index]}
                                              className={`m-10 text-lg text-white px-4 py-2 rounded-md
                                                ${!address || !agreementForTrade[index] ? 'bg-zinc-800' : 'bg-green-500 hover:bg-green-600'}
                                                `}
                                              onClick={() => {
    
                                                  acceptSellOrder(index, item._id, "");
                                            

                                              }}
                                            >
                                              {Buy} {item.sellAmount} CEBIEN
                                            </button>


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

