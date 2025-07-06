import { NextResponse, type NextRequest } from "next/server";

import {
	updateTelegramId,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, telegramId } = body;

  //console.log("walletAddress", walletAddress);
  //console.log("sellerStatus", sellerStatus);

  const result = await updateTelegramId({
    walletAddress: walletAddress,
    telegramId: telegramId,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
