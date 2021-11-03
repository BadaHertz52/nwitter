import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';
import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import { getNweets, getProfileDoc} from '../components/GetData';

const Profile = ({userObj}) => {
  const [userNweets , setUserNweets] =useState([]);
  const [calling, setCalling] =useState(true);
  const [onFollow ,setOnFollow] = useState({});
  const [followList, setFollowList] = useState([]);
  const historyUserProfile = useHistory().location.state.userProfile;
  const [follower , setFollower]=useState(historyUserProfile.follower);
  const currentUserProfile =getProfileDoc(userObj.uid);
  const userProfile =getProfileDoc(historyUserProfile.creatorId) ;

  const changeFollowBtn = ()=>{
    followList.includes(historyUserProfile.creatorId) ? setOnFollow({
      follow: true , text : "팔로우 중"
    }) :
    setOnFollow({
      follow: false , text : "팔로우 하기"
    });
  };
  const getFollowList = async()=>{
      await currentUserProfile.get().then(
        doc => setFollowList(doc.data().following) 
      );
      changeFollowBtn();
  };
  const getUserFollower = async()=>{ 
    await userProfile.get().then(
    doc => setFollower(doc.data().follower) 
  );
};

  const getUserNweets = ()=> {
    getNweets (historyUserProfile.creatorId ,setUserNweets) ; 
    setCalling(false);
  }

  useEffect( ()=> {
    getUserNweets();
    getFollowList();
    getUserFollower();
  },[]);

  const follow = (e)=> {
    e.preventDefault();
    if(onFollow.follow === false){
      followList.unshift(historyUserProfile.creatorId); 
      setFollowList(followList);
      follower.unshift(userObj.uid);
      setFollower(follower);
      
    }else if(onFollow.follow === true){
      setFollowList(list =>list.filter(user => user !== historyUserProfile.creatorId) );
      setFollower(list =>list.filter(user => user !== userObj.uid)  );
    }; 
    currentUserProfile.update({
      following : followList
    });
    userProfile.update({
      follower: follower
    });
    changeFollowBtn();
  }

  return (
    <>
      <section>
        <ProfileTopForm  profile={historyUserProfile} follower={follower} />
        <button  onClick={follow}>{onFollow.text}</button>
        <div id="div"></div>
      </section>
      <sectoion >
        {calling && <div className ="nweets_calling">
          데이터를 불러오는 중입니다.
        </div>  }
        <ProfileBottomForm  
        nweets={userNweets} 
        userObj={userObj}
        /> 
      </sectoion> 
    </> 
  ) 
}

export default Profile