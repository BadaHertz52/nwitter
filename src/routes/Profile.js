import Nweet from '../components/Nweet';
import authSerVice, { dbService, } from '../Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';
import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';

const Profile = ({userObj}) => {
  const [userNweets , setUserNweets] =useState([]);
  const history = useHistory().location.state;
  const userProfile =history.userProfile;
  const getUserNweets = async()=>{
    const nweets = await dbService
      .collection(`nweets_${userProfile.creatorId}`)
      .get();
    const UserNweets = nweets.docs.map(doc => doc.data())  ;
    setUserNweets(UserNweets);
  };
  useEffect( ()=> {
    getUserNweets();
  },[]);
  console.log(userNweets);
  const onFollow = ()=> {

    // dbService.collection('users').doc(currentUserUid).update({
    //   following: ...following.push[userProfile.creatorId]
    // })
  }
  return (
    <>
      <section>
        <ProfileTopForm  profile={userProfile}/>
        <button onClick={onFollow}>follow</button>
      </section>
      <sectoion >
        <ProfileBottomForm  
        nweets={userNweets} 
        userObj={userObj}
        /> 
        {/* {userNweets.map(nweet => <Nweet  nweetObj ={nweet}   />  )} */}
      </sectoion> 
    </> 
  ) 
}

export default Profile