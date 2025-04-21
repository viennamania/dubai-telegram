import { NextResponse, type NextRequest } from "next/server";

import {
	updateDiceGameResultByWalletAddressAndSequence,
} from '@lib/api/gameCebien';



export async function POST(request: NextRequest) {

  const body = await request.json();

  /*
          walletAddress,
        sequence,
        seletedOddOrEven,
        resultOddOrEven, 
        win
        */

  const {
    walletAddress,
    sequence,

    selectedDiceNumber,
    resultDiceNumber,

    //selectedOddOrEven,
    //resultOddOrEven,

    win,
  } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await updateDiceGameResultByWalletAddressAndSequence({
    walletAddress: walletAddress,
    sequence: sequence,

    selectedDiceNumber: selectedDiceNumber,
    resultDiceNumber: resultDiceNumber,

    //selectedOddOrEven: selectedOddOrEven,
    //resultOddOrEven: resultOddOrEven,
    
    win: win,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
