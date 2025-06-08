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


// getOneLottoGame
import {
  getOneLottoGame,

  updateOneLottoGameClose,
} from '@lib/api/gameDubai';



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
    const hours = (date.getHours() + 9) % 24; // Convert to UTC+9

    console.log("hours: ", hours);

    /*
    if (hours >= 22 || hours < 9) {

      
      return NextResponse.json({
        error: "This function can only be run between 09:00 and 22:00 (UTC+9).",
      });

    }
    */


    // get the latest lotto game
    const lottoGame = await getOneLottoGame();


    if (!lottoGame) {
      return NextResponse.json({
        error: "No active lotto game found.",
      });
    }




    const createdAt = lottoGame.createdAt;

    // if current time is more than 10 minutes after the createdAt time, then close the game
    const currentTime = moment();
    const createdAtTime = moment(createdAt);
    const duration = moment.duration(currentTime.diff(createdAtTime)).asMinutes();
    console.log("duration: ", duration);

    if (duration < 10) {
      return NextResponse.json({
        error: "The game is still active. Please wait until it is closed.",
      });
    }


    const tatalBetAmount = lottoGame.totalBetAmount;



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






    //console.log("lottoGame: ", lottoGame);

    // resultNumber
    // "00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, ... 36"

    // randomly generate a result number between "00" and "36"
    const resultNumber = Math.floor(Math.random() * 37).toString().padStart(2, '0');

 

    // find bets that match selectedNumber is equal to resultNumber
    interface Bet {
      walletAddress: string;
      selectedNumber: string;
      betAmount: number;

    }


    const bets: Bet[] = (lottoGame.bets as Bet[]);

    const winningBets: Bet[] = bets.filter((bet: Bet) => bet.selectedNumber === resultNumber);

    console.log("winningBets: ", winningBets);

 



    const transactions = [] as any[];

    for (const bet of winningBets) {
      const userWalletAddress = bet.walletAddress;
      const betAmount = bet.betAmount;

      console.log("userWalletAddress: ", userWalletAddress);
      console.log("betAmount: ", betAmount);

      const winningAmount = tatalBetAmount / winningBets.length; // distribute total bet amount equally among winners

      // transfer USDT to the user
      if (userWalletAddress && userWalletAddress !== gameWalletAddress) {
        const transaction = transfer({
          contract: contractUSDT,
          to: userWalletAddress,
          amount: winningAmount, // send winning amount to the user
        });

        transactions.push(transaction);
      }
    }


    let transactionHash = "";
    if (transactions.length > 0) {
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
      const batchResponse = await sendBatchTransaction(batchOptions);
 
      transactionHash = batchResponse.transactionHash;
      console.log("transactionHash: ", transactionHash);
      // return the transaction hash

    }






    // updateOneLottoGameClose
    const updatedLottoGame = await updateOneLottoGameClose({
      sequence: lottoGame.sequence,
      resultNumber: resultNumber,
    });

    if (!updatedLottoGame) {
      return NextResponse.json({
        error: "Failed to update lotto game.",
      });
    }


    /*
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
    */



    return NextResponse.json({
      result: {
        gameWalletAddress,
        resultNumber,
        lottoGame: updatedLottoGame,
      },
    });


}
