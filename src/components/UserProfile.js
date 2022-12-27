import React from 'react';
import {  useNavigate ,useLocation} from 'react-router-dom';

export const goProfile =async(navigate,userId,uid,location)=>{
  localStorage.setItem('user', uid  );
  navigate(`/twitter/${userId}` ,{state:{
    previous:location.pathname,
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
      <button onClick={()=>  goProfile(navigate,profile.userId, profile.uid,location)}>
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

export default React.memo(UserProfile) ;
