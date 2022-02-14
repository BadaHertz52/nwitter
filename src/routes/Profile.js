import React, { useContext, useEffect, useState } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import {profileForm} from '../components/GetData';
import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';
import { UserContext } from '../context/UserContext';


const Profile = ({userobj}) => {
  const {myProfile, profileDispatch} =useContext(ProfileContext);
  const {userDispatch ,userProfile ,userTweets}=useContext(UserContext);
  const [profile, setProfile]=useState(profileForm);
  const myFollowingList =myProfile!==undefined? myProfile.following:[];
  const [onFollow ,setOnFollow] = useState({following:false , text:"Follow"});
  const followBtn =document.getElementById('profile_followBtn');

  const changeFollowBtn = ()=>{
    myFollowingList.includes(profile.uid) ? 
    setOnFollow({
      following: true , text : "Following"
    }) :
    setOnFollow({
      following: false , text : "Follow"
    });
  }

  const follow = (event)=> {
    event.preventDefault();
    if(!onFollow.following ){
      //follow 
      profileDispatch({
        type:"FOLLOWING",
        id:profile.uid,
        userNotifications:profile.notifications,
        userFollower:profile.follower.concat(userobj.uid),
        following: myFollowingList.concat(profile.uid)
      });
      
      userDispatch({
        type:"UPDATE_USERS_DATA",
        newFollower:[userobj.uid].concat(profile.follower)
      });

      setOnFollow({
        following: true , text : "Following"
      }) 
    }else {
      //unFollow
      profileDispatch({
        type:"UNFOLLOWING",
        id:profile.uid,
        userNotifications: profile.notifications.filter(n=> 
          n.value !=="following" || 
          n.user !== userobj.uid || 
          n.docId !== null),
        userFollower :profile.follower.filter(f=> f !== userobj.uid),
        following: myFollowingList.filter( f=> f!== profile.uid)
      });
      setOnFollow({
        following: false , text : "Follow"
      });
      userDispatch({
        type:"UPDATE_USERS_DATA",
        newFollower:profile.follower.filter(f=> f!==userobj.uid)
      })
    }

  }

  useEffect(()=>{
    myFollowingList[0]!== undefined && changeFollowBtn();
    userProfile !==null && setProfile(userProfile);
    if(followBtn !==null){
      userProfile!== undefined ?
    followBtn.style.disable=false:
    followBtn.style.disable=true;
    }
    
  },[userProfile])


  return (
    <>
    {(profile.uid==="")?
      <Loading/>
    :
    <>
      <section>
        <ProfileTopForm isMine={false} profile={profile} tweets={userTweets} />
        <button id='profile_followBtn' onClick={follow} >
          {onFollow.text}
        </button>
      </section>
      <section >
        <ProfileBottomForm  isMine={false} userobj={userobj} tweets={userTweets}/> 
      </section> 
    </>
    }
      
    </> 
  ) 
}

export default Profile