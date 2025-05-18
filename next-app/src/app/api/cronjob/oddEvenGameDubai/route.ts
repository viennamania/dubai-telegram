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

import {
  getAllOddEvenGamesSettlement,
  setOddEvenGamesSettlementByWalletAddressAndSequence,
} from '@lib/api/gameDubai';


import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  getOneByTelegramId,
} from '@lib/api/referral';



import { Network, Alchemy } from 'alchemy-sdk';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



 

const chain = polygon;


// DUBAI Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {


  console.log("start gameDubai==================>");

    //const center = "owin_anawin_bot";

    // get parameters from request

    // Error: useSearchParams only works in Client Components. Add the "use client" directive at the top of the file to use it.
    //const searchParams = useSearchParams();
    //console.log("searchParams: ", searchParams);

    //const center = searchParams.get('center');

    //console.log("center: ", center);
    //const center = request.nextUrl.searchParams.get('center');

    //console.log("center: ", center);

  


    //if (!center) {
    //    return NextResponse.error();
    //}


    // check time 
    /*
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 23 || hours < 9) {

      
      return;
    }
    */




      /*
      const members = await getAllMembersByCenter({
        center: center,
        limit: 500,
        page: 0,
      });

      //console.log("members: ", members);
    
      if (!members) {
        return NextResponse.error();
      }
      */



      const games = await getAllOddEvenGamesSettlement();

      console.log("games: ", games);


      if (!games) {

        console.log("nod data found");


        return NextResponse.json({
          result: "no data found",
        });
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
      // 0x298288C587dbBc7a7064Aa252ea0848a4F519A5a
      
    
    

      //console.log("members: ", members);


    
      let transactions = [] as any;


      /*
            // send amount is 0.00001 to 0.001
      const sendAmount = 
        Math.random() * (0.001 - 0.00001) + 0.00001;

        */



      //games.forEach(async (game : any) => {
      // sync
      for (let i = 0; i < games.length; i++) {

        const game = games[i];











        const toWalletAddress = game.walletAddress;







        // update game settlement
        const sequence = game.sequence;

        console.log("sequence: ", sequence);
        console.log("toWalletAddress: ", toWalletAddress);

        ///const settlement = sendAmount.toString();

        const result = await setOddEvenGamesSettlementByWalletAddressAndSequence({
          walletAddress: toWalletAddress,
          sequence: sequence,
        });


        console.log("result: ", result);









        ///const amount = game.krwAmount;

              // send amount is 0.00001 to 0.001
        //const sendAmount = Number(Math.random() * (0.001 - 0.00001) + 0.00001).toFixed(2);

        //const sendAmount = game.settlement;

        const sendAmount = game.winPrize;

        const transaction = transfer({
          contract: contractUSDT,
          to: toWalletAddress,
          amount: sendAmount,
        });
    
        transactions.push(transaction);






        // 10% of gaem.winPrize to referral

        // get telegram id from users by wallet address
        // find referral from members by wallet address

        // 1st level
        // rate 10%
        const firstLevelRate = 0.1;

        let firstOwnerWalletAddress = "";
        let firstOwnerownerAmount = "";

   
        const user = await getOneByWalletAddress(toWalletAddress);

        console.log("user: ", user);



        if (user) {
          const telegramId = user.telegramId;
          const center = user.center;

          const response = await getOneByTelegramId(telegramId, center);

          //console.log("response: ", response);

          /*
          {
            "_id": {
              "$oid": "67860af11cbd056942632b2d"
            },
            "telegramId": "441516803",
            "referralCode": "0x4BC23C679e3E2aac58D43Bb5257281562FB01e04_0"
          }
          */

          if (response && response.referralCode) {

            const referralCode = response.referralCode;

            // get contract address and tokenId from referralCode
            const referralCodeArray = referralCode.split("_");
            const contractAddress = referralCodeArray[0];
            const tokenId = referralCodeArray[1];


            console.log("contractAddress: ", contractAddress);
            console.log("tokenId: ", tokenId);

            // Get owner of NFT
            const owner = await alchemy.nft.getOwnersForNft(
              contractAddress,
              tokenId
            );

            console.log("owner: ", owner);



            firstOwnerWalletAddress = owner?.owners?.[0];

            console.log("firstOwnerWalletAddress: ", firstOwnerWalletAddress );


            firstOwnerownerAmount = Number(parseFloat(sendAmount) * firstLevelRate).toFixed(2);


            console.log("ownerAmount: ", firstOwnerownerAmount );


            if (firstOwnerWalletAddress) {

              const ownerTransaction = transfer({
                contract: contractUSDT,
                to: firstOwnerWalletAddress,
                amount: firstOwnerownerAmount,
              });

              transactions.push(ownerTransaction);

            }

            
          }

        } else {
          continue;
        }





        // 2nd level
        // rate 5%

        const secondLevelRate = 0.05;
        let secondOwnerWalletAddress = "";
        let secondOwnerAmount = "";

        const secondOwnerOwner = await getOneByWalletAddress(firstOwnerWalletAddress);


        console.log("secondOwnerOwner: ", secondOwnerOwner);

        if (secondOwnerOwner) {
          const telegramId = secondOwnerOwner.telegramId;
          const center = secondOwnerOwner.center;

          const response = await getOneByTelegramId(telegramId, center);

          if (response && response.referralCode) {

            const referralCode = response.referralCode;

            // get contract address and tokenId from referralCode
            const referralCodeArray = referralCode.split("_");
            const contractAddress = referralCodeArray[0];
            const tokenId = referralCodeArray[1];


            console.log("contractAddress: ", contractAddress);
            console.log("tokenId: ", tokenId);

            // Get owner of NFT
            const ownerOwner = await alchemy.nft.getOwnersForNft(
              contractAddress,
              tokenId
            );



            secondOwnerWalletAddress = ownerOwner?.owners?.[0];

            console.log("secondOwnerWalletAddress: ", secondOwnerWalletAddress );


            secondOwnerAmount = Number(parseFloat(sendAmount) * secondLevelRate).toFixed(2);

            console.log("secondOwnerAmount: ", secondOwnerAmount );


            if (secondOwnerWalletAddress) {

              const ownerOwnerTransaction = transfer({
                contract: contractUSDT,
                to: secondOwnerWalletAddress,
                amount: secondOwnerAmount,
              });

              transactions.push(ownerOwnerTransaction);

            }

            
          }

        } else {

          continue;

        }




        // 3rd level
        // rate 3%
        const thirdLevelRate = 0.03;
        let thirdOwnerWalletAddress = "";
        let thirdOwnerAmount = "";
        const thirdOwnerOwner = await getOneByWalletAddress(secondOwnerWalletAddress);

        


        if (thirdOwnerOwner) {
          const telegramId = thirdOwnerOwner.telegramId;
          const center = thirdOwnerOwner.center;
          const response = await getOneByTelegramId(telegramId, center);
          if (response && response.referralCode) {
            const referralCode = response.referralCode;
            // get contract address and tokenId from referralCode
            const referralCodeArray = referralCode.split("_");
            const contractAddress = referralCodeArray[0];
            const tokenId = referralCodeArray[1];
            console.log("contractAddress: ", contractAddress);
            console.log("tokenId: ", tokenId);
            // Get owner of NFT
            const ownerOwner = await alchemy.nft.getOwnersForNft(
              contractAddress,
              tokenId
            );
            thirdOwnerWalletAddress = ownerOwner?.owners?.[0];
            console.log("thirdOwnerWalletAddress: ", thirdOwnerWalletAddress );
            thirdOwnerAmount = Number(parseFloat(sendAmount) * thirdLevelRate).toFixed(2);
            console.log("thirdOwnerAmount: ", thirdOwnerAmount );
            if (thirdOwnerWalletAddress) {
              const ownerOwnerTransaction = transfer({
                contract: contractUSDT,
                to: thirdOwnerWalletAddress,
                amount: thirdOwnerAmount,
              });
              transactions.push(ownerOwnerTransaction);
            }
          }
        } else {
          continue;
        }



        // 4th level
        // rate 2%
        const fourthLevelRate = 0.02;
        let fourthOwnerWalletAddress = "";
        let fourthOwnerAmount = "";
        const fourthOwnerOwner = await getOneByWalletAddress(thirdOwnerWalletAddress);
        //console.log("user: ", user);
        if (fourthOwnerOwner) {
          const telegramId = fourthOwnerOwner.telegramId;
          const center = fourthOwnerOwner.center;
          const response = await getOneByTelegramId(telegramId, center);
          if (response && response.referralCode) {
            const referralCode = response.referralCode;
            // get contract address and tokenId from referralCode
            const referralCodeArray = referralCode.split("_");
            const contractAddress = referralCodeArray[0];
            const tokenId = referralCodeArray[1];
            console.log("contractAddress: ", contractAddress);
            console.log("tokenId: ", tokenId);
            // Get owner of NFT
            const ownerOwner = await alchemy.nft.getOwnersForNft(
              contractAddress,
              tokenId
            );
            fourthOwnerWalletAddress = ownerOwner?.owners?.[0];
            console.log("fourthOwnerWalletAddress: ", fourthOwnerWalletAddress );
            fourthOwnerAmount = Number(parseFloat(sendAmount) * fourthLevelRate).toFixed(2);
            console.log("fourthOwnerAmount: ", fourthOwnerAmount );
            if (fourthOwnerWalletAddress) {
              const ownerOwnerTransaction = transfer({
                contract: contractUSDT,
                to: fourthOwnerWalletAddress,
                amount: fourthOwnerAmount,
              });
              transactions.push(ownerOwnerTransaction);
            }
          }
        } else {
          continue;
        }


            







        /*
        // update game settlement
        const sequence = game.sequence;

        console.log("sequence: ", sequence);
        console.log("toWalletAddress: ", toWalletAddress);

        ///const settlement = sendAmount.toString();

        const result = await setOddEvenGamesSettlementByWalletAddressAndSequence({
          walletAddress: toWalletAddress,
          sequence: sequence,
        });


        console.log("result: ", result);
        */

    
      }


    
    

      if (transactions.length === 0) {
        
        
        console.log("transaction is empty");


        return NextResponse.json({
          result: "no data found",
        });
      }


      //console.log("transactions: ", transactions);

    
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
    

      
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );
      
      console.log("batchResponse: ", batchResponse);

    

    return NextResponse.json({
        
        result: {
            //amount,
            gameWalletAddress,
        },
    });

}
