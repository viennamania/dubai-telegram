import { NextResponse, type NextRequest } from "next/server";

import {
	getTransferByWalletAddress
} from '@lib/api/transferDubai'


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { limit, page, walletAddress } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getTransferByWalletAddress({
    limit,
    page,
    walletAddress,
  });

  //console.log("getTransferByWalletAddress result", result);

 
  return NextResponse.json({

    result,
    
  });
  
}
