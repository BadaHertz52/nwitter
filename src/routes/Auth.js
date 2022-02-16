import AuthForm from '../components/AuthForm';
import React,{ useState }   from 'react' ;
import authSerVice , { friebaseInstance } from '../Fbase';
import { RiTwitterLine } from 'react-icons/ri';
import auth_img from '../asset/img/auth_img.jpg';
import auth_img_width from '../asset/img/auth_img_width.jpg';

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
    <section id="auth">
      <div id="auth_left">
        <img
          class="auth_img small" 
          src={auth_img} 
          alt="nwitter img"/>
        <img
          class="auth_img width" 
          src={auth_img_width} 
          alt="nwitter img"/>
      </div>
      {!popup ?
        <div id="auth_main">
          <div id="createAccount">
            <div>
            Sign up for Twitter today.
              <RiTwitterLine/>
            </div>
            <button onClick={()=>{setPopup(true) ; setNewAccount(true)}} >
            Subscribe to your email address
            </button>
            <button name="google"
            onClick={onSocialClick}>
              Continue with Goggle
            </button>
          </div>
          <div id="logIn">
            <div>
            Did you already sign up for NWITTER?
            </div>
            <button onClick={()=>{setPopup(true); setNewAccount(false)}}>
              Log In
            </button>
          </div>
      </div>
      :
      <AuthForm newAcount={newAcount} setPopup={setPopup}/>
      }
    </section>
  )
}

; 

export default Auth