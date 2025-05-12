#!/usr/bin/env tsx

import process from 'node:process'
import { ValiError, flatten } from 'valibot'
import { type RunnerHandle, run } from '@grammyjs/runner'
import { createLogger } from './logger.js'
import { createBot } from './bot/index.js'
import type { PollingConfig, WebhookConfig } from './config.js'
import { createConfig } from './config.js'
import { createServer, createServerManager } from './server/index.js'
import type { Bot } from './bot/index.js'



import { privateKeyToAccount } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { config } from 'dotenv' 
import { Composer, InlineKeyboard, InputFile } from 'grammy'



import {
  getContract,
} from "thirdweb";

import {
  polygon,
  arbitrum,
  ethereum,
} from "thirdweb/chains";

import { balanceOf } from "thirdweb/extensions/erc20";
import { contractType } from 'thirdweb/extensions/thirdweb'

config()



// Handler for serverless environments
let botInstance: Bot | null = null;

// sleep for 5 seconds
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



async function startPolling(config: PollingConfig) {
  const logger = createLogger(config)
  
  const bot = createBot(config.botToken, {
    config,
    logger,
  })

  
  /// error
  ////const me = await bot.api.getMe();


  try {

    // set commands


    logger.info('Setting commands');


    /*
    const response = bot.api.setMyCommands([
      { command: "start", description: "시작하기" },
      { command: "wallet", description: "매직월렛"},
    ])


    logger.info('Commands set response:', response);
    */



    // GrammyError: Call to 'setMyCommands' failed! (429: Too Many Requests: retry after 686)
    // Too Many Requests: retry after 686

    // how to fix this error?
    // set commands only once
    // set commands only when the bot is started
    // set commands only when the bot is started for the first time
    // set commands only when the bot is started for the first time after the bot is deployed

    // set commands only when the bot is started for the first time after the bot is deployed

    bot?.api.getMyCommands()
    .then((commands) => {
      //if (commands.length === 0) {
        bot.api.setMyCommands([
          //{ command: "profile", description: "나의 프로필 관리"},
          //{ command: "start", description: "NOAH SKY 시작하기"},
          { command: "start", description: "USDT 개인간 거래"},
          { command: "affiliation", description: "추천코드 관리하기" },
          //{ command: "okx", description: "OKX" },
          { command: "wallet", description: "내 지갑"},
          { command: "game", description: "게임"},


        ])
      //}
    } )

    logger.info('Commands set  response:', 'Commands set  response:');
    




    








  } catch (error) {
    ////console.error('Error setting commands:', error+ '')

    logger.error('Error setting commands:', error+ '');

    logger.info('Commands set  error:', error + '');
  }




  botInstance = bot


  

  let runner: undefined | RunnerHandle

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await runner?.stop()
  })

  await bot.init()

  // start bot
  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: config.botAllowedUpdates,
      },
    },
  })

  /*
  logger.info({
    msg: 'Bot running.......',
    username: bot.botInfo.username,

  })
  */

}



async function startWebhook(config: WebhookConfig) {
  const logger = createLogger(config)
  const bot = createBot(config.botToken, {
    config,
    logger,
  })
  const server = createServer({
    bot,
    config,
    logger,
  })
  const serverManager = createServerManager(server, {
    host: config.serverHost,
    port: config.serverPort,
  })

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await serverManager.stop()
  })

  // to prevent receiving updates before the bot is ready
  await bot.init()

  // start server
  const info = await serverManager.start()
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  // set webhook
  await bot.api.setWebhook(config.botWebhook, {
    allowed_updates: config.botAllowedUpdates,
    secret_token: config.botWebhookSecret,
  })
  logger.info({
    msg: 'Webhook was set',
    url: config.botWebhook,
  })
}

// Utils

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}


type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>

type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object ? KeysToCamelCase<T[K]> : T[K]
}

function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase())
}

function convertKeysToCamelCase<T>(obj: T): KeysToCamelCase<T> {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = toCamelCase(key)
      result[camelCaseKey] = obj[key]
    }
  }
  return result
}




async function startBot() {
  try {

    try {
      process.loadEnvFile()
    }
    catch {
      // No .env file found
    }

    // @ts-expect-error create config from environment variables
    const config = createConfig(convertKeysToCamelCase(process.env))

    if (config.isWebhookMode)
      await startWebhook(config)
    else if (config.isPollingMode)
      await startPolling(config)

  }
  catch (error) {
    if (error instanceof ValiError) {
      console.error('Config parsing error', flatten(error.issues))
    }
    else {
      console.error(error)
    }
    process.exit(1)
  }
}





export default async function handler(req: any, res: any) {
  try {
    process.loadEnvFile()
  } catch {
    // No .env file found
  }

  // @ts-expect-error create config from environment variables
  const config = createConfig(convertKeysToCamelCase(process.env))

  if (config.isWebhookMode) {
    const logger = createLogger(config)
    const bot = createBot(config.botToken, { config, logger })
    await bot.init()
    
    const server = createServer({ bot, config, logger })
    await server.fetch(req)
    
    res.status(200).send('OK')

  } else if (config.isPollingMode) {
    if (!botInstance) {
      const logger = createLogger(config)
      botInstance = createBot(config.botToken, { config, logger })
      await botInstance.init()
      // Start the bot in polling mode without awaiting
      startPolling(config).catch(error => {
        console.error('Error in polling mode:', error)
      })
    }
    res.status(200).send('Bot is running in polling mode')

  } else {
    res.status(400).send('Invalid bot configuration')
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startBot()
}


console.log('Hello, world!')







// fetch account data from the server

async function fetchAccountData() {

  const date = new Date();
  const hours = date.getHours() + 9;
  if (hours >= 23 || hours < 9) {
    return;
  }


  try {

    if (botInstance) {

      const center = botInstance.botInfo.username;

      const response = await fetch("https://owinwallet.com/api/agent/getApplicationsForCenter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          center,
        }),
      });
      
      if (response.status !== 200) {
        ///return ctx.reply("Failed to get leaderboard");

        console.log('Failed to get applications for center')

        return;
      }


      const data = await response.json();

      if (!data?.result) {

        console.log('No data result')

        return;
      }


      const applications = data.result.applications;

      const totalAccountCount = data.result.totalCount;
        
      const totalTradingAccountBalance = '$' + Number(data.result.totalTradingAccountBalance).toFixed(2);


      const url = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getAllUsersTelegramIdByCenter`;

      const responseUsers = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          center,
        }),
      });

      if (responseUsers.status !== 200) {
        ///return ctx.reply("Failed to get leaderboard");

        console.log('Failed to get users telegram id by center')

        return;
      }

      const dataUsers = await responseUsers.json();

      ///console.log('dataUsers:', dataUsers);

      
      for (const user of dataUsers.result) {
        const telegramId = user.telegramId;

        if (!telegramId) {
          continue;
        }

        // find application for the user by wallet address

        const application = applications.find((application: any) => application.walletAddress === user.walletAddress);

        ///console.log('application:', application);

        if (!application) {
          continue;
        }


        const masterBotImageUrl = application ? application?.masterBotInfo?.imageUrl : '';




        const tradingAccountBalance = application ? '$' + Number(application.tradingAccountBalance.balance).toFixed(2) : 'N/A';

        //const tradingAccountVolume = Number(application.affiliateInvitee.data.volMonth).toFixed(0);


        const tradingAccountVolume = application.affiliateInvitee ? Number(application.affiliateInvitee.data.volMonth).toFixed(0) : 0;


        const claimedTradingVolume = Number(application.claimedTradingVolume).toFixed(0);
        const tradingVolume = Number(tradingAccountVolume) - Number(claimedTradingVolume);

        const userName = application.userName;

        const applicationId = application._id;



        if (masterBotImageUrl) {

          try {


            /*
            {
              method: 'sendPhoto',
              payload: {
                chat_id: '7719309234',
                photo: 'https://shinemywinter.vercel.app/logo-magic-wallet.webp',
                caption: '\n\n🚀 0.001150 USDT 를 받았습니다\n\n👇 아래 버튼을 눌러 나의 지갑으로 이동하세요.',
                reply_markup: InlineKeyboard {
                  inline_keyboard: [ [ { text: '나의 지갑 보러가기', web_app: [Object] } ] ]
                }
              },
              ok: false,
              error_code: 403,
              description: 'Forbidden: bot was blocked by the user',
              parameters: {}
            }
            */

            // check if the user blocked the bot
            

            


            /*
            await botInstance.api.sendPhoto(
              telegramId,
              masterBotImageUrl,
              {
                caption: '🔥 My Trading Account Balance: ' + tradingAccountBalance + '\n'
                //+ '💪 Total Account Count: ' + totalAccountCount + '\n'
                //+ '🔥 Total Trading Account Balance: ' + totalTradingAccountBalance
              }
            )
            */


            /*
            const username = telegramId;
            const expiration = Date.now() + 6000_000; // valid for 100 minutes
            const message = JSON.stringify({
              username,
              expiration,
            });
          
            const authCode = await adminAccount.signMessage({
              message,
            });
    
            const urlMySettement = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/claim`;
            */

            console.log("userName=", userName);
            console.log("tradingVolume=", tradingVolume)


            if (tradingVolume >= 1000) {


              /*
                      // update application status to "claimSettlement"
                const response = await fetch("/api/settlement/claim", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        applicationId: applicationId,
                    }),
                });*/

              const url = `https://owinwallet.com/api/settlement/claim`;

              const responseClaim = await fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  applicationId: applicationId
                }),
              });

              console.log("applicationId=", applicationId);
              //console.log("responseClaim=", responseClaim);

              if (responseClaim.ok) {

                const data = await response.json();
        
              
                const urlMySettement = `${process.env.FRONTEND_APP_ORIGIN}/claim?walletAddress=${user.walletAddress}`;
                const keyboard = new InlineKeyboard()
                .webApp('나의 마스터봇 보상 보러가기', urlMySettement)


                // description: 'Forbidden: bot was blocked by the user',
                // check if the user blocked the bot
                // if the user blocked the bot, the bot will not be able to send messages to the user



                await botInstance.api.sendPhoto(
                  telegramId,
                  masterBotImageUrl,
                  {
                    caption: '🔥 나의 마스터봇 채굴량: ' + tradingVolume
                    + '\n\n💪 나의 마스터봇 거래잔고: ' + tradingAccountBalance
                    + '\n\n' + '👇 아래 버튼을 눌러 나의 마스터봇 보상으로 이동하세요.'
                    //+ '💪 Total Account Count: ' + totalAccountCount + '\n'
                    //+ '🔥 Total Trading Account Balance: ' + totalTradingAccountBalance
                    ,

                    reply_markup: keyboard,
                  }
                )

              }


            }


          } catch (error) {
            console.error('Error sending photo:', error)
          }

        } else {

          try {

              //console.log("sendMessage1");
              await botInstance.api.sendMessage(
                telegramId,
                // emoji: https://emojipedia.org/
                '🔥 나의 마스터봇 거래잔고: ' + tradingAccountBalance
                + '\n\n' + '👇 아래 버튼을 눌러 나의 마스터봇 보상으로 이동하세요.'
                //+ '💪 Total Account Count: ' + totalAccountCount + '\n'
                //+ '🔥 Total Trading Account Balance: ' + totalTradingAccountBalance
              ).then(() => {
                //console.log('Message sent');
              }).catch((error) => {
                console.error('Error sending message:', error+'');
              })


          } catch (error) {
            //console.error('Error sending message:', error)
          }

        }
        
        

      }


      

    }

  } catch (error) {
    console.error('Error fetching account data:', error+'')
  }
  
}



const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
})



async function pushGame() {

  /*
  const date = new Date();

  const hours = date.getHours() + 9;
  if (hours >= 23 || hours < 9) {
    return;
  }
  */


  if (!botInstance) return;


  const telegramId = "441516803";

  const urlGetUser = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getUserByTelegramId`;

  const responseGetUser = await fetch(urlGetUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      telegramId,
    }),
  });

  if (responseGetUser.status !== 200) {

    //return ctx.reply("Failed to get user");
    
    await botInstance.api.sendMessage(
      telegramId,
      'Failed to get user',
    )

    return;


  }

  const dataGetUser = await responseGetUser.json();
  //console.log("data", data);

  if (!dataGetUser?.result?.walletAddress) {
    //return ctx.reply("Failed to get wallet address");
    await botInstance.api.sendMessage(
      telegramId,
      'Failed to get wallet address',
    )
    return;
  }
  
  const walletAddress = dataGetUser.result.walletAddress;



  const urlSetGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/setGame`;

  const responseSetGame = await fetch(urlSetGame, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress,
    }),
  });

  if (responseSetGame.status !== 200) {
    ///return ctx.reply("Failed to set game");

    await botInstance.api.sendMessage(
      telegramId,
      'Failed to set game',
    )

    return;
  }

  const dataSetGame = await responseSetGame.json();

  //console.log("dataSetGame=", dataSetGame);

  const status = dataSetGame?.result?.status;

  if (status === 'waiting') {

    const sequence = parseInt(dataSetGame?.result?.data?.sequence) + 1;

    const sequenceString = sequence.toString();
    let sequenceEmoji = '';
    for (let i = 0; i < sequenceString.length; i++) {
      sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
    }


    const waitingTime = dataSetGame?.result?.waitingTime;

    const text = sequenceEmoji + '회차 홀짝 게임을 시작합니다.'
    + '\n\n🚫 ' + waitingTime + '초 후에 시작가능합니다.'
    + '\n\n🙏 잠시만 기다려 주세요.'
    + '\n\n👇 아래 버튼을 눌러 홀짝 게임을 시작하세요';

    //return ctx.reply(text);

    const keyboard = new InlineKeyboard()
    .text(sequenceEmoji + '회차 홀짝 게임 시작하기', 'roulette')
  
    const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-banner.jpg`;

    /*
    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )
    */

    try {
      botInstance.api.sendPhoto(
        telegramId,
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )
    } catch( error ) {}



    return;


  
  }

  let sequence;

  if (status === "success") {

    sequence = dataSetGame?.result?.data?.sequence;

  //console.log("sequence=", sequence);

    if (!sequence) {
      //return ctx.reply("🚫 Failed to set game");

      await botInstance.api.sendMessage(
        telegramId,
        '🚫 Failed to set game',
      )

      return;
    }

  }


  const winPrize = dataSetGame?.result?.data?.winPrize;



  const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-banner.jpg`;
  
  //const videoFile = new InputFile(`/home/ubuntu/video/welcome-casino.gif`)
  //const videoFile = new InputFile(`/home/ubuntu/video/banano-stom.mp4`)


  const sequenceString = sequence.toString();
  let sequenceEmoji = '';
  for (let i = 0; i < sequenceString.length; i++) {
    sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
  }

  const text = sequenceEmoji + '회차 홀짝 게임을 시작합니다.'
    + '\n\n💲 당첨금: ' + winPrize + ' USDT'
    + '\n\n👇 아래 버튼에서 🚹 홀 또는 🚺 짝을 선택하세요.';

  const queryDataOdd = 'roulette-odd' + '-' + sequence;
  const queryDataEvent = 'roulette-even' + '-' + sequence;

  const keyboard = new InlineKeyboard()
    //.text('🎲 홀', 'roulette-odd').text('🎲 짝', 'roulette-even')
    .text('🚹 홀', queryDataOdd).text('🚺 짝', queryDataEvent)

  /*
  return ctx.replyWithPhoto(
    photoUrl,
    {
      caption: text,
      reply_markup: keyboard
    }
  )
    */

  try {
    botInstance.api.sendPhoto(
      telegramId,
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )
  } catch (error) {
    console.log("error=", error+'');
  }
  
  return;
    


}









// send message to all users start command
async function sendStartMessageToAllUsers() {

  
  const date = new Date();
  const hours = date.getHours() + 9;
  if (hours >= 23 || hours < 9) {
    return;
  }
  
  
  if (botInstance) {

    const center = botInstance.botInfo.username;

    const url = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getAllUsersTelegramIdByCenter`;

    const responseUsers = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        center,
      }),
    });

    if (responseUsers.status !== 200) {
      ///return ctx.reply("Failed to get leaderboard");
      return;
    }

    const dataUsers = await responseUsers.json();
    
    for (const user of dataUsers.result) {
      const telegramId = user.telegramId;

      if (!telegramId) {
        continue;
      }

      if (user?.avatar) {
        continue;
      }



      const username = telegramId;

      const expiration = Date.now() + 6000_000; // valid for 100 minutes
      const message = JSON.stringify({
        username,
        expiration,
      });
      
      const authCode = await adminAccount.signMessage({
        message,
      });
      
      const urlMyProfile = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-profile`;
      

      try {

        // 프로필 이미지를 설정해주세요.

        const keyboard = new InlineKeyboard()
          .webApp('나의 프로필 설정하기', urlMyProfile)   

        //console.log("sendMessage2");
        await botInstance.api.sendMessage(
          telegramId,
          '🚀 프로필 이미지를 설정해주세요.\n',
          {
            reply_markup: keyboard,
          }
        )



      } catch (error) {
        //console.error('Error sending message:', error)
      }



    }

  }

}



// send message to all users to notify them to set their profile image
// get messages from api
// /api/telegram/getAllMessages
async function sendMessages() {

  if (!botInstance) {
    return;
  }

  try {

  const center = botInstance.botInfo.username;

  /*
  const url = `${process.env.FRONTEND_APP_ORIGIN}/api/telegram/getAllMessages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      center: center,
      limit: 100,
      page: 0,
    }),
  });
  */

  const url = `${process.env.FRONTEND_APP_ORIGIN}/api/telegram/fetchAllMessagesByCenter`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      center: center,
    }),
  });

  ///console.log("fetchAllMessagesByCenter response=", response);


  if (response.status !== 200) {
    ///return ctx.reply("Failed to get leaderboard");
    return;
  }

  const data = await response.json();

  //const messages = data.result.messages;


  //console.log("fetchAllMessagesByCenter data=", data);



  const messages = data.result.messages;


  //console.log("messages=", messages);


  for (const message of messages) {


    const _id = message._id;

    const telegramId = message.telegramId;
    const messageText = message.message;

    const nftInfo = message?.nftInfo;

    const category = message.category; // "wallet", "settlement", "agent", "center", "nft"

    console.log("category=", category);


    const contractAddress = message?.userTransfer?.transferData?.contractAddress;

    const user = message?.userTransfer?.user;

    const otherUserNickname = message?.userTransfer?.otherUser?.nickname;
    const otherUserAvatar = message?.userTransfer?.otherUser?.avatar;

    const sequence = message?.sequence;
    const winPrize = message?.winPrize;


    const groupChatMessageText = "😀 " + user?.nickname + " 💰 " + messageText;


    
    console.log("contractAddress=", contractAddress);




    
    try {


      //const groupChatId = "-1002295555741";

      const groupChatId = "-1002252842181";


      /*
      botInstance.api.sendMessage(
        groupChatId,
        groupChatMessageText,
      )
      */

      const urlLeaderBoard = `${process.env.FRONTEND_APP_ORIGIN}/leaderboard?center=${center}`;

      const keyboard = new InlineKeyboard()
        //.text('🚹 홀 🚺 짝 게임', "roulette")
        .webApp('🎮 상세보기', urlLeaderBoard)

      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-banner.jpg`;
      await botInstance.api.sendPhoto(
        groupChatId,
        photoUrl,
        {
          caption: groupChatMessageText,
          ///reply_markup: keyboard
        }
      )




    } catch (error) {
      console.error('Group chat Error sending message:', error + '')
    }




      



    try {






      if (category === 'roulette') {


        if (sequence) {




          const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-banner.jpg`;
    
          //const videoFile = new InputFile(`/home/ubuntu/video/welcome-casino.gif`)
          //const videoFile = new InputFile(`/home/ubuntu/video/banano-stom.mp4`)
        
        
          const sequenceString = sequence.toString();
          let sequenceEmoji = '';
          for (let i = 0; i < sequenceString.length; i++) {
            sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
          }
        
          const text = sequenceEmoji + '회차 홀짝 게임을 시작합니다.'
            + '\n\n💲 당첨금: ' + winPrize + ' USDT'
            + '\n\n👇 아래 버튼에서 🚹 홀 또는 🚺 짝을 선택하세요.';
        
          const queryDataOdd = 'roulette-odd' + '-' + sequence;
          const queryDataEvent = 'roulette-even' + '-' + sequence;
        
          const keyboard = new InlineKeyboard()
            .text('🚹 홀', queryDataOdd).text('🚺 짝', queryDataEvent)
        
        
          await botInstance.api.sendPhoto(
            telegramId,
            photoUrl,
            {
              caption: text,
              reply_markup: keyboard
            }
          )

        }





      } else if (category === 'wallet') {

        const clientId = process.env.THIRDWEB_CLIENT_ID;
        const client = createThirdwebClient({
          clientId: clientId as string,
        });



        const contractAddressUsdt = "0xeCfa44db6B9C3B8F7540ffa28F515B05c2D5a35d"; // USDT on Polygon
        const contractAddressNoahs = "0xdd200c6EF8e5fe9b1332224a86b5980D202d4d9d";


        let balanceUsdt;

        let balanceNoahs;


        const urlGetUser = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getUserByTelegramId`;

        const responseGetUser = await fetch(urlGetUser, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegramId,
          }),
        });

        if (responseGetUser.status === 200) {

          const data = await responseGetUser.json();
          //console.log("data", data);

          if (data.result && data.result.walletAddress) {
            const walletAddress = data.result.walletAddress;


            // get balance

            const contractUsdt = getContract({
              client,
              chain: polygon,
              address: contractAddressUsdt,
            });
            const resultUsdt = await balanceOf({
              contract: contractUsdt,
              address: walletAddress,
            });

            balanceUsdt = Number(resultUsdt) / 10 ** 18;


            // get noahs balance

            const contractNoahs = getContract({
              client,
              chain: polygon,
              address: contractAddressNoahs,
            });
            const resultNoahs = await balanceOf({
              contract: contractNoahs,
              address: walletAddress,
            });

            balanceNoahs = Number(resultNoahs) / 10 ** 18;


          }

        }





        const username = telegramId;
        const expiration = Date.now() + 6000_000; // valid for 100 minutes
        const message = JSON.stringify({
          username,
          expiration,
        });
      
        const authCode = await adminAccount.signMessage({
          message,
        });



        let urlMyWallet = '';


        // lower case
        if (  contractAddress?.toLowerCase() === contractAddressUsdt.toLowerCase() ) {

          urlMyWallet = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-wallet`;
        }

        if (  contractAddress?.toLowerCase() === contractAddressNoahs.toLowerCase() ) {
          urlMyWallet = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-wallet-noahs`;
        }



        const urlGame = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/game`;

        const urlGameGranderby = `${process.env.FRONTEND_APP_ORIGIN}/en/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/en/granderby`;


        const urlOtc = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/otc`;

        const urlSellUsdt = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/kr/sell-usdt-simple`;


        const keyboard = new InlineKeyboard()
        .webApp('💰 나의 지갑 보러가기', urlMyWallet)
        // english
        //.webApp('💰 Go to My Wallet', urlMyWallet)

        .row()
        .webApp('🎮 탭투언 게임', urlGame)
        .webApp('🐎 그랑더비 게임', urlGameGranderby)
        .row()
        .text('🎲 홀짝 게임', 'roulette')
        .text('🐎 경마 게임', 'race')
        .webApp('💱 USDT 판매', urlSellUsdt)




        const caption = '\n\n🚀 ' + messageText
        + '\n\n' + '💲 지갑잔고: ' + balanceUsdt + ' USDT'
        
        //+ '\n\n' + '💲 지갑잔고: ' + balanceNoahs + ' NOAHS'

        + '\n\n' + '👇 아래 버튼을 눌러 원하는 서비스로 이동하세요.';
        // english
        //+ '\n\n' + '👇 Press the button below to go to each service';


        

        const photo = `${process.env.FRONTEND_APP_ORIGIN}/logo-magic-wallet.webp`;
        

        console.log("otherUserAvatar=", otherUserAvatar);


        if (otherUserAvatar) {

          if (otherUserNickname === 'tbot') {

       
          
            const videoUrl = '/home/ubuntu/video/gatsby.gif';
            // Create an InputFile object from the URL
            const videoFile = new InputFile(videoUrl);
            
            await botInstance.api.sendVideo(
              telegramId,
              videoFile,
              {
                caption: caption,
                reply_markup: keyboard,
              }
            ).then(() => {
            //console.log('Message sent');
            }).catch((error) => {
              console.error('Error sending video:', error+'');
            })
          

          } else if (otherUserNickname === 'roulette') {

       
          
            const videoUrl = '/home/ubuntu/video/gatsby.gif';
            // Create an InputFile object from the URL
            const videoFile = new InputFile(videoUrl);
            
            await botInstance.api.sendVideo(
              telegramId,
              videoFile,
              {
                caption: caption,
                reply_markup: keyboard,
              }
            ).then(() => {
            //console.log('Message sent');
            }).catch((error) => {
              console.error('Error sending video:', error+'');
            })


          } else {





            const photo = otherUserAvatar;

            
            await botInstance.api.sendPhoto(
              telegramId,
              photo,
              {
                caption: caption,
                reply_markup: keyboard,
              }
            ).then(() => {
            //console.log('Message sent');
            }).catch((error) => {
              console.error('Error sending photo:', error+'');
            })
              
          }





        } else {


          //const videoFile = new InputFile(`/home/ubuntu/video/banano-stom.mp4`)

          const videoFile = new InputFile(`/home/ubuntu/video/welcome-casino.gif`)

          await botInstance.api.sendVideo(
            telegramId,
            videoFile,
            {
              caption: caption,
              reply_markup: keyboard,
            }
          ).then(() => {
          //console.log('Message sent');
          }).catch((error) => {
            console.error('Error sending video:', error+'');
          })

        }


        
     


      } else if (category === 'nft') {

        //console.log("nftInfo=", nftInfo);

        /*
        const username = telegramId;
        const expiration = Date.now() + 6000_000; // valid for 100 minutes
        const message = JSON.stringify({
          username,
          expiration,
        });
      
        const authCode = await adminAccount.signMessage({
          message,
        });
        */


        let urlNFT = '';


        if (nftInfo.contract.address === '0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60') { // granderby
          urlNFT = `${process.env.FRONTEND_APP_ORIGIN}/my-nft-granderby/${nftInfo.contract.address}/${nftInfo.tokenId}`;
        } else {
          urlNFT = `${process.env.FRONTEND_APP_ORIGIN}/nft/${nftInfo.contract.address}/${nftInfo.tokenId}`;
        }

        //console.log("urlNFT=", urlNFT);


        const urlOpensea = `https://opensea.io/assets/matic/${nftInfo.contract.address}/${nftInfo.tokenId}`;




        const keyboard = new InlineKeyboard()
        .webApp('💰 나의 NFT 보러가기', urlNFT)
        .webApp('✅ OpenSea 보러가기', urlOpensea);
        // english
        //.webApp('💰 Go to My NFT', urlNFT')
        




        const caption = '\n\n🚀 ' + messageText
        + '\n\n' + '✅ ' + '번호: ' + '#' + nftInfo.tokenId
        + '\n' + '✅ ' + '이름: ' + nftInfo.name
        + '\n' + '✅ ' + '설명: ' + nftInfo.description


        + '\n\n' + '👇 아래 버튼을 눌러 나의 NFT로 이동하세요.';
        // english
        //+ '\n\n' + '👇 Press the button below to go to My Wallet.';


        ////const photo = nftInfo?.image?.originalUrl ? nftInfo.image.originalUrl
        const photo = nftInfo?.image?.originalUrl ? nftInfo.image.originalUrl
        : `${process.env.FRONTEND_APP_ORIGIN}/banner-nft.png`;


        
        console.log("photo=", photo);


        await botInstance.api.sendPhoto(
          telegramId,
          photo,
          {
            caption: caption,
            reply_markup: keyboard,
          }
        ).then(() => {
        //console.log('Message sent');
        }).catch((error) => {
          console.error('Error sending photo:', error+'');
        })



      } else if (category === 'settlement') {


        const urlGetUser = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getUserByTelegramId`;

        const responseGetUser = await fetch(urlGetUser, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegramId,
          }),
        });
      
        if (responseGetUser.status !== 200) {
          
          ///return ctx.reply("Failed to get user");

        } else {

          const data = await responseGetUser.json();
          //console.log("data", data);
      
          if (data.result && data.result.walletAddress) {

            const walletAddress = data.result.walletAddress;
            
            const urlMySettement = `${process.env.FRONTEND_APP_ORIGIN}/claim?walletAddress=${walletAddress}`;
            

            const caption = '\n\n🚀 ' + messageText
            + '\n\n' + '👇 아래 버튼을 눌러 나의 보상으로 이동하세요.';

            const keyboard = new InlineKeyboard()
            .webApp('💰 나의 마스트봇 보상내역 보러가기', urlMySettement)

            /*
            await botInstance.api.sendMessage(
              telegramId,
              caption,
              {
                reply_markup: keyboard,
              }
            )
            */
            //console.log("sendPhoto2");

            await botInstance.api.sendPhoto(
              telegramId,
              `${process.env.FRONTEND_APP_ORIGIN}/logo-mining.webp`,
              {
                caption: caption,
                reply_markup: keyboard,
              }
            ).then(() => {
            //console.log('Message sent');
            }).catch((error) => {
              console.error('Error sending photo:', error+'');
            })

          }

        }


      } else if (category === 'agent') {

        const contract = message.contract;
        const tokenId = message.tokenId;
        const agentBotNft = message?.agentBotNft;

        const agentBotImageUrl = agentBotNft ? agentBotNft?.image?.originalUrl : '';
        const agentBotName = agentBotNft ? agentBotNft?.name : '';
        const agnetbotDescription = agentBotNft ? agentBotNft?.description : '';

        const photoUrl = agentBotImageUrl ? agentBotImageUrl : `${process.env.FRONTEND_APP_ORIGIN}/logo-mining.webp`;


        const urlMySettement = `${process.env.FRONTEND_APP_ORIGIN}/agent-reward/${contract}/${tokenId}`;



        const keyboard = new InlineKeyboard()
        .webApp('💰 나의 에이전트봇 보상 보러가기', urlMySettement)

        const caption = '\n\n🚀 ' + agentBotName
        + '\n\n🚀 ' + messageText
        + '\n\n' + '👇 아래 버튼을 눌러 나의 에이전트봇 보상을 확인하세요.';
        
        /*
        await botInstance.api.sendMessage(
          telegramId,
          caption,
          {
            reply_markup: keyboard,
          }
        )
        */

        //console.log("sendPhoto3");
        await botInstance.api.sendPhoto(
          telegramId,
          photoUrl,
          {
            caption: caption,
            reply_markup: keyboard,
          }
        ).then(() => {
        //console.log('Message sent');
        }).catch((error) => {
          console.error('Error sending photo:', error+'');
        })

      } else if (category === 'center') {


        const username = telegramId;
        const expiration = Date.now() + 6000_000; // valid for 100 minutes
        const message = JSON.stringify({
          username,
          expiration,
        });
      
        const authCode = await adminAccount.signMessage({
          message,
        });

        const urlMyCenter = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/center`;

        const keyboard = new InlineKeyboard()
        .webApp('💰 나의 보상 보러가기', urlMyCenter)


        const caption = '\n\n🚀 ' + messageText
        + '\n\n' + '👇 아래 버튼을 눌러 나의 보상으로 이동하세요.';

        /*
        await botInstance.api.sendMessage(
          telegramId,
          caption,
          {
            reply_markup: keyboard,
          }
        )
        */
        //console.log("sendPhoto4");
        await botInstance.api.sendPhoto(
          telegramId,
          `${process.env.FRONTEND_APP_ORIGIN}/logo-mining.webp`,
          {
            caption: caption,
            reply_markup: keyboard,
          }
        ).then(() => {
        //console.log('Message sent');
        }).catch((error) => {
          console.error('Error sending photo:', error+'');
        })


      }




      // delete message
      /*
      const url = `${process.env.FRONTEND_APP_ORIGIN}/api/telegram/deleteMessage`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: _id,
        }),
      });
      */


    } catch (error) {
      
      console.error('Private chat Error sending message:', error)

      // delete message
      /*
      const url = `${process.env.FRONTEND_APP_ORIGIN}/api/telegram/deleteMessage`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: _id,
        }),
      });
      */


    }


    //await sleep(10);

  }



  } catch (error) {} 

}






// fetch account data after 5 seconds

/*
sleep(5000).then(() => {
  
  fetchAccountData()

  // send start message to all users

  ////sendStartMessageToAllUsers()

})
*/


// fetch account data every 3600 seconds
setInterval(() => {

    fetchAccountData()

    //sendStartMessageToAllUsers()
    

//}, 3600*1000)
}, 60*1000)


// send messages every 10 seconds
setInterval(() => {

  sendMessages()

}, 10*1000)
//}, 1000)







sleep(5000).then(() => {
  pushGame();
})

setInterval(() => {

  //pushGame();

}, 600*1000)




/*
TypeError: Cannot read properties of undefined (reading 'data')
    at fetchAccountData (file:///home/ubuntu/ppump_orry_bot/build/src/main.js:266:78)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    */

/*
file:///home/ubuntu/ppump_orry_bot/build/src/main.js:270
            const tradingAccountVolume = Number(application.affiliateInvitee.data.volMonth).toFixed(0);
                                                                             ^

TypeError: Cannot read properties of undefined (reading 'data')
    at fetchAccountData (file:///home/ubuntu/ppump_orry_bot/build/src/main.js:270:78)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    */