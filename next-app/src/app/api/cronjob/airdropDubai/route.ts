import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



import {
  getOneByWalletAddress,
  getCenterOwnerByCenter,
  getAllMembersByCenter,
  getAllUsers,
} from '@lib/api/user';

import {
  getReferralCodeByTelegramId,
} from '@lib/api/referral';

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
    //totalSupply,
    transfer,
    
    getBalance,
  
    //balanceOf,
  
} from "thirdweb/extensions/erc20";

import {
  getNFT,

  balanceOf,
  
  totalSupply,
  
} from "thirdweb/extensions/erc1155";


///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

const chain = polygon;


// DUBAI Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




export async function GET(request: NextRequest) {



    // check time 
    
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 22 || hours < 9) {

      
      return;
    }





    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });



    const contractUSDT = getContract(
      //contractOptions
      {
        client: client,
        chain: chain,
        address: tokenContractAddressUSDT,
      }
    );
  
    const claimWalletPrivateKey = process.env.GAME_WALLET_PRIVATE_KEY || "";
  
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
  
    const gameWalletAddress = account.address;
  
    console.log("gameWalletAddress: ", gameWalletAddress);




    // get all users
    const result = await getAllUsers(
      {
        limit: 1000,
        page: 0,
      }
    );

    //console.log("result: ", result);

    const users = result.users;

    // transfer USDT to all users
    const transactions = [] as any[];


    for (const user of users) {
      const userWalletAddress = user.walletAddress;
      const userTelegramId = user.telegramId;
      const userReferralCode = await getReferralCodeByTelegramId(userTelegramId);

      console.log("userWalletAddress: ", userWalletAddress);

      if (userWalletAddress && userWalletAddress !== gameWalletAddress) {
        

        const transaction = transfer({
          contract: contractUSDT,
          to: userWalletAddress,
          amount: 1, // send 1 USDT to each user
        });

        transactions.push(transaction);

      }


    }
    


    const batchOptions: SendBatchTransactionOptions = {
      account: account,
      transactions: transactions,
    };
  
    const batchResponse = await sendBatchTransaction(
      batchOptions
    );


    //console.log("batchResponse: ", batchResponse);

    const transactionHash = batchResponse.transactionHash;







    return NextResponse.json({
        
        result: {
            gameWalletAddress,
            transactionHash,
            totalTransactions: transactions.length,
            totalAmount: transactions.length, // assuming 1 USDT per transaction
            users: users.length,
        },
    });




}
