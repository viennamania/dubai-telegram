import { NextResponse, type NextRequest } from "next/server";

import {
	updateCenterByTelegramId,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { telegramId, center } = body;



  const result = await updateCenterByTelegramId({
    telegramId: telegramId,
    center: center,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
