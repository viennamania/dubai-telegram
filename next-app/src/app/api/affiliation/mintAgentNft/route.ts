import { NextResponse, type NextRequest } from "next/server";


import {
    createThirdwebClient,

    ///ContractOptions,

    getContract,
    sendAndConfirmTransaction,
    
    sendBatchTransaction,

    SendBatchTransactionOptions,
  
} from "thirdweb";


import {
    polygon,
    bsc,
} from "thirdweb/chains";

import {
    privateKeyToAccount,
} from "thirdweb/wallets";

import {
    mintTo,
    totalSupply,

    balanceOf,
  
} from "thirdweb/extensions/erc721";



export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

    const body = await request.json();

    const {
        walletAddress,
        erc721ContractAddress,
        name,
        description,
        image,
    } = body;


    console.log("walletAddress: ", walletAddress);
    console.log("erc721ContractAddress: ", erc721ContractAddress);
    console.log("name: ", name);
    console.log("description: ", description);
    console.log("image: ", image);


    const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });
        

        
    const mintAdminWalletPrivateKey = process.env.MINT_ADMIN_WALLET_PRIVATE_KEY || "";

    const personalAccount = privateKeyToAccount({
        client,
        privateKey: mintAdminWalletPrivateKey,
    });

    const personalAccountAddress = personalAccount ? personalAccount.address : "";

    console.log("personalAccountAddress: ", personalAccountAddress);



    const contract = getContract({
        client,
        chain: bsc,
        address: erc721ContractAddress,
    });


    const transaction = mintTo({
        contract: contract,
        to: walletAddress,
        nft: {
            name: name,
            description: description,
            image: image,
        },
    });


    try {

        const transactionResult = await sendAndConfirmTransaction({
            account: personalAccount,
            transaction: transaction,
        });

        //console.log("transactionResult: ", transactionResult);

        /*
        transactionResult:  {
            blockHash: '0xd70aa0f17d47220b4d003c7bf18bf796e6cb3b5ea44fd086fb2526f14dd2aa49',
            blockNumber: 68061273n,
            contractAddress: null,
            cumulativeGasUsed: 100000n,
            effectivePayerBalance: 999999999999999900n,}
            */


        return NextResponse.json({
            result: transactionResult.transactionHash,
        });

    } catch (error) {

        console.error("error: ", JSON.stringify(error, null, 2));

        // TypeError: Do not know how to serialize a BigInt

        return NextResponse.json({
            request: '',
            error: error,
        });

    }


}