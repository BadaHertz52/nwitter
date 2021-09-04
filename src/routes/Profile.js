import Nweet from 'components/Nweet';
import { dbService, } from 'Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';

const Profile = ( ) => {
  const [userNweets , setUserNweets] =useState([]);
  const history = useHistory().location.state;
  const userProfile =history.userProfile;
  const getUserNweets = async()=>{
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId" ,"==",userProfile.creatorId)
      .get()
    const UserNweets = nweets.docs.map(doc => doc.data())  ;
    setUserNweets(UserNweets);
  };
  useEffect( ()=> {
    getUserNweets();
  },[]);

  return (
    <>
      <section>
        <img src={userProfile.photoUrl}  
            width="80px" height="80px"    alt="profile"/>
          <span>{userProfile.userName}</span>
      </section>
      <sectoion >
        {userNweets.map(nweet => <Nweet  nweetObj ={nweet}   />  )}
      </sectoion>
    </> 
  ) 
}

export default Profile