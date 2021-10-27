import Nweet from '../components/Nweet';
import authSerVice, { dbService, } from '../Fbase';
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
  const onFollow = ()=> {

    // dbService.collection('users').doc(currentUserUid).update({
    //   following: ...following.push[userProfile.creatorId]
    // })
  }
  return (
    <>
      <section>
        <img src={userProfile.photoUrl}  
            width="80px" height="80px"    alt="profile"/>
        <span>{userProfile.userName}</span>
        <div>following : {userProfile.following ===[] ? 0 :userProfile.following.length }</div>
        <div>follower :{userProfile.follower ===[]? 0 :userProfile.follower.length  }</div>
        <button onClick={onFollow}>follow</button>
      </section>
      <sectoion >
        {userNweets.map(nweet => <Nweet  nweetObj ={nweet}   />  )}
      </sectoion>
    </> 
  ) 
}

export default Profile