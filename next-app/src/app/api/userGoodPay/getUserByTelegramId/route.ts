import { NextResponse, type NextRequest } from "next/server";

import {
	getOneByTelegramId,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { telegramId } = body;



  const result = await getOneByTelegramId(telegramId);


 
 
  return NextResponse.json({

    result,
    
  });
  
}
