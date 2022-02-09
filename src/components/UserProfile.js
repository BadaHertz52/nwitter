import React from 'react';
import {  useNavigate ,useLocation} from 'react-router-dom';

export const goProfile =async(navigate,profile,location)=>{
  const {userId, uid}=profile; 
  navigate(`${userId}` ,{state:{
    previous:location.pathname,
    userUid:uid,
    userId:userId ,
    value:"userProfile", 
  }})
};

const UserProfile = ({profile}) => {
  const navigate=useNavigate();
  const location=useLocation()


  return (
    <>
    {profile !== null &&
    (
      <div className="userProfile">
      <button onClick={()=>  goProfile(navigate,profile,location)}>
        <img
          className="profile_photo"
          src={profile.photoUrl}  
          alt="profile"/>
      </button>
    </div>
    )
    }
    </>
  )
};

export default UserProfile ;
