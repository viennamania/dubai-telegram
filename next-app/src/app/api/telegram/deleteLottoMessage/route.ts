import { NextResponse, type NextRequest } from "next/server";

import {
	deleteLottoMessage
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { _id } = body;


  //console.log("walletAddress", walletAddress);


  const result = await deleteLottoMessage( _id );

 
  return NextResponse.json({

    result,
    
  });
  
}
