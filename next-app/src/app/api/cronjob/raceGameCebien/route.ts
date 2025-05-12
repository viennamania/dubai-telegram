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


// owner of erc721
import {
    getNFT,
    ///getTotalClaimedSupply,
    ownerOf,
} from "thirdweb/extensions/erc721";


import {
  getAllRaceGamesSettlement,
  setRaceGamesSettlementByWalletAddressAndSequence,
} from '@lib/api/gameCebien';



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


// USDT Token (USDT)
//const tokenContractAddressCEBIEN = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';

// CEBIEN Token (CEBIEN)
const tokenContractAddressCEBIEN = '0x04a4B27d8221A57b4051AbAc170d4ac5Abdc6aBd';


// smw contract address
const contractAddressSMW = "0xb3f4f5396075c4141148B02D43bF54C5Da6525dD";



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



      const games = await getAllRaceGamesSettlement();

      //console.log("games: ", games);


      if (!games) {
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
        address: tokenContractAddressCEBIEN,
      };
      */
      
      const contractCEBIEN = getContract(
        //contractOptions
        {
          client: client,
          chain: chain,
          address: tokenContractAddressCEBIEN,
        }
      );
    
      const claimWalletPrivateKey = process.env.GAME_CEBIEN_WALLET_PRIVATE_KEY || "";
    
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

      for (let i = 0; i < games.length; i++) {

        const game = games[i];


        // if win is true, then send amount to wallet address
        if (game.win) {
        
          const toWalletAddress = game.walletAddress;

          ///const amount = game.krwAmount;

                // send amount is 0.00001 to 0.001
          //const sendAmount = Number(Math.random() * (0.001 - 0.00001) + 0.00001).toFixed(6);

          //const sendAmount = game.settlement;

          const sendAmount = game.winPrize;

          const transaction = transfer({
            contract: contractCEBIEN,
            to: toWalletAddress,
            amount: sendAmount,
          });
      
          transactions.push(transaction);

        }



        // send 0.01 CEBEIN to all owners of horses
        // find all horses of game
        for (let j = 0; j < game.horses.length; j++) {
          const horse = game.horses[j];

          //console.log("horse: ", horse);

          const tokenId = horse.tokenId;

          console.log("tokenId: ", tokenId);

          const contractErc721 = getContract(
            {
              client: client,
              chain: polygon,
              address: contractAddressSMW,
            }
          );

          const owner = await ownerOf({
            contract: contractErc721,
            tokenId: BigInt(tokenId),
          });

          const ownerAddress = owner.toString();
          console.log("ownerAddress=======>", ownerAddress);

          const sendAmount = Number(0.01).toFixed(2);

          const transaction1 = transfer({
            contract: contractCEBIEN,
            to: ownerAddress,
            amount: sendAmount,
          });
          transactions.push(transaction1);
        }

        



        // find owner wallet address of horse of ranking 1, 
        // then send 10% of winPrice CEBEIN to the owner wallet address

        // find ranking 1 horse
        const reaultNumber = game.resultNumber;
        const ranking1Horse = game.horses[reaultNumber - 1];
        const tokenId = ranking1Horse.tokenId;
        console.log("tokenId: ", tokenId);

        const contractErc721 = getContract(
          {
            client: client,
            chain: polygon,
            address: contractAddressSMW,
          }
        );

        const owner = await ownerOf({
          contract: contractErc721,
          tokenId: BigInt(tokenId),
        });

        const ownerAddress = owner.toString();
        console.log("ownerAddress=======>", ownerAddress);


        const ownerSendAmount = Number(parseFloat(game.winPrize) * 0.1).toFixed(2);

        const transaction2 = transfer({
          contract: contractCEBIEN,
          to: ownerAddress,
          amount: ownerSendAmount,
        });
        transactions.push(transaction2);









        // update game settlement
        const sequence = game.sequence;
        const gameWalletAddress = game.walletAddress;

        ///const settlement = sendAmount.toString();

        const result = await setRaceGamesSettlementByWalletAddressAndSequence({
          walletAddress: gameWalletAddress,
          sequence: sequence,
        });







        let ownerWalletAddress = "";
        let ownerAmount = "";
   
        const user = await getOneByWalletAddress(gameWalletAddress);

        //console.log("user: ", user);

        if (user) {
          const telegramId = user.telegramId;
          const center = user.center;

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
            const owner = await alchemy.nft.getOwnersForNft(
              contractAddress,
              tokenId
            );

            console.log("owner: ", owner);



            ownerWalletAddress = owner?.owners?.[0];

            console.log("ownerWalletAddress: ", ownerWalletAddress );


            ownerAmount = Number(parseFloat(game.winPrize) * 0.1).toFixed(6);

            console.log("ownerAmount: ", ownerAmount );


            if (ownerWalletAddress) {

              const ownerTransaction = transfer({
                contract: contractCEBIEN,
                to: ownerWalletAddress,
                amount: ownerAmount,
              });

              transactions.push(ownerTransaction);

            }

            
          }

        }







        const userOwnerOwner = await getOneByWalletAddress(ownerWalletAddress);

        //console.log("user: ", user);

        if (userOwnerOwner) {
          const telegramId = userOwnerOwner.telegramId;
          const center = userOwnerOwner.center;

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



            const ownerOwnerWalletAddress = ownerOwner?.owners?.[0];

            console.log("ownerOwnerWalletAddress: ", ownerOwnerWalletAddress );


            const ownerOwnerAmount = Number(parseFloat(game.winPrize) * 0.05).toFixed(6);

            console.log("ownerOwnerAmount: ", ownerOwnerAmount );


            if (ownerOwnerWalletAddress) {

              const ownerOwnerTransaction = transfer({
                contract: contractCEBIEN,
                to: ownerOwnerWalletAddress,
                amount: ownerOwnerAmount,
              });

              transactions.push(ownerOwnerTransaction);

            }

            
          }

        }



    
      }


    

      if (transactions.length === 0) {
        return NextResponse.json({
          result: "no transactions found",
        });
      }

    
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
