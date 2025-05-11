import { NextResponse, type NextRequest } from "next/server";

import {
	updateDiceGameResultByWalletAddressAndSequence,
} from '@lib/api/gameCebien';

/*
        walletAddress: walletAddress,
        sequence: selectedSequence,
        selectedDiceNumber: selectedDiceNumber,
        resultDiceNumber: resultDiceNumber,
        win: win,
        */

export async function POST(request: NextRequest) {

  const body = await request.json();

  /*
walletAddress= 0x820401adfF23A01E2CaCF913A2642B781d470a95
sequence= 2
selectedDiceNumber= 1
resultDiceNumber= 4
win= false
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
