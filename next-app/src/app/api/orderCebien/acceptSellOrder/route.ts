import { NextResponse, type NextRequest } from "next/server";

import {
  acceptSellOrder,
  getOneSellOrderForEscrow,
} from '@lib/api/orderCebien';


import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  insertOtcMessageByWalletAddress
} from '@lib/api/telegram';




import { ethers } from "ethers";

import {
  createThirdwebClient,

} from "thirdweb";

//import { polygonAmoy } from "thirdweb/chains";
import {
  polygon,
  arbitrum,
 } from "thirdweb/chains";

import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  
 } from "thirdweb/wallets";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, orderId, buyerWalletAddress, buyerNickname, buyerAvatar, buyerMobile, buyerMemo, depositName, depositBankName } = body;

  console.log("orderId", orderId);





  const escrowWalletPrivateKey = ethers.Wallet.createRandom().privateKey;

  //console.log("escrowWalletPrivateKey", escrowWalletPrivateKey);

  if (!escrowWalletPrivateKey) {
    return NextResponse.json({
      result: null,
    });
  }



  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  if (!client) {
    return NextResponse.json({
      result: null,
    });
  }


  const personalAccount = privateKeyToAccount({
    client,
    privateKey: escrowWalletPrivateKey,
  });
    

  if (!personalAccount) {
    return NextResponse.json({
      result: null,
    });
  }
  
  const wallet = smartWallet({
    chain: polygon,
    sponsorGas: true,
  });


  // Connect the smart wallet
  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });

  if (!account) {
    return NextResponse.json({
      result: null,
    });
  }


  const escrowWalletAddress = account.address;

    




  

  const result = await acceptSellOrder({
    lang: lang,
    chain: chain,
    orderId: orderId,
    buyerWalletAddress: buyerWalletAddress,
    buyerNickname: buyerNickname,
    buyerAvatar: buyerAvatar,
    buyerMobile: buyerMobile,
    buyerMemo: buyerMemo,
    depositName: depositName,
    depositBankName: depositBankName,
    escrowWalletAddress: escrowWalletAddress,
    escrowWalletPrivateKey: escrowWalletPrivateKey,

  });

  ///console.log("result", result);


  if (!result) {
    return NextResponse.json({
      result: null,
    });
  }

  // telegram message to seller

  const sellOrder = await getOneSellOrderForEscrow({
    orderId: orderId,
  });

  if (sellOrder) {
    
    

    const sellerWalletAddress = sellOrder.seller.walletAddress;

    const user = await getOneByWalletAddress(sellerWalletAddress);

    if (user) {
      
      const center = user.center;
      
      if (sellerWalletAddress) {

        const messagetext = '구매자가 구매를 신청하였습니다.'
          + '\n\n겨래번호: ' + '#' + sellOrder.tradeId
          + '\n\n구매자 입금자명: ' + depositName

        const result = await insertOtcMessageByWalletAddress({
          center: center,
          walletAddress: sellerWalletAddress,
          sellOrder: sellOrder,
          message: messagetext,
        } );

        //console.log("insertOtcMessageByWalletAddress result", JSON.stringify(result));

      }

    }

  }





 
  return NextResponse.json({

    result,
    
  });
  
}
