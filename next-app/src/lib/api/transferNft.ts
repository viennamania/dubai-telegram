import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';

/*
  console.log("transactionHash", transactionHash, "transactionIndex", transactionIndex,
    "fromAddress", fromAddress, "toAddress", toAddress, "value", value,
    "timestamp", timestamp);
  
*/

export interface TransferProps {
    transactionHash: string;
    transactionIndex: string;
    fromAddress: string;
    toAddress: string;
    contractAddress: string;
    tokenId: string;
    timestamp: string;
}

export async function insertOne(data: any) {

    console.log("insertOne data", data);



    if (!data.transactionHash || !data.transactionIndex || !data.fromAddress || !data.toAddress || !data.timestamp) {
        return null;
    }

    const transferData = {
        transactionHash: data.transactionHash,
        transactionIndex: data.transactionIndex,
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,
        contractAddress: data.contractAddress,
        tokenId: data.tokenId,
        nftInfo: data.nftInfo,
        timestamp: data.timestamp,
    };


    console.log("transferData", transferData);



    const client = await clientPromise;

    // if fromAddress is user wallet address, then insert into userTransfers collection
    // if toAddress is user wallet address, then insert into userTransfers collection


    const collectionUsers = client.db('dubai').collection('users');

    const collectionUserTransfers = client.db('dubai').collection('userTransfersNft');

    const collection = client.db('dubai').collection('transfersNft');


    

    const user = await collectionUsers.findOne(
        { $or: [ { walletAddress: data.fromAddress }, { walletAddress: data.toAddress } ] },
        { projection: { walletAddress: 1 } }
    );

    if (!user) {
        return null;
    }
    

    const result = await collection.insertOne(transferData);

    // if error, then return
    if (!result) {
        return null;
    }


    ////const userFromAddress = await collectionUsers.findOne({ walletAddress: data.fromAddress });
    /*
    const userFromAddress = collectionUsers
    .aggregate([
        { $match: { walletAddress: data.fromAddress } },
        { $project: { _id: 1, telegramId: 1, walletAddress: 1 } }
    ])
    */
    const userFromAddress = await collectionUsers.findOne(
        { walletAddress: data.fromAddress },
        { projection: { telegramId: 1, walletAddress: 1 } }
    )

    if (userFromAddress && userFromAddress.walletAddress) {
        
        await collectionUserTransfers.insertOne(
        {
            user: userFromAddress,
            sendOrReceive: "send",
            transferData: transferData,
        }
        );


    }



    const userToAddress = await collectionUsers.findOne(
        { walletAddress: data.toAddress },
        { projection: { telegramId: 1, walletAddress: 1, center: 1 } }
    )

    if (userToAddress && userToAddress.walletAddress) {

        await collectionUserTransfers.insertOne(
        {
            user: userToAddress,
            sendOrReceive: "receive",
            transferData: transferData,
        }
        );




    
        const telegramId = userToAddress.telegramId;
        const center = userToAddress.center;

        if (telegramId) {

            //const amount = parseFloat(data.value) / 1000000.0;

            ///const message = "You have received " + Number(amount).toFixed(6) + " USDT";
            //const message = Number(amount).toFixed(6) + " USDT 를 받았습니다";

            const message = "NFT를 받았습니다.";

            //+ "\n"
            //+ "NFT 이름: " + data.nftInfo.name
            //+ "\n"
            //+ "NFT 설명: " + data.nftInfo.description ? data.nftInfo.description : ""
            // NFT 이름: data.nftInfo.name
            // NFT 설명: data.nftInfo.description

            const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

            await collectionTelegramMessages.insertOne(
            {
                center: center,
                
                //category: "wallet",
                category: "nft",

                telegramId: telegramId,
                message: message,
                nftInfo: data.nftInfo,
                timestamp: data.timestamp,
            }
            );

        }
        
        
    }




    return {
        result: "success",
    };


}




// getTransferByWalletAddress
export async function getTransferByWalletAddress(data: any) {

    if (!data.walletAddress) {
        return null;
    }


    const client = await clientPromise;

    const collectionUsers = client.db('dubai').collection('users');

    
    const user = await collectionUsers.findOne(
        { walletAddress: data.walletAddress },
        { projection: { walletAddress: 1 } }
    );


    if (!user) {
        return null;
    }

    // transferData: { transactionHash: string, transactionIndex: string, fromAddress: string, toAddress: string, value: string, timestamp: string }
    // timestamp desc
    

    const collectionUserTransfers = client.db('dubai').collection('userTransfers');

    const userTransfers = await collectionUserTransfers
    .find({ "user.walletAddress": data.walletAddress })
    .sort({ "transferData.timestamp": -1 })
    .toArray();

    // totalTransfers
    const totalTransfers = await collectionUserTransfers
    .find({ "user.walletAddress": data.walletAddress })
    .count();



    return {
        transfers: userTransfers,
        totalTransfers: totalTransfers,
    }

}

