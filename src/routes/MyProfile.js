import authSerVice from '../Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory } from 'react-router-dom';
import EditProfile from './EditProfile';
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm';
import { getNweets, getProfile } from '../components/GetData';


const MyProfile = ({userObj ,refreshUser} ) => {
  const [myProfile , setMyProfile] = useState({});
  const [myNweets , setMyNweets] =useState([]);
  const [editing ,setEditing] = useState(false);
  const [follower, setFollower]= useState([]);
  const history = useHistory();
  const onLogOutClick = () => {
    authSerVice.signOut();
    history.push("/");
  };

  const getMyNweets = () => getNweets(userObj.uid , setMyNweets);
  
  const getMyProfile =  () =>{
    getProfile(userObj.uid, setMyProfile);
    Array.isArray(myProfile.follower) && setFollower(myProfile.follower);
  };

  useEffect( ()=> {
    getMyNweets();
    getMyProfile();
  },[]);

  const onToggle = ()=> setEditing((prev)=> !prev) ;
  useEffect( ()=> {
    getMyNweets();
    getMyProfile()
  },[]);


  return (
    <>
      <section>
        {myProfile.follower && <ProfileTopForm  profile={myProfile} follower={follower}/> }
        <button onClick={onLogOutClick}> Log Out </button>
        <button onClick={onToggle}>Edit Profile</button>
        {editing &&
        (<EditProfile
          userObj={userObj}
          refreshUser={refreshUser}
          myProfile={myProfile}
          onToggle ={onToggle}
        />)
      }
      </section>
      <p>---프로필--- </p>
      <sectoion >
        <ProfileBottomForm nweets={myNweets} userObj={userObj}/>
      </sectoion>

    </>
  )
}

export default MyProfile