import React from 'react';
import {  useNavigate ,useLocation} from 'react-router-dom';

export const goProfile =async(navigate,profile,location)=>{
  const {userId}=profile; 
  localStorage.setItem('user', JSON.stringify(profile) )
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
      <div className="userProfile profile">
      <button className='profile' onClick={()=>  goProfile(navigate,profile,location)}>
        <img
          className="profile_photo profile"
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
