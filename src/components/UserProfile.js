import React from 'react';
import {  useNavigate ,useLocation} from 'react-router-dom';

const UserProfile = ({profile}) => {
  const navigate=useNavigate();
  const location=useLocation()

  const goProfile =async()=>{
    navigate(`/${profile.userId}` ,{state:{
      previous:location.pathname,
      userProfile:profile,
      userId:profile.userId ,
      value:"userProfile",
    }})
  }
  return (
    <>
    {profile !== null &&
    (
      <div className="userProfile">
      <button onClick={goProfile}>
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
