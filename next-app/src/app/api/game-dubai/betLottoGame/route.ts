import { NextResponse, type NextRequest } from "next/server";

import {
	//insertOneLottoGame,
  getOneLottoGame,
  
  updateOneLottoGameForBet,

} from '@lib/api/gameDubai';

//import {
//  updateOneGameMoneyMinus,
//} from '@lib/api/user';


import {
  createThirdwebClient,
  getContract,
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";


import {
getNFT,

balanceOf,

totalSupply,

ownerOf,

///getTotalClaimedSupply,

} from "thirdweb/extensions/erc721";


import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  insertMessage
} from '@lib/api/telegram';
import { min } from "moment";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    selectedNumber,
    betAmount,
  } = body;


  

  const result = await getOneLottoGame();

  if (!result) {
    return NextResponse.json({
      error: "No active lotto game found.",
    }, { status: 404 });
  }

  const sequence = result.sequence;

  
  const updateGameResult = await updateOneLottoGameForBet({
    sequence,
    walletAddress,
    selectedNumber,
    betAmount,
  });
  if (!updateGameResult) {
    return NextResponse.json({
      error: "Failed to update lotto game.",
    }, { status: 500 });
  }

  /*
  const botWalletAddress = process.env.GAME_WALLET_ADDRESS;
  if (!botWalletAddress) {
    return NextResponse.json({
      error: "Bot wallet address is not configured.",
    }, { status: 500 });
  }
  */


  // "00" - "36"
  /*
  const botSelectedNumber = Math.floor(Math.random() * 37).toString().padStart(2, '0');
  const botBetAmount = 1;

  await updateOneLottoGameForBet({
    sequence,
    walletAddress: botWalletAddress,
    selectedNumber: botSelectedNumber,
    betAmount: botBetAmount,
  });
  */



 
  return NextResponse.json({

    updateGameResult,
    
  });
  
}
