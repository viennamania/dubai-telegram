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
        amount: data.amount,
        nftInfo: data.nftInfo,
        timestamp: data.timestamp,
    };


    console.log("transferData", transferData);



    const client = await clientPromise;

    // if fromAddress is user wallet address, then insert into userTransfers collection
    // if toAddress is user wallet address, then insert into userTransfers collection


    const collectionUsers = client.db('dubai').collection('usersNoahk');

    const collectionUserTransfers = client.db('dubai').collection('userTransfersNoahNft');

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

            ///const message = "You have received " + Number(amount).toFixed(2) + " DUBAI";
            //const message = Number(amount).toFixed(2) + " DUBAI 를 받았습니다";

            const message = "NFT를 받았습니다.";

            //+ "\n\n"
            //+ "NFT 이름: " + data.nftInfo.name
            //+ "\n"
            //+ "NFT 수량: " + data.amount


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
                amount: data.amount,
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

    ///console.log("getTransferByWalletAddress data", data);


    if (!data.walletAddress) {
        return null;
    }

    if (!data.contractAddress) {
        return null;
    }



    const client = await clientPromise;

    const collectionUsers = client.db('dubai').collection('usersNoahk');

    
    const user = await collectionUsers.findOne(
        { walletAddress: data.walletAddress },
        { projection: { walletAddress: 1 } }
    );

    //console.log("user", user);

    if (!user) {
        return null;
    }

    // transferData: { transactionHash: string, transactionIndex: string, fromAddress: string, toAddress: string, value: string, timestamp: string }
    // timestamp desc
    

    const collectionUserTransfers = client.db('dubai').collection('userTransfersNoahNft');


    /*
    {
  "_id": {
    "$oid": "67a58d2728fefa7168bc18e9"
  },
  "user": {
    "_id": {
      "$oid": "67860b48c7ec01ab07b82a95"
    },
    "telegramId": "441516803",
    "walletAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440"
  },
  "sendOrReceive": "send",
  "transferData": {
    "transactionHash": "0xdeff83a94ffb33ba23b8c9188c3bb66f5e372216a53b00833585eab2ed44156a",
    "transactionIndex": 17,
    "fromAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
    "toAddress": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
    "contractAddress": "0xd1fae297d2e28fc7e4a6333a8e60aff7603d1b04",
    "tokenId": "0",
    "nftInfo": {
      "contract": {
        "address": "0xd1FAE297D2E28Fc7e4a6333A8E60Aff7603D1B04",
        "name": "NOAH SKY",
        "symbol": "NOAH",
        "totalSupply": null,
        "tokenType": "ERC1155",
        "contractDeployer": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
        "deployedBlockNumber": 67630479,
        "openSeaMetadata": {
          "floorPrice": null,
          "collectionName": "NOAH SKY",
          "collectionSlug": "noah-sky",
          "safelistRequestStatus": "not_requested",
          "imageUrl": "https://i.seadn.io/s/raw/files/8b286cb76b824f00c26fa87498df147d.jpg?w=500&auto=format",
          "description": null,
          "externalUrl": null,
          "twitterUsername": null,
          "discordUrl": null,
          "bannerImageUrl": null,
          "lastIngestedAt": "2025-02-07T03:42:38.000Z"
        },
        "isSpam": null,
        "spamClassifications": []
      },
      "tokenId": "0",
      "tokenType": "ERC1155",
      "name": "100 NOAH",
      "description": null,
      "tokenUri": "https://alchemy.mypinata.cloud/ipfs/QmbNFNUVRd5bazcyD4sRQMUc7viRUFbTGbu78YBnqUhb1D/0",
      "image": {
        "cachedUrl": "https://nft-cdn.alchemy.com/matic-mainnet/5d0477ce1ab50a09375075472bb2108b",
        "thumbnailUrl": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/matic-mainnet/5d0477ce1ab50a09375075472bb2108b",
        "originalUrl": "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/matic-mainnet/5d0477ce1ab50a09375075472bb2108b",
        "contentType": "image/png",
        "size": 2767046,
        "originalUrl": "https://ipfs.io/ipfs/QmcCLL23zDwsEMwCTnLYmzPCEAhjn9Bp9Ckh7Wkpn4sHZi/1.png"
      },
      "raw": {
        "tokenUri": "ipfs://QmbNFNUVRd5bazcyD4sRQMUc7viRUFbTGbu78YBnqUhb1D/0",
        "metadata": {
          "image": "ipfs://QmcCLL23zDwsEMwCTnLYmzPCEAhjn9Bp9Ckh7Wkpn4sHZi/1.png",
          "external_url": "",
          "animation_url": "ipfs://QmcCLL23zDwsEMwCTnLYmzPCEAhjn9Bp9Ckh7Wkpn4sHZi/0.mp4",
          "background_color": "",
          "name": "100 NOAH",
          "description": "",
          "customImage": "",
          "customAnimationUrl": ""
        },
        "error": null
      },
      "collection": {
        "name": "NOAH SKY",
        "slug": "noah-sky",
        "externalUrl": null,
        "bannerImageUrl": null
      },
      "mint": {
        "mintAddress": "0xe38a3d8786924e2c1c427a4ca5269e6c9d37bc9c",
        "blockNumber": 67630568,
        "timestamp": "2025-02-07T03:13:46Z",
        "transactionHash": "0x901b5708b678f12321dcab09537cdbc35802eda1bb416e8ae7c7512c6bc094b3"
      },
      "owners": null,
      "timeLastUpdated": "2025-02-07T03:13:52.697Z",
      "acquiredAt": null
    },
    "timestamp": 1738902813000,
    "_id": {
      "$oid": "67a58d2728fefa7168bc18e8"
    }
  }
}
    */

    //console.log("data", data);


    const userTransfers = await collectionUserTransfers
    .find({
        "user.walletAddress": data.walletAddress,
        "transferData.nftInfo.contract.address": data.contractAddress,
        "transferData.nftInfo.tokenId": data.tokenId,
    })
    .limit(data.limit)
    .skip(data.limit * data.page)
    .sort({ "transferData.timestamp": -1 })
    .toArray();

    //console.log("userTransfers", userTransfers);




    // totalTransfers
    const totalTransfers = await collectionUserTransfers
    .find({
        "user.walletAddress": data.walletAddress,
        "transferData.nftInfo.contract.ddress": data.contractAddress,
        "transferData.nftInfo.tokenId": data.tokenId,
    })
    .count();





    return {
        transfers: userTransfers,
        totalTransfers: totalTransfers,
    }

}

