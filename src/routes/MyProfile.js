
import Nweet from 'components/Nweet';
import authSerVice, { dbService, } from 'Fbase';
import React, { useEffect, useState } from 'react' ;
import { useHistory } from 'react-router-dom';
import EditProfile from './EditProfile';

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
      .collection("nweets")
      .where("creatorId" ,"==", userObj.uid)
      .get()
    const MyNweets = nweets.docs.map(doc => doc.data())  ;
    setMyNweets(MyNweets);
    console.log(myNweets);
  };
  useEffect( ()=> {
    getMyNweets();
  if ( myProfileStore ){getMyProfile()}
  },[]);

  const getMyProfile = async () =>{
    const get_myProfiles = await dbService
    .collection("users")
    .where("creatorId" ,"==", userObj.uid)
    .get()
    
    const get_myProfile = get_myProfiles.docs[0].data();
    setMyProfile(get_myProfile); 
  };

  const onToggle = ()=> setEditing((prev)=> !prev) ;
  return (
    <>
      <section>
        <div>
          <img src={myProfile.photoUrl} width="150px" height="100px"  alt="profile"/>
          <span>{userObj.displayName}</span>
        </div>
        <button onClick={onLogOutClick}> Log Out </button>
        <button onClick={onToggle}>Edit Profile</button>
        {editing &&
        (<EditProfile 
          userObj={userObj} 
          refreshUser={refreshUser} 
          myProfileStore={myProfileStore} 
          getMyProfile={getMyProfile}
        />)
      } 
      </section>
      <sectoion >
        {myNweets.map(nweet => <Nweet  nweetObj ={nweet}  isOwner={nweet.creatorId === userObj.uid} userObj={userObj}/>  )}
      </sectoion>
 
    </> 
  ) 
}

export default MyProfile