import AuthForm from '../components/AuthForm';
import React,{ useState }   from 'react' ;
import authSerVice , { friebaseInstance } from '../Fbase';
import { BsTwitter } from "react-icons/bs";
import auth_img from '../asset/img/auth_img.jpg';
import auth_img_width from '../asset/img/auth_img_width.jpg';
import Footer from '../components/Footer';
import { changeTitle } from '../components/TwitterRouter';

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
  changeTitle("tiwtter login");
  return(
    <section id="auth">
      <div id="auth_left">
        <img
          className="auth_img small" 
          src={auth_img} 
          alt="twitter img"/>
        <img
          className="auth_img width" 
          src={auth_img_width} 
          alt="twitter img"/>
      </div>
      {!popup ?
        <div id="auth_main">
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
          <div className='auth_main_div'>
            <Footer/>
          </div>
          
      </div>
      :
      <AuthForm newAcount={newAcount} setPopup={setPopup}/>
      }
    </section>
  )
}

; 

export default React.memo(Auth);