import React, { useEffect } from "react";
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useState } from "react/cjs/react.development";
import { dbService } from "../Fbase";
import { getProfile, getProfileDoc } from "./GetData";

const RtAndLikeFun = ( {nweetObj ,userObj})=> {
  const date = Date.now();
  const [ownerProfile, setOwnerProfile] = useState({alarm:[]});
  const [whoProfile, setWhoProfile] = useState({alarm:[]});
  const [rtValue ,setRtValue] =useState(false);
  const [heartValue ,setHeartValue] =useState(false);
  const newAlarm =(what)=>({userId:userObj.uid , creatorId : nweetObj.creatorId, createdAt: nweetObj.createdAt, value: what });
  const rtBtn = document.getElementsByClassName("rtBtn");
  const heartBtn = document.getElementsByClassName("heartBtn");

  const checkAlarm = ()=>{
    ownerProfile.alarm[newAlarm("rt")] && setRtValue(true);
    rtValue === true && (rtBtn.style.backgroundColor = "lightblue" );
    ownerProfile.alarm[newAlarm("heart")] && setHeartValue(true);
    heartValue === true && (heartBtn.style.backgroundColor = "lightblue" );
  };

  useEffect(()=>{
  getProfile(nweetObj.creatorId ,setOwnerProfile);
  nweetObj.who && getProfile(nweetObj.who ,setWhoProfile) ;
  checkAlarm();
  },[]);

  const updateAlram = (what)=> {
    //data : nweetObj 
    const ownerAlarm  = ownerProfile.alarm ; 
    
    //  nweet  원래 작성자
    ownerAlarm.unshift(newAlarm(what));
    
    getProfileDoc(nweetObj.creatorId).set({alarm: ownerAlarm},{merge:true}) ;
    // rt, heart한 작성자 
    if(nweetObj.who){
      const whoAlarm = whoProfile.alarm ; 
      whoAlarm.unshift(newAlarm(what));
    getProfileDoc(nweetObj.who).set({alarm: whoAlarm},{merge:true}) ;
    } 
  };

  // const deleteAlarm = () => {
  //   const ownerAlarm = ownerProfile.alarm.fi
  //   getProfileDoc(nweetObj.creatorId).
  // }
  const Rt =(event)=>{ 
    event.preventDefault();
    console.log(rtValue );
    
    if(rtValue === false){
      const rt ={
        text: nweetObj.text,
        value :"rt",
        createdAt: nweetObj.createdAt,
        who:userObj.uid , 
        creatorId: nweetObj.creatorId,
        attachmentUrl : nweetObj.attachmentUrl
      };
      updateAlram("rt");
      setRtValue(true);
      dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set(rt);
    }else {
      dbService.collection(`nweets_${userObj.uid}`).where("text" , "===" , `${nweetObj.text}`).delete();
      //deltealarm (); 
      setRtValue(false);
    }
    checkAlarm();
    };

  const sendHeart = (event) => {
    event.preventDefault();
    if(heartValue === false){
      const heart ={
        text: nweetObj.text,
        value :"heart",
        createdAt:nweetObj.createdAt,
        creatorId: nweetObj.creatorId,
        who:userObj.uid ,
        attachmentUrl : nweetObj.attachmentUrl
      };
      dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set(heart);
      updateAlram( "heart");
      setHeartValue(true);
    }else {
      dbService.collection(`nweets_${userObj.uid}`).where("text" , "===" , `${nweetObj.text}`).delete();
      setHeartValue(false);
    }
    checkAlarm();
  };

  return(
    <>
      <button className="rtBtn" onClick={Rt} value={rtValue}>
        <AiOutlineRetweet/>
      </button>
      <button className="heartBtn" onClick={sendHeart} value={heartValue}>
        <AiOutlineHeart/>
      </button>
    </>
  )
};

export default RtAndLikeFun;