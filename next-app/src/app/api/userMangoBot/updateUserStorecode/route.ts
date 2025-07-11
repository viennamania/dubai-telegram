import { NextResponse, type NextRequest } from "next/server";

import {
	updateStorecode,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, storecode } = body;

  console.log("walletAddress", walletAddress);
  console.log("storecode", storecode);

  const result = await updateStorecode({
    walletAddress: walletAddress,
    storecode: storecode,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
