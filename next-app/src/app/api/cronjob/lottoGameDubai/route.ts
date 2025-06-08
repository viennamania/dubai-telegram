import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllMembersByCenter,
} from '@lib/api/user';

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

import {
  getAllOddEvenGamesSettlement,
  setOddEvenGamesSettlementByWalletAddressAndSequence,
} from '@lib/api/gameDubai';


import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  getOneByTelegramId,
} from '@lib/api/referral';



import { Network, Alchemy } from 'alchemy-sdk';


import {
  startLotto,
} from '@lib/api/lotto';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



 

const chain = polygon;


// DUBAI Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {


  console.log("start lottoGameDubai==================>");

 

    // check time 
    
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 22 || hours < 9) {

      
      return;
    }
    


    const resultStartLotto = await startLotto({
        timestamp: moment().unix(),
    });



    return NextResponse.json({
        
        result: {
            //amount,
            //gameWalletAddress,
        },
    });

}
