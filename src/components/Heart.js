import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { TweetContext } from "../context/TweetContex";
import { OffRtHeart, OnRtHeart } from "./GetData";

  const Heart = ( {userobj ,original, tweetObj,  profile ,ownerProfile  })=> {
    const [heartBtn,setHeartBtn] =useState('fun heartBtn') ;
    const {tweetDispatch , myTweets} =useContext(TweetContext);
    const heartRef= useRef();
    useEffect(()=>{
      const notifications =tweetObj.notifications;
      if(notifications[0]!==undefined){
        const isIncludes =notifications.map(n=> n.user=== userobj.uid && n.value === "heart").includes(true);
        if(isIncludes){
          setHeartBtn('heartBtn on')   
        };
      }
    },[tweetObj]) ;


    const onHeart =(event, heartRef)=>{
      event.preventDefault();
      OnRtHeart(tweetObj,original, userobj, profile, ownerProfile, tweetDispatch, "heart" , myTweets); 
      heartRef.classList.add("on")
    };
    const offHeart =(event ,heartRef)=>{
      event.preventDefault();
      OffRtHeart("heart" ,tweetObj,original,  userobj, profile,ownerProfile, tweetDispatch , myTweets);
    heartRef.classList.remove("on")
    }

  return(

    <button 
      className={heartBtn} 
      name={heartBtn} 
      ref={heartRef}
      onClick={(event)=>{
        heartRef.current.classList.contains("on")?
        offHeart(event, heartRef.current): onHeart(event,heartRef.current)
      }}
    >
      <AiOutlineHeart/>
    </button>
  )
};

export default React.memo(Heart);