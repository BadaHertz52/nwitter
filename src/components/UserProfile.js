import { dbService } from '../Fbase';
import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';


const UserProfile = ({nweetObj }) => {
  const [userProfile, setUserProfile] =useState({});
  const getUserProfile =async () => {
    const profile =  await dbService
      .collection("users")
      .where("creatorId" ,"==",nweetObj.creatorId)
      .get() ;
      
      const get_profile = profile.docs[0].data();
      setUserProfile(get_profile); 
      console.log(userProfile);
  };
    useEffect(()=>{
    getUserProfile();

  },[]);
  const creatorId =JSON.stringify( userProfile.creatorId);
  return (
    <>
      <div >
        <Link id={creatorId} to={{
          pathname:"/userProfile",
          state :{
            userProfile :userProfile
          }
        }}>
          <img src={userProfile.photoUrl}  
            width="80px" height="80px"    alt="profile"/>
          <span>{userProfile.userName}</span>
        </Link>
      </div>

    </>
  )
};

export default UserProfile ;
