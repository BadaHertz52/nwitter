import AuthForm from '../components/AuthForm';
import authSerVice, { friebaseInstance } from '../Fbase';
import React from 'react' ;

const Auth = ( ) => {
  const onSocialClick = async (event) =>{
    const {target:{name}} = event;
    let provider ;
    if (name === "google"){
      provider = new  friebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github"){
      provider = new friebaseInstance.auth.GithubAuthProvider(); 
    }
    const data = await authSerVice.signInWithPopup(provider) ;
    console.log("popup //" , data) ;
  };
  return(
    <div>
      <AuthForm/>
      <div>
      <button  onClick={onSocialClick}  name="google">
        Continue with Goggle
      </button>
      <button onClick={onSocialClick} name="github">
        Continue with Github
      </button>
    </div>
  </div>
  )
}

; 

export default Auth