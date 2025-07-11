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
  const recvBankCd = '035'; // 제주은행


  //const bankAccount = '110019648787';

  const bankAccount = seller?.bankInfo?.accountNumber || '';



  //const payerName = '박승현';

  const payerName = seller?.bankInfo?.accountHolder || '';


  //const payerTel = '01098551647';

  const payerTel = seller?.bankInfo?.phoneNum || '';


  //const dob = '691120';

  const dob = seller?.bankInfo?.birth || '';



  ///const gender = '1';

  const gender = seller?.bankInfo?.gender || '1';


  /*
  {
  "vact":{
      "tmnId":"sorhkrj",
      "mchtId":"sorhkrj",
      "trackId":"",
      "bankCd":"004",
      "account":"111122223333",
      "payerName":"홍길동",
      "payerTel":"01012345678",
      "dob":"880101",
      "gender":"1",
      "recvBankCd":"",
      "itndAmount":"20000",
      "holderName":""
      }
}
  */


  /*
  const response2 = await fetch('https://na.winglobalpay.com/api/v1/vactFcs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': process.env.WINGLOBALPAY_API_KEY || '',
    },
    body: JSON.stringify({
      "vact": {
        tmnId: '',
        mchtId: 'w63791online',
        trackId: '',
        bankCd: bankCd,
        account: bankAccount,
        payerName: payerName,
        payerTel: payerTel,
        dob: dob,
        gender: gender,
        recvBankCd: recvBankCd,
        itndAmount: '20000',
        holderName: '',

      },
    })
  });

  const response2Json = await response2.json();
  

  console.log("response2Json: ", response2Json);
  */


  /*
response2Json:  {
  timestamp: '2025-02-03T06:44:02.186+00:00',
  status: 500,
  error: 'Internal Server Error',
  path: '/api/v1/vactFcs'
}
  */
 /*
 response2Json:  {
  result: {
    resultCd: '9999',
    advanceMsg: '올바르지 않은 생년월일(예:YYMMDD)입니다.',
    create: '20250203154959',
    resultMsg: '입력값 오류'
  },
  vact: {
    holderName: '',
    gender: '1',
    tmnId: '',
    trackId: '',
    itndAmount: '20000',
    recvBankCd: '034',
    dob: '19601120',
    bankCd: '088',
    payerTel: '01098551647',
    mchtId: 'w63791online',
    payerName: '박승현',
    account: '110019648787'
  }
    */

  /*
  response2Json:  {
  result: {
    resultCd: '9999',
    advanceMsg: '계좌인증 실패 - 실명번호 오류',
    create: '20250203155041',
    resultMsg: '조회 오류'
  },
  vact: {
    holderName: '',
    gender: '1',
    tmnId: '',
    trackId: '',
    itndAmount: '20000',
    recvBankCd: '034',
    dob: '601120',
    bankCd: '088',
    payerTel: '01098551647',
    mchtId: 'w63791online',
    payerName: '박승현',
    account: '110019648787'
  }
}
  */

  /*
  response2Json:  {
  result: {
    resultCd: '9999',
    advanceMsg: '해당 상점의 가상계좌 개수가 부족합니다.',
    create: '20250203155607',
    resultMsg: '계좌 부족'
  },
  vact: {
    holderName: '',
    gender: '1',
    tmnId: '',
    trackId: '',
    itndAmount: '20000',
    recvBankCd: '088',
    dob: '691120',
    bankCd: '088',
    payerTel: '01098551647',
    mchtId: 'w63791online',
    payerName: '박승현',
    account: '110019648787'
  }
}
  */



  /*
  response2Json:  {
  result: {
    resultCd: '0000',
    advanceMsg: '기존 발행된 가상계좌가 있습니다.',
    create: '20250203155848',
    resultMsg: '정상처리'
  },
  vact: {
    holderName: '박승현',
    gender: '1',
    tmnId: '',
    trackId: '',
    itndAmount: '20000',
    recvBankCd: '035',
    dob: '691120',
    bankCd: '035',
    payerTel: '01098551647',
    mchtId: 'w63791online',
    payerName: '박승현',
    account: '50902006423904'
  }
}

 {
  result: {
    resultCd: '9999',
    advanceMsg: '계좌인증 실패 - 입금계좌 오류',
    create: '20250205091812',
    resultMsg: '조회 오류'
  },
  vact: {
    holderName: '',
    gender: '1',
    tmnId: '',
    trackId: '',
    itndAmount: '20000',
    recvBankCd: '035',
    dob: '701111',
    bankCd: '090',
    payerTel: '01098551647',
    mchtId: 'w63791online',
    payerName: '박승현',
    account: '110019648787'
  }
}


  */

  //console.log("resultCd: ", response2Json.result.resultCd);


  // 성공
  /*
  if (response2Json.result.resultCd === '0000') {

    //console.log("account: ", response2Json.vact.account);


    const virtualAccount = response2Json.vact.account;

    if (virtualAccount) {


      
      //return NextResponse.json({
      //  result: null,
      //  error: response2Json.result.advanceMsg,
      //});
      

    }

    const result = await updateSeller({
      walletAddress: walletAddress,
      seller: seller,
      virtualAccount: virtualAccount,
    });

    return NextResponse.json({
      result,
      error: "",
    });

  }



  return NextResponse.json({
    result: null,
    error: response2Json.result.advanceMsg,
  });
  */



  const virtualAccount = "1234567890";

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
