import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllMembersByCenter,
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


///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

const chain = polygon;


// DUBAI Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {

    //const center = "owin_anawin_bot";

    // get parameters from request

    // Error: useSearchParams only works in Client Components. Add the "use client" directive at the top of the file to use it.
    //const searchParams = useSearchParams();
    //console.log("searchParams: ", searchParams);

    //const center = searchParams.get('center');

    //console.log("center: ", center);
    const center = request.nextUrl.searchParams.get('center');

    //console.log("center: ", center);

  


    if (!center) {
        return NextResponse.error();
    }


    // check time 
    /*
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 23 || hours < 9) {

      
      return;
    }
    */





      const members = await getAllMembersByCenter({
        center: center,
        limit: 500,
        page: 0,
      });

      //console.log("members: ", members);
    
      if (!members) {
        return NextResponse.error();
      }


      return NextResponse.error();


    
      //console.log("members: ", members);
    
        // amount is random from 0.00001 to 0.1
        const amount = Math.random() * (1 - 0.00001) + 0.00001;

    
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
    
        const toWalletAddress = member.walletAddress;

        const transaction = transfer({
          contract: contractUSDT,
          to: toWalletAddress,
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



    return NextResponse.json({
        
        result: {
            members,
            amount,
            claimWalletAddress,
        },
    });

}
