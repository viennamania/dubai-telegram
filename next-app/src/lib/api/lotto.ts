import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';
import { wallet } from '@/app/constants';


export async function startLotto(data: any) {




    const client = await clientPromise;

    // if fromAddress is user wallet address, then insert into userTransfers collection
    // if toAddress is user wallet address, then insert into userTransfers collection


    const collectionUsers = client.db('dubai').collection('users');


    const allUsers = await collectionUsers.find({},
        { projection: { walletAddress: 1, telegramId: 1, center: 1 } }
    ).toArray();



    allUsers.forEach(async (user) => {

        console.log("user", user);
    
        const walletAddress = user.walletAddress;
        const telegramId = user.telegramId;
        const center = user.center;


            

        if (telegramId) {


            // notice message for start lotto
            const message = "Lotto has started! You can participate in the next draw by sending DUBAI to the lotto address.";



            const collectionTelegramMessages = client.db('dubai').collection('telegramLottoMessages');

            await collectionTelegramMessages.insertOne(
            {
                center: center,
                category: "start",
                walletAddress: walletAddress,
                telegramId: telegramId,
                message: message,
                timestamp: data.timestamp,
            }
            );

        }

    });








    return {
        result: "success",
    };


}
