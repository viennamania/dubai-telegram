import { NextResponse, type NextRequest } from "next/server";

import {
	updateRaceGameResultByWalletAddressAndSequence,
  getOneRaceGameByWalletAddressAndSequence,
} from '@lib/api/gameCebien';

import {
  insertMessage
} from '@lib/api/telegram';




import {
  createThirdwebClient,
  getContract,
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
  getNFT,
  
  balanceOf,
  
  totalSupply,
  
  ownerOf,
  
  ///getTotalClaimedSupply,
  
} from "thirdweb/extensions/erc721";

import {
  getOneByWalletAddress,
} from '@lib/api/user';




export async function POST(request: NextRequest) {

  const body = await request.json();



  const {
    walletAddress,
    center,
    sequence,
    selectedNumber,
    horseRanking,
    resultNumber,
    win,
  } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await updateRaceGameResultByWalletAddressAndSequence({
    walletAddress: walletAddress,
    sequence: sequence,
    selectedNumber: selectedNumber,
    horseRanking: horseRanking,
    resultNumber: resultNumber,
    win: win,
  });


  if (result) {

    // getOneRaceGameByWalletAddressAndSequence

    const result2 = await getOneRaceGameByWalletAddressAndSequence(
      walletAddress,
      sequence
    );

    /*
    {
  "_id": {
    "$oid": "67eb533f246c65ede8044709"
  },
  "walletAddress": "0x7ade168d854cD7777C91A653B6191dc2FE53A11b",
  "sequence": 100,
  "status": "closed",
  "winPrize": "1.609071",
  "horses": [
    {
      "tokenId": 4805,
      "nft": {
        "metadata": {
          "id": "4805",
          "name": "",
          "description": "Granderby NFT Horses",
          "image": "https://dshujxhbbpmz18304035.gcdn.ntruss.com/nft/HV/hrs/Hrs_00101520.png",
          "attributes": [
            {
              "trait_type": "Speed",
              "value": 0
            },
            {
              "trait_type": "Preceding",
              "value": 0
            },
            {
              "trait_type": "Overtaking",
              "value": 0
            },
            {
              "trait_type": "Stamina",
              "value": 0
            },
            {
              "trait_type": "Spirit",
              "value": 0
            },
            {
              "trait_type": "Power",
              "value": 0
            },
            {
              "trait_type": "Agility",
              "value": 0
            },
            {
              "trait_type": "Weight",
              "value": 0
            },
            {
              "trait_type": "Drivinghabits",
              "value": 0
            },
            {
              "trait_type": "Record",
              "value": 0
            },
            {
              "trait_type": "textureKey",
              "value": "Hrs_00101520"
            }
          ],
          "animation_url": "",
          "external_url": "https://granderby.io/horse-details/4805"
        },
        "owner": null,
        "id": {
          "$numberLong": "4805"
        },
        "tokenURI": "https://granderby.io/api/nft/horse/4805",
        "type": "ERC721"
      }
    },
    {
      "tokenId": 7729,
      "nft": {
        "metadata": {
          "id": "7729",
          "name": "",
          "description": "Granderby NFT Horses",
          "image": "https://dshujxhbbpmz18304035.gcdn.ntruss.com/nft/HV/hrs/Hrs_00020908.png",
          "attributes": [
            {
              "trait_type": "Speed",
              "value": 0
            },
            {
              "trait_type": "Preceding",
              "value": 0
            },
            {
              "trait_type": "Overtaking",
              "value": 0
            },
            {
              "trait_type": "Stamina",
              "value": 0
            },
            {
              "trait_type": "Spirit",
              "value": 0
            },
            {
              "trait_type": "Power",
              "value": 0
            },
            {
              "trait_type": "Agility",
              "value": 0
            },
            {
              "trait_type": "Weight",
              "value": 0
            },
            {
              "trait_type": "Drivinghabits",
              "value": 0
            },
            {
              "trait_type": "Record",
              "value": 0
            },
            {
              "trait_type": "textureKey",
              "value": "Hrs_00020908"
            }
          ],
          "animation_url": "",
          "external_url": "https://granderby.io/horse-details/7729"
        },
        "owner": null,
        "id": {
          "$numberLong": "7729"
        },
        "tokenURI": "https://granderby.io/api/nft/horse/7729",
        "type": "ERC721"
      }
    },
    {
      "tokenId": 2329,
      "nft": {
        "metadata": {
          "id": "2329",
          "name": "",
          "description": "Granderby NFT Horses",
          "image": "https://dshujxhbbpmz18304035.gcdn.ntruss.com/nft/HV/hrs/Hrs_00100513.png",
          "attributes": [
            {
              "trait_type": "Speed",
              "value": 0
            },
            {
              "trait_type": "Preceding",
              "value": 0
            },
            {
              "trait_type": "Overtaking",
              "value": 0
            },
            {
              "trait_type": "Stamina",
              "value": 0
            },
            {
              "trait_type": "Spirit",
              "value": 0
            },
            {
              "trait_type": "Power",
              "value": 0
            },
            {
              "trait_type": "Agility",
              "value": 0
            },
            {
              "trait_type": "Weight",
              "value": 0
            },
            {
              "trait_type": "Drivinghabits",
              "value": 0
            },
            {
              "trait_type": "Record",
              "value": 0
            },
            {
              "trait_type": "textureKey",
              "value": "Hrs_00100513"
            }
          ],
          "animation_url": "",
          "external_url": "https://granderby.io/horse-details/2329"
        },
        "owner": null,
        "id": {
          "$numberLong": "2329"
        },
        "tokenURI": "https://granderby.io/api/nft/horse/2329",
        "type": "ERC721"
      }
    },

  ],
  "usdtAmount": 0,
  "krwAmount": 0,
  "rate": 0,
  "createdAt": "2025-04-01T02:45:19.150Z",
  "horseRanking": [
    5,
    8,
    4,
    1,
    7,
    6,
    2,
    3
  ],
  "resultNumber": 5,
  "selectedNumber": "6",
  "updatedAt": "2025-04-01T02:45:46.635Z",
  "win": false
}
    */




    if (result2) {
      // send telegram message
      //const center = "ppump_songpa_bot";

      //const message = `updateRaceGameResultByWalletAddressAndSequence: ${JSON.stringify(result2)}`;

      const horses = result2.horses;
      //const resultNumber = result2.resultNumber;

      //const winHorse = horses[resultNumber - 1];
      //const tokenId = winHorse.tokenId;

      // smw contract address
      const contractAddressSMW = "0xb3f4f5396075c4141148B02D43bF54C5Da6525dD";
      //const totalSupply = 10; // total supply of the contract
      // tokenId 0 to 9
      // select 8 horses from 0 to 9
    
      
    
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });


    
      if (client) {



        const contractErc721 = getContract(
          {
            client: client,
            chain: polygon,
            address: contractAddressSMW,
          }
        );


        let index = 0;
        //horses.map(async (horse: any) => {

        horses.forEach(async (horse: any) => {

          const tokenId = horse.tokenId;

          const ranking = horseRanking[index];
          index++;

          // owner of horse
          const owner = await ownerOf({
            contract: contractErc721,
            tokenId: BigInt(tokenId),
          });
          const ownerAddress = owner.toString();
          console.log("ownerAddress=======>", ownerAddress);
      
          if (ownerAddress !== walletAddress) {

            // get user info
            const user = await getOneByWalletAddress(ownerAddress);
            const telegramId = user?.telegramId;
            console.log("telegramId=======>", telegramId);

            if (telegramId) {

              const message = `당신의 말 ${horse.nft.metadata.name} 이(가) 경주에서 ${ranking}등으로 도착했습니다.`;

              await insertMessage({
                center,
                category: "racegame",
                telegramId,
                message,
                //nftInfo: horse.nft,
              } );

            }



          }

        })


      }

    }


  }



 
  return NextResponse.json({

    result,
    
  });
  
}
