import { NextResponse, type NextRequest } from "next/server";

/*
import {
  getOneByApplicationId,
	setSettlementClaim,
} from '@lib/api/agent';
*/

import {
  getAllMembersByCenter,
  getUserByTelegramId,
} from '@lib/api/user';

import {
	createThirdwebClient,

	///ContractOptions,

	getContract,
	sendAndConfirmTransaction,
	
	sendBatchTransaction,

	SendBatchTransactionOptions,
  
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
	privateKeyToAccount,
	smartWallet,
	getWalletBalance,
	SmartWalletOptions,
} from "thirdweb/wallets";

import {
	mintTo,
	totalSupply,
	transfer,
	
	getBalance,
  
	balanceOf,
  
} from "thirdweb/extensions/erc20";


import { Network, Alchemy } from 'alchemy-sdk';



const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);





export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

  const body = await request.json();


  const { amount,  userTelegramId} = body;

 
  if (!amount || !userTelegramId) {
    return NextResponse.error();
  }

  console.log("amount: ", amount);
  console.log("userTelegramId: ", userTelegramId);



  // get wallet address by userTelegramId
  const user = await getUserByTelegramId(userTelegramId);

  if (!user) {
    return NextResponse.error();
  }

  const toWalletAddress = user.walletAddress;

  if (!toWalletAddress) {
    return NextResponse.error();
  }



  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  /*
  const contractOptions: ContractOptions = {
    client: client,
    chain: chain,
    address: tokenContractAddressUSDT,
  };
  */
  
  const contractUSDT = getContract(
    //contractOptions
    {
      client: client,
      chain: chain,
      address: tokenContractAddressUSDT,
    }
  );

  
  
  const claimWalletPrivateKey = process.env.CLAIM_WALLET_PRIVATE_KEY || "";

  ///const claimWalletPrivateKey = process.env.GAME_WALLET_PRIVATE_KEY || "";


  const personalAccount = privateKeyToAccount({
    client,
    privateKey: claimWalletPrivateKey,
  });

  const wallet = smartWallet({
    chain: chain,
    sponsorGas: true,
  });

  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });

  const claimWalletAddress = account.address;

  //console.log("claimWalletAddress: ", claimWalletAddress);
  // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2



  let transactions = [] as any;

  // transfer USDT to user and memo

  const transaction = transfer({
    contract: contractUSDT,
    to: toWalletAddress,
    amount: amount,
    
    //memo: "From Thirdweb",

  });

  transactions.push(transaction);



  const batchOptions: SendBatchTransactionOptions = {
    account: account,
    transactions: transactions,
  };

  const batchResponse = await sendBatchTransaction(
    batchOptions
  );

  ///console.log("batchResponse: ", batchResponse);

  
  return NextResponse.json({
    result: batchResponse,
  });
  
}
