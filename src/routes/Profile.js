import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';
import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import { getNweets, getProfileDoc, toggleCalling } from '../components/GetData';

const Profile = ({userObj}) => {
  const [userNweets , setUserNweets] =useState([]);
  const [calling, setCalling] =useState(true);
  const [onFollow ,setOnFollow] = useState(false);
  const [followList, setFollowList] = useState([]);
  const [follower , setFollower]=useState([]);
  const historyUserProfile = useHistory().location.state.userProfile;
  const currentUserProfile =getProfileDoc(userObj.uid);
  const userProfile =getProfileDoc(historyUserProfile.creatorId) ;
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
    doc => setFollower(doc.data().follower) 
  );
};

  const getUserNweets =()=> {
    getNweets (historyUserProfile.creatorId ,setUserNweets) ; 
    setCalling(false);
    toggleCalling(calling);
  }

  useEffect( ()=> {
    getUserNweets();
    getFollowList();
    getUserFollower();
  },[]);

  const follow = (e)=> {
    e.preventDefault();
    if(onFollow === false){
      followList.push(historyUserProfile.creatorId); 
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
        <div className ="nweets_calling">
          데이터를 불러오는 중입니다.
        </div>
        <ProfileBottomForm  
        nweets={userNweets} 
        userObj={userObj}
        /> 
      </sectoion> 
    </> 
  ) 
}

export default Profile