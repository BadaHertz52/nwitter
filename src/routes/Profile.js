import React, { useContext, useEffect, useState } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';

import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';
import { dbService } from '../Fbase';
import { useLocation } from 'react-router';
import { UserContext } from '../context/UserContext';
import { getNweetsDocs, getProfileDoc } from '../components/GetData';

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
      
      userDispatch({
        type:"UPDATE_USERS_DATA",
        newFollower:[userobj.uid].concat(userProfile.follower)
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
      userDispatch({
        type:"UPDATE_USERS_DATA",
        newFollower:userProfile.follower.filter(f=> f!==userobj.uid)
      })
    }

  }

  useEffect(()=>{ 
    if(state !==null){
      const updateUserProfile =async()=>{
        const userUid =state.userUid;
        const nweets =await getNweetsDocs(userUid).then(
          result =>{
            const docs =result.docs;
            const array= docs.map(doc =>({ id:doc.id ,...doc.data()}))
            return array
          }); 
        const profile = await getProfileDoc(userUid).get().then(doc=> doc.data());
        console.log(profile, nweets)
        setUserProfile(profile);
        setUserNweets(nweets);
        userDispatch({
          type:'GET_USER_DATA',
          userProfile:profile,
          userNweets:nweets
        })
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

    sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
    sessionStorage.setItem('userNweets', JSON.stringify(userNweets));

    if(followBtn !==null){
      userProfile!== undefined ?
    followBtn.style.disable=false:
    followBtn.style.disable=true;
    }
    
  },[userProfile])


  return (
    <>
    {(state!== null && state.userProfile !==undefined)?
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