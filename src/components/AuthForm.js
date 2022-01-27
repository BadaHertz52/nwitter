import React, { useState } from 'react';
import {BiArrowBack} from "react-icons/bi";
import authSerVice from '../Fbase' ;

const AuthForm = ({newAcount, setPopup})=> {
  const [email ,setEmail ] = useState(""); 
  // " 사이에 공백을 넣으면 공백도 값으로 인식하니까 주의 
  const [password ,setPassword ] = useState("");
  const [error, setError] = useState("") ;
  const onChange = (event) => {
    const {target :{name ,value}} =event ;
    name === "email" ? setEmail(value) : setPassword(value) ;
  };
  const onSubmit =async(event) => {
    event.preventDefault();
     //preventDefalut() : 기본행위가 실행되는 것을 원치않음 / submit 버튼을 누르면 발생하는 새로고침을 방지, 
    try{
      if(newAcount){
        //create 
        await authSerVice.createUserWithEmailAndPassword(email, password);
      }else{
        //log in 
        await authSerVice.signInWithEmailAndPassword(email, password);
      }
      setPopup(false)
    }catch(e){
      const start = e.message.indexOf("Firebase:");
      const end =e.message.indexOf("(")
      setError(e.message.substring(start+10 ,end));
    }
  } ;

  return (
    <>
      <button onClick={
        ()=>{setPopup(false)}
      }>
        <BiArrowBack/>
      </button>
      <form id="authForm" onSubmit={onSubmit} >
        <label for="email">Email </label>
        <input id="email" name="email" type="text" placeholder="Email@***.***" onChange={onChange}   />
        <label for="password">Password</label>
        <input id="password" name="password" type="password"  placeholder="Password"  onChange={onChange} />
        <input type="submit" value={newAcount ?"가입하기" : "로그인"} className='btn'/>
        {error !=="" &&
          <div id="authError">
            ❕{error}
          </div>
        }
        
      </form>
    </>
  )
  } ;

export default AuthForm 