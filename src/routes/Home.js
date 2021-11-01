import React, { useState, useEffect } from "react";
import { dbService} from "../Fbase";
import NweetFactory from "../components/NweetFactory";
import EditProfile from "./EditProfile";
import HomeNeets from "../HomeNweets";

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

  return (
    <div>
      {IsMyProfile ?
        (
          <>
            <div>factory</div>
            <NweetFactory userObj={userObj} />
            <HomeNeets userObj={userObj} />
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