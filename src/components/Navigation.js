import React from 'react';
import { Link } from 'react-router-dom';
import NweetFactory from './NweetFactory';

const Navigation = ({userObj}) => {

  return(
    <nav>
      <ul>
        <li> 
          <Link to ="/"> Home </Link>
        </li>
        <li> 
          <Link to ="/my_profile"> {userObj.displayName == null ? " " : `${userObj.displayName}의`} Profile </Link>
        </li>
        {/* <li>
          <button>Nweet</button> 
          <NweetFactory userObj={userObj}/>
        </li> */}
      </ul>
    </nav>
  )
};

export default Navigation