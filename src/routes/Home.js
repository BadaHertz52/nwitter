import React, { useState, useEffect } from "react";

import { dbService} from "../Fbase";
import NweetFactory from "../components/NweetFactory";
//import myNweets from "../components/GeData";
import EditProfile from "./EditProfile";


const Home =  ({userObj ,refreshUser}) => {

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
  }, []);

//mynweet바뀔 때 마다 getmynweet
  return (
    <div>
      {IsMyProfile ?
        (
          <>
            <NweetFactory userObj={userObj} />
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