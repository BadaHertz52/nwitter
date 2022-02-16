import React, {useState , useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link, useLocation} from 'react-router-dom';

import { BsBell, BsBellFill, BsPencil, BsTwitter } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';

import {ProfileContext} from '../context/ProfileContex';
import {TweetContext} from '../context/TweetContex';

import DeleteUser from './DeleteUser';
import { profileForm } from './GetData';

const Navigation = ({userobj ,home}) => {
  const location= useLocation();
  const navigate =useNavigate();
  const {myProfile}=useContext(ProfileContext);
  const {myTweets}= useContext(TweetContext);
  const inner =document.getElementById('inner');
  const [set, setSet] =useState(false);
  const [deleteError ,setDeleteError] =useState(false);
  const [profile, setProfile]=useState(profileForm);

  const goMyProfile=()=>{
    navigate(`${home}${userobj.id}` ,{state:{value:"profile", previous:location.pathname}})
  };

  const goTweetFactory=()=>{
    const pathname =`${location.pathname}/tweet`;

    navigate( `${pathname}` , 
    {state:{
    value:"tweet",
    pre_previous:location.state!==null?location.state.previous:"",
    previous:location.pathname , 
    previousState: ( location.pathname.includes("list"))?location.state.previousState : null }})
  };
  
    set && inner !== null && inner.addEventListener('click', (event)=>{
      const target =event.target;
      !target.className.includes('account')&&setSet(false)
    });

  useEffect(()=>{
    myProfile!==undefined && setProfile(myProfile); 
  },[myProfile])
  return(
    <>
    {deleteError && 
      <div id="deleteError">
        <div>
          Please log out and try again.
        </div>
        <button onClick={()=>{setDeleteError(false)}}>
          confirm
        </button>
      </div>
        }
    <nav id="nav">
      <div>
        < Link to ={`${home}home`} id="nav_twitter">
          <BsTwitter/>
        </Link>
        <Link to ={`${home}home`}>
          {location.pathname===`${home}/home`? 
          <>
            <AiFillHome/>
            <div className="nav_label on">Home</div> 
          </>
          :
          <>
            <AiOutlineHome/>
            <div className="nav_label">Home</div> 
          </>
          }
        </Link>
        <Link to={`${home}notification`} userobj={userobj} >
          {location.pathname===`${home}notification` ?
          <>
            <BsBellFill/> 
            <div className="nav_label on"> Notifications </div>
          </>
          :
          <>
            <BsBell/>
            <div className="nav_label"> Notifications </div>
          </>
          }
          
        </Link>
        <button 
          id="nav_myProfile"
          onClick={goMyProfile}> 
          {location.pathname ===`${home}${userobj.id}` ?
          <>
            <FaUser/>
            <div 
            className="nav_label on"> 
              Profile 
            </div>
          </>
          :
          <>
            <FaRegUser/>
            <div 
            className="nav_label"> 
              Profile 
            </div>
          </>
          }
        </button>
      </div>
      <div>
        <button id="nav_popUp"  
        onClick={goTweetFactory} 
        >
          <BsPencil/>
          <div id="do_tweet">tweet</div>
        </button>
      </div> 
      <div id="nav_profile">
      {set &&
            <div  class="account" id="account">
              <div  class="account"  id="account_user">
                <img className="profile_photo dark_target acccount" src ={profile.photoUrl} alt="myProfile" ></img>
                <div className="nav_label account">
                  <div  class="account">{profile.userName}</div>
                  <div  class="account">@{profile.userId}</div>
                </div>
              </div>
              <div  class="account" id="account_btn"> 
                <button   class="account" id="account_logOut" 
                onClick={()=>
                  navigate(`${home}/logout`)}>
                  Log out @{profile.userId}
                </button>
                <button   class="account" id="account_logOut" 
                onClick={()=>{DeleteUser(profile, myTweets,setDeleteError );
                setSet(false)}}>
                  Delete @{profile.userId}
                </button>
              </div>
            </div>
          }
        <button 
        onClick={()=>setSet(!set)}
        >
          <img className="profile_photo dark_target" src ={profile.photoUrl} alt="myProfile" ></img>
          <div className="nav_label">
            <div>{profile.userName}</div>
            <div>@{profile.userId}</div>
          </div>
        </button>

      </div>

    </nav>
    </>
  )
};

export default Navigation