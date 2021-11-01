import { dbService, } from '../Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';
import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';

const Profile = ({userObj}) => {
  const [userNweets , setUserNweets] =useState([]);
  const [onFollow ,setOnFollow] = useState(false);
  const [followList, setFollowList] = useState([]);
  const [follower , setFollower]=useState([]);
  const historyUserProfile = useHistory().location.state.userProfile;
  const currentUserProfile =  dbService.collection('users').doc(userObj.uid);
  const userProfile = dbService.collection('users').doc(historyUserProfile.creatorId);
  const followBtn = document.getElementById('follow');

  const ChangeFollowBtn = ()=>{
    followList.includes(historyUserProfile.creatorId) ? setOnFollow(true) : setOnFollow(false);
    if(followBtn){
      onFollow === true ? followBtn.textContent ="팔로우중" : followBtn.textContent="팔로우하기";
    }
    
  };
  const getFollowList = async()=>{
      await currentUserProfile.get().then(
        doc => setFollowList(doc.data().following) 
      );
      ChangeFollowBtn();
  };
  const getUserFollower = async()=>{ 
    await userProfile.get().then(
    doc => setFollower(doc.data().following) 
  );
};
  const getUserNweets = async()=>{
    const nweets = await dbService
      .collection(`nweets_${historyUserProfile.creatorId}`)
      .get();
    const UserNweets = nweets.docs.map(doc => doc.data())  ;
    setUserNweets(UserNweets);
  };
  useEffect( ()=> {
    getUserNweets();
    getFollowList();
    getUserFollower();
  },[]);

  const follow = (e)=> {
    e.preventDefault();
    if(onFollow === false){
      followList.push(historyUserProfile.creatorId); //concat을 하면 id의 철자마다 배열에 저장됨 
      setFollowList(followList);
      follower.push(userObj.uid);
      setFollower(follower);
      
    }else if(onFollow === true){
      setFollowList(list =>list.filter(user => user !== historyUserProfile.creatorId) );
      setFollower(list =>list.filter(user => user !== userObj.uid)  );
    }; 
    ChangeFollowBtn();
    currentUserProfile.update({
      following : followList
    });
    userProfile.update({
      follower: follower
    });

  }

  return (
    <>
      <section>
        <ProfileTopForm  profile={historyUserProfile} follower={follower}/>
        <button id="follow"  onClick={follow}>btn</button>
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