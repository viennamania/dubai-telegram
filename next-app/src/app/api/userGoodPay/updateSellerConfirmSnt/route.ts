import { NextResponse, type NextRequest } from "next/server";

import {
  getOneByWalletAddress,
  updateSeller,
  setEscrowWalletAddressByWalletAddress,
} from '@lib/api/user';



import { ethers } from "ethers";

import {
  createThirdwebClient,

} from "thirdweb";

//import { polygonAmoy } from "thirdweb/chains";
import {
  polygon,
  arbitrum,
 } from "thirdweb/chains";

import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  
 } from "thirdweb/wallets";
import { error } from "console";



export async function POST(request: NextRequest) {

  const body = await request.json();

  //const { walletAddress, sellerStatus, bankName, accountNumber, accountHolder } = body;
  const { walletAddress, seller, authValue, oneId } = body;

  //console.log("walletAddress", walletAddress);
  //console.log("sellerStatus", sellerStatus);

 
  // check escrow wallet address is exist

  const user = await getOneByWalletAddress(walletAddress);

  if (!user) {
    return NextResponse.json({
      result: null,
    });
  }


  {/*
    	•	MID (가맹점 ID)
	•	SKEY_MID (인증키)
	•	C_AUTHVAL (검증값, 1원 인증 검증값)
	•	T_ONEID (1원 인증 ID, R_ONEID 값과 동일해야 함)
	•	T_NATVNO (요청고유번호)
	•	T_DATE (가맹점 요청일시, yyyyMMddHHmmss 형식)
  */}

  const bodyData = {
    MID: 'stadiumC',
    SKEY_MID: '1af341df9c61c3af0a0e12c02faf22',
    C_AUTHVAL: authValue,
    T_ONEID: oneId,
    T_NATVNO: "TRA23052500012231322",
    T_DATE: new Date().toISOString(),
  };



  console.log("bodyData: ", bodyData);


  const response3 = await fetch('https://vact.npcpn.kr/vauth/v1/onecertChk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(bodyData),

  });

  if (!response3) {
    console.log("response3 is null");

    return NextResponse.json({
      result: null,
    });
  }

  const response3Json = await response3.json();

  console.log("response3Json: ", response3Json);

  /*
    response3Json:  {
      R_DATE: '20250317174035',
      R_CD: 'A011',
      T_DATE: '2025-03-17T08:40:35.078Z',
      R_MSG: '계좌검증번호가 일치하지 않습니다. 다시 정확하게 입력하여 주십시오.'
    }
  */
  /*
  response3Json:  {
    R_DATE: '20250317174635',
    R_CD: '1011',
    T_DATE: '2025-03-17T08:46:35.613Z',
    R_MSG: '1원 인증 이력 없음'
  }
  */
  /*
  response3Json:  {
    R_EXPIRE: '9999123100',
    R_FCSID: 'O250317309740',
    R_BANKCD: '012',
    R_DATE: '20250317175000',
    R_ACCNT: '79200045363565',
    R_CD: '0000',
    T_DATE: '2025-03-17T08:50:00.692Z',
    T_NATVNO: 'TRA23052500012231322',
    R_ISSUEID: 'VI250317403944',
    R_MSG: '정상발급',
    R_HDNAME: '박승현'
  }
  */


  if (response3Json.R_CD !== "0000") {
    return NextResponse.json({
      result: null,
      error: response3Json.R_MSG,
    });
  }




  const virtualAccount = response3Json.R_ACCNT;

  const result = await updateSeller({
    walletAddress: walletAddress,
    seller: seller,
    
    virtualAccount: virtualAccount,

    sntVirtualAccount: virtualAccount,


  });

  return NextResponse.json({
    result,
    error: "",
  });



}
