import { NextResponse, type NextRequest } from "next/server";


import {
  getOneSellOrderForEscrow,
  confirmPayment,
} from '@lib/api/order';



import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  insertOtcMessageByWalletAddress
} from '@lib/api/telegram';



import {
  createThirdwebClient,

  ///ContractOptions,

  getContract,
  sendAndConfirmTransaction,
  
  sendBatchTransaction,

  SendBatchTransactionOptions,
  
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  SmartWalletOptions,
} from "thirdweb/wallets";

import {
  mintTo,
  totalSupply,
  transfer,
  
  
  getBalance,
  
  balanceOf,
  
} from "thirdweb/extensions/erc20";
import { error } from "console";



export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { orderId, walletAddress } = body;

  if (!orderId) {
    return NextResponse.json({
      result: null,
      error: "Missing orderId",
    });
  }


  // getOneSellOrder
  // get escrow wallet private key, toWalletAddress, amount
  const sellOrder = await getOneSellOrderForEscrow({
    orderId: orderId,
  })




  if (!sellOrder) {
    return NextResponse.json({
      result: null,
      error: "Sell order not found",
    });
  }


  const toWalletAddress = walletAddress;

  const { escrow, sellAmount, buyer} = sellOrder;

  const escrowWalletPrivateKey = escrow.walletPrivateKey;
  const amount = sellAmount;


  console.log("escrowWalletPrivateKey: ", escrowWalletPrivateKey);
  console.log("amount: ", amount);


  //const tokenContractAddress = "0x9948328fa1813037a37F3d35C0b1e009d6d9a563"; // NOAH-K on Polygon

  const tokenContractAddress = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon


  try {


    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });

    
    const contractToken = getContract(
      {
        client: client,
        chain: polygon,
        address: tokenContractAddress,
      }
    );


    const personalAccount = privateKeyToAccount({
      client,
      privateKey: escrowWalletPrivateKey,
    });

    const wallet = smartWallet({
      chain: polygon,
      sponsorGas: true,
    });

    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });

    //const claimWalletAddress = account.address;

    //console.log("claimWalletAddress: ", claimWalletAddress);
    // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2



    let transactions = [] as any;

    const transaction = transfer({
      contract: contractToken,
      to: toWalletAddress,
      amount: amount,
    });

    transactions.push(transaction);



    const batchOptions: SendBatchTransactionOptions = {
      account: account,
      transactions: transactions,
    };





    const batchResponse = await sendBatchTransaction(
      batchOptions
    );

    if (!batchResponse) {
      return NextResponse.json({
        result: null,
      });
    }

    const escrowTransactionHash = batchResponse.transactionHash;


    /*
    const result = await confirmPayment({
      orderId,
      paymentMethod,
      paymentAmount,
      paymentProof,
      paymentMemo,
      escrowTransactionHash,
    });


    if (!result) {
      return NextResponse.json({
        result: null,
      });
    }
    */



    // telegram message
    /*

    const buyerWalletAddress = buyer.walletAddress;

    const user = await getOneByWalletAddress(buyerWalletAddress);
  

  
    if (user) {
  
      const center = user.center;
      
      if (buyerWalletAddress) {
  
        const messagetext = '거래번호: ' + '#' + sellOrder.tradeId
         + '\n\n거래를 완료하였습니다.';
  
        const result = await insertOtcMessageByWalletAddress({
          center: center,
          walletAddress: buyerWalletAddress,
          sellOrder: sellOrder,
          message: messagetext,
        } );
  
        //console.log("insertOtcMessageByWalletAddress result", JSON.stringify(result));
  
  
      }
  
    }


    return NextResponse.json({
      result: result,
    });
    
    */

    return NextResponse.json({
      result: escrowTransactionHash,
    });


  } catch (error) {

    console.error("sendBatchTransaction error", error);
    return NextResponse.json({
      result: null,
    });

  }



}
