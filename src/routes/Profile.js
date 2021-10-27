import { dbService, } from '../Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';
import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';

const Profile = ({userObj}) => {
  const [userNweets , setUserNweets] =useState([]);
  const [onFollow ,setOnFollow] = useState(false);
  const [followList, setFollowList] = useState([]);
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

  const follow = async()=> {
    const followBtn = document.getElementById('follow');
    const currentUserProfile =  dbService.collection('users').doc(userObj.uid);
    const getFollow = await currentUserProfile.get().then(
        doc => doc.data().following
      );
    if(onFollow === false){
      setOnFollow(true);
      getFollow.push(userProfile.creatorId)
      setFollowList(getFollow); //concat을 하면 id의 철자마다 배열에 저장됨 
      followBtn.textContent="following";
    }else if(onFollow === true){
      setOnFollow(false);
      setFollowList(followList.filter(array => array !== userProfile.creatorId));
      followBtn.textContent="follow";
    }
    
    currentUserProfile.update({
      following : followList
    });
  }


  return (
    <>
      <section>
        <ProfileTopForm  profile={userProfile}/>
        <button id="follow" onClick={follow}>btn</button>
        <div id="div"></div>
      </section>
      <sectoion >
        <ProfileBottomForm  
        nweets={userNweets} 
        userObj={userObj}
        /> 
      </sectoion> 
    </> 
  ) 
}

export default Profile