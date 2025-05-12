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

  sellAmount: number;
  krwAmount: number;
  rate: number;

  walletAddress: string;

  seller: any;

  status: string;

  acceptedAt: string;

  paymentRequestedAt: string;

  cancelledAt: string;

  paymentConfirmedAt: string;
  escrowWalletAddress: string;
  escrowTransactionHash: string;

  tradeId: string;

  buyer: any;

  privateSale: boolean;

  escrow: any;

  virtualAccount: string;
}





//const contractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon

//const contractAddress = "0x9948328fa1813037a37F3d35C0b1e009d6d9a563"; // USDT on Polygon

const contractAddress = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d'; // CEBIEN on Polygon




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

    Sell_CEBIEN: "", 
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

    Sell_CEBIEN,
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
    
        //setBalance( Number(result) / 10 ** 18 );
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

    //const [escrowWalletAddress, setEscrowWalletAddress] = useState("");
  
  
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
  
            console.log("data", data);
  
            if (data.result) {
                setNickname(data.result.nickname);
                data.result.avatar && setAvatar(data.result.avatar);
                setUserCode(data.result.id);

                setUser(data.result);
  
                setSeller(data.result.seller);

                //setEscrowWalletAddress(data.result.escrowWalletAddress);
  
            }
        };
  
        fetchData();
  
    }, [address]);










    const [loadingSellOrders, setLoadingSellOrders] = useState(false);
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

          setLoadingSellOrders(true);

          // api call
          const response = await fetch('/api/orderCebien/getAllSellOrders', {
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
  
          setLoadingSellOrders(false);
        };
  
        fetchSellOrders();

        // fetch sell orders every 1 seconds, when status is "ordered"


        const interval = setInterval(() => {
          if (
            sellOrders.filter((item) => item.status === 'ordered').length > 0
          ) {
          
            fetchSellOrders();
          }
        }, 1000);

        return () => clearInterval(interval);

        /*
        const interval = setInterval(() => {
          
          // check all requsting payment list is false
          // and all confirming payment list is false

          if (requestingPaymentList.every((item) => item === false)
          && confirmingPaymentList.every((item) => item === false)) {
            fetchSellOrders();
          }
          
     

        }, 10000);
        


        return () => clearInterval(interval);
        */
        
  
    }, [address, searchMyOrders]);




    const [sellAmount, setSellAmount] = useState(0);

    const [defaultKrWAmount, setDefaultKrwAmount] = useState(0);

    const [krwAmount, setKrwAmount] = useState(0);



    const [rate, setRate] = useState(15);


    useEffect(() => {

      if (sellAmount === 0) {

        setDefaultKrwAmount(0);

        setKrwAmount(0);

        return;
      }
    
        
      setDefaultKrwAmount( Math.round(sellAmount * rate) );


      setKrwAmount( Math.round(sellAmount * rate) );

    } , [sellAmount, rate]);



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


      // if seller is not exist
      if (!seller) {
        //toast.error('Seller is not exist');
        alert('판매자 정보가 없습니다. 나의 프로필에서 판매자로 등록하세요.');
        return;
      }

      // check the balance

      if (sellAmount > balance) {
        //toast.error('Insufficient balance');
        alert('판매할수 있는 CEBIEN 이 부족합니다.');
        return;
      }


      setSellOrdering(true);

      

      const response = await fetch('/api/orderCebien/setSellOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          sellAmount: sellAmount,
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
        //alert(Order_has_been_placed);
        alert('판매주문이 완료되었습니다.');

        setSellAmount(0);
        setprivateSale(false);

        setAgreementPlaceOrder(false);
     


        setLoadingSellOrders(true);
        await fetch('/api/orderCebien/getAllSellOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            walletAddress: address,
            searchMyOrders: searchMyOrders
          })
        }).then(async (response) => {
          const data = await response.json();
          //console.log('data', data);
          if (data.result) {
            setSellOrders(data.result.orders);
          }
        });
        setLoadingSellOrders(false);





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

      const response = await fetch('/api/orderCebien/cancelSellOrder', {
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
        //alert('Order has been cancelled');
        alert('판매주문이 취소되었습니다.');

      } else {
        
        //toast.error('Order has been failed');
        alert('판매주문 취소가 실패했습니다.');

      }

      setCancellings(cancellings.map((item, i) => i === index ? false : item));



      setLoadingSellOrders(true);
      await fetch('/api/orderCebien/getAllSellOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          searchMyOrders: searchMyOrders
        })
      }).then(async (response) => {
        const data = await response.json();
        //console.log('data', data);
        if (data.result) {
          setSellOrders(data.result.orders);
        }
      });
      setLoadingSellOrders(false);


    }



/*
   const transaction = transfer({
        contract,
        to: escrowWalletAddress,
        amount: amount,
      });
      


      try {


        const transactionResult = await sendAndConfirmTransaction({
            transaction: transaction,
            
            account: activeAccount as any,
        });
*/

    // requstPayment


    const [requestingPaymentList, setRequestingPaymentList] = useState([] as boolean[]);

    useEffect(() => {
      setRequestingPaymentList(sellOrders.map(() => false));
    }, [sellOrders]);


    const requestPayment = async (index: number) => {

      if (requestingPaymentList[index]) {
        return;
      }

      if (!sellOrders[index]?.escrow?.walletAddress) {
        alert('에스크로 지갑주소가 없습니다.');
        return;
      }


      setRequestingPaymentList(requestingPaymentList.map((item, i) => i === index ? true : item));


      try {

        const transaction = transfer({
          contract,
          
          //to: escrowWalletAddress,
          //to: sellOrders[index].escrowWalletAddress,
          to: sellOrders[index]?.escrow?.walletAddress,

          amount: sellOrders[index].sellAmount,
        });


        const transactionResult = await sendAndConfirmTransaction({
          transaction: transaction,
          account: account as any,
        });


        //console.log('transactionResult', transactionResult);

        if (transactionResult) {

          // api/requestPayment
          const response = await fetch('/api/orderCebien/requestPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderId: sellOrders[index]._id,
              transactionHash: transactionResult.transactionHash,
            })
          });

          if (response.ok) {

            const data = await response.json();

            setSellOrders(sellOrders.map((item, i) => i === index ? data.result : item));



            //toast.success('Payment requested');
            alert('판매자 지갑에서 에스크로 지갑으로 CEBIEN 이 전송되었고 구매자에게 결제 요청을 하였습니다.');
            
          } else {
            //toast.error('Payment request failed');
            alert('에스크로 지갑으로 CEBIEN 전송이 실패했습니다.');
          }

        } else {

          alert('에스크로 지갑으로 CEBIEN 전송이 실패했습니다.');

        }

      } catch (error) {
        
        //console.log('error', error);

        alert('에스크로 지갑으로 CEBIEN 전송이 실패했습니다.' + '-' + error);

      }


      setRequestingPaymentList(requestingPaymentList.map((item, i) => i === index ? false : item));

    }




    // confirmPayment
    const [confirmingPaymentList, setConfirmingPaymentList] = useState([] as boolean[]);
    useEffect(() => {
      setConfirmingPaymentList(sellOrders.map(() => false));
    }, [sellOrders]);

    const confirmPayment = async (index: number) => {

      if (confirmingPaymentList[index]) {
        return;
      }


      const orderId = sellOrders[index]._id;

      //console.log('orderId', orderId);

      const paymentAmount = sellOrders[index].sellAmount;

      //console.log('paymentAmount', paymentAmount);


      setConfirmingPaymentList(confirmingPaymentList.map((item, i) => i === index ? true : item));

      // api/confirmPayment
      const response = await fetch('/api/orderCebien/confirmPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentMethod: 'bank',
          paymentAmount: paymentAmount,
          paymentProof: 'bank transfer',
          paymentMemo: 'bank transfer',
        })
      });



      if (response.ok) {

        const data = await response.json();

        

        if (!data.result) {

          //toast.error('Payment confirmation failed');
          alert('거래를 실패했습니다.'+ '-' + data?.error);
          setConfirmingPaymentList(confirmingPaymentList.map((item, i) => i === index ? false : item));
          return;
        }

        
        setSellOrders(sellOrders.map((item, i) => i === index ? data.result : item));


        //toast.success('Payment confirmed');
        alert('거래를 완료했습니다.');

      } else {
        //toast.error('Payment confirmation failed');
        alert('거래를 실패했습니다.');
      }

      setConfirmingPaymentList(confirmingPaymentList.map((item, i) => i === index ? false : item));

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
                    alt="sell"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />
                  <div className="text-2xl font-semibold">
                    {/*Sell_USDT*/}
                    CEBIEN 판매하기
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


                {/* check my sell orders status is ordered
                {/* if there is no sell orders, then show the message */}


                  {address && !loadingSellOrders && sellOrders.filter((item) => item.status === 'ordered'
                  || item.status === 'accepted'
                  || item.status === 'paymentRequested').length === 0 && (
                 
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


                              <div className="mt-4 flex flex-col gap-2 items-start">

                                <div className="flex flex-row items-center gap-2">
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

                                {/* seller bank info */}
                                <div className="flex flex-row items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>


                                    <span className="text-sm text-zinc-400">

                                      {Payment}:{' '}(

                                        {
                                          seller?.bankInfo.bankName === '090' ? '카카오뱅크'
                                          : seller?.bankInfo.bankName === '089' ? '케이뱅크'
                                          : seller?.bankInfo.bankName === '092' ? '토스뱅크'

                                          : seller?.bankInfo.bankName === '004' ? '국민은행'
                                          : seller?.bankInfo.bankName === '020' ? '우리은행'
                                          : seller?.bankInfo.bankName === '088' ? '신한은행'
                                          : seller?.bankInfo.bankName === '011' ? '농협'
                                          : seller?.bankInfo.bankName === '003' ? '기업은행'
                                          : seller?.bankInfo.bankName === '081' ? '하나은행'
                                          : seller?.bankInfo.bankName === '002' ? '외환은행'
                                          : seller?.bankInfo.bankName === '032' ? '부산은행'
                                          : seller?.bankInfo.bankName === '031' ? '대구은행'
                                          : seller?.bankInfo.bankName === '037' ? '전북은행'
                                          : seller?.bankInfo.bankName === '071' ? '경북은행'
                                          : seller?.bankInfo.bankName === '034' ? '광주은행'
                                          : seller?.bankInfo.bankName === '071' ? '우체국'
                                          : seller?.bankInfo.bankName === '007' ? '수협'
                                          : seller?.bankInfo.bankName === '027' ? '씨티은행'
                                          : seller?.bankInfo.bankName === '055' ? '대신은행'
                                          : seller?.bankInfo.bankName === '054' ? '동양종합금융'
                                          : seller?.bankInfo.bankName === '230' ? '미래에셋증권'

                                          : seller?.bankInfo.bankName
                                        }

                                      {' '}{seller?.bankInfo.accountNumber}{' '}{seller?.bankInfo.accountHolder})
                                    </span>

                    

                                </div>


                                <div className="flex flex-row items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                                  <span className="text-sm text-zinc-400">
                                    구매자가 구매신청을 하고 입금할 은행정보입니다.
                                  </span>
                                </div>

                                </div>
                            )}

                            {/* escrow wallet address */}
                            {/* 에스크로 지갑주소 */}
                            {/*}
                            {address && seller && escrowWalletAddress && (
                              <div className="mt-4 flex flex-col gap-2 items-start">
                                <div className="flex flex-row items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                                  <span className="text-sm text-zinc-400">
                                    에스크로: {
                                    escrowWalletAddress.slice(0, 6) + '...' + escrowWalletAddress.slice(-4)
                                    }
                                  </span>
                                </div>
                              </div>
                            )}
                            */}

                  




                            {address && !seller && (
                              <div className="mt-4 flex flex-col gap-2 items-center justify-center">

                                <div className="flex flex-row items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full inline-block mr-2"></div>
                                  <div className="text-sm text-zinc-400">
                                    프로필 설정에서 결제정보를 등록하세요. 결제정보가 없으면 거래가 불가능합니다.
                                  </div>
                                </div>

                                {/* go to profile */}
                                <button
                                  className="text-sm text-yellow-500 border border-yellow-500 rounded-md px-2 py-1"

                                  onClick={() => router.push('/my-profile-songpa')}
                                >
                                  결제정보 등록하기
                                </button>
                                
                              </div>
                            )}


                            <p className="mt-4 text-xl font-bold text-zinc-400">
                              환율: 1 CEBIEN = {
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
                                  value={sellAmount}
                                  onChange={(e) => {
                                    // check number
                                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');

                                    // prevent float number
                                    if (e.target.value.includes('.')) {
                                      e.target.value = e.target.value.split('.')[0];
                                    }

                                    // if the value is start with 0, then remove 0
                                    if (e.target.value.startsWith('0')) {
                                      e.target.value = e.target.value.substring(1);
                                    }

                                    
                                    if (e.target.value === '') {
                                      setSellAmount(0);
                                      return;
                                    }
                                    
                                    parseFloat(e.target.value) < 0 ? setSellAmount(0) : setSellAmount(parseFloat(e.target.value));

                                    parseFloat(e.target.value) > 1000 ? setSellAmount(1000) : setSellAmount(parseFloat(e.target.value));

                                  } }


                                />
                                <span className="text-lg">CEBIEN</span>
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
                              <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                              <span className="text-sm text-zinc-400">
                                판매할 수량을 입력하세요.
                              </span>
                            </div>

                          

                          </div>


                          {/* input krw amount */}
                          {/* left side decrease button and center is input and  right side increase button */}
                          {/* -1, -10, -100, +1, +10, +100 */}
                          {/* if - button change bg color red */}
                          {/* if + button change bg color */}

                            <div className="hidden mt-4 flex-row items-center justify-between gap-2">


                              <div className="flex flex-col gap-2">

                                <button
                                  disabled={sellAmount === 0}
                                  className="bg-red-400 text-white px-2 py-2 rounded-md"
                                  onClick={() => {
                                    krwAmount > 0 && setKrwAmount(krwAmount - 1);
                                  }}
                                >
                                  -1
                                </button>

                                <button
                                  disabled={sellAmount === 0}
                                  className="bg-red-600 text-white px-2 py-2 rounded-md"
                                  onClick={() => {
                                    krwAmount > 10 && setKrwAmount(krwAmount - 10);
                                  }}
                                >
                                  -10
                                </button>

                                <button
                                  disabled={sellAmount === 0}
                                  className="bg-red-800 text-white px-2 py-2 rounded-md"
                                  onClick={() => {
                                    krwAmount > 100 && setKrwAmount(krwAmount - 100);
                                  }}
                                >
                                  -100
                                </button>

                                <button
                                  disabled={sellAmount === 0}
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
                                      Number((krwAmount / sellAmount).toFixed(2)).toLocaleString('ko-KR', {
                                        style: 'currency',
                                        currency: 'KRW'
                                      })

                                    } 
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col gap-2">
                                <button
                                  disabled={sellAmount === 0}
                                  className="bg-green-400 text-white px-2 py-2 rounded-md"
                                  onClick={() => {
                                    setKrwAmount(krwAmount + 1);
                                  }}
                                >
                                  +1
                                </button>
                                <button
                                  disabled={sellAmount === 0}
                                  className="bg-green-600 text-white px-2 py-2 rounded-md"
                                  onClick={() => {
                                    setKrwAmount(krwAmount + 10);
                                  }}
                                >
                                  +10
                                </button>

                                <button
                                  disabled={sellAmount === 0}
                                  className="bg-green-800 text-white px-2 py-2 rounded-md"
                                  onClick={() => {
                                    setKrwAmount(krwAmount + 100);
                                  }}
                                >
                                  +100
                                </button>

                                <button
                                  disabled={sellAmount === 0}
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
                              disabled={!address || sellAmount === 0 || sellOrdering}
                              type="checkbox"
                              checked={agreementPlaceOrder}
                              onChange={(e) => setAgreementPlaceOrder(e.target.checked)}
                              className="w-10 h-10
                              border-2 border-zinc-800
                              rounded-md"
                            />
                            <p className="text-sm text-zinc-400">
                              
                              {/*I_agree_to_the_terms_of_trade*/}
                              거래조건에 동의하기 위해서 체크하세요.

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
                              After the buyer accepts the order, you must deposit the USDT to escrow within 1 hour.
                              If you do not deposit the USDT to escrow within 1 hour, the order will be expired.
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
                            <span>After the buyer accepts the order, you must deposit the USDT to escrow within 1 hour.
                              If you do not deposit the USDT to escrow within 1 hour, the order will be expired.
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
                                    {/*Placing_Order*/}판매주문 중...
                                  </div>
                    
                              </div>


                            ) : (
                                <button
                                    disabled={sellAmount === 0 || agreementPlaceOrder === false}
                                    className={`text-lg text-white px-4 py-2 rounded-md ${sellAmount === 0 || agreementPlaceOrder === false ? 'bg-gray-500' : 'bg-green-500'}`}
                                    onClick={() => {
                                        console.log('Sell CEBIEN');
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

                  )}

                  {/* total sell orders */}
                  <div className="p-2 xl:p-0  flex flex-row items-center justify-between gap-2">

                    {/*
                    <div className="flex flex-col gap-2 items-center">
                      <div className="text-sm">{Total}</div>
                      <div className="text-xl font-semibold text-gray-400">
                        {sellOrders.length}
                      </div>
                    </div>
                    */}

                    {/*
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
                    */}



                    <div className="ml-5 flex flex-col gap-2 items-between justify-center">
                      
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

                    {/* 새로고침 버튼 */}
                    <button
                      className="text-sm text-white bg-gray-800 px-2 py-1 rounded-md"
                      onClick={() => {
                        setLoadingSellOrders(true);
                        fetch('/api/orderCebien/getAllSellOrders', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            walletAddress: address,
                            searchMyOrders: searchMyOrders
                          })
                        }).then(async (response) => {
                          const data = await response.json();
                          //console.log('data', data);
                          if (data.result) {
                            setSellOrders(data.result.orders);
                          }
                        });
                        setLoadingSellOrders(false);
                      }}
                    >
                      새로고침
                    </button>



                  </div>


                  <div className=" w-full grid gap-4 xl:grid-cols-3 justify-center">

                    {sellOrders.length === 0 && (
                      <div className="w-full flex flex-col items-center justify-center gap-4">
                        <div className="text-xl font-semibold text-gray-400">
                          퍈매주문한 내역이 없습니다.
                        </div>
                      </div>
                    )}


                    {sellOrders.map((item, index) => (

                      <>
                      {
                      (
                        /*
                        item.status === 'ordered'
                      || item.status === 'accepted'
                      || item.status === 'paymentRequested'
                      */
                        item.status === 'ordered'
                      || item.status === 'accepted'
                      || item.status === 'paymentRequested'
                      ) && (

                        <div
                          key={index}
                          className="relative flex flex-col items-center justify-center"
                        >

                          {/*}
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
                          */}


                          {/*
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
                          */}




                          <article
                              key={index}
                              className={`

                                w-96 xl:w-full h-full

                                bg-black p-4 rounded-md border
                                
                                ${item.walletAddress === address ? 'border-green-500' : 'border-gray-200'}
                                
                                
                           
                                ${item.status === 'ordered' && 'border-green-500 border-2'}

                                ${item.status === 'accepted' && 'border-blue-500 border-2'}

                                ${item.status === 'paymentRequested' && 'border-yellow-500 border-2'}

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






                              { (item.status === 'accepted' || item.status === 'paymentRequested' ) && (

                                <div className="flex flex-row items-center justify-between
                                gap-2  bg-white px-2 py-1 rounded-md mb-4  ">

                                  <div className="flex flex-row items-center gap-2">
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
                                        className="rounded-full animate-spin"
                                      />
                                    )}

                                    <p className="text-xl font-semibold text-green-500 ">
                                      거래번호: #{item.tradeId}
                                    </p>
                                  </div>

                                  {item.status === 'accepted' && (
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-md">
                                      구매신청상태
                                    </span>
                                  )}

                                  {item.status === 'paymentRequested' && (
                                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-md">
                                      결제요청상태
                                    </span>
                                  )}

                                </div>

                              )}


                              {/*
                              { item.status === 'paymentConfirmed' && (

                                <div className="flex flex-row items-center justify-between
                                gap-2 bg-white px-2 py-1 rounded-md mb-4">



                                  <p className="text-xl font-semibold text-green-500 ">
                                    거래번호: #{item.tradeId}
                                  </p>
                                  <span className="bg-green-500 text-white px-2 py-1 rounded-md">
                                    거래완료
                                  </span>
                                </div>

                              )}
                              */}


                              {item.acceptedAt && (
                                <p className="mb-2 text-sm text-zinc-400">
                                  {new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()}
                                  에 거래가 시작되었습니다.
                                </p>
                              )}


                              {/*
                              {item.status === 'cancelled' && (

                                  <p className="text-sm text-zinc-400"> 
                                    {new Date(item?.cancelledAt).toLocaleString()}
                                    에 거래가 취소되었습니다.
                                  </p>
                      
                              )}
                              */}



                              {item.paymentConfirmedAt && (
                                <p className="mb-2 text-sm text-zinc-400">
                                  
                                  {new Date(item.paymentConfirmedAt).toLocaleDateString() + ' ' + new Date(item.paymentConfirmedAt).toLocaleTimeString()}
                                  에 거래가 완료되었습니다.
                              
                                </p>
                              )}



                              <div className="mt-4 flex flex-col items-start gap-2">




                                <div className="flex flex-row items-center gap-2">

                                  <p className="text-2xl font-semibold text-green-500">
                                    {item.sellAmount} CEBIEN
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
  국민은행: 004, 우리은행: 020, 신한은행: 088, 농협: 011, 기업은행: 003, 하나은행: 081, 외환은행: 002, 부산은행: 032, 대구은행: 031, 전북은행: 037, 경북은행: 071, 부산은행: 032, 광주은행: 034, 우체국: 071, 수협: 007, 씨티은행: 027, 대신은행: 055, 동양종합금융: 054, 롯데카드: 062, 삼성카드: 029, 현대카드: 048, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카

  카카오뱅크: 090, 케이뱅크: 089, 토스뱅크: 092,
    */}

                              <div className="mt-2 flex flex-row items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                                <p className="text-sm text-zinc-400">
                                  {Payment}:{' '}
                                  
                                  {item.seller?.bankInfo.bankName === '090' && '카카오뱅크'}
                                  {item.seller?.bankInfo.bankName === '089' && '케이뱅크'}
                                  {item.seller?.bankInfo.bankName === '092' && '토스뱅크'}
                                  
                                  {item.seller?.bankInfo.bankName === '004' && '국민은행'}
                                  {item.seller?.bankInfo.bankName === '020' && '우리은행'}
                                  {item.seller?.bankInfo.bankName === '088' && '신한은행'}
                                  {item.seller?.bankInfo.bankName === '011' && '농협'}
                                  {item.seller?.bankInfo.bankName === '003' && '기업은행'}
                                  {item.seller?.bankInfo.bankName === '081' && '하나은행'}
                                  {item.seller?.bankInfo.bankName === '002' && '외환은행'}
                                  {item.seller?.bankInfo.bankName === '032' && '부산은행'}
                                  {item.seller?.bankInfo.bankName === '031' && '대구은행'}
                                  {item.seller?.bankInfo.bankName === '037' && '전북은행'}
                                  {item.seller?.bankInfo.bankName === '071' && '경북은행'}
                                  {item.seller?.bankInfo.bankName === '034' && '광주은행'}
                                  {item.seller?.bankInfo.bankName === '071' && '우체국'}
                                  {item.seller?.bankInfo.bankName === '007' && '수협'}
                                  {item.seller?.bankInfo.bankName === '027' && '씨티은행'}
                                  {item.seller?.bankInfo.bankName === '055' && '대신은행'}
                                  {item.seller?.bankInfo.bankName === '054' && '동양종합금융'}
                                  {item.seller?.bankInfo.bankName === '230' && '미래에셋증권'}
                                  
                                  {' '}

                                  {item.seller?.bankInfo.accountNumber}{' '}
                                  {item.seller?.bankInfo.accountHolder}
                                </p>
                              </div>
                            

                              {/* 입금자명 depositName */}
                              {item?.buyer?.depositName && (
                                <span className="text-lg text-yellow-500 font-semibold">
                                  입금자명: {item.buyer.depositName}
                                </span>
                              )}


                              {item.walletAddress === address && item?.escrow?.walletAddress && (
                                <div className="mt-2 flex flex-row items-center gap-2">
                                  <span className="text-sm text-zinc-400">
                                    에스크로 확인
                                  </span>
                                  <button
                                    className="bg-white text-black px-2 py-2 rounded-md"
                                    onClick={() => {
                                        // new window for smart contract
                                        //window.open(`https://polygonscan.com/tx/${item.escrowTransactionHash}`);
                                        //https://polygonscan.com/address/0x4b27beba84cf5c340d409b268acb3fe309f4292b#tokentxns

                                        window.open(`https://polygonscan.com/address/${item?.escrow?.walletAddress}#tokentxns`);
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
                              )}



                              {item.walletAddress === address && item.status === 'ordered' && (

                                <div className="mt-5 w-full flex flex-col items-start gap-2">

                                  <div className="w-full flex flex-row items-center justify-end gap-2">

                                    <button
                                        disabled={cancellings[index]}
                                        className={`text-sm bg-red-500 text-white px-3 py-2 rounded-md ${cancellings[index] ? 'bg-gray-500' : ''}`}
                                        onClick={() => {
                                          // api call
                                          // cancelSellOrder

                                          confirm('판매주문을 취소하시겠습니까?') &&
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
                                          <span>

                                            {cancellings[index] && (
                                              <span className="text-sm text-white">
                                                판매주문 취소중...
                                              </span>
                                            )}

                                            {!cancellings[index] && (
                                              <span className="text-sm text-white">
                                                판매주문 취소하기
                                              </span>
                                            )}



                                          </span>
                                        </div>
                                      </div>
                                      
                                    </button>

                                  </div>



                                    {/* 구매자가 구매신청하기전에는 언제든지 판매주문을 취소활수 있습니다. */}
                                  <div className="w-full flex flex-row items-center gap-2">
                                    {/* dot */}
                                    <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                                    <span className="text-sm text-zinc-400">
                                      {Buyer}가 구매신청하기 전에는 언제든지 판매주문을 취소할 수 있습니다.
                                    </span>
                                  </div>
                                          



                                </div>

                              )}





                        

                              {/*
                              <div className="mt-4 flex text-lg font-semibold mb-2">
                                {
    

                                  item.walletAddress === address &&
                                  (item.status === 'accepted' || item.status === 'paymentRequested') ? (

                                    <div className="flex flex-row items-center gap-2">
                                      <span>{Seller}: {item.nickname}</span>

                                      <div
                                        className="text-sm
                                          bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer"

                                        onClick={() => {
                                          router.push(
                                            "/" + params.lang + `/sell-noahk/${item._id}`);
                                        }}
                                      >
                                        {Go_Sell_USDT}
                                      </div>
                                  
                                    </div>

                                  ) : (item.walletAddress === address && item.status === 'ordered') ? (

                                    <div className="w-full flex flex-row items-center justify-end gap-2">

                                            
                                      <button
                                          disabled={cancellings[index]}
                                          className={`text-sm bg-red-500 text-white px-3 py-2 rounded-md ${cancellings[index] ? 'bg-gray-500' : ''}`}
                                          onClick={() => {
                                            // api call
                                            // cancelSellOrder
        
                                            confirm('주문을 취소하시겠습니까?') &&
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
                                            <span>
                  
                                              {cancellings[index] && (
                                                <span className="text-sm text-white">
                                                  판매주문 취소중...
                                                </span>
                                              )}

                                              {!cancellings[index] && (
                                                <span className="text-sm text-white">
                                                  판매주문 취소하기
                                                </span>
                                              )}



                                            </span>
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
                              */}

    



                              {/* accept order button for seller */}

                              {(item.status === 'accepted' || item.status === 'paymentRequested' ) 
                                && (
                                  <div className="w-full mt-4 mb-2 flex flex-row items-center justify-start gap-2">

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

                                    <p className="text-xl text-green-500 font-semibold">
                                      {Buyer}: {
                                        item.buyer.walletAddress === address ? item.buyer.nickname + ' :' + Me :
                                      
                                        item.buyer.nickname ? item.buyer.nickname : item.buyer.walletAddress.substring(0, 6) + '...' + item.buyer.walletAddress.substring(item.buyer.walletAddress.length - 4)
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
                                      <span className="text-lg text-green-500 font-semibold">
                                        {Waiting_for_seller_to_deposit}

                                        {item.sellAmount} USDT

                                        {to_escrow}....
                                      </span>
                                      */}
                                      <span className="text-lg text-blue-500 font-semibold">
                                      {item.sellAmount} CEBIEN 을 에스크로에 예치해야 합니다.
                                      </span>

                                      <span className="text-sm text-zinc-400">

                                        {/*If_the_seller_does_not_deposit_the_USDT_to_escrow*/}

                                        {/*this_trade_will_be_cancelled_in*/}
                                        
                                        다음 시간이 지나면 거래가 취소됩니다.{': '}

                                        {
                                          (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) > 0
                                          ? (1 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 / 60) - 1) + ' hours'
                                          : (60 - Math.floor((new Date().getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60) % 60) + ' minutes'

                                        }

                                      </span>

                                      {/* request payment button */}
                                      {/* 에스크로에 예치하고 구매자에게 결제요청 */}
                                      <div className="mt-5 mb-5 w-full flex flex-row items-center justify-end gap-2">
                                        <button
                                          disabled={requestingPaymentList[index]}
                                          className={
                                            `text-sm bg-green-500 text-white px-3 py-2 rounded-md
                                            ${requestingPaymentList[index] ? 'bg-gray-500' : 'bg-green-500'}
                                            `
                                          }
                                          onClick={() => {
                                            // request payment
                                            confirm('에스크로에 예치하고 구매자에게 결제요청하시겠습니까?') &&
                                            requestPayment(index);
                                          }}
                                        >
                                          {requestingPaymentList[index] ? (
                                            
                                            <div className="flex flex-row text-xs items-center gap-2 ">
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
                                              <div className="flex flex-row xl:flex-col items-center gap-1">
                                                <span>
                                                  <span className="text-sm text-white">
                                                    에스크로에 예치하고 결제요청중입니다. 완료될때까지 기다려주세요.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>

                                          ) : (
                                            <div className="flex flex-row text-xs items-center gap-2 ">
                                              <Image
                                                src="/icon-confirm.png"
                                                alt="Confirm"
                                                width={12}
                                                height={12}
                                              />
                                              <div className="flex flex-row xl:flex-col items-center gap-1">
                                                <span>
                                                  <span className="text-sm text-white">
                                                    에스크로에 예치하고 결제요청하기
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          )}

                                        </button>
                                      </div>

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
                                      <div className="flex flex-col gap-2 items-start">
                                        <span className="text-lg text-blue-500 font-semibold">
                                          에스크로: {item.sellAmount} CEBIEN
                                        </span>
                                      </div>
                                      
                                      <button
                                        className="bg-white text-black px-2 py-2 rounded-md"
                                        onClick={() => {
                                            // new window for smart contract
                                            //window.open(`https://polygonscan.com/tx/${item.escrowTransactionHash}`);
                                            //https://polygonscan.com/address/0x4b27beba84cf5c340d409b268acb3fe309f4292b#tokentxns

                                            window.open(`https://polygonscan.com/address/${item?.escrow?.walletAddress}#tokentxns`);
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
                                        <span className="text-lg text-green-500 font-semibold">
                                          {Waiting_for_seller_to_deposit} {item.krwAmount} KRW to {Seller}...
                                        </span>
                                        */}
                                        <div className="flex flex-row items-center gap-2">
                                          {/* dot */}
                                          <div className="w-2 h-2 bg-yellow-500 rounded-full inline-block mr-2"></div>
                                          <span className="text-lg text-yellow-500 font-semibold">
                                            {Buyer}가 {
                                            Number(item.krwAmount).toLocaleString('ko-KR', {
                                              style: 'currency',
                                              currency: 'KRW',
                                            })}을 결제한것을 확인하고 거래완료를 눌러주세요.
                                          </span>
                                        </div>

                                        {/* 만약 구매자가 결제한것을 확인하고 거래완료를 하지 않으면 판매자 권한을 회수할 수 있습니다. */}
                                        <div className="flex flex-row items-center gap-2">
                                          {/* dot */}
                                          <div className="w-2 h-2 bg-yellow-500 rounded-full inline-block mr-2"></div>
                                          <span className="text-lg text-yellow-500 font-semibold">
                                            {Buyer}가 결제한것을 확인하고 10분내로 거래완료를 하지 않으면 판매자 권한을 회수할 수 있습니다.
                                          </span>
                                        </div>


                                        {/* confirm payment button */}
                                        <div className="mt-5 mb-5 w-full flex flex-row items-center justify-end gap-2">
                                          
                                          <button
                                            disabled={confirmingPaymentList[index]}
                                            className={
                                              `text-sm bg-green-500 text-white px-3 py-2 rounded-md
                                              ${confirmingPaymentList[index] ? 'bg-gray-500' : 'bg-green-500'}
                                              `
                                            }
                                            onClick={() => {
                                              // confirm payment
                                              confirm('거래를 완료하면 에스크로에서 CEBIEN 이 구매자에게 전송됩니다. 거래를 완료하시겠습니까?') &&
                                              confirmPayment(index);
                                            }}
                                          >
                                            {confirmingPaymentList[index] ? (

                                              <div className="flex flex-row text-xs items-center gap-2 ">
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
                                                <div className="flex flex-row xl:flex-col items-center gap-1">
                                                  <span>
                                                    <span className="text-sm text-white">
                                                      거래를 완료중입니다. 완료될때까지 기다려주세요.
                                                    </span>
                                                  </span>
                                                </div>
                                              </div>

                                            ) : (
                                              <div className="flex flex-row text-xs items-center gap-2 ">
                                                <Image
                                                  src="/icon-confirm.png"
                                                  alt="Confirm"
                                                  width={12}
                                                  height={12}
                                                />
                                                <div className="flex flex-row xl:flex-col items-center gap-1">
                                                  <span>
                                                    <span className="text-sm text-white">
                                                      거래 완료하기
                                                    </span>
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </button>

                                        </div>

                                      </div>

                                    </div>

                                  </div>
                              )}
                          </article>


                        </div>

                      )}

                      </>

                    ))}

                </div>

            </div>

            
          </div>


        </main>

    );


};




