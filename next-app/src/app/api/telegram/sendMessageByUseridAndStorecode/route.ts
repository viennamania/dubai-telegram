import { NextResponse, type NextRequest } from "next/server";

import {
	insertMessageByUseridAndStorecode
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    userid,
    storecode,
    message,
  } = body;




  const result = await insertMessageByUseridAndStorecode({
    center: "LotusWorkerBot",
    category: "wallet",
    userid,
    storecode,
    message,
  } );

 
  return NextResponse.json({

    result,
    
  });
  
}
