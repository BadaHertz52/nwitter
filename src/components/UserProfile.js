
import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import {Route} from 'react-router-dom';
import Profile from '../routes/Profile';
import { getProfile } from './GetData';

const UserProfile = ({userId}) => {
  const [ownerProfile, setOwnerProfile] =useState({});
  const profilePath= `/user/${ownerProfile.userId}`;
  
  useEffect(()=>{
    const getOwnerProfile = async(userId) =>{
      await getProfile(userId , setOwnerProfile); 
      };
    getOwnerProfile(userId);
  },[]);

  const id =JSON.stringify(userId);
  const user = ownerProfile.userId ;
  sessionStorage.setItem(user,JSON.stringify(ownerProfile) );
  return (
    <>
    {ownerProfile !== {} &&
    (
      <div className="userProfile">
      <Link id={id} to={{
        pathname:profilePath,
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
