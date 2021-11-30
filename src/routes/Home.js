import React, { useState, useEffect } from "react";
import NweetFactory from "../components/NweetFactory";
import EditProfile from "./EditProfile";
import HomeNeets from "../components/HomeNweets";

const Home =  ({userobj}) => {

  return (
    <div>
      <NweetFactory userobj={userobj} />
      <HomeNeets userobj={userobj} />
    </div>
  );
};
export default Home;