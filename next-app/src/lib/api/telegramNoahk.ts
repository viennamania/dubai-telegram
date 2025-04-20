import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';

// objectId from mongodb
import { ObjectId } from 'mongodb';

/*
{
  "_id": {
    "$oid": "678463726bacbc66db602c33"
  },
  "category": "wallet",
  "telegramId": "441516803",
  "message": "You have received 0.221000 USDT"
}
  
*/

export interface Message {
    center: string;
    category: string;
    telegramId: string;
    message: string;
}


// getMessagesByTelegramId
export async function getMessagesByTelegramId(data: any) {

    ///console.log("data", data);


    if (!data.telegramId) {
        return null;
    }



    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');


    try {

        const messages = await collectionTelegramMessages
        .find({ telegramId: data.telegramId })
        .sort({ _id: -1 })
        .limit(data.limit)
        .skip(data.limit * (data.page - 1))
        .toArray();


        ////console.log("messages", messages);


        // totalTelegramMessages

        const totalMessages = await collectionTelegramMessages
        .find({ telegramId: data.telegramId })
        .count();


        return {
            messages,
            totalMessages,
        }


    } catch (error) {
        
        console.log("error", error+'');

        return null;

    }

}


// getAllMessages
export async function getAllMessages(data: any) {

    const {
        center,
        limit,
        page,
    } = data;

    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

    const messages = await collectionTelegramMessages
    .find({
        center,
    })
    .sort({ _id: -1 })
    .limit(limit)
    .skip(limit * page)
    .toArray();

    // totalTelegramMessages

    const totalMessages = await collectionTelegramMessages
    .find({
        center,
    })
    .count();

    return {
        messages,
        totalMessages,
    }

}

// deleteMessage
export async function deleteMessage(_id: string) {


    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

    await collectionTelegramMessages.deleteOne(
        {
            _id: new ObjectId(_id),
        }
    );

    return {
        result: "success",
    };

}


/*
        if (telegramId) {

            const amount = parseFloat(data.value) / 1000000.0;

            const message = "You have received " + Number(amount).toFixed(6) + " USDT";

            const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

            await collectionTelegramMessages.insertOne(
            {
                center: center,
                category: "wallet",
                telegramId: telegramId,
                message: message,
            }
            );

        }
*/

// insertMessage
export async function insertMessage(
    {
        center,
        category,
        telegramId,
        message,
    }
    : Message
) {

    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

    await collectionTelegramMessages.insertOne(
        {
            center,
            category,
            telegramId,
            message,
        }
    );

    return {
        result: "success",
    };

}

// insertMessageByWalletAddress
export async function insertMessageByWalletAddress(
    {
        center,
        category,
        walletAddress,
        message,
    }
    :
    {
        center: string,
        category: string,
        walletAddress: string,
        message: string,
    }
) {

    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

    const user = await client.db('dubai').collection('usersNoahk').findOne(
        { walletAddress },
        { projection: { telegramId: 1 } }
    );

    if (user && user.telegramId) {

        await collectionTelegramMessages.insertOne(
            {
                center,
                category,
                telegramId: user.telegramId,
                message,
            }
        );

    }

    return {
        result: "success",
    };

}

// insertAgentMessageByWalletAddress
export async function insertAgentMessageByWalletAddress(
    {
        center,
        contract,
        tokenId,
        agentBotNft,
        walletAddress,
        message,
    }
    :
    {
        center: string,
        contract: string,
        tokenId: string,
        agentBotNft: object,
        walletAddress: string,
        message: string,
    }
) {

    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

    const user = await client.db('dubai').collection('usersNoahk').findOne(
        { walletAddress },
        { projection: { telegramId: 1 } }
    );

    if (user && user.telegramId) {

        await collectionTelegramMessages.insertOne(
            {
                center,
                contract,
                tokenId,
                agentBotNft,
                category: "agent",
                telegramId: user.telegramId,
                message,
            }
        );

    }

    return {
        result: "success",
    };

}









// insertAgentMessageByWalletAddress
export async function insertOtcMessageByWalletAddress(
    {
        center,
        walletAddress,
        sellOrder,
        message,
    }
    :
    {
        center: string,
        walletAddress: string,
        sellOrder: any,
        message: string,
    }
) {

    const client = await clientPromise;

    const collectionTelegramMessages = client.db('dubai').collection('telegramMessages');

    
    const user = await client.db('dubai').collection('usersNoahk').findOne(
        { walletAddress : walletAddress },

        { projection: { telegramId: 1 } }
    );


    if (user && user.telegramId) {

        const result = await collectionTelegramMessages.insertOne(
            {
                center: center,
                category: "otc",
                sellOrder: sellOrder,
                telegramId: user.telegramId,
                message: message,
            }
        );

        if (result) {
            return {
                result: "success",
            };
        } else {
            return {
                result: "error",
            };
        }

    } else {
        
        return {
            result: "error",
        };
    }



}