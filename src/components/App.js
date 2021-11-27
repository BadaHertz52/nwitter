import React, { useEffect, useState } from 'react';
import NwitterRouter from './NwitterRouter';
import authSerVice from '../Fbase';

function App() {
  // 초기 화면
  const [init ,setInit] = useState(false) ; 
  const [isLoggedIn ,setIsLoggedIn] = useState(false); 
  const [userobj ,setuserobj] = useState({}) ; 
  const currentUser = authSerVice.currentUser ;
  // profilestore 만들기 
  
  // 마운트 마다 로그인 상태를 알아보는  observer 사용해서 유저 여부에 따른 로그인 여부 상태 변화, 초기 화면 로그아웃으로 세팅 
  useEffect(()=>{
    authSerVice.onAuthStateChanged((user)=> 
    {if(user){
      const ind = user.email.indexOf("@");
      const end = user.email.substring(0,ind);
      if(user.displayName == null){ //user displayname이 없다면 초기에 생성해주어서 나중에 오류발생 x 
        user.updateProfile({displayName:end}); 
      };
      // react는 랜더링에 특화되어 있지만 object 의 내용이 많으면 랜더링 시 랜더링이 안되는 문제가 발생할 수 있음
      /* 해결1 : 필요한 정보만 담아서 userobj을 만듦 단, refrecshUser에서 동일 코드가 반복 이는 Object.assign({}, user) 로 해결 */
      setuserobj({
        displayName : user.displayName,
        uid: user.uid,
        id: end, //-creatorId ,userId
        updateProfile: (args) => user.updateProfile(args) , //프로필 업데이트 함수 
      }) ; 
      setIsLoggedIn(true); 
      setInit(true) ;
    }else{
      setIsLoggedIn(false);
      setInit(false);
    };
    
  }); 
  } ,[]); 
  // userobj 바뀌면 전체가 다시 렌더링
  const refreshUser = ()=>{
    setuserobj(
      Object.assign({}, currentUser) // 객체를 복사해 대상 객체에 붙이는 assign을 이용해  사용자가
    );
  }
  return (
    <>
      {init ? 
      <NwitterRouter isLoggedIn = {isLoggedIn} userobj={userobj} refreshUser={refreshUser} /> 
      : "Initializing..." 
      }
      <div></div>
      <fotter>@copy {new Date().getFullYear()} Nwitter</fotter>
    </>
    
  );
}

export default App;
