import { NextResponse, type NextRequest } from "next/server";

import {
	getCenterOwnerByCenter
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getCenterOwnerByCenter(center);


  ///console.log("getOneByWalletAddress result", result);

 
  return NextResponse.json({

    result,
    
  });
  
}
