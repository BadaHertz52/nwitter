import AuthForm from '../components/AuthForm';
import React from 'react' ;
import { useState } from 'react/cjs/react.development';

import authSerVice , { friebaseInstance } from '../Fbase';

const Auth = ( ) => {
  const [newAcount, setNewAccount] =useState();
  const [popup , setPopup]=useState(false);

  const onSocialClick = async (event) =>{
    const {target:{name}} = event;
    let provider ;
    if (name === "google"){
      provider = new  friebaseInstance.auth.GoogleAuthProvider();
    }
    const data = await authSerVice.signInWithPopup(provider) ;
    console.log("popup //" , data) ;
  };
  return(
    <div id="auth">
      {!popup ?
        <>
          <div id="createAccount">
            <div>
              오늘 Nwitter에 가입하세요.
            </div>
            <button onClick={()=>{setPopup(true) ; setNewAccount(true)}} >
                이메일 주소로 가입하기
            </button>
            <button name="google"
            onClick={onSocialClick}>
              Continue with Goggle
            </button>
          </div>
          <div id="logIn">
            <div>
              이미 Nwitter에 가입하셨나요?
            </div>
            <button onClick={()=>{setPopup(true); setNewAccount(false)}}>
              로그인
            </button>
          </div>
      </>
      :
      <AuthForm newAcount={newAcount} setPopup={setPopup}/>
      }
    </div>
  )
}

; 

export default Auth