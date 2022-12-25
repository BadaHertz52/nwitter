import AuthForm from '../components/AuthForm';
import React,{ useEffect, useState }   from 'react' ;
import authSerVice , { friebaseInstance } from '../Fbase';
import { BsTwitter } from "react-icons/bs";
import auth_img from '../asset/img/auth_img.jpg';
import auth_img_width from '../asset/img/auth_img_width.jpg';
import Footer from '../components/Footer';
import Suspension from '../components/Suspension';

const Auth = ( ) => {
  const [newAcount, setNewAccount] =useState();
  const [popup , setPopup]=useState(false);
  const [openSusp , setOpenSusp]=useState(false);
  const changeAuthMainStyle =()=>{
    const authLeftElement = document.getElementById("auth_left");
    const authMainElement = document.getElementById("auth_main");
    if(window.innerWidth >= 1024){
      const authLeftWidth =authLeftElement.getClientRects()[0].width;
      const authMainWidth =window.innerWidth - authLeftWidth
      const susPWidth =`${authMainWidth * 0.8}px`;
      const paddingSide  = `${authMainWidth * 0.1}px`;
      
      authMainElement?.setAttribute("style",`width:${susPWidth}; padding:0 ${paddingSide}`);
    }else{
      authMainElement.setAttribute("style", `width:100%; padding:0`);
    }
  };
  window.onresize = changeAuthMainStyle();
  useEffect(()=>{
    changeAuthMainStyle();
  },[openSusp])
/**
 * 원래는 goggle 버튼 클릭 시 구글 계정을 로그인 가능하도록 함
 */
  const onSocialClick = async (event) =>{
    const {target:{name}} = event;
    let provider ;
    if (name === "google"){
      provider = new  friebaseInstance.auth.GoogleAuthProvider();
    }
    setOpenSusp(true);
    //const data = await authSerVice.signInWithPopup(provider) ;
  };

  return(
    <section id="auth">
      <div id="auth_left">
        <img
          class="auth_img small" 
          src={auth_img} 
          alt="twitter img"/>
        <img
          class="auth_img width" 
          src={auth_img_width} 
          alt="twitter img"/>
      </div>
      {openSusp?
        <Suspension
          setOpenSusp={setOpenSusp}
        />
      :
      <div id="auth_main"> 
      {!popup ?
        <>
          <div  className='twitter_icon auth_main_div' id="createAccount">
            <BsTwitter/>
            <div>
            Sign up for Twitter today.
            </div>
            <button onClick={()=>{setPopup(true) ; setNewAccount(true)}} >
            Subscribe to your email address
            </button>
            <button name="google"
            onClick={onSocialClick}>
              Continue with Goggle
            </button>
          </div>
          <div   className='auth_main_div'  id="logIn">
            <div>
              Did you already sign up for Twitter?
            </div>
            <button onClick={()=>{setPopup(true); setNewAccount(false)}}>
              Log In
            </button>
          </div>
          
        </>
        :
        <div className='auth_main_div'>
          <AuthForm 
            newAcount={newAcount} 
            setPopup={setPopup}
            setOpenSusp={setOpenSusp}
          />
        </div>

      }
        <div className='auth_main_div'>
        <Footer/>
        </div>
        
      </div>
      }
      
    </section>
  )
}

; 

export default React.memo(Auth);