import { NextResponse, type NextRequest } from "next/server";

import {
	updateOneGameMoney,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();


  const {
    walletAddress,
    addGameMoney,
  } = body;

  console.log("walletAddress", walletAddress);
  console.log("addGameMoney", addGameMoney);

  const result = await updateOneGameMoney({
    walletAddress: walletAddress,
    addGameMoney: addGameMoney,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
