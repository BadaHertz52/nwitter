import React, { useContext } from 'react';
import { BsTwitter } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import { NweetContext } from '../context/NweetContex';
import { ProfileContext } from '../context/ProfileContex';
import { UserContext } from '../context/UserContext';
import authSerVice from '../Fbase';


const LogOut =()=>{
  const {nweetDispatch} =useContext(NweetContext);
  const {profileDispatch} =useContext(ProfileContext);
  const {userDispatch}=useContext(UserContext);
  const navigate =useNavigate();

  const onLogOut = () => {
    userDispatch({
      type:"CLEAR_USER"
    });
    nweetDispatch({
      type:"CLEAR_NWEETS"
    });
    profileDispatch({
      type:"CLEAR_MY_PROFILE"
    })
    navigate('/')
    authSerVice.signOut();
  };

  return (
    <section id="logout">
      <div id="logout_icon">
        <BsTwitter/>
      </div>
      <div id="logout_alert">
        <div>
          Log out of Twitter?
        </div>
        <div>
          You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account. 
        </div>
      </div>
      <div id="logout_Btn">
        <button 
        onClick={onLogOut}>
          Log out
        </button>
        <button onClick={()=>{navigate(-1)}} >
          Cancel
        </button>
      </div>
    </section>
  )
};


export  default LogOut