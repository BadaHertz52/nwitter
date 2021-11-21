import React from 'react';
import { Link } from 'react-router-dom';
import { VscBell ,VscBellDot } from "react-icons/vsc";
const Navigation = ({userobj}) => {

  return(
    <nav>
      <ul>
        <li> 
          <Link to ="/"> Home </Link>
        </li>
        <li>
          <Link to="/notification" userobj={userobj} >{VscBell}Alarm </Link>
        </li>
        <li> 
          <Link to ="/my_profile"> {userobj.displayName == null ? " " : `${userobj.displayName}의`} Profile </Link>
        </li>
        {/* <li>
          <button>Nweet</button> 
          <NweetFactory userobj={userobj}/>
        </li> */}
      </ul>
    </nav>

  )
};

export default Navigation