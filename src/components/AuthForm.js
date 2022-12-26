import React, { useState } from 'react';
import {BiArrowBack} from "react-icons/bi";
import authSerVice from '../Fbase' ;
import {RiErrorWarningLine} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const AuthForm = ({newAcount, setPopup ,setOpenSusp})=> {
  const [email ,setEmail ] = useState(""); 
  const [password ,setPassword ] = useState("");
  const [error, setError] = useState("") ;
  const navigate =useNavigate();
  const onChange = (event) => {
    const {target :{name ,value}} =event ;
    name === "email" ? setEmail(value) : setPassword(value) ;
  };
  const onSubmit =async(event) => {
    event.preventDefault();
    try{
      if(newAcount){
        //create 
          setOpenSusp(true);
        //await authSerVice.createUserWithEmailAndPassword(email, password);
        //navigate(`/twitter/home`) 
      }else{
        //log in 
        await authSerVice.signInWithEmailAndPassword(email, password);
        navigate(`/twitter/home`) 
      }
      setPopup(false);
      
    }catch(e){
      const start = e.message.indexOf("Firebase:");
      const end =e.message.indexOf("(")
      setError(e.message.substring(start+10 ,end));
    }

      
    
  } ;

  return (
    <section id="authForm">
      <button 
      id="authForm_backBtn"
      onClick={
        ()=>{setPopup(false)}
      }>
        <BiArrowBack/>
      </button>
      <form  onSubmit={onSubmit} >
        <label for="email">Email </label>
        <input id="email" name="email" type="text" placeholder="Email@***.***" onChange={onChange}   />
        <label for="password">Password</label>
        <input id="password" name="password" type="password"  placeholder="Password"  onChange={onChange} />
        <input id="authForm_logIn" type="submit" value={newAcount ?"Sign up " : "Log In"} className='btn'/>
        {error !=="" &&
          <div id="authError">
            <div>
              <RiErrorWarningLine/>
            </div>
            <div>
              {error}
            </div>
          </div>
        }
        
      </form>
    </section>
  )
  } ;

export default React.memo(AuthForm) 