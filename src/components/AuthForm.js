import authSerVice from '../Fbase';
import React, { useState } from 'react';

const AuthForm = ()=> {
  const [email ,setEmail ] = useState(""); // " 사이에 공백을 넣으면 공백도 값으로 인식하니까 주의 
  const [password ,setPassword ] = useState("");
  const [newAcount , setNewAccount] = useState(true) ;
  const [error, setError] = useState("") ;
  const onChange = (event) => {
    const {target :{name ,value}} =event ;
    name === "email" ? setEmail(value) : setPassword(value) ;
  };
  const onSubmit =async(event) => {
    event.preventDefault(); //preventDefalut() : 기본행위가 실행되는 것을 원치않음 / submit 버튼을 누르면 발생하는 새로고침을 방지, 
    try{
      let data ;
      if(newAcount){
        //create account
        data= await authSerVice.createUserWithEmailAndPassword(email, password);
      }else{
        //log in 
        data = await authSerVice.signInWithEmailAndPassword(email, password);
      }
    }catch(error){
      setError(error.message);
    }
  } ;

  const toggleAccount =()=>{
    setNewAccount( (prev)=> !prev) ;
  } ;
  return (
    <>
      <form onSubmit={onSubmit}>
        <input name="email" type="text" placeholder="Email"   required value={email}    onChange={onChange}/>
        <input name="password" type="password"  placeholder="Password" required value=  {password}   onChange={onChange}/>
        <input type="submit" value={newAcount? "Create  Account" : "Log In"}/>
        {error}
      </form>
      <span onClick={toggleAccount}>{newAcount? "Log in" : "Create Account"}</span>
    </>
  )
  } ;

export default AuthForm 