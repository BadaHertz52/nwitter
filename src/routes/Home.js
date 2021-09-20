import React, { useState, useEffect } from "react";

import { dbService} from "../Fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import myNweets from "../components/GeData";
import EditProfile from "./EditProfile";


const Home =  ({userObj ,refreshUser}) => {
  const [nweets, setNweets] = useState([]);
  const myProfileStore = dbService.collection("users").doc(userObj.uid) ;
  
  useEffect(() => {
      dbService.collection(`nweets_${userObj.uid}`).onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    })}, []);

  return (
    <div>
      {myProfileStore.creatorId === userObj.uid ?  
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