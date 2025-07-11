import { NextResponse, type NextRequest } from "next/server";


import {
	setErc721ContractAddressByWalletAddress,
} from '@lib/api/user';

export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    erc721ContractAddress,
    center,
  } = body;



  const result = await setErc721ContractAddressByWalletAddress(
    walletAddress,
    erc721ContractAddress,
  );

 
  return NextResponse.json({

    result,
    
  });
  

}
