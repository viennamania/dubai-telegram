import { NextResponse, type NextRequest } from "next/server";


import {
	getOneByNickname,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { nickname, center } = body;



  const result = await getOneByNickname(nickname);



  return NextResponse.json({

    result,
    
  });

}