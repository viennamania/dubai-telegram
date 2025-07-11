import { NextResponse, type NextRequest } from "next/server";

import {
	insertMessageByUseridAndStorecodeMangoBot,
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    center,
    userid,
    storecode,
    message,
  } = body;



  const result = await insertMessageByUseridAndStorecodeMangoBot({
    center: center,
    category: "wallet",
    userid,
    storecode,
    message,
  } );

 
  return NextResponse.json({

    result,
    
  });
  
}
