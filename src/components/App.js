import React, { useEffect, useState } from 'react';
import NwitterRouter from './NwitterRouter';
import authSerVice, { dbService } from '../Fbase';

function App() {
  // 초기 화면
  const [init ,setInit] = useState(true) ; 
  const [isLoggedIn ,setIsLoggedIn] = useState(false); 

  const [userObj ,setUserObj] = useState(null) ; 
  // profilestore 만들기 
  
  // 마운트 마다 로그인 상태를 알아보는  observer 사용해서 유저 여부에 따른 로그인 여부 상태 변화, 초기 화면 로그아웃으로 세팅 
  useEffect(()=>{
    authSerVice.onAuthStateChanged((user)=> 
    {if(user){
      if(user.displayName == null){
        const ind = user.email.indexOf("@");
        const end = user.email.substring(0,ind);
        user.updateProfile({displayName:end}); 
      };
      // react는 랜더링에 특화되어 있지만 object 의 내용이 많으면 랜더링 시 랜더링이 안되는 문제가 발생할 수 있음
      /* 해결1 : 필요한 정보만 담아서 userObj을 만듦 단, refrecshUser에서 동일 코드가 반복 이는 Object.assign({}, user) 로 해결 */
      setUserObj({
        displayName : user.displayName,
        uid: user.uid, //-creatorId ,uerId
        updateProfile: (args) => user.updateProfile(args) ,
      }) ; 
      setIsLoggedIn(true); 
      
    }else{
      setIsLoggedIn(false)
    }
    setInit(true) 
  }) ; 

  } ,[]); 
  // userObj 바뀌면 전체가 다시 렌더링
  const refreshUser = ()=>{
    const user = authSerVice.currentUser ;
    setUserObj(
      Object.assign({}, user)
    );
  }
  return (
    <>
      {init ? 
      <NwitterRouter isLoggedIn = {isLoggedIn} userObj={userObj} refreshUser={refreshUser} /> 
      : "Initializing..." 
      }
      <div></div>
      <fotter>@copy {new Date().getFullYear()} Nwitter</fotter>
    </>
    
  );
}

export default App;
