import React, { useContext,  } from 'react';
import UserProfile from './UserProfile';
import { dbService } from '../Fbase';
import { useEffect, useState } from 'react/cjs/react.development';
import { ProfileContext } from '../context/ProfileContex';
import { getProfileDoc } from './GetData';
import { UserContext } from '../context/UserContext';
import { useLocation, useNavigate } from 'react-router';

const Recommend =({userobj})=>{
  const [usersProfiles, setUsersProfile] =useState([]);
  const [users, setUsers] =useState([]);
  const {myProfile} =useContext(ProfileContext);
  const {following} =myProfile.following;
  const {userDispatch}=useContext(UserContext);
  const navigate =useNavigate();
  const location =useLocation();
  const getUsers =async()=>{
  //users를 가져오자 
  const USERS = (await dbService.collection('users').get().then()).docs.map(doc=> doc.id);
  if(following !==undefined && following[0]!==undefined){
    let filteredUsers =USERS.filter(user => user!==userobj.uid && !following.includes(user));
  setUsers(filteredUsers);
  }else {
    const filteredUsers = USERS.filter(user=> user!== userobj.uid);
    setUsers(filteredUsers);
  }
  };
const getUsersProfile =async()=>{
  await  getUsers();
  //user's profile 
  const profiles =await Promise.all(users.map(user => 
    getProfileDoc(user).get().then(doc => doc.data())
  )).then(data=> data) ;
    setUsersProfile(profiles);
};
const goProfile =async(profile)=>{
  const getDocs = await  dbService
  .collection(`nweets_${profile.uid}`).get();
  const nweets =getDocs.docs.map(doc =>({ id:doc.id ,...doc.data()}));    
  
  userDispatch({
    type:"GET_USER_DATA",
    userProfile :profile,
    userNweets:nweets
  });
  navigate(`/${profile.userId}` ,{state:
    {previous:location.pathname, 
      userId:profile.userId ,
      value:"userProfile"
    }})
};

  useEffect(()=>{ 
    getUsersProfile();
  },[myProfile]);

  return (
    <>
    <div id='recommend'>
      <p>Who to follow</p>
      <div>
        {usersProfiles.map((profile) => 
        <button 
        className='recommend_user' 
        key={`recommend_${usersProfiles.indexOf(profile)}`} 
        onClick={()=>goProfile(profile)}
        >
          <UserProfile profile={profile}  />
          <div className='userInform'>
            <div>{profile.userName}</div>
            <div>@{profile.userId} </div>
          </div>
          <button>
            Follow
          </button>
        </button>
        )}
      </div>
    </div>
  </>
  )
};


export default Recommend;