import { dbService } from '../Fbase';
import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { getProfile } from './GetData';


const UserProfile = ({nweetObj }) => {
  const [userProfile, setUserProfile] =useState({});
  const getUserProfile = () => getProfile(nweetObj.creatorId , setUserProfile); 

    useEffect(()=>{
    getUserProfile();

  },[]);
  const creatorId =JSON.stringify( userProfile.creatorId);
  return (
    <>
      <div >
        <Link id={creatorId} to={{
          pathname:"/profile",
          state :{
            userProfile :userProfile
          }
        }}>
          <img src={userProfile.photoUrl}  
            width="50px" height="50px"    alt="profile"/>
          <span>{userProfile.userName}</span>
        </Link>
      </div>

    </>
  )
};

export default UserProfile ;
