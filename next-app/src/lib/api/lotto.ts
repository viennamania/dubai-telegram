import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';
import { wallet } from '@/app/constants';


export async function startLotto(data: any) {




    const client = await clientPromise;

    // if fromAddress is user wallet address, then insert into userTransfers collection
    // if toAddress is user wallet address, then insert into userTransfers collection


    const collectionUsers = client.db('dubai').collection('users');

    const collectionTelegramMessages = client.db('dubai').collection('telegramLottoMessages');



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




// updateOneLottoGameForBet
/*

export async function updateOneLottoGameForBet(data: any) {

    const client = await clientPromise;

    const collectionLottoGames = client.db('dubai').collection('lottoGames');


    // update selectedNumber array in lottoGames collection
    // update sum of betAmount in selectedNumber array

    const existingGame = await collectionLottoGames.findOne({ sequence: data.sequence });
    if (!existingGame) {
        return null; // No game found with the given sequence
    }

    // selectNumber is from '00' - '36'



    const result = await collectionLottoGames.updateOne(
        { sequence: data.sequence },
        {
            $push: {
                bets: {
                    walletAddress: data.walletAddress,
                    selectedNumber: data.selectedNumber,
                    betAmount: data.betAmount,
                    timestamp: new Date(),
                },
            },
        }
    );

    if (result.modifiedCount === 0) {
        return null;
    }

    return {
        sequence: data.sequence,
        walletAddress: data.walletAddress,
        selectedNumber: data.selectedNumber,
        betAmount: data.betAmount,
    };

}
    */
  