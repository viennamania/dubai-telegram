import { wallet } from '@/app/constants';
import clientPromise from '../mongodb';
import { create } from 'domain';


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

  gameMoneyBalance: number,

  storecode: string,

}

export interface ResultProps {
  totalCount: number;
  users: UserProps[];
}


export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));

  if (!data.walletAddress || !data.nickname || !data.mobile) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

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

  ///console.log('checkUser: ' + checkUser);


  if (checkUser) {
    return null;
  }


  // generate id 100000 ~ 999999

  const id = Math.floor(Math.random() * 900000) + 100000;


  const result = await collection.insertOne(

    {
      id: id,
      email: data.email,
      nickname: data.nickname,
      mobile: data.mobile,

      walletAddress: data.walletAddress,


      createdAt: new Date().toISOString(),

      settlementAmountOfFee: "0",
    }
  );


  if (result) {
    return {
      id: id,
      email: data.email,
      nickname: data.nickname,
      mobile: data.mobile,
    };
  } else {
    return null;
  }
  

}





export async function insertOneVerified(data: any) {


  if (!data.walletAddress || !data.nickname ) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

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
  const collection = client.db('dubai').collection('usersMangoBot');


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
  const collection = client.db('dubai').collection('usersMangoBot');


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
  const collection = client.db('dubai').collection('usersMangoBot');


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
  const collection = client.db('dubai').collection('usersMangoBot');

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

  const collection = client.db('dubai').collection('usersMangoBot');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { walletAddress: walletAddress },
  );


  //console.log('getOneByWalletAddress results: ' + results);

  return results;

}

// getOneByTelegramId
export async function getOneByTelegramId(
  telegramId: string,
): Promise<UserProps | null> {

  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  const collection = client.db('dubai').collection('usersMangoBot');

  const results = await collection.findOne<UserProps>(
    { telegramId: telegramId },
  );

  return results;

}




export async function getOneByNickname(
  nickname: string,
): Promise<UserProps | null> {

  const client = await clientPromise;

  const collection = client.db('dubai').collection('usersMangoBot');

  const results = await collection.findOne<UserProps>(
    { nickname: nickname },
  );

  return results;

}




export async function getOneByContractAddress(
  erc721ContractAddress: string,
): Promise<UserProps | null> {

  console.log('getOneByContractAddress erc721ContractAddress: ' + erc721ContractAddress);

  const client = await clientPromise;

  const collection = client.db('dubai').collection('usersMangoBot');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { erc721ContractAddress: erc721ContractAddress },
  );


  return results;

}


export async function getOneByTronWalletAddress(
  tronWalletAddress: string,
): Promise<UserProps | null> {

  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  const collection = client.db('dubai').collection('usersMangoBot');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { tronWalletAddress: tronWalletAddress },
  );


  //console.log('getOneByWalletAddress results: ' + results);

  return results;

}





export async function getAllUsers(
  {
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  console.log('limit: ' + limit);
  console.log('page: ' + page);




  // walletAddress is not empty and not null
  // order by nickname asc


  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null},
        verified: true,

        
        

      },
      {
        limit: limit,
        skip: page * limit,
      },
      
    )
    .sort({ nickname: 1 })
    .toArray();


  // user info
  // walletAddress, nickname, mobile, email, tronWalletAddress

  const resultUsers = users.map((user) => {
    return {
      walletAddress: user.walletAddress,
      nickname: user.nickname,
      mobile: user.mobile,
      email: user.email,
    };
  } );

  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      verified: true,
    }
  );

  return {
    totalCount,
    users: resultUsers,
  };

  
}





// get all users telegram id by center
export async function getAllUsersTelegramIdByCenter(
  {
    limit,
    page,
    center,
    searchNickname,
  }: {
    limit: number;
    page: number;
    center: string;
    searchNickname: string;
  }
): Promise<any> {

  if (!center) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');



  const users = await collection.aggregate([
    {
      $match: {
        center: center,
        telegramId: { $exists: true, $ne: '' },

        // errmsg: '$regex has to be a string',

        nickname: { $regex: searchNickname, $options: 'i' },

      

      }
    },
    {
      $lookup: {
        from: 'referrals',
        localField: 'telegramId',
        foreignField: 'telegramId',
        as: 'referral'
      }
    },
    {
      $project: {
        _id: 0,
        telegramId: 1,
        nickname: 1,
        walletAddress: 1,
        createdAt: 1,
        avatar: 1,
        center: 1,
        centerOwner: 1,

        referralCode: { $arrayElemAt: ['$referral.referralCode', 0] }
      }
    },
    {
      $limit: limit,
    },
    {
      $skip: page * limit,
    },
    // order by createdAt desc
    {
      $sort: { createdAt: -1 }
    }
  ]).toArray();



  return users;


}








// get all members by center excluding center owner
export async function getAllMembersByCenter(
  {
    limit = 100,
    page = 0,
    center,
  }: {
    limit: number;
    page: number;
    center: string;
  }
): Promise<any> {

  ///console.log('getAllMembersByCenter center: ' + center);

  if (!center) {
    return null;
  }

  //console.log('getAllMembersByCenter limit: ' + limit);
  //console.log('getAllMembersByCenter page: ' + page);


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');



  // center is not empty and not null

  // exclude center owner ( centerOwner is not exist or centerOwner is false )

  // when  centerOwner is exist and centerOwner is false
  // or centerOwner is not exist

  // telegramId is not empty and not null and not empty string

  const users = await collection
    .find<UserProps>(
      {
        center: center,

        telegramId: { $exists: true, $ne: '' },
        
        /*
        $or: [
          { centerOwner: { $exists: false } },

          { centerOwner: false }
        ],
        */
       
      },
      {
        limit: limit,
        skip: page * limit,
      }, 
    ).toArray();

    //console.log('getAllMembersByCenter users: ' + users);



    return users;

}




// getAllMembersByMarketingCenter
export async function getAllMembersByMarketingCenter(
  {
    limit = 100,
    page = 0,
    marketingCenter,
  }: {
    limit: number;
    page: number;
    marketingCenter: string;
  }
): Promise<any> {

  ///console.log('getAllMembersByCenter center: ' + center);

  if (!marketingCenter) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  // marketingCenter is prefix of center


  const users = await collection
    .find<UserProps>(
      {
        telegramId: { $exists: true, $ne: '' },
        center: { $regex: '^' + marketingCenter },
      },
      {
        limit: limit,
        skip: page * limit,
      }, 
    ).toArray();

    //console.log('getAllMembersByCenter users: ' + users);

    return users;

}






export async function getBestSellers(
  {
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {


        // seller is exist and seller status is 'confirmed'

        seller: { $exists: true },
        

      },
      {
        limit: limit,
        skip: page * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      seller: { $exists: true },
    }
  );

  return {
    totalCount,
    users,
  };

  
}










export async function getUserWalletPrivateKeyByWalletAddress(
  walletAddress: string,
): Promise<string | null> {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  const results = await collection.findOne<UserProps>(
    { walletAddress },
    { projection: { _id: 0, emailVerified: 0 } }
  ) as any;

  console.log('getUserWalletPrivateKeyByWalletAddress results: ' + results);

  if (results) {
    return results.walletPrivateKey;
  } else {
    return null;
  }

}


export async function getUserByEmail(
  email: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  return await collection.findOne<UserProps>(
    { email },
    { projection: { _id: 0, emailVerified: 0 } }
  );

}

// get user by telegramId
export async function getUserByTelegramId(
  telegramId: string,
): Promise<UserProps | null> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  return await collection.findOne<UserProps>(
    { telegramId },
  );

}


export async function checkUserByEmail(
  email: string,
  password: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  const results = await collection.findOne<UserProps>(
    {
      email,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  ///console.log('getUser results: ' + results);

  if (results) {
    return {
      ...results,
      ///bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }

}


export async function loginUserByEmail(
  email: string,
  password: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  const results = await collection.findOne<UserProps>(
    {
      email,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  if (results) {
    
    // user_login_sesson
    const sessionCollection = client.db('dubai').collection('user_login_sessions');
    const sessionResults = await sessionCollection.insertOne({
      id: results.id,
      email: results.email,
      loginedAt: new Date().toISOString(),
    });

    console.log('sessionResults: ' + sessionResults);

    return {
      ...results,
      ...sessionResults,
      ///bioMdx: await getMdxSource(results.bio || placeholderBio)
    }

  } else {
    return null;
  }


}









export async function searchUser(query: string): Promise<UserProps[]> {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  
  return await collection
    .aggregate<UserProps>([
      {
        $search: {
          index: 'name-index',
          /* 
          name-index is a search index as follows:

          {
            "mappings": {
              "fields": {
                "followers": {
                  "type": "number"
                },
                "name": {
                  "analyzer": "lucene.whitespace",
                  "searchAnalyzer": "lucene.whitespace",
                  "type": "string"
                },
                "username": {
                  "type": "string"
                }
              }
            }
          }

          */
          text: {
            query: query,
            path: {
              wildcard: '*' // match on both name and username
            },
            fuzzy: {},
            score: {
              // search ranking algorithm: multiply relevance score by the log1p of follower count
              function: {
                multiply: [
                  {
                    score: 'relevance'
                  },
                  {
                    log1p: {
                      path: {
                        value: 'followers'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        // filter out users that are not verified
        $match: {
          verified: true
        }
      },
      // limit to 10 results
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          emailVerified: 0,
          score: {
            $meta: 'searchScore'
          }
        }
      }
    ])
    .toArray();
}

export async function getUserCount(): Promise<number> {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');
  return await collection.countDocuments();
}



export async function updateUser(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  // check dupplicated nickname




  return await collection.updateOne({ username }, { $set: { bio } });
}




export async function checkUser(id: string, password: string): Promise<UserProps | null> {
  

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');
  const results = await collection.findOne<UserProps>(
    {
      id,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );
  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}



// get user 



export async function getAllUsersForSettlement(
  limit: number,
  page: number,
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {
        walletAddress: { $exists: true, $ne: null },
        walletPrivateKey: { $exists: true, $ne: null },

      },
      {
        limit: limit,
        skip: page * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      walletPrivateKey: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users,
  };

}




export async function getAllUsersForSettlementOfStore(
  limit: number,
  page: number,
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null },
        walletPrivateKey: { $exists: true, $ne: null },

        // when settlementAmountOfFee is exist, check settlementAmountOfFee is 0

        settlementAmountOfFee: {
          $exists: true,
          $eq: "0"
        }, 

      },
      {
        limit: limit,
        skip: page * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      walletPrivateKey: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users,
  };

}




// update settlementAmountOfFee for User collection
export async function updateSettlementAmountOfFee(
  walletAddress: string,
  settlementAmountOfFee: string,
) {

  console.log('updateSettlementAmountOfFee walletAddress: ' + walletAddress + ' settlementAmountOfFee: ' + settlementAmountOfFee);
  
  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        settlementAmountOfFee,
      }
    }
  );
  
  }

// getAllUsersForSettlementOfFee

export async function getAllUsersForSettlementOfFee(
  limit: number,
  page: number,
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null },
        walletPrivateKey: { $exists: true, $ne: null },

        // when settlementAmountOfFee is exist, check convert settlementAmountOfFee to float number and check settlementAmountOfFee is greater than 0

        settlementAmountOfFee: {
          $exists: true,
          $ne: "0"
        }, 

      },
      {
        limit: limit,
        skip: page * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      walletPrivateKey: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users,
  };

}


// setEscrowWalletAddressByWalletAddress
export async function setEscrowWalletAddressByWalletAddress(
  walletAddress: string,
  escrowWalletAddress: string,
  escrowWalletPrivateKey: string,
) {



  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        escrowWalletAddress,
        escrowWalletPrivateKey,
      }
    }
  );
  
}



// setTronWalletAddressByWalletAddress
export async function setTronWalletAddressByWalletAddress(
  walletAddress: string,
  tronWalletAddress: string,
  tronWalletPrivateKey: string,
) {



  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        tronWalletAddress,
        tronWalletPrivateKey,
      }
    }
  );
  
}



export async function setErc721ContractAddressByWalletAddress(
  walletAddress: string,
  erc721ContractAddress: string,
) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        walletAddress: walletAddress,
        erc721ContractAddress: erc721ContractAddress,
      }
    }
  );
  
}




export async function setMasterBotContractAddressByWalletAddress(
  walletAddress: string,
  masterBotContractAddress: string,
) {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        walletAddress: walletAddress,
        masterBotContractAddress: masterBotContractAddress,
      }
    }
  );
  
}









export async function getAllAgents(
  {
    limit = 100,
    page = 0,
  }: {
    limit: number;
    page: number;
  }
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null
  // order by nickname asc

  // where erc721ContractAddress is not empty and not null


    // exclude nickname is 'solongos'



  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null},
        verified: true,

        
        erc721ContractAddress: { $exists: true, $ne: null },
        
        // exclude nickname is 'solongos'
        nickname: { $ne: 'solongos' },

      },
      {
        limit: limit,
        skip: page * limit,
      },
      
    )
    .sort({ nickname: 1 })
    .toArray();


  // user info
  // walletAddress, nickname, mobile, email, tronWalletAddress

  const resultUsers = users.map((user) => {
    return {
      walletAddress: user.walletAddress,
      nickname: user.nickname,
      avatar: user.avatar,
      mobile: user.mobile,
      email: user.email,
      tronWalletAddress: user.tronWalletAddress,
      erc721ContractAddress: user.erc721ContractAddress,
    };
  } );

  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      verified: true,
      erc721ContractAddress: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users: resultUsers,
  };

  
}


// get all ercy721ContractAddress from users collection
export async function getAllErc721ContractAddresses(): Promise<string[]> {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  const results = await collection.distinct('erc721ContractAddress');

  return results;

}



// getAllCenters
// group by center
// 
export async function getAllCenters(
  {
    limit = 100,
    page = 0,
    marketingCenter = null,
  }: {
    limit: number;
    page: number;
    marketingCenter: string | null;
  }
): Promise<any> {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');


  // if marketingCenter is not null,
  // marketingCenter is "ppump", "owin", "exms"
  // then center is "ppump_xxxx", "owin_xxxx", "exms_xxxx"

  

  // select center, count(*) as count from users group by center
  // check center is not empty and not null and telegramId is not empty and not null

  const centers = await collection
    .aggregate([
      {
        $match: {
          center: { $exists: true, $ne: null },
          telegramId: { $exists: true, $ne: '' },
        }
      },
      {
        $group: {
          _id: '$center',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: limit,
      },
      {
        $skip: page * limit,
      }
    ])
    .toArray();

    // filter by marketingCenter

    if (marketingCenter) {
      return centers.filter((center) => center._id.startsWith(marketingCenter));
    } else {
      return centers;
    }

}



// getCenterOwnerByCenter
export async function getCenterOwnerByCenter(
  center: string,
): Promise<UserProps | null> {

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.findOne<UserProps>(
    { center: center, centerOwner: true },
  );

}





/*
        "seller": {
            "status": "confirmed",
            "bankInfo": {
            "bankName": "하나은행",
            "accountNumber": "01234567890",
            "accountHolder": "강하나"
            }
        },
*/
// updateSeller
export async function updateSeller({
  walletAddress,
  seller,
  virtualAccount,
  sntVirtualAccount,
}: {
  walletAddress: string;
  seller: any;
  virtualAccount: string;
  sntVirtualAccount: string;
}) {

  console.log('updateSeller walletAddress: ' + walletAddress + ' seller: ' + JSON.stringify(seller));

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        seller,
        virtualAccount,
        sntVirtualAccount,
      }
    }
  );
  
}



// updateCenterByTelegramId
export async function updateCenterByTelegramId({
  telegramId,
  center,
}: {
  telegramId: string;
  center: string;
}) {

  console.log('updateCenterByTelegramId telegramId: ' + telegramId + ' center: ' + center);

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');

  return await collection.updateOne(
    { telegramId },
    {
      $set: {
        center,
      }
    }
  );
  
}





// updateOneGameMoney


export async function updateOneGameMoney(data: any) {





  if (!data.walletAddress || !data.addGameMoney) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');



  // if gameMoneyBalance is not exist, then gameMoneyBalance is addGameMoney
  // if gameMoneyBalance is exit. then gameMoneyBalance is plus addGameMoney

  /*
  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { gameMoneyBalance: { $add: [data.addGameMoney, "$gameMoneyBalance"] } } }
  );
  */


  // if gameMoneyBalance is not exist, then gameMoneyBalance is 0 + addGameMoney
  /*
  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { gameMoneyBalance: { $add: [data.addGameMoney, { $ifNull: ["$gameMoneyBalance", 0] }] } } }
  );


  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return {
      gameMoneyBalance: updated?.gameMoneyBalance
    }
  } else {
    return null;
  }
    */



  // check gameMoneyBalance is exist or not
  const checkUser = await collection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
  );
  if (checkUser) {
    // if gameMoneyBalance is not exist, then gameMoneyBalance is 0 + addGameMoney
    if (!checkUser.gameMoneyBalance) {
      const result = await collection.updateOne(
        { walletAddress: data.walletAddress },
        { $set: { gameMoneyBalance: data.addGameMoney } }
      );
      if (result) {
        const updated = await collection.findOne<UserProps>(
          { walletAddress: data.walletAddress },
        );

        return {
          gameMoneyBalance: updated?.gameMoneyBalance
        }
      }
    } else {
      // if gameMoneyBalance is exist, then gameMoneyBalance is plus addGameMoney
      const result = await collection.updateOne(
        { walletAddress: data.walletAddress },
        { $set: { gameMoneyBalance: checkUser.gameMoneyBalance + data.addGameMoney } }
      );
      if (result) {
        const updated = await collection.findOne<UserProps>(
          { walletAddress: data.walletAddress },
        );

        return {
          gameMoneyBalance: updated?.gameMoneyBalance
        }
      }
    }
  } else {
    return null;
  }

  return null;
  

}


// updateOneGameMoneyMinus
export async function updateOneGameMoneyMinus(data: any) {
  if (!data.walletAddress || !data.minusGameMoney) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');
  // check gameMoneyBalance is exist or not
  const checkUser = await collection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
  );
  if (checkUser) {
    // if gameMoneyBalance is not exist, then gameMoneyBalance is 0 - minusGameMoney
    if (!checkUser.gameMoneyBalance) {
      
      return null; // cannot minus game money if gameMoneyBalance is not exist
    } else {

      // if gameMoneyBalance is exist, then gameMoneyBalance is minus minusGameMoney
      const result = await collection.updateOne(
        { walletAddress: data.walletAddress },
        { $set: { gameMoneyBalance: checkUser.gameMoneyBalance - data.minusGameMoney } }
      );
      if (result) {
        const updated = await collection.findOne<UserProps>(
          { walletAddress: data.walletAddress },
        );

        return {
          gameMoneyBalance: updated?.gameMoneyBalance
        }
      }
    }

  } else {
    return null;
  }

  return null;
}






// updateStorecode
export async function updateStorecode(data: any) {

  if (!data.walletAddress || !data.storecode) {
    return null;
  }
  const client = await clientPromise;
  const collection = client.db('dubai').collection('usersMangoBot');
  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { storecode: data.storecode } }
  );
  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return {
      storecode: updated?.storecode
    }
  }
  return null;
}


