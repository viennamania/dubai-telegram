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
  nickname: string;
  trades: number;
  price: number;
  available: number;
  limit: string;
  paymentMethods: string[];

  usdtAmount: number;
  krwAmount: number;
  rate: number;

  walletAddress: string;

  seller: any;

  status: string;

  acceptedAt: string;

  paymentRequestedAt: string;

  cancelledAt: string;

  paymentConfirmedAt: string;
  escrowTransactionHash: string;

  tradeId: string;

  buyer: any;

  privateSale: boolean;
}





const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // DUBAI on Polygon


// get a contract
const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: polygon,
  // the contract's address
  address: contractAddress,
  // OPTIONAL: the contract's abi
  //abi: [...],
});




export default function Index({ params }: any) {

  //console.log('params', params);

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

    Order: "",
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
    Sell_USDT: "",  
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

    Sale: "",
    Private_Sale: "",

    Place_Order: "",

    Search_my_orders: "",

    Go_Sell_USDT: "",

    Cancel_My_Order: "",

    Order_has_been_placed: "",


    Placing_Order: "",

    hours_ago: "",
    minutes_ago: "",
    seconds_ago: "",

    SMS_will_be_sent_to_your_mobile_number: "",

    Profile : "",
    My_Profile_Picture : "",

    Edit : "",

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

    Order,
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
    Sell_USDT,
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

    Sale,
    Private_Sale,

    Place_Order,

    Search_my_orders,

    Go_Sell_USDT,

    Cancel_My_Order,

    Order_has_been_placed,

    Placing_Order,

    hours_ago,
    minutes_ago,
    seconds_ago,

    SMS_will_be_sent_to_your_mobile_number,

    Profile,
    My_Profile_Picture,

    Edit,


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





    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState("/profile-default.png");
    const [userCode, setUserCode] = useState("");
  
  
    const [user, setUser] = useState<any>(null);


    const [seller, setSeller] = useState(null) as any;
  
  
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
  
            //console.log("data", data);
  
            if (data.result) {
                setNickname(data.result.nickname);
                data.result.avatar && setAvatar(data.result.avatar);
                setUserCode(data.result.id);

                setUser(data.result);
  
                setSeller(data.result.seller);
  
            }
        };
  
        fetchData();
  
    }, [address]);










    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);

    //const [searchMyOrders, setSearchMyOrders] = useState(false);
    const [searchMyOrders, setSearchMyOrders] = useState(true);


    useEffect(() => {

        /*
        if (!address) {
          return;
        }
          */
        
        const fetchSellOrders = async () => {
          // api call
          const response = await fetch('/api/order/getAllSellOrders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              walletAddress: address,
              searchMyOrders: searchMyOrders
            })
          });
  
          const data = await response.json();
  
          
          //console.log('data', data);


  
          if (data.result) {
            setSellOrders(data.result.orders);
          }
  
        };
  
        fetchSellOrders();

        // fetch sell orders every 10 seconds

        const interval = setInterval(() => {
          fetchSellOrders();
        }, 10000);

        return () => clearInterval(interval);
  
    }, [address, searchMyOrders]);




    const [usdtAmount, setUsdtAmount] = useState(0);

    const [defaultKrWAmount, setDefaultKrwAmount] = useState(0);

    const [krwAmount, setKrwAmount] = useState(0);

    console.log('usdtAmount', usdtAmount);


    const [rate, setRate] = useState(1500);


    useEffect(() => {

      if (usdtAmount === 0) {

        setDefaultKrwAmount(0);

        setKrwAmount(0);

        return;
      }
    
        
      setDefaultKrwAmount( Math.round(usdtAmount * rate) );


      setKrwAmount( Math.round(usdtAmount * rate) );

    } , [usdtAmount, rate]);



    const [privateSale, setprivateSale] = useState(false);


    const [sellOrdering, setSellOrdering] = useState(false);

    const [agreementPlaceOrder, setAgreementPlaceOrder] = useState(false);


    const sellOrder = async () => {
      // api call
      // set sell order

      if (sellOrdering) {
        return;
      }


      if (agreementPlaceOrder === false) {
        
        //toast.error('You must agree to the terms and conditions');
        alert('You must agree to the terms and conditions');

        return;
      }


      setSellOrdering(true);

      

      const response = await fetch('/api/order/setSellOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          usdtAmount: usdtAmount,
          krwAmount: krwAmount,
          rate: rate,
          privateSale: privateSale,
        })
      });

      const data = await response.json();

      //console.log('data', data);

      if (data.result) {
        /*
        toast.success(
          Order_has_been_placed
        );
        */
        alert(Order_has_been_placed);

        setUsdtAmount(0);
        setprivateSale(false);

        setAgreementPlaceOrder(false);
     


        await fetch('/api/order/getAllSellOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          })
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

      setSellOrdering(false);

      

    };


    // cancel sell order state
    const [cancellings, setCancellings] = useState([] as boolean[]);
    useEffect(() => {
      setCancellings(sellOrders.map(() => false));
    }, [sellOrders]);



    const cancelSellOrder = async (orderId: string, index: number) => {

      if (cancellings[index]) {
        return;
      }

      setCancellings(cancellings.map((item, i) => i === index ? true : item));

      const response = await fetch('/api/order/cancelSellOrder', {
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
        
        //toast.success('Order has been cancelled');
        alert('Order has been cancelled');


        await fetch('/api/order/getAllSellOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          })
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




      
      //<main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">
      
    
    return (


      <main
        className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto"
      >


        <AutoConnect
            client={client}
            wallets={[wallet]}
            timeout={15000}
        />

        <div className="py-0 w-full">
  
          {/* goto home button using go back icon
          history back
          */}
          {/*
          <AppBarComponent />
          */}
  

          <div className="flex flex-col items-start justify-center space-y-4">

              <div className='flex flex-row items-center space-x-4'>
                  <Image
                    src="/trade-sell.png"
                    alt="USDT"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />
                  <div className="text-2xl font-semibold">
                    {Sell_USDT}
                  </div>


                    {/*
                    {!address && (
                        <ConnectButton

                            client={client}

                            wallets={wallets}
                            
                            accountAbstraction={{        
                            chain: polygon,
                            //chain: arbitrum,
                            factoryAddress: "0x655934C0B4bD79f52A2f7e6E60714175D5dd319b", // polygon, arbitrum
                            gasless: true,
                            }}
                            
                            theme={"light"}
                            connectModal={{
                            size: "wide",


                            }}


                            
                            appMetadata={
                            {
                                logoUrl: "https://gold.goodtether.com/logo.png",
                                name: "Next App",
                                url: "https://gold.goodtether.com",
                                description: "This is a Next App.",

                            }
                            }

                        />

                    )}
                    */}



              </div>


                <div className="w-full flex flex-row items-center justify-between gap-2">
                  {/* my usdt balance */}
                  <div className='w-full flex flex-row gap-2 items-center justify-between
                      border border-gray-800
                      p-4 rounded-lg'>

                      <Image
                          src="/logo-tether.png"
                          alt="USDT"
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
                          <span className="p-2 text-gray-500 text-lg font-semibold">USDT</span>

                      </div>
                  </div>
                </div>


                  <div className=" w-full flex gap-4  justify-center">


                    {/* sell order is different border color
                    */}
                    <div
                      className="w-full bg-black p-4 rounded-md border-2 border-green-500"
                    >

                      <div className="flex flex-col xl:flex-row gap-5 xl:gap-10 items-center">


                        <div className="flex flex-col gap-2 items-start">
                          
                          {/*
                          <div className=" flex flex-row items-center justify-between gap-4">
                  
                            <div className=" flex flex-row items-center gap-2">
                              <h2 className="text-lg font-semibold text-white">{Order}</h2>
                            </div>

                            <div className="flex flex-row items-center gap-2">

                              <Image
                                src="/icon-private-sale.png"
                                alt="Private Sale"
                                width={32}
                                height={32}
                              />

                              <div className="text-sm text-zinc-400">
                                {Private_Sale}
                              </div>
                              <input
                                className="w-6 h-6"
                                type="checkbox"
                                checked={privateSale}
                                onChange={(e) => setprivateSale(e.target.checked)}
                              />
                            </div>

                          </div>
                          */}


                          {/* my seller info */}

                          {address && seller && (



                            <div className="mt-4 flex flex-row items-center gap-2">
                              <Image
                                src={avatar || "/profile-default.png"}
                                alt="Profile"
                                width={24}
                                height={24}
                                className="rounded-full"
                                style={{
                                  objectFit: 'cover',
                                  width: '24px',
                                  height: '24px'
                                }}

                              />
                              <div className="text-lg font-semibold text-white">
                                {nickname}
                              </div>

                              <Image
                                src="/verified.png"
                                alt="Verified"
                                width={24}
                                height={24}
                              />
                              <Image
                                src="/best-seller.png"
                                alt="Identity"
                                width={24}
                                height={24}
                              />
                            </div>
                          )}


                          <p className="mt-4 text-xl font-bold text-zinc-400">
                            환율: 1 DUBAI = {
                            // currency format
                            Number(rate).toLocaleString('ko-KR', {
                              style: 'currency',
                              currency: 'KRW'
                            })
                          }</p>
                          
                          <div className=" flex flex-row items-center gap-2">

                            <div className="flex flex-row items-center gap-2 text-4xl text-blue-500 font-bold ">
                              <input 
                                type="number"
                                className=" w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 "
                                placeholder="Amount"
                                value={usdtAmount}
                                onChange={(e) => {
                                  // check number
                                  e.target.value = e.target.value.replace(/[^0-9.]/g, '');

                                  // if the value is start with 0, then remove 0
                                  if (e.target.value.startsWith('0')) {
                                    e.target.value = e.target.value.substring(1);
                                  }

                                  
                                  if (e.target.value === '') {
                                    setUsdtAmount(0);
                                    return;
                                  }
                                  
                                  parseFloat(e.target.value) < 0 ? setUsdtAmount(0) : setUsdtAmount(parseFloat(e.target.value));

                                  parseFloat(e.target.value) > 1000 ? setUsdtAmount(1000) : setUsdtAmount(parseFloat(e.target.value));

                                } }


                              />
                              <span className="text-lg">USDT</span>
                            </div>

                            <div className=" text-xl text-zinc-400 font-bold">
                              = {
                              Number(defaultKrWAmount).toLocaleString('ko-KR', {
                                style: 'currency',
                                currency: 'KRW'
                              })
                              }
                            </div>
                          </div>

                          {/* 판매할 수량을 입력하세요. */}
                          <div className="flex flex-row items-center gap-2">
                            {/* dot */}
                            <div className="w-2 h-2 bg-zinc-400 rounded-full inline-block mr-2"></div>
                            <span className="text-sm text-zinc-400">
                              판매할 수량을 입력하세요.
                            </span>
                          </div>



                          {seller && (
                          <p className=" text-sm text-zinc-400">
                            {Payment}: {Bank_Transfer} ({seller?.bankInfo.bankName})
                          </p>
                        )}

                        </div>


                        {/* input krw amount */}
                        {/* left side decrease button and center is input and  right side increase button */}
                        {/* -1, -10, -100, +1, +10, +100 */}
                        {/* if - button change bg color red */}
                        {/* if + button change bg color */}

                          <div className="mt-4  flex flex-row items-center justify-between gap-2">


                            <div className="flex flex-col gap-2">

                              <button
                                disabled={usdtAmount === 0}
                                className="bg-red-400 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  krwAmount > 0 && setKrwAmount(krwAmount - 1);
                                }}
                              >
                                -1
                              </button>

                              <button
                                disabled={usdtAmount === 0}
                                className="bg-red-600 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  krwAmount > 10 && setKrwAmount(krwAmount - 10);
                                }}
                              >
                                -10
                              </button>

                              <button
                                disabled={usdtAmount === 0}
                                className="bg-red-800 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  krwAmount > 100 && setKrwAmount(krwAmount - 100);
                                }}
                              >
                                -100
                              </button>

                              <button
                                disabled={usdtAmount === 0}
                                className="bg-red-900 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  krwAmount > 1000 && setKrwAmount(krwAmount - 1000);
                                }}
                              >
                                -1000
                              </button>

                            </div>

                            <div className="w-full flex flex-col items-center justify-center gap-2">
                              {/* 판매할 금액을 변경하세요 */}
                              <div className="flex flex-row items-center gap-2">
                                <div className="w-2 h-2 bg-zinc-400 rounded-full inline-block mr-2"></div>
                                <span className="text-sm text-zinc-400">
                                  판매할 금액을 변경하세요
                                </span>
                              </div>
                              <div className="flex flex-row items-center gap-2"> 
    
                                <input 
                                  disabled
                                  type="number"
                                  className=" w-36  px-3 py-2 text-black bg-white text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 "
                                  value={krwAmount}
                                  onChange={(e) => {
                                    // check number
                                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');

                                    if (e.target.value === '') {
                                      setKrwAmount(0);
                                      return;
                                    }

                                    parseFloat(e.target.value) < 0 ? setKrwAmount(0) : setKrwAmount(parseFloat(e.target.value));

                                    parseFloat(e.target.value) > 1000 ? setKrwAmount(1000) : setKrwAmount(parseFloat(e.target.value));

                                  } }
                                />
                              </div>

                              {krwAmount > 0 && (
                                <div className="text-lg font-semibold text-zinc-400">
                                  {Rate}: {

                                    // currency format
                                    Number((krwAmount / usdtAmount).toFixed(2)).toLocaleString('ko-KR', {
                                      style: 'currency',
                                      currency: 'KRW'
                                    })

                                  } 
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <button
                                disabled={usdtAmount === 0}
                                className="bg-green-400 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  setKrwAmount(krwAmount + 1);
                                }}
                              >
                                +1
                              </button>
                              <button
                                disabled={usdtAmount === 0}
                                className="bg-green-600 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  setKrwAmount(krwAmount + 10);
                                }}
                              >
                                +10
                              </button>

                              <button
                                disabled={usdtAmount === 0}
                                className="bg-green-800 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  setKrwAmount(krwAmount + 100);
                                }}
                              >
                                +100
                              </button>

                              <button
                                disabled={usdtAmount === 0}
                                className="bg-green-900 text-white px-2 py-2 rounded-md"
                                onClick={() => {
                                  setKrwAmount(krwAmount + 1000);
                                }}
                              >
                                +1000
                              </button>

                            </div>


                          </div>

                        </div>


                        {/* aggremment */}
                        {/* After you place order and the buyer accepts the order, you can not cancel the order. */}


                        <div className="mt-4 flex flex-row items-center gap-2">
                          <input
                            disabled={!address || usdtAmount === 0 || sellOrdering}
                            type="checkbox"
                            checked={agreementPlaceOrder}
                            onChange={(e) => setAgreementPlaceOrder(e.target.checked)}
                          />
                          <p className="text-sm text-zinc-400">
                            
                            {I_agree_to_the_terms_of_trade}

                          </p>
                        </div>


                        {/* terms and conditions */}
                        {/* text area */}
                        {/*
                        <textarea
                          className="w-full h-32 p-2 border border-gray-300 rounded-md text-sm text-black"
                          placeholder="
                            After you place order, the buyer has 24 hours to accept the order.
                            If the buyer does not accept the order within 24 hours, the order will be expired.
                            After the buyer accepts the order, you can not cancel the order.
                            After the buyer accepts the order, you must deposit the DUBAI to escrow within 1 hour.
                            If you do not deposit the DUBAI to escrow within 1 hour, the order will be expired.
                            If you want to cancel the order, you must contact the buyer and request to cancel the order.
                            If the buyer agrees to cancel the order, the order will be cancelled.
                          "
                        ></textarea>
                        */}



                        {/*
                        <div className="mt-4 text-sm text-zinc-400">

                          <div className="h-2 w-2 bg-zinc-400 rounded-full inline-block mr-2"></div>
                          <span>After you place order, the buyer has 24 hours to accept the order.
                            If the buyer does not accept the order within 24 hours, the order will be expired.
                          </span>
                        </div>
                        <div className="mt-4 text-sm text-zinc-400">

                          <div className="h-2 w-2 bg-zinc-400 rounded-full inline-block mr-2"></div>
                          <span>After the buyer accepts the order, you can not cancel the order.</span>
                        </div>
                        <div className="mt-4 text-sm text-zinc-400">

                          <div className="h-2 w-2 bg-zinc-400 rounded-full inline-block mr-2"></div>
                          <span>After the buyer accepts the order, you must deposit the DUBAI to escrow within 1 hour.
                            If you do not deposit the DUBAI to escrow within 1 hour, the order will be expired.
                          </span>
                        </div>
                        <div className="mt-4 text-sm text-zinc-400">

                          <div className="h-2 w-2 bg-zinc-400 rounded-full inline-block mr-2"></div>
                          <span>If you want to cancel the order, you must contact the buyer and request to cancel the order.
                            If the buyer agrees to cancel the order, the order will be cancelled.
                          </span>
                        </div>
                        */}





                        <div className="mt-4 flex flex-col gap-2">
                  
                          {sellOrdering ? (

                            <div className="flex flex-row items-center gap-2">
                                <div className="
                                  w-6 h-6
                                  border-2 border-zinc-800
                                  rounded-full
                                  animate-spin
                                ">
                                  <Image
                                    src="/loading.png"
                                    alt="loading"
                                    width={24}
                                    height={24}
                                  />
                                </div>
                                <div className="text-white">
                                  {Placing_Order}...
                                </div>
                  
                            </div>


                          ) : (
                              <button
                                  disabled={usdtAmount === 0 || agreementPlaceOrder === false}
                                  className={`text-lg text-white px-4 py-2 rounded-md ${usdtAmount === 0 || agreementPlaceOrder === false ? 'bg-gray-500' : 'bg-green-500'}`}
                                  onClick={() => {
                                      console.log('Sell DUBAI');
                                      // open trade detail
                                      // open modal of trade detail
                                      ///openModal();

                                      sellOrder();
                                  }}
                              >
                                {/*Place_Order*/}
                                판매주문하기
                              </button>
                          )}

                        </div>


                    </div>

                    <article
                      className="hidden xl:block"
                    ></article>

                    <article
                      className="hidden xl:block"
                    ></article>


                  </div>

         

                  {/* total sell orders */}
                  <div className="p-2 xl:p-0  flex flex-row items-center justify-between gap-2">

                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Total}</div>
                      <div className="text-xl font-semibold text-gray-400">
                        {sellOrders.length}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Orders}</div>
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
                      
                      {/*
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
                        <div className="text-lg font-semibold text-white ">{user?.nickname}</div>
                      </div>
                      */}


                      {/* checkbox for search my trades */}
                      {/*
                      <div className="flex flex-row items-center gap-2">
                        <input
                          disabled={!address}
                          type="checkbox"
                          checked={searchMyOrders}
                          onChange={(e) => setSearchMyOrders(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <label className="text-sm text-zinc-400">
                          {Search_my_trades}
                        </label>
                      </div>
                      */}

                    </div>



                  </div>


                  <div className=" w-full grid gap-4 xl:grid-cols-3 justify-center">

                    {sellOrders.length === 0 && (
                      <div className="w-full flex flex-col items-center justify-center gap-4">
                        <Image
                          src="/no-data.png"
                          alt="No Data"
                          width={100}
                          height={100}
                        />
                        <div className="text-xl font-semibold text-gray-400">
                          퍈매주문한 내역이 없습니다.
                        </div>
                      </div>
                    )}


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
                            key={index}
                            className={`

                              w-96 xl:w-full h-full

                              bg-black p-4 rounded-md border
                              
                               ${item.walletAddress === address ? 'border-green-500' : 'border-gray-200'}
                               

                               ${item.status === 'paymentConfirmed' ? 'bg-gray-900 border-gray-900' : ''}

                            `}
                        >

                            {item.status === 'ordered' && (
                              <div className="flex flex-col items-start gap-1">


                                <div className="flex flex-row items-center gap-2">
                                  {/* new order icon 1 hour after created */}

            
                                  {
                                    (new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60 < 1 && (
                                      <Image
                                        src="/icon-new.png"
                                        alt="New Order"
                                        width={32}
                                        height={32}
                                      />
                                    ) 
                                  } 



                                  {item.privateSale ? (
                                      <Image
                                        src="/icon-private-sale.png"
                                        alt="Private Sale"
                                        width={32}
                                        height={32}
                                      />
                                  ) : (
                                      <Image
                                        src="/icon-public-sale.png"
                                        alt="Public Sale"
                                        width={32}
                                        height={32}
                                      />
                                  )}

                                  <p className="text-sm text-zinc-400">
                                    {
                                    new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 ? (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000) + ' ' + seconds_ago
                                    ) :
                                    new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 ? (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) + ' ' + minutes_ago
                                    ) : (
                                      ' ' + Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) + ' ' + hours_ago
                                    )}에 시작되었습니다.
                                  </p>

                                </div>

                                {24 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) > 0 ? (

                                  <div className="mt-2 flex flex-row items-center space-x-2">
                                    <Image
                                      src="/icon-timer.webp"
                                      alt="Timer"
                                      width={28}
                                      height={28}
                                    />
                                    <p className="text-sm text-zinc-400">
                                      {

                                      24 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60) - 1

                                    } 시간 {
                                      60 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60) % 60
                                    } 분후에 만료됩니다.

                                    
                                    </p>
                                  </div>

                                  ) : (
                                  <div className="mt-2 flex flex-row items-center space-x-2">
                                    <Image
                                      src="/icon-timer.webp"
                                      alt="Expired"
                                      width={28}
                                      height={28}
                                    />
                                    <p className="text-sm text-zinc-400">
                                      만료되었습니다.
                                    </p>
                                  </div>
                                )}

                              </div>
                            )}






                            { (item.status === 'accepted' || item.status === 'paymentRequested' || item.status === 'cancelled') && (

                              <div className="flex flex-row items-center gap-2  bg-white px-2 py-1 rounded-md mb-4  ">




                                {item.privateSale && (
                                    <Image
                                      src="/icon-private-sale.png"
                                      alt="Private Sale"
                                      width={32}
                                      height={32}
                                    />
                                ) }

                                { (item.status === 'accepted' || item.status === 'paymentRequested') && (
                                  <Image
                                    src="/icon-trade.png"
                                    alt="Trade"
                                    width={32}
                                    height={32}
                                  />
                                )}


                                <p className="text-xl font-semibold text-green-500 ">
                                  TID: {item.tradeId}
                                </p>

                              </div>

                            )}


                            { (item.status === 'paymentConfirmed') && (

                              <div className="flex flex-row items-center gap-2  bg-white px-2 py-1 rounded-md mb-4">

                                <Image
                                  src="/confirmed.png"
                                  alt="Payment Confirmed"
                                  width={50}
                                  height={50}
                                />

                                <p className="text-xl font-semibold text-green-500 ">
                                  TID: {item.tradeId}
                                </p>
                              </div>

                            )}


                            {item.acceptedAt && (
                              <p className="mb-2 text-sm text-zinc-400">
                                {new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()}
                                에 거래가 시작되었습니다.
                              </p>
                            )}



                            {item.status === 'cancelled' && (

                                <p className="text-sm text-zinc-400"> 
                                  {new Date(item?.cancelledAt).toLocaleString()}
                                  에 거래가 취소되었습니다.
                                </p>
                    
                            )}



                            {item.paymentConfirmedAt && (
                              <p className="mb-2 text-sm text-zinc-400">
                                
                                {new Date(item.paymentConfirmedAt).toLocaleDateString() + ' ' + new Date(item.paymentConfirmedAt).toLocaleTimeString()}
                                에 거래가 완료되었습니다.
                            
                              </p>
                            )}



                            <div className="mt-4 flex flex-col items-start gap-2">




                              <div className="flex flex-row items-start gap-2">

                                <p className="text-2xl font-semibold text-white">
                                  {item.usdtAmount} DUBAI
                                </p>

                                <p className="text-lg font-semibold text-white">{Rate}: {

                                  Number(item.krwAmount / item.usdtAmount).toFixed(2)

                                }</p>

                              </div>



                              <p className="text-2xl text-zinc-400">
                                {Price}: {
                                  // currency
                                
                                  Number(item.krwAmount).toLocaleString('ko-KR', {
                                    style: 'currency',
                                    currency: 'KRW',
                                  })

                                }
                              </p>


                            </div>


                            <p className="mt-2 text-sm text-zinc-400">
                              {Payment}: {Bank_Transfer} ({item.seller?.bankInfo.bankName})
                            </p>



                       

                            
                            <div className="mt-4 flex text-lg font-semibold mb-2">
                              {
   

                                item.walletAddress === address &&
                                (item.status === 'accepted' || item.status === 'paymentRequested') ? (

                                  <div className="flex flex-row items-center gap-2">
                                    <span>{Seller}: {item.nickname}</span>
                                    <span className="text-green-500">:{Me}</span>
                                    
                                    {/* goto /sell-usdt/:id */}

                                    <div
                                      className="text-sm
                                        bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer"

                                      onClick={() => {
                                        router.push(
                                          "/" + params.lang + `/sell-usdt/${item._id}`);
                                      }}
                                    >
                                      {Go_Sell_USDT}
                                    </div>
                                
                                  </div>

                                ) : (item.walletAddress === address && item.status === 'ordered') ? (

                                  <div className="flex flex-row items-center gap-2">
                                    <span>{Seller}: {item.nickname}</span>
                                    <span className="text-green-500">:{Me}</span>
                                           
                                    <button
                                        disabled={cancellings[index]}
                                        className={`text-sm bg-red-500 text-white px-3 py-2 rounded-md ${cancellings[index] ? 'bg-gray-500' : ''}`}
                                        onClick={() => {
                                          // api call
                                          // cancelSellOrder
      
                                          cancelSellOrder(item._id, index);
      
                                        }}
                                    >
      
                                      <div className="flex flex-row text-xs items-center gap-2 ">
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
                                              width={12}
                                              height={12}
                                            />
                                          </div>
                                        ) : (
                                          <Image
                                            src="/icon-cancelled.png"
                                            alt="Cancel"
                                            width={12}
                                            height={12}
                                          />
                                        )}
                                        <div className="flex flex-row xl:flex-col items-center gap-1">
                                          <span>{Cancel_My_Order}</span>
                                        </div>
                                      </div>
                                      
                                    </button>

                                  </div>
  

                                ) : (
                                
                                  <span>
                                    {Seller}: {item.nickname}
                                  </span>

                                )

                              }
                            </div>

   



                            {/* accept order button for seller */}

                            {(item.status === 'accepted' || item.status === 'paymentRequested' || item.status === 'paymentConfirmed' || item.status === 'cancelled') 
                              && (
                                <div className="w-full mt-4 mb-2 flex flex-col items-start ">

                                  <p className="text-xl text-green-500 font-semibold">
                                    {Buyer}: {
                                      item.buyer.walletAddress === address ? item.buyer.nickname + ' :' + Me :
                                    
                                      item.buyer.nickname.substring(0, 1) + '****'
                                    }
                                  </p>

                                </div>
                            )}





                            {/* share button */}
                           

                            {/*
                            <div className=" mt-4 flex flex-row gap-2 items-center justify-center">

                              {item.privateSale && (
                                <Image
                                  src="/icon-private-sale.png"
                                  alt="Private Sale"
                                  width={48}
                                  height={48}
                                />
                              )}
   

                              {item.walletAddress === address && item.privateSale && (
                                <button
                                    className=" flex flex-row text-sm bg-blue-500 text-white px-2 py-1 rounded-md"
                                    onClick={() => {
                                      
                                      ////router.push(`/sell-usdt/${item._id}`);

                                      // copy to clipboard
                                      navigator.clipboard.writeText(`https://gold.goodtether.com/${params.lang}/sell-usdt/${item._id}`);
                                      
                                      //toast.success('Link has been copied to clipboard');
                                      alert('Link has been copied to clipboard');

                                    }}
                                >

                                  <Image
                                    src="/icon-share.png"
                                    alt="Share"
                                    width={16}
                                    height={16}
                                    className="mr-2"
                                  />
                                  Share
                                </button>
                              )}


                            </div>
                            */}
                          




                            {/* waiting for escrow */}
                            {item.status === 'accepted' && (
                                <div className="mt-4 flex flex-row gap-2 items-center justify-start">
                                  <Image
                                    src="/loading.png"
                                    alt="Escrow"
                                    width={32}
                                    height={32}
                                    className="animate-spin"
                                  />

                                  <div className="flex flex-col gap-2 items-start">
                                    <span>
                                      {Waiting_for_seller_to_deposit}
                                      {item.usdtAmount} DUBAI
                                      {to_escrow}....
                                    </span>

                                    <span className="text-sm text-zinc-400">

                                      {If_the_seller_does_not_deposit_the_USDT_to_escrow}

                                      {this_trade_will_be_cancelled_in}

                                      {
                                        (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) > 0
                                        ? (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) + ' hours'
                                        : (60 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) % 60) + ' minutes'

                                      }

                                    </span>
                                  </div>
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
                                    <div>Escrow: {item.usdtAmount} DUBAI</div>
                                    <button
                                      className="bg-white text-black px-2 py-2 rounded-md"
                                      onClick={() => {
                                          // new window for smart contract
                                          window.open(`https://polygonscan.com/tx/${item.escrowTransactionHash}`);
                                      }}
                                    >
                                      <Image
                                        src="/logo-polygon.png"
                                        alt="Polygon"
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

                                    <div>
                                      {Waiting_for_seller_to_deposit} {item.krwAmount} KRW to {Seller}...
                                    </div>

                                  </div>

                                </div>
                            )}
                        </article>


                      </div>

                    ))}

                </div>

            </div>

            
          </div>


        </main>

    );


};




