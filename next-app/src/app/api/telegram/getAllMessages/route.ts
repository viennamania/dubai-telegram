import { NextResponse, type NextRequest } from "next/server";

import {
	getAllMessages
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center, limit, page } = body;

  const result = await getAllMessages({
    center: center,
    limit: limit || 500,
    page: page || 0,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
