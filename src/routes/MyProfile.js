import authSerVice from '../Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory } from 'react-router-dom';
import EditProfile from './EditProfile';
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm';
import { getNweets, getProfile } from '../components/GetData';


const MyProfile = ({userobj} ) => {
  const [myProfile , setMyProfile] = useState({});
  const [myNweets , setMyNweets] =useState([]);
  const [editing ,setEditing] = useState(false);
  const [follower, setFollower]= useState([]);
  const history = useHistory();
  const onLogOutClick = () => {
    authSerVice.signOut();
    history.push("/");
  };

  const getMyNweets = () => getNweets(userobj.uid , setMyNweets);
  
  const getMyProfile =  () =>{
    getProfile(userobj.uid, setMyProfile);
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
        {myProfile.follower && <ProfileTopForm  profile={myProfile} follower={follower} currentUserProfile={myProfile}/> }
        <button onClick={onLogOutClick}> Log Out </button>
        <button onClick={onToggle}>Edit Profile</button>
        {editing &&
        (<EditProfile
          userobj={userobj}
          myProfile={myProfile}
          onToggle ={onToggle}
        />)
        }
      </section>
      <p>---프로필--- </p>
      <section >
        <ProfileBottomForm nweets={myNweets} userobj={userobj}/>
      </section>

    </>
  )
}

export default MyProfile