import React, { useEffect, useState } from 'react' ;
import { useHistory, } from 'react-router-dom';
import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import { getNweets, getProfileDoc} from '../components/GetData';

const Profile = ({userobj}) => {
  const [userNweets , setUserNweets] =useState([]);
  const [calling, setCalling] =useState(true);
  const [onFollow ,setOnFollow] = useState({});
  const [followList, setFollowList] = useState([]);
  const history = useHistory();
  const pathname = history.location.pathname ;
  const user = pathname.substring(6);
  //const userProfile = history.location.state.userProfile; 
  const userProfile =JSON.parse(sessionStorage.getItem(user)) ;
  //console.log(userProfile);
  const [follower , setFollower]=useState([]);
  //currentUser : 로그인 한 현재 유저
  const currentUserProfileDoc =getProfileDoc(userobj.uid);
  const[currentUserProfile, setcurrentUserProfile]= useState({
    follower:[],
    following:[]
  });
  const newAlarm ={userId:userobj.uid , creatorId : "none", createdAt: "none", value: "follow" };


  const changeFollowBtn = ()=>{
    followList.includes(userProfile.creatorId) ? setOnFollow({
      follow: true , text : "팔로우 중"
    }) :
    setOnFollow({
      follow: false , text : "팔로우 하기"
    });
  };
  // 나의 팔로잉 명단
  const getFollowList = async()=>{
      await currentUserProfileDoc.get().then(
        doc => setcurrentUserProfile(doc.data()) 
      );
      setFollowList(currentUserProfile.following);
      changeFollowBtn();
  };

  // 해당 프로필 유저의 팔로워 명단 
  const getUserFollower = async()=>{ 
    await getProfileDoc(userProfile.creatorId).get().then(
    doc => setFollower(doc.data().follower) 
  );
};
  // 해당 프로필 유저의 nweets 
  const getUserNweets = ()=> {
    getNweets (userProfile.creatorId ,setUserNweets) ; 
    setCalling(false);
  };

  useEffect( ()=> {
      // const getHistory =()=>{
      //   sessionStorage.setItem("user", JSON.stringify( userProfile));
      // if(history.location.state === undefined){
      //   const storageItem =  JSON.parse(sessionStorage.getItem('user'));
      //   setHistoryUserProfile(storageItem);
      // };
      // console.log(userProfile);
      // };
      // getHistory(); 
      getUserNweets();
      getFollowList();
      getUserFollower();
  },[history.action]);

  const follow = (e)=> {
    e.preventDefault();
    if(onFollow.follow === false){
      //나의 팔로잉 리스트에 해당 프로필 유저를 추가 
      followList.unshift(userProfile.creatorId); 
      setFollowList(followList);
      //해당 프로필 유저의 팔로워 리스트에 나를 추가 
      follower.unshift(userobj.uid);
      setFollower(follower);
      //알람 보내기 
      userProfile.alarm.unshift(newAlarm);
      getProfileDoc(userProfile.creatorId).update({alarm : userProfile.alarm})
      
    }else if(onFollow.follow === true){
      setFollowList(list =>list.filter(user => user !== userProfile.creatorId) );
      setFollower(list =>list.filter(user => user !== userobj.uid)  );
    }; 
    //변경된 팔로워,팔로잉 리스트 업로드 
    currentUserProfileDoc.update({
      following : followList
    });
    getProfileDoc(userProfile.creatorId).update({
      follower: follower
    });
    changeFollowBtn();
  }

  return (
    <>
      <section>
        <ProfileTopForm  profile={userProfile} follower={follower} currentUserProfile={currentUserProfile} />
        <button  onClick={follow}>{onFollow.text}</button>
        <div id="div"></div>
      </section>
      <section >
        {calling && <div className ="nweets_calling">
          데이터를 불러오는 중입니다.
        </div>  }
        <ProfileBottomForm  
        nweets={userNweets} 
        userobj={userobj}
        /> 
      </section> 
    </> 
  ) 
}

export default Profile