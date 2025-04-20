import { wallet } from '@/app/constants';
import clientPromise from '../mongodb';


export interface UserProps {
  /*
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
  bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  followers: number;
  verified: boolean;
  */

  id: string,
  name: string,
  nickname: string,
  email: string,
  avatar: string,
  regType: string,
  mobile: string,
  gender: string,
  weight: number,
  height: number,
  birthDate: string,
  purpose: string,
  marketingAgree: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  loginedAt: string,
  followers : number,
  emailVerified: boolean,
  bio: string,

  password: string,

  walletAddress: string,

  escrowWalletAddress: string,
  escrowWalletPrivateKey: string,

  tronWalletAddress: string,
  tronWalletPrivateKey: string,

  erc721ContractAddress: string,

  center: string,
  centerOwner: boolean,
  telegramId: string,
  referralCode: string,
}

export interface ResultProps {
  totalCount: number;
  users: UserProps[];
}




export async function insertOne(data: any) {

  if (!data.telegramId || !data.referralCode) {
    return null;
  }



  const client = await clientPromise;


  if (data.center === 'owin_eagle_bot'
    || data.center === 'we_gogo_bot'
  ) {

    const collection = client.db('dubai').collection('referrals_center');

    // check duplicat telegramId, center
    const checkTelegramId = await collection.findOne<UserProps>(
      {
        telegramId: data.telegramId,
        center: data.center,
      }
    );

    if (checkTelegramId) {

      return {
        telegramId: data.telegramId,
        center: data.center,
        referralCode: data.referralCode,
      }
      //return null;
    }

    // insert and return inserted user

    const result = await collection.insertOne(
      {
        telegramId: data.telegramId,
        center: data.center,
        referralCode: data.referralCode,
      }
    );

    if (result) {
      return {
        telegramId: data.telegramId,
        center: data.center,
        referralCode: data.referralCode,
      };
    } else {
      return null
    }

  } else {

    const collection = client.db('dubai').collection('referrals');

    // check duplicat telegramId
    const checkTelegramId = await collection.findOne<UserProps>(
      { telegramId: data.telegramId }
    );

    if (checkTelegramId) {
      return null;
    }

    // insert and return inserted user

    const result = await collection.insertOne(
      {
        telegramId: data.telegramId,
        referralCode: data.referralCode,
      }
    );

    if (result) {
      return {
        telegramId: data.telegramId,
        referralCode: data.referralCode,
      };
    } else {
      return null;
    }

  }

}





export async function insertOneVerified(data: any) {


  if (!data.walletAddress || !data.nickname ) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');

  // check same walletAddress or smae nickname

  const checkUser = await collection.findOne<UserProps>(
    {
      $or: [
        { walletAddress: data.walletAddress },
        { nickname: data.nickname },
      ]
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  console.log('checkUser: ' + checkUser);


  if (checkUser) {
    return null;
  }


  // generate id 100000 ~ 999999

  const id = Math.floor(Math.random() * 900000) + 100000;


  const result = await collection.insertOne(

    {
      id: id,
      nickname: data.nickname,
      userType: data.userType,
      mobile: data.mobile,
      telegramId: data.telegramId,
      email: data.email,
      center: data.center,


      walletAddress: data.walletAddress,


      createdAt: new Date().toISOString(),

      settlementAmountOfFee: "0",

      verified: true,
    }
  );


  if (result) {
    return {
      id: id,
      nickname: data.nickname,
      userType: data.userType,
      mobile: data.mobile,
      telegramId: data.telegramId,
      email: data.email,
    };
  } else {
    return null;
  }
  

}








export async function updateOne(data: any) {





  if (!data.walletAddress || !data.nickname) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');


  // update and return updated user

  const checkUser = await collection.findOne<UserProps>(
    
    { nickname: data.nickname }
    
  )
      


  if (checkUser) {
    return null;
  }





  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { nickname: data.nickname } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return updated;
  } else {
    return null;
  }

}


export async function updateAvatar(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');


  // update and return updated user

  if (!data.walletAddress || !data.avatar) {
    return null;
  }


  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { avatar: data.avatar } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
      { projection: { _id: 0, emailVerified: 0 } }
    );

    return updated;
  } else {
    return null;
  }


}



export async function updateSellerStatus(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');


  // update and return updated user

  if (!data.walletAddress || !data.sellerStatus || !data.bankName || !data.accountNumber || !data.accountHolder) {
    return null;
  }

  const seller = {
    status: data.sellerStatus,
    bankInfo: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
    }
  };
  


  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { seller: seller } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
      { projection: { _id: 0, emailVerified: 0 } }
    );

    return updated;
  } else {
    return null;
  }


}




export async function updateTelegramId(data: any) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');

  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { telegramId: data.telegramId } }
  );

  return result;
}




export async function getOneByWalletAddress(
  walletAddress: string,
): Promise<UserProps | null> {

  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  const collection = client.db('dubai').collection('referrals');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { walletAddress: walletAddress },
  );


  //console.log('getOneByWalletAddress results: ' + results);

  return results;

}





// getReferralCodeByTelegramId
export async function getReferralCodeByTelegramId(
  telegramId: string,
) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');

  const results = await collection.findOne<any>(
    { telegramId: telegramId },
  );

  if (results) {
    return results.referralCode;
  } else {
    return null;
  }

}


// getOneByTelegramId
export async function getOneByTelegramId(
  telegramId: string,
  center: string,
): Promise<UserProps | null> {
  
  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  if (center === 'owin_eagle_bot'
    || center === 'we_gogo_bot'
  ) {

    const collection = client.db('dubai').collection('referrals_center');

    const results = await collection.findOne<UserProps>(
      {
        telegramId: telegramId,
        center: center,
      },
    );

    return results;



  } else {
    const collection = client.db('dubai').collection('referrals');

    const results = await collection.findOne<UserProps>(
      { telegramId: telegramId },
    );

    return results;
  }


}


// getOneByReferralCode
export async function getOneByReferralCode(
  referralCode: string,
  center: string,
): Promise<UserProps | null> {

  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  if (center === 'owin_eagle_bot'
    || center === 'we_gogo_bot'
  ) {

    const collection = client.db('dubai').collection('referrals_center');

    const results = await collection.findOne<UserProps>(
      {
        referralCode: referralCode,
        center: center,
      },
    );

    return results;

  } else {
    const collection = client.db('dubai').collection('referrals');

    const results = await collection.findOne<UserProps>(
      { referralCode: referralCode },
    );

    return results;
  }

}
 


// getReferredMembers
// join user telegramId, referrals telegramId
export async function getReferredMembers(
  referralCode: string,
): Promise<any> {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('referrals');

  // join user telegramId, referrals telegramId

  const results = await collection.aggregate<any>([
    {
      $match: { referralCode: referralCode }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'telegramId',
        foreignField: 'telegramId',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 0,
        referralCode: 1,
        telegramId: 1,
        user: {
          id: 1,
          nickname: 1,
          email: 1,
          avatar: 1,
          center: 1,
          walletAddress: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
          loginedAt: 1,
          followers: 1,
          emailVerified: 1,
          bio: 1,
        }
      }
    }
  ]).toArray();

  return results;
}




// getReferredMembersByCenter
// join user telegramId, referrals telegramId

export async function getReferredMembersByCenter(
  referralCode: string,
  center: string,
): Promise<any> {

  const client = await clientPromise;

  if (center === 'owin_eagle_bot'
    || center === 'we_gogo_bot'
  ) {

    const collection = client.db('dubai').collection('referrals_center');

    // join user telegramId, referrals telegramId

    const results = await collection.aggregate<any>([
      {
        $match: { referralCode: referralCode, center: center }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'telegramId',
          foreignField: 'telegramId',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          referralCode: 1,
          telegramId: 1,
          user: {
            id: 1,
            nickname: 1,
            email: 1,
            avatar: 1,
            center: 1,
            walletAddress: 1,
            createdAt: 1,
            updatedAt: 1,
            deletedAt: 1,
            loginedAt: 1,
            followers: 1,
            emailVerified: 1,
            bio: 1,
          }
        }
      }
    ]).toArray();

    return results;

  } else {
    const collection = client.db('dubai').collection('referrals');

    // join user telegramId, referrals telegramId

    const results = await collection.aggregate<any>([
      {
        $match: { referralCode: referralCode }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'telegramId',
          foreignField: 'telegramId',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          referralCode: 1,
          telegramId: 1,
          user: {
            id: 1,
            nickname: 1,
            email: 1,
            avatar: 1,
            center: 1,
            walletAddress: 1,
            createdAt: 1,
            updatedAt: 1,
            deletedAt: 1,
            loginedAt: 1,
            followers: 1,
            emailVerified: 1,
            bio: 1,
          }
        }
      }
    ]).toArray();


    return results;

  }

}








/*/
masterWalletAddress, masterAmount
agentWalletAddress, agentAmount);
centerWalletAddress, centerAmount);
*/
/*
referral_rewards collection
*/

// daily rewards


export async function insertReferralRewards(data: any) {

  if (!data.masterWalletAddress || !data.agentWalletAddress || !data.centerWalletAddress) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('dubai').collection('referral_rewards');


  // collection for check duplicat date day

  const collectionDay = client.db('dubai').collection('referral_rewards_day');

  // check duplicat date day and masterWalletAddress

  const checkDate = await collectionDay.findOne<any>(
    {
      createdAtDay: new Date().toISOString().slice(0, 10),
      masterWalletAddress: data.masterWalletAddress,
    }
  );

  if (checkDate) {
    return null;
  }






  // insert and return inserted user

  const result = await collection.insertOne(
    {
      walletAddress: data.masterWalletAddress,
      amount: data.masterAmount,
      category: "master",
      createdAt: new Date().toISOString(),
    }
  );

  const result2 = await collection.insertOne(
    {
      walletAddress: data.agentWalletAddress,
      amount: data.agentAmount,
      category: "agent",
      createdAt: new Date().toISOString(),
    }
  );

  const result3 = await collection.insertOne(
    {
      walletAddress: data.centerWalletAddress,
      amount: data.centerAmount,
      category: "center",
      createdAt: new Date().toISOString(),
    }
  );

  if (result && result2 && result3) {



    // insert day

    const resultDay = await collectionDay.insertOne(
      {
        createdAtDay: new Date().toISOString().slice(0, 10),
        masterWalletAddress: data.masterWalletAddress,
      }
    );



    return {

      masterWalletAddress: data.masterWalletAddress,
      masterAmount: data.masterAmount,

      agentWalletAddress: data.agentWalletAddress,
      agentAmount: data.agentAmount,

      centerWalletAddress: data.centerWalletAddress,
      centerAmount: data.centerAmount,

    };
  } else {
    return null;
  }

}




// getRewardsByWalletAddress
// order by createdAt desc

export async function getRewardsByWalletAddress(
  walletAddress: string,
): Promise<any> {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('referral_rewards');

  const results = await collection.find<UserProps>(
    { walletAddress: walletAddress },
  )
  .sort({ createdAt: -1 })
  .toArray();

  return {
    totalCount: results.length,
    rewards: results,
  };
}