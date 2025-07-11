import { NextResponse, type NextRequest } from "next/server";

import {
	getAllCenters,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { limit, page, marketingCenter } = body;

  const result = await getAllCenters({
    limit: limit || 100,
    page: page || 0,
    marketingCenter: marketingCenter || null
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
