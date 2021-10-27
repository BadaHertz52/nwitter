import authSerVice, { dbService, } from '../Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory } from 'react-router-dom';
import EditProfile from './EditProfile';
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm';


const MyProfile = ({userObj ,refreshUser} ) => {
  const [myProfile , setMyProfile] = useState({});
  const myProfileStore = dbService.collection(`users`).doc(userObj.uid) ;
  const [myNweets , setMyNweets] =useState([]);
  const [editing ,setEditing] = useState(false);
  const history = useHistory();

  const onLogOutClick = () => {
    authSerVice.signOut();
    history.push("/");
  };
  const getMyNweets = async()=>{
    const nweets = await dbService
      .collection(`nweets_${userObj.uid}`)
      .get()
    const MyNweets = nweets.docs.map(doc => ({
      id: doc.id ,
      ...doc.data()}))  ;
    setMyNweets(MyNweets);
  };
  

  const getMyProfile = async () =>{

    const get_myProfiles = dbService
    .collection("users")
    .doc(userObj.uid);
    await get_myProfiles.get().then((doc) => {
      if (doc.exists) {
        setMyProfile(doc.data());
          console.log("Document data:",myProfile);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  };

  const onToggle = ()=> setEditing((prev)=> !prev) ;
  useEffect( ()=> {
    getMyNweets();
    getMyProfile()
  },[]);
  return (
    <>
      <section>
        <ProfileTopForm  profile={myProfile}/>
        <button onClick={onLogOutClick}> Log Out </button>
        <button onClick={onToggle}>Edit Profile</button>
        {editing &&
        (<EditProfile
          userObj={userObj}
          refreshUser={refreshUser}
          myProfileStore={myProfileStore}
          onToggle ={onToggle}
        />)
      }
      </section>
      <p>---프로필--- </p>
      <sectoion >
        <ProfileBottomForm Nweets={myNweets} userObj={userObj}/>
      </sectoion>

    </>
  )
}

export default MyProfile