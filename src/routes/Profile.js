import React, { useContext, useEffect, useState } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import '../asset/profile.css';
import { ProfileContext } from '../context/ProfileContex';
import { UserContext } from '../context/UserContext';

const Profile = ({userobj}) => {
  const {myProfile, profileDispatch} =useContext(ProfileContext);
  const {userDispatch, userProfile} =useContext(UserContext);
  const myFollowingList =myProfile!==undefined? myProfile.following:[];
  const [calling, setCalling] =useState(true);
  const [onFollow ,setOnFollow] = useState({following:false , text:"Follow"});

  const changeFollowBtn = ()=>{
    myFollowingList.includes(userProfile.uid) ? setOnFollow({
      following: true , text : "Following"
    }) :
    setOnFollow({
      following: false , text : "Follow"
    });
  }
  const editProfile =()=>{
    if(!onFollow.following ){
      //follow 
      profileDispatch({
        type:"FOLLOWING",
        id:userProfile.uid,
        userNotifications:userProfile.notifications,
        userFollower:userProfile.follower.concat(userobj.uid),
        following: myFollowingList.concat(userProfile.uid)
      });
      
      userDispatch({
        type:"UPDATE_USERS_DATA",
        newFollower: userProfile.follower.concat(userobj.uid) 
      });
      setOnFollow({
        following: true , text : "Following"
      }) 
    }else {
      //unFollow
      profileDispatch({
        type:"UNFOLLOWING",
        id:userProfile.uid,
        userNotifications: userProfile.notifications.filter(n=> 
          n.value !=="following" || 
          n.user !== userobj.uid || 
          n.docId !== null),
        userFollower :userProfile.follower.filter(f=> f !== userobj.uid),
        following: myFollowingList.filter( f=> f!== userProfile.uid)
      });
    const unFollow_Follower = userProfile.follower.filter(f=> f!==userobj.uid); 
      userDispatch({
        type:"UPDATE_USERS_DATA",
        newFollower: unFollow_Follower
      });
      setOnFollow({
        following: false , text : "Follow"
      });
    }

  };

  const follow = async(e)=> {
    e.preventDefault();
    editProfile();
  }

  useEffect(()=>{
    setCalling(false);
    myFollowingList[0]!== undefined && changeFollowBtn();
  },[]);

  
  return (
    <>
      <section>
        <ProfileTopForm isMine={false}  />
        <button id='profile_followBtn' onClick={follow} 
       >{onFollow.text}</button>
      </section>
      <section >
        {calling && <div className ="nweets_calling">
          데이터를 불러오는 중입니다.
        </div>  }
        <ProfileBottomForm  isMine={false} userobj={userobj}
        /> 
      </section> 
    </> 
  ) 
}

export default Profile