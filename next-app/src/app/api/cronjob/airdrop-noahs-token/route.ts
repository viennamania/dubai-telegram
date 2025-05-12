import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



import {
  getOneByWalletAddress,
  getCenterOwnerByCenter,
  getAllMembersByCenter,
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


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




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
   // }
    


    const tokenidParam = request.nextUrl.searchParams.get('tokenid');

    console.log("tokenidParam: ", tokenidParam);

  

    
    if (tokenidParam !== "0" && tokenidParam !== "1" && tokenidParam !== "2" && tokenidParam !== "3" && tokenidParam !== "4" && tokenidParam !== "5") {
        return NextResponse.error();
    }
    

    const tokenId = BigInt(tokenidParam);



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



    const tokenContractAddressNOAHS = '0xdd200c6EF8e5fe9b1332224a86b5980D202d4d9d';


    const contractNOAHS = getContract(
      //contractOptions
      {
        client: client,
        chain: chain,
        address: tokenContractAddressNOAHS,
      }
    );
  
    const noahsWalletPrivateKey = process.env.NOAHS_WALLET_PRIVATE_KEY || "";
  
    const personalAccount = privateKeyToAccount({
      client,
      privateKey: noahsWalletPrivateKey,
    });
  
    const wallet = smartWallet({
      chain: chain,
      sponsorGas: true,
    });
  
    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });
  
    const noahsWalletAddress = account.address;
  
    console.log("noahsWalletAddress: ", noahsWalletAddress);











    const tokenContractAddressErc1155 = '0xE6BeA856Cd054945cE7A9252B2dc360703841028';






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
    const totalSupplyResult = await totalSupply({
      contract: contractErc1155,
      id: tokenId,
    });

    console.log("totalSupplyResult", totalSupplyResult.toString());



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

    // if tokenId is 5,
    // then 0.8%, 0.1%, 0.1%, 0.2%



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
          let masterAmount = 0.0;


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

          const referralCode = await getReferralCodeByTelegramId( telegramId ) as string;

          if (!referralCode) {

            console.log("referralCode is empty");

            //return NextResponse.error();
            continue;
          }

          const referralContractAddress = referralCode?.split("_")[0] || "";
          const referralTokenId = BigInt(referralCode?.split("_")[1] || "0");

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



          const platformWalletAddress = "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C"; // sonapa metamask wallet



          let agentAmount = 0.0;

          let centerAmount = 0.0;
          
          let platformAmount = 0.0;


          if (tokenId === BigInt(0)) {

            //const shareTotalAmount = 100.0 * balance;
            const shareTotalAmount = 1.0 * balance;

      
            masterAmount = shareTotalAmount * 0.3;
            agentAmount = shareTotalAmount * 0.6;
            centerAmount = shareTotalAmount * 0.1;
            platformAmount = shareTotalAmount * 0.2;

          } else if (tokenId === BigInt(1)) {

            //const shareTotalAmount = 300.0 * balance;

            const shareTotalAmount = 3.0 * balance;

       
            masterAmount = shareTotalAmount * 0.4;
            agentAmount = shareTotalAmount * 0.5;
            centerAmount = shareTotalAmount * 0.1;
            platformAmount = shareTotalAmount * 0.2;

          } else if (tokenId === BigInt(2)) {

            //const shareTotalAmount = 500.0 * balance;

            const shareTotalAmount = 5.0 * balance;
            
   
            masterAmount = shareTotalAmount * 0.5;
            agentAmount = shareTotalAmount * 0.4;
            centerAmount = shareTotalAmount * 0.1;
            platformAmount = shareTotalAmount * 0.2;

          } else if (tokenId === BigInt(3)) {

            //const shareTotalAmount = 1000.0 * balance;
            const shareTotalAmount = 10.0 * balance;


            masterAmount = shareTotalAmount * 0.6;
            agentAmount = shareTotalAmount * 0.3;
            centerAmount = shareTotalAmount * 0.1;
            platformAmount = shareTotalAmount * 0.2;

          } else if (tokenId === BigInt(4)) {

            //const shareTotalAmount = 5000.0 * balance;

            const shareTotalAmount = 50.0 * balance;

        

            masterAmount = shareTotalAmount * 0.7;
            agentAmount = shareTotalAmount * 0.2;
            centerAmount = shareTotalAmount * 0.1;
            platformAmount = shareTotalAmount * 0.2;

          } else if (tokenId === BigInt(5)) {

            //const shareTotalAmount = 10000.0 * balance;

            const shareTotalAmount = 100.0 * balance;
      

            masterAmount = shareTotalAmount * 0.8;
            agentAmount = shareTotalAmount * 0.1;
            centerAmount = shareTotalAmount * 0.1;
            platformAmount = shareTotalAmount * 0.2;

          }

          console.log("masterWalletAddress: ", masterWalletAddress, "masterAmount: ", masterAmount, "agentWalletAddress: ", agentWalletAddress, "agentAmount: ", agentAmount, "centerWalletAddress: ", centerWalletAddress, "centerAmount: ", centerAmount, "platformWalletAddress: ", platformWalletAddress, "platformAmount: ", platformAmount);


          const transactionMaster = transfer({
            contract: contractNOAHS,
            to: masterWalletAddress,
            amount: masterAmount,
          });
          transactions.push(transactionMaster);

          const transactionAgent = transfer({
            contract: contractNOAHS,
            to: agentWalletAddress,
            amount: agentAmount,
          });
          transactions.push(transactionAgent);

          const transactionCenter = transfer({
            contract: contractNOAHS,
            to: centerWalletAddress,
            amount: centerAmount,
          });
          transactions.push(transactionCenter);

          const transactionPlatform = transfer({
            contract: contractNOAHS,
            to: platformWalletAddress,
            amount: platformAmount,
          });
          transactions.push(transactionPlatform);



          //console.log("transactions length: ", transactions.length);


        }


      }

      //console.log("transactions: ", transactions);



      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
  

      try {

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
