import { NextRequest, NextResponse } from "next/server";

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
  const { walletAddress, seller } = body;

  //console.log("walletAddress", walletAddress);
  //console.log("sellerStatus", sellerStatus);

 
  // check escrow wallet address is exist

  const user = await getOneByWalletAddress(walletAddress);

  if (!user) {
    return NextResponse.json({
      result: null,
    });
  }



  /*
  if (!user.escrowWalletAddress) {




    const escrowWalletPrivateKey = ethers.Wallet.createRandom().privateKey;

    //console.log("escrowWalletPrivateKey", escrowWalletPrivateKey);

    if (!escrowWalletPrivateKey) {
      return NextResponse.json({
        result: null,
      });
    }



    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });

    if (!client) {
      return NextResponse.json({
        result: null,
      });
    }


    const personalAccount = privateKeyToAccount({
      client,
      privateKey: escrowWalletPrivateKey,
    });
      

    if (!personalAccount) {
      return NextResponse.json({
        result: null,
      });
    }
    
    const wallet = smartWallet({

      chain: polygon,
      //factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // your own deployed account factory address
      sponsorGas: true,
    });


    // Connect the smart wallet
    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });

    if (!account) {
      return NextResponse.json({
        result: null,
      });
    }

  
    const escrowWalletAddress = account.address;

      



    const resultEscrow = await setEscrowWalletAddressByWalletAddress(
      walletAddress,
      escrowWalletAddress,
      escrowWalletPrivateKey,
    );

    if (!resultEscrow) {
      return NextResponse.json({
        result: null,
      });
    }

  }
  */



  // https://na.winglobalpay.com/api/v1/vactFcs
  /*
  mchtId : 가맹점 ID
  bankCd : 실명인증 은행코드
  account : 실명인증 계좌번호
  payerName : 발급요청자 실명
  payerTel : 발급요청자 연락처
  dob : 발급요청자 생년월일
  gender : 발급요청자 성별, 0:여성, 1:남성

  recvBankCd : 수취은행코드, 비어있을 경우 광주은행으로 발급됩니다.
  //광주은행:034, 경남은행:039, 제주은행:035

  국민은행: 004, 우리은행: 020, 신한은행: 088, 농협: 011, 기업은행: 003, 하나은행: 081, 외환은행: 002, 부산은행: 032, 대구은행: 031, 전북은행: 037, 경북은행: 071, 부산은행: 032, 광주은행: 034, 우체국: 071, 수협: 007, 씨티은행: 027, 대신은행: 055, 동양종합금융: 054, 롯데카드: 062, 삼성카드: 029, 현대카드: 048, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카드: 002, 씨티카드: 027, 현대카드: 048, 롯데카드: 062, 삼성카드: 029, 신한카드: 016, 국민카드: 020, 하나카드: 081, 외환카

  카카오뱅크: 090, 케이뱅크: 089, 토스뱅크: 092,
  */






  //const bankCd = '035';

  const bankCd =
    seller?.bankInfo?.bankName === '카카오뱅크' ? '090' :
    seller?.bankInfo?.bankName === '케이뱅크' ? '089' :
    seller?.bankInfo?.bankName === '토스뱅크' ? '092' :

    seller?.bankInfo?.bankName === '국민은행' ? '004' :
    seller?.bankInfo?.bankName === '우리은행' ? '020' :
    seller?.bankInfo?.bankName === '신한은행' ? '088' :
    seller?.bankInfo?.bankName === '농협' ? '011' :
    seller?.bankInfo?.bankName === '기업은행' ? '003' :
    seller?.bankInfo?.bankName === '하나은행' ? '081' :
    seller?.bankInfo?.bankName === '외환은행' ? '002' :
    seller?.bankInfo?.bankName === '부산은행' ? '032' :
    seller?.bankInfo?.bankName === '대구은행' ? '031' :
    seller?.bankInfo?.bankName === '전북은행' ? '037' :
    seller?.bankInfo?.bankName === '경북은행' ? '071' :
    seller?.bankInfo?.bankName === '광주은행' ? '034' :
    seller?.bankInfo?.bankName === '우체국' ? '071' :
    seller?.bankInfo?.bankName === '수협' ? '007' :
    seller?.bankInfo?.bankName === '씨티은행' ? '027' :
    seller?.bankInfo?.bankName === '대신은행' ? '055' :
    seller?.bankInfo?.bankName === '동양종합금융' ? '054' :
    seller?.bankInfo?.bankName === '미래에셋증권' ? '230'
    
    : seller?.bankInfo?.bankName;
    
    //: '034';


    console.log("bankCd: ", bankCd);



  //const bankCd = '034';
  //const recvBankCd = '035'; // 제주은행
  const recvBankCd = '012'; // 농협


  const bankAccount = seller?.bankInfo?.accountNumber || '';


  const payerName = seller?.bankInfo?.accountHolder || '';

  const payerTel = seller?.bankInfo?.phoneNum || '';

  const dob = seller?.bankInfo?.birth || '';




  // https://vact.npcpn.kr/vauth/v1/onecert
  /*
  •	MID: 가맹점 ID
	•	SKEY_MID: 인증키
	•	C_BANKCD: 은행코드
	•	C_NAME: 예금주명
	•	C_TEL: 연락처 (선택)
	•	C_ACCNTNO: 조회계좌번호
	•	C_ACNMNO: 실명번호
	•	M_PTST_TXT: 1원 인증 계좌 기재 내용 (선택)
	•	T_NATVNO: 요청 고유번호
	•	T_BANKCD: 계좌 은행코드
	•	T_DATE: 가맹점 요청일시
  */
  /*
  MID : stadiumC
  SKEY_MID : 1af341df9c61c3af0a0e12c02faf22
  */

  // natvno : random number
  const natvno = Math.floor(Math.random() * 10000000).toString();
  
  const bodyData = {
    MID: 'stadiumC',
    SKEY_MID: '1af341df9c61c3af0a0e12c02faf22',
    C_BANKCD: bankCd,
    C_NAME: payerName,
    C_TEL: payerTel,
    C_ACCNTNO: bankAccount,
    C_ACNMNO: dob,
    M_PTST_TXT: "PUB",

    T_NATVNO: "TRA23052500012231322",
    //T_NATVNO: natvno,
    
    T_BANKCD: recvBankCd,

    T_DATE: new Date().toISOString(),
  };
  


  /*
  const bodyData = {
    MID: 'stadiumC',
    SKEY_MID: '1af341df9c61c3af0a0e12c02faf22',
    C_BANKCD: '011',    // 농협
    C_NAME:   '이철호', 
    C_TEL: "01032370095",
    C_ACCNTNO: "3522246464283",
    C_ACNMNO: "611213",
    M_PTST_TXT: "PUB",
    T_NATVNO: "TRA23052500012231322",
    T_BANKCD: "012",

    T_DATE: new Date().toISOString(),
  };
  */



  //console.log("bodyData: ", bodyData);


  const response3 = await fetch('https://vact.npcpn.kr/vauth/v1/onecert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(bodyData),


    /*
    body: JSON.stringify({
      MID: 'stadiumC',
      SKEY_MID: '1af341df9c61c3af0a0e12c02faf22',
      C_BANKCD: bankCd,
      C_NAME: payerName,
      C_TEL: payerTel,
      C_ACCNTNO: bankAccount,
      C_ACNMNO: dob,

      //M_PTST_TXT: '',
      ////T_NATVNO: 'TRA23052500012231322',
      //T_NATVNO: '',
      //T_BANKCD: recvBankCd,

      M_PTST_TXT: "PUB",
      T_NATVNO: "TRA23052500012231322",
      T_BANKCD: "034",


      T_DATE: new Date().toISOString(),
    }),
    */
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
    R_DATE: '20250317181949',
    R_CD: '9989',
    T_DATE: '2025-03-17T09:19:49.721Z',
    R_MSG: '기존 발급 가상계좌 존재, 관리자 문의'
  }
  */
  /*
  {
    R_DATE: '20250317152358',
    R_CD: '0000',
    T_DATE: '2025-03-17T06:23:58.187Z',
    R_MSG: '정상처리',
    R_ONEID: 'O250317309732'
  }
  */

  if (response3Json.R_CD === '9989') {
    console.log("response3Json.R_CD is 9989");

    return NextResponse.json({
      result: null,
      error: response3Json.R_MSG,
    });
  }



  if (response3Json.R_CD !== '0000') {
    console.log("response3Json.R_CD is not 0000");

    return NextResponse.json({
      result: null,
    });
  }


  return NextResponse.json({

    result: {
      oneId: response3Json.R_ONEID,
    },
    error: "",

  });

  /*
  const virtualAccount = "1234567890";

  const result = await updateSeller({
    walletAddress: walletAddress,
    seller: seller,
    virtualAccount: virtualAccount,
  });

  return NextResponse.json({
    result,
    error: "",
  });

  */

}
