import React from 'react';
import { Link, useNavigate ,useLocation} from 'react-router-dom';

import nwitterImg from "../asset/img/icons8-지저귀다-48.png"; 
import { BsBell, BsBellFill, BsPencil } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
const Navigation = ({userobj}) => {
  const location= useLocation();
  const navigate =useNavigate();
  
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
  return(
    <>
    <nav id="nav">
      <div>
        < Link to ="/" id="nav_nwitter">
          <img src={nwitterImg} alt="nwitter"/>
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
      <div>
        <div id="nav_profile">
          <img className="profile_photo dark_target" src ={userobj.photoURL} alt="myProfile" ></img>
          <div className="nav_label">
            <div>{userobj.displayName}</div>
            <div>@{userobj.id}</div>
          </div>
        </div>
      </div>

    </nav>
    </>
  )
};

export default Navigation