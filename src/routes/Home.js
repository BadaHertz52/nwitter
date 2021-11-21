import React, { useState, useEffect } from "react";
import NweetFactory from "../components/NweetFactory";
import EditProfile from "./EditProfile";
import HomeNeets from "../components/HomeNweets";
import { findMyProfile } from "../components/GetData";


const Home =  ({userobj ,refreshUser}) => {

  const [IsMyProfile , setIsMyProfile] = useState(false);

  useEffect(() => {
      findMyProfile(userobj.uid, setIsMyProfile);
  }, []);

  return (
    <div>
      {IsMyProfile ?
        (
          <>
            <NweetFactory userobj={userobj} />
            <HomeNeets userobj={userobj} />
          </>
        )
      :
        (
          <EditProfile userobj={userobj}  refreshUser={refreshUser}/>
        )
      }
    </div>
  );
};
export default Home;