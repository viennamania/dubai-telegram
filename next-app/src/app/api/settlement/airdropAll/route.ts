import { NextResponse, type NextRequest } from "next/server";

/*
import {
  getOneByApplicationId,
	setSettlementClaim,
} from '@lib/api/agent';
*/

import {
  getAllMembersByMarketingCenter,
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


// DUBAI Token (USDT)
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


  const {
    amount,
    marketingCenter,
  } = body;

 
  if (!amount || !marketingCenter) {
    return NextResponse.error();
  }

  console.log("amount: ", amount);
  console.log("marketingCenter: ", marketingCenter);


  const members = await getAllMembersByMarketingCenter({
    marketingCenter: marketingCenter,
    limit: 500,
    page: 0,
  });

  if (!members) {
    return NextResponse.error();
  }

  //console.log("members: ", members);



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

  //console.log("members: ", members);


  let transactions = [] as any;

  const sendAmount = amount / members.length;

  members.forEach(async (member : any) => {

    const tronWalletAddress = member.walletAddress;


    const transaction = transfer({
      contract: contractUSDT,
      to: tronWalletAddress,
      amount: sendAmount,
    });

    transactions.push(transaction);

  } );


  const batchOptions: SendBatchTransactionOptions = {
    account: account,
    transactions: transactions,
  };

  
  const batchResponse = await sendBatchTransaction(
    batchOptions
  );
  

  // test
  ///const batchResponse = null;



  ///console.log("batchResponse: ", batchResponse);






  /*
  const transactionMasterWalletAddress = transfer({
    contract: contractUSDT,
    to: masterWalletAddress,
    amount: masterInsentive,
  });

  const transactionAgentWalletAddress = transfer({
    contract: contractUSDT,
    to: agentWalletAddress,
    amount: agentInsentive,
  });

  const transactionCenterWalletAddress = transfer({
    contract: contractUSDT,
    to: centerWalletAddress,
    amount: centerInsentive,
  });

  const batchOptions: SendBatchTransactionOptions = {
    account: account,
    transactions: [
      transactionMasterWalletAddress,
      transactionAgentWalletAddress,
      transactionCenterWalletAddress,
    ],
  };


  const batchResponse = await sendBatchTransaction(
    batchOptions
  );


  //console.log("batchResponse: ", batchResponse);

  if (!batchResponse) {
    return NextResponse.error();
  }

  */


  
  return NextResponse.json({
    result: batchResponse,
  });
  
}
