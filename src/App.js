import React, { useEffect,useState } from 'react';
import TwitterRouter from './components/TwitterRouter';
import authSerVice from './Fbase';
import { getProfileDoc } from './components/GetData';

function App() {
  // 초기 화면
  const [isLoggedIn ,setIsLoggedIn] = useState(false); 
  const [userobj ,setuserobj] = useState({}) ; 
  const [IsMyProfile , setIsMyProfile] =useState();
  const basicPhoto ='https://firebasestorage.googleapis.com/v0/b/nwitter-c8556.appspot.com/o/icons8-user-64.png?alt=media&token=0e76967a-3740-4666-a169-35523d1e07cb' ;
  const basicHeader ='https://firebasestorage.googleapis.com/v0/b/nwitter-c8556.appspot.com/o/basicHeader.png?alt=media&token=3fb9d8ee-95ba-4747-a64f-65c838247ca9';
  const currentUser = authSerVice.currentUser ;

  // 마운트 마다 로그인 상태를 알아보는  observer 사용해서 유저 여부에 따른 로그인 여부 상태 변화, 초기 화면 로그아웃으로 세팅 
  const findMyProfile =(userobj ,setIsMyProfile)=> getProfileDoc(userobj.uid)
  .get()
  .then(doc => {
    if(doc.exists){
      setIsMyProfile(true);
    }else {
      setIsMyProfile(false);
      const newMyProfile = {
        uid:userobj.uid,
        userId:userobj.id,
        userName: userobj.displayName,
        introduce:"",
        headerUrl:basicHeader,
        photoUrl:basicPhoto, 
        following:[],
        follower:[],
        notifications : []
      };
      getProfileDoc(userobj.uid).set(newMyProfile)
    };
  })
  .catch((e) => {
  console.log("Error getting document", e)
  });

  const LogIn =()=>authSerVice.onAuthStateChanged(async(user)=> 
    {if(user){
      
      const ind = user.email.indexOf("@");
      const end = user.email.substring(0,ind);
      const newUserObj ={
        displayName : end,
        uid: user.uid,//-creatorId ,userId
        id: end, 
        photoURL:user.photoURL,
        updateProfile: (args) => user.updateProfile(args) , //프로필 업데이트 함수 
      };
      if(user.displayName == null){
        user.updateProfile({displayName:end});
      };
      if(user.photoURL == null){
        user.updateProfile({
          photoURL:basicPhoto
        })
      }
      findMyProfile(newUserObj, setIsMyProfile);
      setuserobj(newUserObj) ; 
      setIsLoggedIn(true); 
    }else{
      setIsLoggedIn(false);
    };
  });
  
  useEffect( ()=>{
    LogIn();
      // userobj 바뀌면 전체가 다시 렌더링
    const refreshUser = (currentUser)=>{
    setuserobj(
      Object.assign({}, currentUser) // 객체를 복사해 대상 객체에 붙이는 assign을 이용해  사용자가
    );
  };
    refreshUser(currentUser);
  },[currentUser]
  )
  return (
    <>
      <TwitterRouter isLoggedIn = {isLoggedIn} userobj={userobj} IsMyProfile={IsMyProfile} setIsMyProfile={setIsMyProfile} /> 
      {/* <footer>
      Photo by <a href="https://unsplash.com/@jeremybezanger?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeremy Bezanger</a> on <a href="https://unsplash.com/s/photos/twitter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
      </footer> */}
    </>
    
  );
}

export default App;
