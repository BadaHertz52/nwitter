import React, { useContext, useEffect, useState } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';

import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';
import { dbService } from '../Fbase';
import { useLocation } from 'react-router';
import { UserContext } from '../context/UserContext';

const Profile = ({userobj}) => {
  const location =useLocation();
  const state =location.state;
  const {myProfile, profileDispatch} =useContext(ProfileContext);
  const [userProfile, setUserProfile]=useState({
    uid:"",
    following:[],
    follower:[],
    notifications:[]
  });
  const [userNweets, setUserNweets]=useState([]);
  const {userDispatch}=useContext(UserContext);
  const myFollowingList =myProfile!==undefined? myProfile.following:[];
  const [onFollow ,setOnFollow] = useState({following:false , text:"Follow"});
  const followBtn =document.getElementById('profile_followBtn');

  const changeFollowBtn = ()=>{
    myFollowingList.includes(userProfile.uid) ? 
    setOnFollow({
      following: true , text : "Following"
    }) :
    setOnFollow({
      following: false , text : "Follow"
    });
  }

  const follow = ()=> {
    if(!onFollow.following ){
      //follow 
      profileDispatch({
        type:"FOLLOWING",
        id:userProfile.uid,
        userNotifications:userProfile.notifications,
        userFollower:userProfile.follower.concat(userobj.uid),
        following: myFollowingList.concat(userProfile.uid)
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
      setOnFollow({
        following: false , text : "Follow"
      });
    }

  }

  useEffect(()=>{ 
    if(state !==null){
      const updateUserProfile =async()=>{
        const profile =state.userProfile;
        const getDocs = await  dbService
        .collection(`nweets_${profile.uid}`).get();
        const nweets =getDocs
        .docs.map(doc =>({ id:doc.id ,...doc.data()}));    
        setUserProfile(profile);
        setUserNweets(nweets);
        userDispatch({
          type:'GET_USER_DATA',
          userProfile:profile,
          userNweets:nweets
        })
        sessionStorage.setItem('userProfile', JSON.stringify(profile));
        sessionStorage.setItem('userNweets', JSON.stringify(nweets));
      };
      updateUserProfile();
    }
    if(sessionStorage.getItem('userProfile')){
      const profile = JSON.parse(sessionStorage.getItem('userProfile')) ;
      const nweets = JSON.parse(sessionStorage.getItem('userNweets')) ;
      setUserProfile(profile);
      setUserNweets(nweets);
    }
  },[]);

  useEffect(()=>{
    myFollowingList[0]!== undefined && changeFollowBtn();
    if(followBtn !==null){
      userProfile!== undefined ?
    followBtn.style.disable=false:
    followBtn.style.disable=true;
    }
    
  },[userProfile])


  return (
    <>
    {(userProfile===undefined|| userNweets===undefined)?
      <Loading/>
    :
    <>
      <section>
        <ProfileTopForm isMine={false} profile={userProfile} nweets={userNweets} />
        <button id='profile_followBtn' onClick={follow} >
          {onFollow.text}
        </button>
      </section>
      <section >
        <ProfileBottomForm  isMine={false} userobj={userobj} nweets={userNweets}/> 
      </section> 
    </>
    }
      
    </> 
  ) 
}

export default Profile