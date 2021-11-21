
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from './GetData';


const UserProfile = ({nweetObj }) => {
  const [userProfile, setUserProfile] =useState({});
  const profilePath= `/profile/${userProfile.userId}`;
  const getUserProfile = async() =>{
    await getProfile(nweetObj.creatorId , setUserProfile); 
    }
  useEffect(()=>{
    getUserProfile();
  },[]);

  const id =JSON.stringify( nweetObj.creatorId);
  return (
    <>
    {userProfile !== {} &&
    (
      <div >
      <Link id={id} to={{
        pathname:profilePath,
        state :{
          userProfile :userProfile
        }
      }}>
        <img src={userProfile.photoUrl}  
          width="50px" height="50px"    alt="profile"/>
        <span>{userProfile.userName}</span>
      </Link>
    </div>
    )
    }


    </>
  )
};

export default UserProfile ;
