import React, { useEffect } from "react";
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useState } from "react/cjs/react.development";
import { dbService } from "../Fbase";
import { getProfile, getProfileDoc } from "./GetData";

const RtAndLikeFun = ( {nweetObj ,userObj})=> {
  const date = Date.now();
  const [profile, setProfile] = useState({});

  useEffect(()=>{
  getProfile(nweetObj.creatorId ,setProfile);
  },[])
  const updateAlram = (data)=> {
    const userAlram  = profile.alram ; 
    userAlram.push(`${userObj.displayName}님이 내 트윗을 ${data}.`);
    //추후에  displayName 변경 시에 따른 알람 내용 변경을 코딩해야함 
    profile.userName !== userObj.displayName && (
      getProfileDoc(nweetObj.creatorId).set({
      alram :userAlram 
    }, {merge:true}))
    
  };
  const Rt =(event)=>{ 
    event.preventDefault();
    const rt ={
      text: nweetObj.text,
      value :"rt",
      createAt: date,
      who:userObj.uid , 
      creatorId: nweetObj.creatorId,
      attachmentUrl : nweetObj.attachmentUrl
    };
    dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set(rt);
    updateAlram('리트윗 했습니다.');
    };

  const sendHeart = () => {
    const heart ={
      text: nweetObj.text,
      value :"heart",
      createAt:date,
      creatorId: nweetObj.creatorId,
      who:userObj.uid ,
      attachmentUrl : nweetObj.attachmentUrl
    };
    dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set(heart);
    updateAlram('마음에 들어합니다.');
  };

  return(
    <>
      <button onClick={Rt}>
        <AiOutlineRetweet/>
      </button>
      <button onClick={sendHeart}>
        <AiOutlineHeart/>
      </button>
    </>
  )
};

export default RtAndLikeFun;