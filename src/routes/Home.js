import React, { useState, useEffect } from "react";

import { dbService} from "../Fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import myNweets from "../components/GeData";
import EditProfile from "./EditProfile";


const Home =  ({userObj ,refreshUser}) => {
  const [nweets, setNweets] = useState([]);
  const [IsMyProfile , setIsMyProfile] = useState(false);
  const myProfileStore = dbService.collection("users").doc(userObj.uid) ;
  const findMyProfile =()=> myProfileStore.get()
  .then(doc => {
    if(doc.exists){
      setIsMyProfile(true);
    }else {
      setIsMyProfile(false);
      console.log("No such document");
    }
  }).catch((e) => {
    console.log("Error getting document", e)
  });
  useEffect(() => {
      findMyProfile();
      dbService.collection(`nweets_${userObj.uid}`).onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
      console.log(IsMyProfile);
    })}, []);

  return (
    <div>
      {IsMyProfile ?  
        (
          <>
            <NweetFactory userObj={userObj}/>
            <div>
              { nweets.map((nweet) => (
                <Nweet
                key={nweet.id}
                nweetObj={nweet}
                userObj ={userObj}
                isOwner={nweet.creatorId === userObj.uid}
                />
              ))}
            </div>
          </>
        )
      : 
        (
          <EditProfile userObj={userObj} myProfileStore ={myProfileStore} refreshUser={refreshUser}/>
        )
      }
    </div>
  );
};
export default Home;