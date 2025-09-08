import { NextResponse, type NextRequest } from "next/server";

import {
	insertMessageByUseridAndStorecodeMulberryBot,
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    center,
    userid,
    storecode,
    message,
  } = body;


  const result = await insertMessageByUseridAndStorecodeMulberryBot({
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
