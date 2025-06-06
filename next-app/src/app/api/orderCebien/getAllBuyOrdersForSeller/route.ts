import { NextResponse, type NextRequest } from "next/server";

import {
	getBuyOrdersForSeller,
} from '@lib/api/orderCebien';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, searchMyTrades } = body;



  const result = await getBuyOrdersForSeller({
    limit: 200,
    page: 0,
    walletAddress,
    searchMyTrades,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
