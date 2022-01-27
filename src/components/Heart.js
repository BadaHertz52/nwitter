import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { NweetContext } from "../context/NweetContex";
import { OffRnHeart, OnRnHeart } from "./GetData";

  const Heart = ( {userobj ,original, nweetObj,  profile ,ownerProfile  })=> {
    const [heartBtn,setHeartBtn] =useState('fun heartBtn') ;
    const {nweetDispatch , myNweets} =useContext(NweetContext);
    const heartRef= useRef();
    useEffect(()=>{
      const notifications =nweetObj.notifications;
      if(notifications[0]!==undefined){
        const isIncludes =notifications.map(n=> n.user=== userobj.uid && n.value == "heart").includes(true);
        if(isIncludes){
          setHeartBtn('heartBtn on')   
        };
      }
    },[nweetObj]) ;


    const onHeart =(event, heartRef)=>{
      event.preventDefault();
      OnRnHeart(event ,nweetObj,original, userobj, profile, ownerProfile, nweetDispatch, "heart" , myNweets); 
      heartRef.classList.add("on")
    };
    const offHeart =(event ,heartRef)=>{
      event.preventDefault();
      OffRnHeart(event, "heart" ,nweetObj,original,  userobj, profile,ownerProfile, nweetDispatch , myNweets);
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

export default Heart;