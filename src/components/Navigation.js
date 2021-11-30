import React from 'react';
import { Link } from 'react-router-dom';
import { VscBell } from "react-icons/vsc";

const Navigation = ({userobj}) => {

  return(
    <nav id="nav">
      <ul>
        <li> 
          <Link to ="/"> Home </Link>
        </li>
        <li>
          <Link to="/notification" userobj={userobj} >
            {VscBell}Alarm 
          </Link>
        </li>
        <li> 
          <Link to ={{
            pathname: `/${userobj.id}`}}
          > 
            {userobj.displayName == null ? " " : `${userobj.displayName}의`} Profile 
          </Link>
        </li>
        <li>
          <button>
            <img src ={userobj.photoURL} with="50px" height="50px" alt="myProfile"></img>
            <div>
              <div>{userobj.displayName}</div>
              <div>@{userobj.id}</div>
            </div>
          </button>
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