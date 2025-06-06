import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';

/*
  console.log("transactionHash", transactionHash, "transactionIndex", transactionIndex,
    "fromAddress", fromAddress, "toAddress", toAddress, "value", value,
    "timestamp", timestamp);
  
*/

export interface TransferProps {
    contractAddress: string;
    transactionHash: string;
    transactionIndex: string;
    fromAddress: string;
    toAddress: string;
    value: string;
    timestamp: string;
}

export async function insertOne(data: any) {

    if (!data.transactionHash || !data.transactionIndex || !data.fromAddress || !data.toAddress || !data.value || !data.timestamp) {
        return null;
    }

    const transferData = {
        contractAddress: data.contractAddress,
        transactionHash: data.transactionHash,
        transactionIndex: data.transactionIndex,
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,
        value: data.value,
        timestamp: data.timestamp,
    };


    const client = await clientPromise;

    // if fromAddress is user wallet address, then insert into userTransfers collection
    // if toAddress is user wallet address, then insert into userTransfers collection


    const collectionUsers = client.db('dubai').collection('userGogo');

    const collectionUserTransfers = client.db('dubai').collection('userGogoTransfers');

    //const collection = client.db('dubai').collection('transfers');


    

    const user = await collectionUsers.findOne(
        { $or: [ { walletAddress: data.fromAddress }, { walletAddress: data.toAddress } ] },
        { projection: { walletAddress: 1 } }
    );

    if (!user) {
        return null;
    }

    

    const userFromAddress = await collectionUsers.findOne(
        { walletAddress: data.fromAddress },
        //{ projection: { telegramId: 1, walletAddress: 1 } }
    )

    const userToAddress = await collectionUsers.findOne(
        { walletAddress: data.toAddress },
        //{ projection: { telegramId: 1, walletAddress: 1, center: 1 } }
    )


    if (userFromAddress && userFromAddress.walletAddress) {
        
        await collectionUserTransfers.insertOne(
        {
            user: userFromAddress,
            otherUser: userToAddress,
            sendOrReceive: "send",
            transferData: transferData,
        }
        );


    }





    if (userToAddress && userToAddress.walletAddress) {

        const response = await collectionUserTransfers.insertOne(
        {
            user: userToAddress,
            otherUser: userFromAddress,
            sendOrReceive: "receive",
            transferData: transferData,
        }
        );





        if (response) {

            // get one userTransfer by response.insertedId
            const userTransfer = await collectionUserTransfers.findOne(
                { _id: response.insertedId }
            );



            const telegramId = userToAddress.telegramId;
            const center = userToAddress.center;

            if (telegramId) {

                const amount = parseFloat(data.value) / 1000000.0;

                ///const message = "You have received " + Number(amount).toFixed(2) + " DUBAI";
                
                //const message = Number(amount).toFixed(2) + " DUBAI 를 받았습니다";
                const message = "You have received " + Number(amount).toFixed(2) + " DUBAI";


                const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

                await collectionTelegramMessages.insertOne(
                {
                    center: center,
                    category: "wallet",
                    telegramId: telegramId,
                    message: message,
                    timestamp: data.timestamp,
                    userTransfer: userTransfer,
                }
                );

            }

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

    if (!data.limit) {
        data.limit = 10;
    }

    if (!data.page) {
        data.page = 0;
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

    .limit(data.limit)
    .skip(data.page * data.limit)

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

