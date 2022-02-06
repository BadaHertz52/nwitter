import React, {useState , useContext, useReducer } from 'react';
import { Link, useNavigate ,useLocation} from 'react-router-dom';

import { BsBell, BsBellFill, BsPencil, BsTwitter } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import DeleteUser from './DeleteUser';
import {ProfileContext} from '../context/ProfileContex';
import {NweetContext} from '../context/NweetContex';

const Navigation = ({userobj}) => {
  const location= useLocation();
  const navigate =useNavigate();
  const {myProfile}=useContext(ProfileContext);
  const {myNweets}= useContext(NweetContext);
  const inner =document.getElementById('inner');
  const [set, setSet] =useState(false);

  const doneInitialSatate ={
    doneFollowing:false,
    doneFollower:false,
    doneNweet:false,
    doneOtherUserNweet:false
  };

  const reducer =(state, action)=> {
    switch (action.type) {
      case "FOLLOWING":
        return {
          ...state,
          doneFollowing:true
        }
      case "FOLLOWER":
        return {
          ...state,
          doneFollower:true
        }
      case "NWEET":
        return {
          ...state,
          doneNweet:true
        }
      case "OTHER_USER_NWEET":
        return {
          ...state,
          doneOtherUserNweet:true
        }
      default:
        break;
    }
  };

  const [state,dispatch]=useReducer(reducer,doneInitialSatate);

  const goMyProfile=()=>{
    navigate(`/${userobj.id}` ,{state:{value:"profile", previous:location.pathname}})
  };

  const goNweetFactory=()=>{
    const pathname =location.pathname=== '/'? 'nweet' : `${location.pathname}/nweet`;
    navigate( `${pathname}` , 
    {state:{value:"nweet",
    pre_previous:location.state!==null?location.state.previous:"",
    previous:location.pathname , 
    previousState: (location.pathname.includes("status")|| location.pathname.includes("list"))?location.state.previousState : null }})
  };
  
    set && inner !== null && inner.addEventListener('click', (event)=>{
      const target =event.target;
      !target.className.includes('account')&&setSet(false)
    });

  return(
    <>
    <nav id="nav">
      <div>
        < Link to ="/" id="nav_nwitter">
          <BsTwitter/>
        </Link>
        <Link to ="/">
          {location.pathname=="/"? 
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
        <Link to="/notification" userobj={userobj} >
          {location.pathname==`/notification` ?
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
          {location.pathname ==`/${userobj.id}` ?
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
        onClick={goNweetFactory} 
        >
          <BsPencil/>
          <div id="do_nweet">Nweet</div>
        </button>
      </div> 
      <div id="nav_profile">
      {set &&
            <div  class="account" id="account">
              <div  class="account"  id="account_user">
                <img className="profile_photo dark_target acccount" src ={userobj.photoURL} alt="myProfile" ></img>
                <div className="nav_label account">
                  <div  class="account">{userobj.displayName}</div>
                  <div  class="account">@{userobj.id}</div>
                </div>
              </div>
              <div  class="account" id="account_btn"> 
                <button   class="account" id="account_logOut" 
                onClick={()=>
                  navigate('/logout')}>
                  Log out @{userobj.id}
                </button>
                <button   class="account" id="account_logOut" 
                onClick={()=>
                  DeleteUser(myProfile, myNweets, state, dispatch)}>
                  Delete @{userobj.id}
                </button>
              </div>
            </div>
          }
        <button 
        onClick={()=>setSet(!set)}
        >
          <img className="profile_photo dark_target" src ={userobj.photoURL} alt="myProfile" ></img>
          <div className="nav_label">
            <div>{userobj.displayName}</div>
            <div>@{userobj.id}</div>
          </div>
        </button>

      </div>

    </nav>
    </>
  )
};

export default Navigation