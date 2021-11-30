import React from "react";
import NweetFactory from "../components/NweetFactory";
import EditProfile from "./EditProfile";
import HomeNeets from "../components/HomeNweets";



const Home =  ({userobj }) => {
  
  return (
    <div>
      {userobj.photoURL !==""?
        (
          <>
            <NweetFactory userobj={userobj} />
            <HomeNeets userobj={userobj} />
          </>
        )
      :
        (
          <EditProfile userobj={userobj}  />
        )
      }
    </div>
  );
};
export default Home;