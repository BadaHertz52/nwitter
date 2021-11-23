
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from './GetData';

const UserProfile = ({userId}) => {
  const [ownerProfile, setOwnerProfile] =useState({});
  const profilePath= `/profile/${ownerProfile.userId}`;
  
  useEffect(()=>{
    const getOwnerProfile = async() =>{
      await getProfile(userId , setOwnerProfile); 
      };
    getOwnerProfile();
  },[]);

  const id =JSON.stringify(userId);
  return (
    <>
    {ownerProfile !== {} &&
    (
      <div >
      <Link id={id} to={{
        pathname:profilePath,
        state :{
          userProfile :ownerProfile
        }
      }}>
        <img src={ownerProfile.photoUrl}  
          width="50px" height="50px"    alt="profile"/>
        <span>{ownerProfile.userName}</span>
      </Link>
    </div>
    )
    }


    </>
  )
};

export default UserProfile ;
