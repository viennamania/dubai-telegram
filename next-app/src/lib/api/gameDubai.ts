import clientPromise from '../mongodb';

// object id
import { ObjectId } from 'mongodb';


export interface GameProps {
 
}

export interface ResultProps {
  totalCount: number;
  orders: GameProps[];
}



// insertOne
export async function insertOne(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');


  // check if latest data is within 30 seconds
  // then return waiting message

  // // within 120 seconds

  const latestData = await collection.findOne({ walletAddress: data.walletAddress }, { sort: { createdAt: -1 } });


  if (latestData
    //&& latestData.status === "opened"
  ) {


    if (latestData.status === "opened") {
      return {
        status: "success",
        data: latestData
      };
    }


    // within 120 seconds
    if (
      //isWithinOneMinute(latestData.createdAt)
      
      
      ///new Date().getTime() - new Date(latestData.createdAt).getTime() < 60000

      new Date().getTime() - new Date(latestData.createdAt).getTime() < 1


    ) {
  
      return {
        status: "waiting",
        waitingTime: 60 - Math.floor((new Date().getTime() - new Date(latestData.createdAt).getTime()) / 1000),
        data: latestData

      };



    } else {

      // sequence is last sequence + 1



      const sequence = latestData.sequence + 1;

      //const winPrize = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);

      // winPrice is 1 to 3

      //const winPrize =  (Number(Math.random() * 3) + 1).toFixed(0);

      ///const winPrize = Math.floor(Math.random() * 10) + 1

      const winPrize = "2";


      const result = await collection.insertOne(
        {
          walletAddress: data.walletAddress,
          sequence: sequence,
          status: "opened",
          winPrize: winPrize,
          usdtAmount: data.usdtAmount,
          krwAmount: data.krwAmount,
          rate: data.rate,
          createdAt: new Date().toISOString(),
        }
      );

      const insertedId = result.insertedId;

      const insertedData = await collection.findOne({ _id: insertedId });

      if (insertedData) {
        return {
          status: "success",
          data: insertedData
        };
      } else {
        return null;
      }


    }



  }


  let sequence = 1;

  const findSequence = await collection.find(
    {
      walletAddress: data.walletAddress
    }
  ).sort({ sequence: -1 }).limit(1).toArray();

  if (findSequence.length > 0) {
    sequence = findSequence[0].sequence + 1;
  }

  //const winPrize = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);
  //const winPrize = Math.floor(Math.random() * 10) + 1;
  // winPrice is 1 to 3
  //const winPrize =  (Number(Math.random() * 3) + 1).toFixed(0);
  const winPrize = "2";


  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      status: "opened",
      winPrize: winPrize,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
    }
  );

  const insertedId = result.insertedId;

  const insertedData = await collection.findOne({ _id: insertedId });

  if (insertedData) {
    return {
      status: "success",
      data: insertedData
    };
  } else {
    return null;
  }

}





// getOneByWalletAddressAndSequence
export async function getOneByWalletAddressAndSequence(walletAddress: string, sequence: number) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  const result = await collection.findOne(
    { walletAddress: walletAddress, sequence: sequence }
  );

    



  if (result) {
    return result;
  } else {
    return null;
  }

}

// check if createAt is within 1 minute from now
export function isWithinOneMinute(createdAt: string) {
  const now = new Date();
  const createdAtDate = new Date(createdAt);

  const diff = now.getTime() - createdAtDate.getTime();

  if (diff < 60000) {
    return true;
  } else {
    return false;
  }
}





// update result
/*
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win. true, false
    */
export async function updateResultByWalletAddressAndSequence(

  {
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win
  } : {
    walletAddress: string,
    sequence: string,
    selectedOddOrEven: string,
    resultOddOrEven: string,
    win: boolean
  }

) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {

    return {
      params : {
        walletAddress: walletAddress,
        sequence: sequence,
        selectedOddOrEven: selectedOddOrEven,
        resultOddOrEven: resultOddOrEven,
        win: win,
      },
      status: "fail",
      message: "no data found"
    }
  }


  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }


  //const settlement = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);

  let settlement = 0;



  let result = null;
  
  
  if (win) {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedOddOrEven: selectedOddOrEven,
          resultOddOrEven: resultOddOrEven,
          win: win,
          settlementStatus: false,
          settlement: settlement,
          settlementAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  } else {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedOddOrEven: selectedOddOrEven,
          resultOddOrEven: resultOddOrEven,
          win: win,
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }





  if (result) {


    // find updated data
    const updatedData = await collection.findOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      }
    );

    return {
      status: "success",
      data: updatedData
    };
    ;
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }

}



// getAllWinGames
export async function getAllWinGames() {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  const result = await collection.find(
    {
      win: true
    }
  ).toArray();

  return result;
}


// getAllGamesSettlement
export async function getAllGamesSettlement() {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  const result = await collection.find(
    {
      settlementStatus: false,
    }
  ).toArray();

  return result;
}


// setGaemsSettlementByWalletAddressAndSequence
export async function setGamesSettlementByWalletAddressAndSequence(
  {
    walletAddress,
    sequence,
  } : {
    walletAddress: string,
    sequence: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  // finde one and updaate
  // sequence is integer

  const findResult = await collection.findOneAndUpdate(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    },
    {
      $set: {
        settlementStatus: true,
        settlementAt: new Date().toISOString(),
      }
    }
  );

  return findResult;
}














// insertOneDiceGame
export async function insertOneDiceGame(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('diceGames');
  // check if latest data is within 30 seconds
  // then return waiting message
  // // within 120 seconds
  const latestData = await collection.findOne({ walletAddress: data.walletAddress }, { sort: { createdAt: -1 } });
  if (latestData
    //&& latestData.status === "opened"
  ) {
    if (latestData.status === "opened") {
      return {
        status: "success",
        data: latestData
      };
    }
    // within 120 seconds
    if (
      //isWithinOneMinute(latestData.createdAt)
      //new Date().getTime() - new Date(latestData.createdAt).getTime() < 120000
      new Date().getTime() - new Date(latestData.createdAt).getTime() < 1


    ) {
      return {
        status: "waiting",
        waitingTime: 120 - Math.floor((new Date().getTime() - new Date(latestData.createdAt).getTime()) / 1000),
        data: latestData
      };
    } else {
      // sequence is last sequence + 1
      const sequence = latestData.sequence + 1;
      //const winPrize = Number(Math.random() * (2.0 - 0.00001) + 0.00001).toFixed(2);
      // winPrice is 1 to 5
      
      //const winPrize = (Math.floor(Math.random() * 5) + 1).toFixed(0);
      const winPrize = "6";


      const result = await collection.insertOne(
        {
          walletAddress: data.walletAddress,
          sequence: sequence,
          status: "opened",
          winPrize: winPrize,
          usdtAmount: data.usdtAmount,
          krwAmount: data.krwAmount,
          rate: data.rate,
          createdAt: new Date().toISOString(),
          settlementStatus: false,
        }
      );
      const insertedId = result.insertedId;
      const insertedData = await collection.findOne({ _id: insertedId });
      if (insertedData) {
        return {
          status: "success",
          data: insertedData
        };
      } else {
        return null;
      }
    }
  }

  // if no data, then sequence is 1
  // if data exists, then sequence is sequence + 1
  let sequence = 1;
  const findSequence = await collection.find(
    {
      walletAddress: data.walletAddress
    }
  ).sort({ sequence: -1 }).limit(1).toArray();
  if (findSequence.length > 0) {
    sequence = findSequence[0].sequence + 1;
  }
  //const winPrize = Number(Math.random() * (1.0 - 0.00001) + 0.00001).toFixed(2);
  // winPrice is 1 to 5
  //const winPrize = (Math.floor(Math.random() * 5) + 1).toFixed(0);
  const winPrize = "6";


  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      status: "opened",
      winPrize: winPrize,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
      settlementStatus: false,
    }
  );
  const insertedId = result.insertedId;
  const insertedData = await collection.findOne({ _id: insertedId });
  if (insertedData) {
    return {
      status: "success",
      data: insertedData
    };
  } else {
    return null;
  }
}



// updateDiceGameResultByWalletAddressAndSequence
export async function updateDiceGameResultByWalletAddressAndSequence(
  {
    walletAddress,
    sequence,

    selectedDiceNumber,
    resultDiceNumber,

    //selectedOddOrEven,
    //resultOddOrEven,
    win
  } : {
    walletAddress: string,
    sequence: string,

    selectedDiceNumber: string,
    resultDiceNumber: string,

    //selectedOddOrEven: string,
    //resultOddOrEven: string,
    win: boolean
  }

) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('diceGames');

  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {

    return {
      params : {
        walletAddress: walletAddress,
        sequence: sequence,
        
        selectedDiceNumber: selectedDiceNumber,
        resultDiceNumber: resultDiceNumber,

        //selectedOddOrEven: selectedOddOrEven,
        //resultOddOrEven: resultOddOrEven,
        win: win,
      },
      status: "fail",
      message: "no data found"
    }
  }
  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }





  // update user gameMoneyBalance -1
  const userCollection = client.db('dubai').collection('users');
  const userResult = await userCollection.updateOne(
    {
      walletAddress: walletAddress,
    },
    {
      $inc: {
        gameMoneyBalance: -1,
      }
    }
  );
  if (!userResult) {
    return {
      status: "fail",
      message: "fail to update user gameMoneyBalance"
    };
  }





  //const settlement = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);
  let settlement = 0;
  let result = null;
  if (win) {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",

          selectedDiceNumber: selectedDiceNumber,
          resultDiceNumber: resultDiceNumber,

          //selectedOddOrEven: selectedOddOrEven,
          //resultOddOrEven: resultOddOrEven,


          win: win,
          settlementStatus: false,
          settlement: settlement,
          settlementAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  } else {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",

          selectedDiceNumber: selectedDiceNumber,
          resultDiceNumber: resultDiceNumber,

          //selectedOddOrEven: selectedOddOrEven,
          //resultOddOrEven: resultOddOrEven,
          
          win: win,
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }
  if (result) {
    // find updated data
    const updatedData = await collection.findOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      }
    );
    return {
      status: "success",
      data: updatedData
    };
    ;
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }
}























// insertOneRaceGame
export async function insertOneRaceGame(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('raceGames');


  // check if latest data is within 30 seconds
  // then return waiting message

  // // within 120 seconds

  const latestData = await collection.findOne({ walletAddress: data.walletAddress }, { sort: { createdAt: -1 } });


  if (latestData
    //&& latestData.status === "opened"
  ) {


    if (latestData.status === "opened") {
      return {
        status: "success",
        data: latestData
      };
    }


    // within 120 seconds
    if (
      //isWithinOneMinute(latestData.createdAt)
      new Date().getTime() - new Date(latestData.createdAt).getTime() < 1
    ) {
  
      return {
        status: "waiting",
        waitingTime: 120 - Math.floor((new Date().getTime() - new Date(latestData.createdAt).getTime()) / 1000),
        data: latestData

      };

    } else {

      // sequence is last sequence + 1



      const sequence = latestData.sequence + 1;

      
      //const winPrize = Number(Math.random() * (2.0 - 0.00001) + 0.00001).toFixed(2);

      // winPrice is 1 to 5
      //const winPrize = (Math.floor(Math.random() * 5) + 1).toFixed(0);
      const winPrize = 30;


      const result = await collection.insertOne(
        {
          walletAddress: data.walletAddress,
          sequence: sequence,
          status: "opened",
          winPrize: winPrize,
          horses: data.horses,
          usdtAmount: data.usdtAmount,
          krwAmount: data.krwAmount,
          rate: data.rate,
          createdAt: new Date().toISOString(),
          settlementStatus: false,
        }
      );

      const insertedId = result.insertedId;

      const insertedData = await collection.findOne({ _id: insertedId });

      if (insertedData) {
        return {
          status: "success",
          data: insertedData
        };
      } else {
        return null;
      }


    }



  }



  // insert sequence number for order by wallet address

  /*
  const sequence = await collection.countDocuments(
    {
      walletAddress: data.walletAddress
    }
  );
  */

  // if no data, then sequence is 1
  // if data exists, then sequence is sequence + 1

  let sequence = 1;

  const findSequence = await collection.find(
    {
      walletAddress: data.walletAddress
    }
  ).sort({ sequence: -1 }).limit(1).toArray();

  if (findSequence.length > 0) {
    sequence = findSequence[0].sequence + 1;
  }

  //const winPrize = Number(Math.random() * (1.0 - 0.00001) + 0.00001).toFixed(2);

  // winPrice is 1 to 5
  //const winPrize = (Math.floor(Math.random() * 5) + 1).toFixed(0);
  const winPrize = 30;


  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      status: "opened",
      winPrize: winPrize,
      horses: data.horses,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
      settlementStatus: false,
    }
  );

  const insertedId = result.insertedId;

  const insertedData = await collection.findOne({ _id: insertedId });

  if (insertedData) {
    return {
      status: "success",
      data: insertedData
    };
  } else {
    return null;
  }

}





// getOneRaceGameByWalletAddressAndSequence
export async function getOneRaceGameByWalletAddressAndSequence(walletAddress: string, sequence: string) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('raceGames');

  const result = await collection.findOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    }
  );


  if (result) {
    return result 
  } else {
    return null;
  }

}



export async function updateRaceGameResultByWalletAddressAndSequence(

  {
    walletAddress,
    sequence,
    selectedNumber,
    horseRanking,
    resultNumber,
    win
  } : {
    walletAddress: string,
    sequence: string,
    selectedNumber: string,
    horseRanking: number[],
    resultNumber: string,
    win: boolean
  }

) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('raceGames');

  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {

    return {
      params : {
        walletAddress: walletAddress,
        sequence: sequence,
        selectedNumber: selectedNumber,
        resultNumber: resultNumber,
        win: win,
      },
      status: "fail",
      message: "no data found"
    }
  }


  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }




  // update user gameMoneyBalance -1
  const userCollection = client.db('dubai').collection('users');
  const userResult = await userCollection.updateOne(
    {
      walletAddress: walletAddress,
    },
    {
      $inc: {
        gameMoneyBalance: -5,
      }
    }
  );
  if (!userResult) {
    return {
      status: "fail",
      message: "fail to update user gameMoneyBalance"
    };
  }



  const settlement = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);

  let result = null;
  
  
  if (win) {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedNumber: selectedNumber,
          horseRanking: horseRanking,
          resultNumber: resultNumber,
          win: win,
          settlementStatus: false,
          settlement: settlement,
          settlementAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  } else {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedNumber: selectedNumber,
          horseRanking: horseRanking,
          resultNumber: resultNumber,
          win: win,
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }





  if (result) {


    // find updated data
    const updatedData = await collection.findOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      }
    );

    return {
      status: "success",
      data: updatedData
    };
    ;
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }

}




// getAllRaceGamesSettlement
export async function getAllRaceGamesSettlement() {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('raceGames');

  // status is closed and settlementStatus is false
  const result = await collection.find(
    {
      status: "closed",
      settlementStatus: false,
    }
  ).sort({ createdAt: -1 }
  ).toArray();

  return result;
}


// 
export async function setRaceGamesSettlementByWalletAddressAndSequence(
  {
    walletAddress,
    sequence,
  } : {
    walletAddress: string,
    sequence: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('raceGames');

  // finde one and updaate
  // sequence is integer

  const findResult = await collection.findOneAndUpdate(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    },
    {
      $set: {
        settlementStatus: true,
        settlementAt: new Date().toISOString(),
      }
    }
  );

  return findResult;
}











// insertOne
export async function insertOneOddEvenGame(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');


  // check if latest data is within 30 seconds
  // then return waiting message

  // // within 120 seconds

  const latestData = await collection.findOne({ walletAddress: data.walletAddress }, { sort: { createdAt: -1 } });


  if (latestData
    //&& latestData.status === "opened"
  ) {


    if (latestData.status === "opened") {
      return {
        status: "success",
        data: latestData
      };
    }


    // within 120 seconds
    if (
      //isWithinOneMinute(latestData.createdAt)
      
      
      ///new Date().getTime() - new Date(latestData.createdAt).getTime() < 60000

      new Date().getTime() - new Date(latestData.createdAt).getTime() < 1


    ) {
  
      return {
        status: "waiting",
        waitingTime: 60 - Math.floor((new Date().getTime() - new Date(latestData.createdAt).getTime()) / 1000),
        data: latestData

      };



    } else {

      // sequence is last sequence + 1



      const sequence = latestData.sequence + 1;

      //const winPrize = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);

      // winPrice is 1 to 3

      ///const winPrize =  (Number(Math.random() * 3) + 1).toFixed(0);

      ///const winPrize = Math.floor(Math.random() * 10) + 1

      const winPrize = "2";


      const result = await collection.insertOne(
        {
          walletAddress: data.walletAddress,
          sequence: sequence,
          status: "opened",
          winPrize: winPrize,
          usdtAmount: data.usdtAmount,
          krwAmount: data.krwAmount,
          rate: data.rate,
          createdAt: new Date().toISOString(),
        }
      );

      const insertedId = result.insertedId;

      const insertedData = await collection.findOne({ _id: insertedId });

      if (insertedData) {
        return {
          status: "success",
          data: insertedData
        };
      } else {
        return null;
      }


    }



  }


  let sequence = 1;

  const findSequence = await collection.find(
    {
      walletAddress: data.walletAddress
    }
  ).sort({ sequence: -1 }).limit(1).toArray();

  if (findSequence.length > 0) {
    sequence = findSequence[0].sequence + 1;
  }

  //const winPrize = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);
  //const winPrize = Math.floor(Math.random() * 10) + 1;
  // winPrice is 1 to 3
  //const winPrize =  (Number(Math.random() * 3) + 1).toFixed(0);

  const winPrize = "2";


  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      status: "opened",
      winPrize: winPrize,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
    }
  );

  const insertedId = result.insertedId;

  const insertedData = await collection.findOne({ _id: insertedId });

  if (insertedData) {
    return {
      status: "success",
      data: insertedData
    };
  } else {
    return null;
  }

}














// update result
/*
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win. true, false
    */
export async function updateOddEvenGameResultByWalletAddressAndSequence(

  {
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win
  } : {
    walletAddress: string,
    sequence: string,
    selectedOddOrEven: string,
    resultOddOrEven: string,
    win: boolean
  }

) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {

    return {
      params : {
        walletAddress: walletAddress,
        sequence: sequence,
        selectedOddOrEven: selectedOddOrEven,
        resultOddOrEven: resultOddOrEven,
        win: win,
      },
      status: "fail",
      message: "no data found"
    }
  }


  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }





  // update user gameMoneyBalance -1
  const userCollection = client.db('dubai').collection('users');
  const userResult = await userCollection.updateOne(
    {
      walletAddress: walletAddress,
    },
    {
      $inc: {
        gameMoneyBalance: -1,
      }
    }
  );
  if (!userResult) {
    return {
      status: "fail",
      message: "fail to update user gameMoneyBalance"
    };
  }













  //const settlement = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(2);

  let settlement = 0;



  let result = null;
  
  
  if (win) {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedOddOrEven: selectedOddOrEven,
          resultOddOrEven: resultOddOrEven,
          win: win,
          settlementStatus: false,
          settlement: settlement,
          settlementAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  } else {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedOddOrEven: selectedOddOrEven,
          resultOddOrEven: resultOddOrEven,
          win: win,
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }





  if (result) {


    // find updated data
    const updatedData = await collection.findOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      }
    );

    return {
      status: "success",
      data: updatedData
    };
    ;
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }

}






// getAllGamesSettlement
export async function getAllOddEvenGamesSettlement() {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  const result = await collection.find(
    {
      settlementStatus: false,
    }
  ).toArray();

  return result;
}




// setGaemsSettlementByWalletAddressAndSequence
export async function setOddEvenGamesSettlementByWalletAddressAndSequence(
  {
    walletAddress,
    sequence,
  } : {
    walletAddress: string,
    sequence: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('oddEvenGames');

  // finde one and updaate
  // sequence is integer

  const findResult = await collection.findOneAndUpdate(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    },
    {
      $set: {
        settlementStatus: true,
        settlementAt: new Date().toISOString(),
      }
    }
  );

  return findResult;
}
















// insertOneRaceGame
export async function insertOneLottoGame(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('lottoGames');


  // check if latest data is within 30 seconds
  // then return waiting message

  // // within 120 seconds

  const latestData = await collection.findOne({}, { sort: { createdAt: -1 } });


  if (latestData
    //&& latestData.status === "opened"

  ) {


    if (latestData.status === "opened") {
      return {
        status: "success",
        data: latestData
      };
    }


    // within 120 seconds
    if (
      //isWithinOneMinute(latestData.createdAt)
      new Date().getTime() - new Date(latestData.createdAt).getTime() < 1
    ) {
  
      return {
        status: "waiting",
        waitingTime: 120 - Math.floor((new Date().getTime() - new Date(latestData.createdAt).getTime()) / 1000),
        data: latestData

      };

    } else {

      // sequence is last sequence + 1



      const sequence = latestData.sequence + 1;

      
      //const winPrize = Number(Math.random() * (2.0 - 0.00001) + 0.00001).toFixed(2);

      // winPrice is 1 to 5
      //const winPrize = (Math.floor(Math.random() * 5) + 1).toFixed(0);
      const winPrize = 30;


      const result = await collection.insertOne(
        {
          walletAddress: data.walletAddress,
          sequence: sequence,
          status: "opened",
          winPrize: winPrize,
          horses: data.horses,
          usdtAmount: data.usdtAmount,
          krwAmount: data.krwAmount,
          rate: data.rate,
          createdAt: new Date().toISOString(),
          settlementStatus: false,
        }
      );

      const insertedId = result.insertedId;

      const insertedData = await collection.findOne({ _id: insertedId });

      if (insertedData) {
        return {
          status: "success",
          data: insertedData
        };
      } else {
        return null;
      }


    }



  }



  // insert sequence number for order by wallet address

  /*
  const sequence = await collection.countDocuments(
    {
      walletAddress: data.walletAddress
    }
  );
  */

  // if no data, then sequence is 1
  // if data exists, then sequence is sequence + 1

  let sequence = 1;

  const findSequence = await collection.find(
    {
    }
  ).sort({ sequence: -1 }).limit(1).toArray();

  if (findSequence.length > 0) {
    sequence = findSequence[0].sequence + 1;
  }


  const winPrize = 30;


  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      status: "opened",
      winPrize: winPrize,
      horses: data.horses,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
      settlementStatus: false,
    }
  );

  const insertedId = result.insertedId;

  const insertedData = await collection.findOne({ _id: insertedId });

  if (insertedData) {
    return {
      status: "success",
      data: insertedData
    };
  } else {
    return null;
  }

}



// getOneLottoGame
// status is opened
export async function getOneLottoGame() {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('lottoGames');

  const result = await collection.findOne(
    {
      status: "opened"
    }
  );

  if (result) {
    return result;
  } else {
    return null;
  }

}











// updateOneLottoGameClose
export async function updateOneLottoGameClose(
  {
    sequence,
    resultNumber,
  } : {
    sequence: string,
    resultNumber: string,
  }

) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('lottoGames');


  const userCollection = client.db('dubai').collection('users');

  const collectionTelegramMessages = client.db('dubai').collection('telegramLottoMessages');



  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {
    return {
      status: "fail",
      message: "no data found"
    }
  }

  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }

  // update user gameMoneyBalance -1


  const updateResult = await collection.updateOne(
    {
      sequence: parseInt(sequence),
    },
    {
      $set: {
        status: "closed",
        resultNumber: resultNumber,
        updatedAt: new Date().toISOString(),
      }
    }
  );

  if (!updateResult) {
    return {
      status: "fail",
      message: "fail to update lotto game"
    };
  }



  // send telegram message

  const bets = findResult.bets || [];



  for (const bet of bets) {

    const user = await userCollection.findOne(
      {
        walletAddress: bet.walletAddress,
      }
    );

    const telegramId = user?.telegramId;
    const center = user?.center;
    const walletAddress = bet.walletAddress;
    


    const message = "Lotto Game Result\n" +
      "Sequence: " + sequence + "\n" +
      "Result Number: " + resultNumber + "\n" +
      "Your Bet: " + bet.selectedNumber + "\n" +
      "Your Bet Amount: " + bet.betAmount + "\n" +
      "You " + (bet.selectedNumber === resultNumber ? "Win" : "Lose") + "\n";




    await collectionTelegramMessages.insertOne(
    {
        center: center,
        category: "start",
        walletAddress: walletAddress,
        telegramId: telegramId,
        message: message,
        timestamp: new Date().toISOString(),
    } );

  }







  if (updateResult.modifiedCount > 0) {
    // find updated data
    const updatedData = await collection.findOne(
      {
        sequence: parseInt(sequence),
      }
    );

    if (updatedData) {
      return {
        status: "success",
        data: updatedData
      };
    } else {
      return null;
    }

  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }
}












// updateOneLottoGameForBet
export async function updateOneLottoGameForBet(
  {
    walletAddress,
    sequence,
    selectedNumber,
    betAmount
  } : {
    walletAddress: string,
    sequence: string,
    selectedNumber: string,
    betAmount: number
  }

) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('lottoGames');

  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {
    return {
      params : {
        walletAddress: walletAddress,
        sequence: sequence,
        selectedNumber: selectedNumber,
        betAmount: betAmount
      },
      status: "fail",
      message: "no data found"
    }
  }


  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }

  // update user gameMoneyBalance - betAmount
  const userCollection = client.db('dubai').collection('users');
  const userResult = await userCollection.updateOne(
    {
      walletAddress: walletAddress,
    },
    {
      $inc: {
        gameMoneyBalance: -betAmount,
      }
    }
  );
  if (!userResult) {
    return {
      status: "fail",
      message: "fail to update user gameMoneyBalance"
    };
  }

  



  interface LottoBet {
    walletAddress: string;
    selectedNumber: string;
    betAmount: number;
    createdAt: string;
  }

  const bets: LottoBet[] = findResult.bets || [];

  const totalBetAmount: number = bets.reduce((acc: number, bet: LottoBet) => acc + bet.betAmount, 0);

  bets.push({
    walletAddress: walletAddress,
    selectedNumber: selectedNumber,
    betAmount: betAmount,
    createdAt: new Date().toISOString(),
  });



  // push bets array if not exists
  // if exists, then update bets array
  // if bets array exists, then update bets array

  // update lotto game
  const result = await collection.updateOne(
    {
      sequence: parseInt(sequence),
    },
    {
      $set: {
        bets: bets,
        totalBetAmount: totalBetAmount,
        updatedAt: new Date().toISOString(),
      }
    }
  );


    


  if (!result) {
    return {
      status: "fail",
      message: "fail to update lotto game"
    };
  }



  if (result.modifiedCount > 0) {
    // find updated data
    const updatedData = await collection.findOne(
      {
        sequence: parseInt(sequence),
      }
    );

    if (updatedData) {
      return {
        status: "success",
        data: updatedData
      };
    } else {
      return null;
    }
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }
}



