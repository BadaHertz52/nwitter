import React, { useState } from 'react';
import {BiArrowBack} from "react-icons/bi";
import authSerVice from '../Fbase' ;
import {RiErrorWarningLine} from 'react-icons/ri'
import { useNavigate } from 'react-router';

const AuthForm = ({newAcount, setPopup})=> {
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
        await authSerVice.createUserWithEmailAndPassword(email, password);
      }else{
        //log in 
        await authSerVice.signInWithEmailAndPassword(email, password);
      }
      setPopup(false);
      navigate(`/twitter/home`) 
    }catch(e){
      const start = e.message.indexOf("Firebase:");
      const end =e.message.indexOf("(")
      setError(e.message.substring(start+10 ,end));
    }

      
    
  } ;

  return (
    <section id="authForm">
      <button onClick={
        ()=>{setPopup(false)}
      }>
        <BiArrowBack/>
      </button>
      <form  onSubmit={onSubmit} >
        <label for="email">Email </label>
        <input id="email" name="email" type="text" placeholder="Email@***.***" onChange={onChange}   />
        <label for="password">Password</label>
        <input id="password" name="password" type="password"  placeholder="Password"  onChange={onChange} />
        <input type="submit" value={newAcount ?"Sign up " : "Log In"} className='btn'/>
        {error !=="" &&
          <div id="authError">
            <RiErrorWarningLine/>{error}
          </div>
        }
        
      </form>
    </section>
  )
  } ;

export default React.memo(AuthForm) 