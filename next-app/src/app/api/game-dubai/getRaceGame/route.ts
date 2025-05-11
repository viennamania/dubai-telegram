import { NextResponse, type NextRequest } from "next/server";

import {
	getOneRaceGameByWalletAddressAndSequence,
} from '@lib/api/gameCebien';





export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    sequence,

  } = body;


  if (!walletAddress || !sequence) {
    return NextResponse.error();
  }

  const result = await getOneRaceGameByWalletAddressAndSequence(
    walletAddress,
    sequence
  );

  return NextResponse.json({

    result,

  });

}