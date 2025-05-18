import { NextResponse, type NextRequest } from "next/server";

import {
	updateOddEvenGameResultByWalletAddressAndSequence,
} from '@lib/api/gameDubai';



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
    selectedOddOrEven,
    resultOddOrEven,
    win,
  } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await updateOddEvenGameResultByWalletAddressAndSequence({
    walletAddress: walletAddress,
    sequence: sequence,
    selectedOddOrEven: selectedOddOrEven,
    resultOddOrEven: resultOddOrEven,
    win: win,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
