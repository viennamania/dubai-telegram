import { NextResponse, type NextRequest } from "next/server";

/*
import {
  getOneByApplicationId,
	setSettlementClaim,
} from '@lib/api/agent';
*/

import {
  getAllMembersByCenter,
  getUserByTelegramId,
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


import { Network, Alchemy } from 'alchemy-sdk';


/*
import {
	insertOne,
} from '@lib/api/game';
 */

import {
	insertMessage,
} from '@lib/api/telegram';


const chain = polygon;


// DUBAI Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);





export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

  const body = await request.json();


  const {
    center
  } = body;


  // getAllMembersByCenter
  if (!center) {
    return NextResponse.error();
  }

  console.log("center: ", center);

  const members = await getAllMembersByCenter({
    center: center,
    limit: 500,
    page: 0,
  });

  //console.log("members: ", members);



  if (!members) {

    return NextResponse.error();
  }

  members.forEach(async (member : any) => {


    const userWalletAddress = member.walletAddress;


    if (userWalletAddress) {


      /*
      const result = await insertOne({
        walletAddress: userWalletAddress,
        usdtAmount: 0,
        krwAmount: 0,
        rate: 0,
      });
      */


      /*
      if (result?.status === "success") {
      */


        //const insertedData = result.data;


        //const sequence = insertedData?.sequence;
        //const winPrize = insertedData?.winPrize;

        //if (sequence && winPrize) {


          const message = `폴 게임을 시작하세요!`; 

          const resultMessage = await insertMessage({
            center: center,
            category: "poll",
            telegramId: member.telegramId,
            message,
            //sequence: sequence,
            //winPrize: winPrize,
          } );


        //}

      /*
        
      }

      */


    }

        

  });


  return NextResponse.json({
    status: "success",
  });

  
}
