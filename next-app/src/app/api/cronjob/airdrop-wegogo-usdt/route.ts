import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



import {
  getOneByWalletAddress,
  getCenterOwnerByCenter,
  getAllMembersByCenter,
} from '@lib/api/userGogo';

import {
  //getReferralCodeByTelegramId,
  getOneByTelegramId,
  getOneByReferralCode,

  insertReferralRewards,
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


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




export async function GET(request: NextRequest) {

 

    const tokenId = BigInt("0");



    // check time 
    /*
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 23 || hours < 9) {

      
      return;
    }
    */


    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });



    const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';


    const contractUSDT = getContract(
      {
        client: client,
        chain: chain,
        address: tokenContractAddressUSDT,
      }
    );
  
    const weGogoWalletPrivateKey = process.env.WEGOGO_WALLET_PRIVATE_KEY || "";
  
    const personalAccount = privateKeyToAccount({
      client,
      privateKey: weGogoWalletPrivateKey,
    });
  
    const wallet = smartWallet({
      chain: chain,
      sponsorGas: true,
    });
  
    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });
  
    const weGogoWalletAddress = account.address;
  
    console.log("weGogoWalletAddress: ", weGogoWalletAddress);











    const tokenContractAddressErc1155 = '0x936C5b9348Dc08CF60Bdc6C03F0871037517161d';






    const contractErc1155 = getContract(
      {
        client: client,
        chain: chain,
        address: tokenContractAddressErc1155,
      }
    );


    



    /*
    const nft = await getNFT({
      contract: contractErc1155,
      //tokenId: 0n,
      //tokenId: BigInt(0),

      tokenId: tokenId,
    });
    */

    //console.log("nft", nft);
    /*
    nft {
      metadata: {
        name: '100 NOAH MINING',
        description: '',
        background_color: '',
        external_url: '',
        customImage: '',
        customAnimationUrl: '',
        animation_url: 'ipfs://QmXa48CAigywF9QMEJvVXX4RGBXAoSiuL7Em7t94rAxVsK/0.mp4',
        image: 'ipfs://QmXa48CAigywF9QMEJvVXX4RGBXAoSiuL7Em7t94rAxVsK/1.jpeg'
      },
      owner: null,
      id: 0n,
      tokenURI: 'ipfs://QmVtBg1odf85cyySZfdrirzHG4zo8tshfsCk7zfZYwuuTS/0',
      type: 'ERC1155',
      supply: 30n
    }
    */

    // total supply of the nft contract
    /*
    const totalSupplyResult = await totalSupply({
      contract: contractErc1155,
      id: tokenId,
    });

    console.log("totalSupplyResult", totalSupplyResult.toString());

    */


    /*
    try {

      
      let pageKey;

      
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        toBlock: 'latest',

        fromAddress: "0x0000000000000000000000000000000000000000",

        category: [AssetTransfersCategory.ERC1155],

        contractAddresses: [tokenContractAddressErc1155], // Replace with the address of your NFT contract.

        order: SortingOrder.DESCENDING, // Sort the results in descending order.
        
        //pageKey: pageKey, // The pageKey is used to paginate through the API call.
      });
   


      console.log("res", response);
      // reason: 'missing response',
      // serverError: TypeError: Referrer "client" is not a valid URL.
    
    } catch (error) {
      console.error("error", error);
    }
    */



    // get holders of the nft contract
    const result = await alchemy.nft.getOwnersForContract(
      tokenContractAddressErc1155);


    //console.log("result", result);
    /*
      {    owners: [
        '0x1ab86ceA8DcFBdD56DF8086f5190a2C6d5795C94',
        '0x3C9C78c24148e52393221347af3D3F74A5729e5f',
        '0x542197103Ca1398db86026Be0a85bc8DcE83e440',
        '0x58a9E653ded2004ff94e5Fa3f342412a7B4cc563',
        '0x7071060C66d4f365CdE477436Ca02509912054fF',
        '0xA8B4BE80b986BD6868A2778fAD135aE51f79C332',
        '0xc147840E00F1840183de52FE57AC04ed3d474442',
        '0xC3f8DA6cD73c214aE5665D2555f14a286F152CB1',
        '0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C'
      ],
      pageKey: undefined,
    }
    */

   



    let transactions = [] as any;

    
    if (result && result.owners && result.owners.length > 0) {

      //result.owners.map(async (owner : any) => {
      //result.owners.forEach(async (owner : any) => {

      console.log("result.owners", result.owners);


      for (const owner of result.owners) {

        //const owner = result.owners[0];
        
        const balanceResult = await balanceOf({
            contract: contractErc1155,
            owner: owner,
            tokenId: tokenId,
        });

        //console.log("balanceResult", balanceResult);

        // balanceResult 1n

        const balance = parseFloat(balanceResult.toString());

        console.log("owner: ", owner, "balance: ", balance);


        /*
        const airdropAmount = 10;

        const share = ((Number(balance) / Number(totalSupplyResult.toString())) * airdropAmount).toFixed(6);
      

        console.log("owner: ", owner, "balance: ", balance, "share: ", share);
        */

        if (balance > 0.0) {


          const masterWalletAddress = owner;


          // getOneByWalletAddress
          const user = await getOneByWalletAddress( masterWalletAddress );
          if (!user) {

            console.log("user is empty");

            //return NextResponse.error();

            continue;

          }

          const telegramId = user?.telegramId || "";
          const center = user?.center || "";

          console.log("telegramId: ", telegramId, "center: ", center);


          if (!telegramId || !center) {

            console.log("telegramId or center is empty");
            ///return NextResponse.error();

            continue;
          }

          // get referrer from telegramId
          /*
          {
            "_id": {
              "$oid": "677e0dd317d6c41796ada511"
            },
            "telegramId": "7779739539",
            "referralCode": "0x929BEeB406aB304d0ae5A800D07ab2A0694d723b_0"
          }
          */

          //const referralCode = await getReferralCodeByTelegramId( telegramId );

          const referral = await getOneByTelegramId( telegramId, center );

          
          if (!referral) {
            
            console.log("referral is empty");

            //return NextResponse.error();
            continue;
          }

          const referralCode = referral?.referralCode || "";

          if (!referralCode) {

            console.log("referralCode is empty");

            //return NextResponse.error();
            continue;
          }




          const referralContractAddress = referralCode?.split("_")[0] || "";
          const referralTokenId = BigInt(referralCode?.split("_")[1] || "0");

          console.log("referralContractAddress: ", referralContractAddress, "referralTokenId: ", referralTokenId);



          // get onwer of nft
          const response = await alchemy.nft.getOwnersForNft(referralContractAddress, referralTokenId);
          // { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] }

          const agentWalletAddress = response?.owners[0] || "";

          console.log("agentWalletAddress: ", agentWalletAddress);

          if (!agentWalletAddress) {

            console.log("agentWalletAddress is empty");

            //return NextResponse.error();
            continue;
          }



          // getCenterOwnerByCenter
          /*
          const userCenter = await getCenterOwnerByCenter( center );
          if (!userCenter) {
            //return NextResponse.error();
            console.log("userCenter is empty");
            continue;
          }

          const centerWalletAddress = userCenter?.walletAddress || "";

          console.log("centerWalletAddress: ", centerWalletAddress);

          if (!centerWalletAddress) {
            //return NextResponse.error();
            console.log("centerWalletAddress is empty");
            continue;
          }
            */







          // get center owner
          // if referralCode is "
          // if rererralCode is "0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_73",
          // then center owner


          let centerWalletAddress = agentWalletAddress;

          let tmpReferralCode = referralCode;

          console.log("tmpReferralCode=======> ", tmpReferralCode);

          // 0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_73


          while (tmpReferralCode !== "0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_73") {
            
            const referralContractAddress = tmpReferralCode?.split("_")[0] || "";
            const referralTokenId = BigInt(tmpReferralCode?.split("_")[1] || "0");

            console.log("referralContractAddress: ", referralContractAddress, "referralTokenId: ", referralTokenId);

            const response = await alchemy.nft.getOwnersForNft(referralContractAddress, referralTokenId);
            // { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] }

            centerWalletAddress = response?.owners[0] || "";

            console.log("centerWalletAddress: ", centerWalletAddress);

            if (!centerWalletAddress) {
              console.log("centerWalletAddress is empty");
              break;
            }

            // telegramId by walletAddress

            const userCenter = await getOneByWalletAddress( centerWalletAddress );
            if (!userCenter) {
              console.log("userCenter is empty");
              break;
            }

            const telegramId = userCenter?.telegramId || "";

            console.log("telegramId: ", telegramId);

            if (!telegramId) {
              console.log("telegramId is empty");
              break;
            }

            // get referrer from telegramId
            const referral = await getOneByTelegramId( telegramId, center );

            if (!referral) {
              console.log("referral is empty");
              break;
            }

            tmpReferralCode = referral?.referralCode || "";

            console.log("tmpReferralCode: ", tmpReferralCode);


            // if referralCode is same, then break
            if (referral?.referralCode === tmpReferralCode) {
              console.log("referralCode is same");
              break;
            }


          }


          console.log("centerWalletAddress: ", centerWalletAddress);
          


          //const platformWalletAddress = "0x75aC3a6364F963e1C72D194f5EfC0e160E9459e0"; // lichard wallet



          let masterAmount = 0.0;

          let agentAmount = 0.0;

          let centerAmount = 0.0;
          
          //let platformAmount = 0.0;


 
          //const shareTotalAmount = 1.0 * balance;

    
          masterAmount = 10;
          agentAmount = 3.4;
          centerAmount = 1.7;

          //platformAmount = 0;


          console.log("masterWalletAddress: ", masterWalletAddress, "masterAmount: ", masterAmount);
          console.log("agentWalletAddress: ", agentWalletAddress, "agentAmount: ", agentAmount);
          console.log("centerWalletAddress: ", centerWalletAddress, "centerAmount: ", centerAmount);
          //console.log("platformWalletAddress: ", platformWalletAddress, "platformAmount: ", platformAmount);

          const transactionMaster = transfer({
            contract: contractUSDT,
            to: masterWalletAddress,
            amount: masterAmount,
          });
          transactions.push(transactionMaster);

          const transactionAgent = transfer({
            contract: contractUSDT,
            to: agentWalletAddress,
            amount: agentAmount,
          });
          transactions.push(transactionAgent);

          const transactionCenter = transfer({
            contract: contractUSDT,
            to: centerWalletAddress,
            amount: centerAmount,
          });
          transactions.push(transactionCenter);

          /*
          const transactionPlatform = transfer({
            contract: contractUSDT,
            to: platformWalletAddress,
            amount: platformAmount,
          });
          transactions.push(transactionPlatform);
          */



          //console.log("transactions length: ", transactions.length);
        



          // insertReferralRewards

          const data = {
            masterWalletAddress: masterWalletAddress,
            agentWalletAddress: agentWalletAddress,
            centerWalletAddress: centerWalletAddress,
            //platformWalletAddress: platformWalletAddress,
            amount: balance,
            masterAmount: masterAmount,
            agentAmount: agentAmount,
            centerAmount: centerAmount,
            //platformAmount: platformAmount,
            timestamp: moment().unix(),
          };

          const result = await insertReferralRewards(data);

          console.log("insertReferralRewards result: ", result);
    




        }


      }



      ///console.log("transactions: ", transactions);





      /*
      try {

        const batchOptions: SendBatchTransactionOptions = {
          account: account,
          transactions: transactions,
        };
  



        const batchResponse = await sendBatchTransaction(
          batchOptions
        );
    
        console.log("batchResponse: ", batchResponse);
    
        if (!batchResponse) {
          return NextResponse.error();
        }

        return NextResponse.json({
            
            result: {
                transactions,
                batchResponse,
            },
        });

      } catch (error) {
        console.error("error", error);
        return NextResponse.json({
            
            result: {
                transactions,
                error,
            },
        });

      }
      */



    }




    return NextResponse.json({
        
        result: {
            transactions,
        },
    });



    /*
    const response = await alchemy.nft.getNftsForOwner(
      walletAddress, {
      omitMetadata: false, // // Flag to omit metadata
    });
  
    ///console.log("response?.ownedNfts", response?.ownedNfts);
  
  
    // get tokenType is 'ERC721' from the response
  
    response?.ownedNfts?.map((nft) => {
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


      return NextResponse.json({
        
        result: {
            members,
        },
      });
      */


      /*
      //console.log("members: ", members);
    
      // amount is random from 0.00001 to 0.1
      const amount = Math.random() * (1 - 0.00001) + 0.00001;

    
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });
    
      
      //const contractOptions: ContractOptions = {
      //  client: client,
      //  chain: chain,
      //  address: tokenContractAddressUSDT,
      //};
      
      
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
    */

}
