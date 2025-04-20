import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';
import { wallet } from '@/app/constants';

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


    const collectionUsers = client.db('dubai').collection('usersNoahk');



    const collectionUserTransfers = client.db('dubai').collection('userTransfersNoahk');

    
    const collection = client.db('dubai').collection('transfersNoahk');


    
    /*
    const user = await collectionUsers.findOne(
        { $or: [ { walletAddress: data.fromAddress }, { walletAddress: data.toAddress } ] },
        { projection: { walletAddress: 1 } }
    );

    if (!user) {
        return null;
    }
    */
   
    

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
        { projection: {
                nickname: 1,
                mobile: 1,
                telegramId: 1,
                walletAddress: 1,
                center: 1
            }
        }
    )

    if (userFromAddress) {
        
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
        { projection: {
                nickname: 1,
                mobile: 1,
                telegramId: 1,
                walletAddress: 1,
                center: 1
            }
        }
    )

    if (userToAddress && userToAddress.walletAddress) {


        // if data.fromAddress is escrow.walletAddress of ordersNoahk collection

        const collectionOrders = client.db('dubai').collection('ordersNoahk');

        const sellOrder = await collectionOrders.findOne(
            { "escrow.walletAddress": data.fromAddress },
        );



        const response = await collectionUserTransfers.insertOne(
        {
            user: userToAddress,
            sendOrReceive: "receive",
            transferData: transferData,
            sellOrder: sellOrder,
        } );



        if (response) {

            // get one userTransfer by response.insertedId
            const userTransfer = await collectionUserTransfers.findOne(
                { _id: response.insertedId }
            );

        
            const walletAddress = userToAddress.walletAddress;
            const telegramId = userToAddress.telegramId;
            const center = userToAddress.center;

            if (telegramId) {

                // divide by 1e18
                const amount = parseFloat(data.value) / 1e18;

                ///const message = "You have received " + Number(amount).toFixed(6) + " USDT";
                const message = Number(amount).toFixed(0) + " NOAH-K 포인트를 받았습니다";

                const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

                await collectionTelegramMessages.insertOne(
                {
                    center: center,
                    category: "wallet",
                    walletAddress: walletAddress,
                    telegramId: telegramId,
                    message: message,
                    timestamp: data.timestamp,
                    userTransfer: userTransfer,
                    
                }
                );

            }

        }

    
        
    }









    // ordersNoahk collection
    const collectionOrders = client.db('dubai').collection('ordersNoahk');


    // if escrow.walletAddress is fromAddress
    // and buyer.walletAddress is toAddress
    // then send message to seller

    const sellOrder = await collectionOrders.findOne(
        {
            $and: [
                { "escrow.walletAddress": data.fromAddress },
                { "buyer.walletAddress": data.toAddress }
            ]
        },
        { projection: {
                walletAddress: 1,
            }
        }
    );

    const sellerWalletAddress = sellOrder?.walletAddress;



    const userSeller = await collectionUsers.findOne(
        {
            walletAddress: sellerWalletAddress
        },
        { projection: {
                nickname: 1,
                mobile: 1,
                telegramId: 1,
                walletAddress: 1,
                center: 1
            }
        }
    );


    if (userSeller) {
        

        ///const walletAddress = userSeller.walletAddress;
        const telegramId = userSeller.telegramId;
        const center = userSeller.center;

        if (telegramId) {

            // divide by 1e18
            ////const amount = parseFloat(data.value) / 1e18;

            ///const message = "You have received " + Number(amount).toFixed(6) + " USDT";
            const message = "판매가 완료되었습니다.";

            const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

            await collectionTelegramMessages.insertOne(
            {

                center: center,
                category: "otc",
                sellOrder: sellOrder,
                telegramId: telegramId,
                message: message,
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

    const collectionUsers = client.db('dubai').collection('usersNoahk');

    
    const user = await collectionUsers.findOne(
        { walletAddress: data.walletAddress },
        { projection: { walletAddress: 1 } }
    );


    if (!user) {
        return null;
    }

    // transferData: { transactionHash: string, transactionIndex: string, fromAddress: string, toAddress: string, value: string, timestamp: string }
    // timestamp desc
    

    const collectionUserTransfers = client.db('dubai').collection('userTransfersNoahk');

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

