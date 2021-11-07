import React, { useState, useEffect } from "react";
import NweetFactory from "../components/NweetFactory";
import EditProfile from "./EditProfile";
import HomeNeets from "../HomeNweets";
import { findMyProfile } from "../components/GetData";


const Home =  ({userObj ,refreshUser}) => {

  const [IsMyProfile , setIsMyProfile] = useState(false);

  useEffect(() => {
      findMyProfile(userObj.uid, setIsMyProfile);
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
          <EditProfile userObj={userObj}  refreshUser={refreshUser}/>
        )
      }
    </div>
  );
};
export default Home;