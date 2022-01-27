import React from 'react';
import {  useNavigate ,useLocation} from 'react-router-dom';
import { useContext } from 'react/cjs/react.development';
import { UserContext } from '../context/UserContext';
import { dbService } from "../Fbase";
const UserProfile = ({profile}) => {
  const navigate=useNavigate();
  const location=useLocation()
  const {userDispatch}=useContext(UserContext);
  const goProfile =async()=>{
    const getDocs = await  dbService
    .collection(`nweets_${profile.uid}`).get();
    const nweets =getDocs
    .docs.map(doc =>({ id:doc.id ,...doc.data()}));    
    
    userDispatch({
      type:"GET_USER_DATA",
      userProfile :profile,
      userNweets:nweets
    });
    navigate(`/${profile.userId}` ,{state:{
      previous:location.pathname,
      userId:profile.userId ,
      value:"userProfile"}})
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
