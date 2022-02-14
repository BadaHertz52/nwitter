import React, { useState, useEffect, useContext, useRef } from "react";
import { AiOutlineRetweet} from "react-icons/ai";
import {  useNavigate ,useLocation} from "react-router-dom";
import { TweetContext } from "../context/TweetContex";
import { OffRtHeart, OnRtHeart } from "./GetData";
import { BsPencil } from "react-icons/bs";

  const Rt = ( {userobj  ,tweetObj, original ,profile, ownerProfile})=> {
    const navigate=useNavigate();
    const location=useLocation();
    const rtRef =useRef();
    const [popup, setPopup]= useState(false);
    const [rtBtn, setRtBtn] =useState(("fun rtBtn"));
    const {tweetDispatch , myTweets} =useContext(TweetContext);
    const inner =document.getElementById('inner');

    const closePopup =(e)=>{
      const target =e.target;
      if(e &&!target.classList.contains('rt')){
        target.addEventListener('click', setPopup(false));
      };
    };
    inner !== null && inner.addEventListener('click', closePopup);

    const clickFun =async(event)=> {
      
      const onRt=()=>{
        event.preventDefault();
        rtRef.current.classList.add("on");
        OnRtHeart(tweetObj, original, userobj, profile,ownerProfile, tweetDispatch, "rt"  , myTweets)
        
      }
      const offRt=()=>{
        event.preventDefault();
        rtRef.current.classList.remove("on")
        OffRtHeart("rt" ,tweetObj,original,  userobj, profile, ownerProfile, tweetDispatch , myTweets) 
      };
    rtRef.current.classList.contains("on")? offRt() : onRt()
    }; 
    const onQute=()=>{
      localStorage.setItem("tweet", JSON.stringify({tweetObj:tweetObj, profile:{id:profile.uid, notifications:profile.notifications} ,isOwner:false}));
      
      navigate("tweet",{state:{
        previous:location.pathname,
        value:"qt"
        }
        })
    };
    useEffect(()=>{
      const notifications =tweetObj.notifications;
      if(notifications[0]!==undefined){
        const isIncludes = notifications.map(n=> n.user=== userobj.uid && (n.value === "rt"|| n.value==="qt" )).includes(true);
        if(isIncludes){
            setRtBtn('rtBtn on')
          }
      }
;
    },[]); 
        
    
  return(
    <div className="rt fun">
      <button 
        className={rtBtn} 
        name="rt" 
        ref={rtRef}
        onClick={()=>setPopup(true)}>
        <AiOutlineRetweet/>
      </button>
              {popup &&
          <div className="rt_popup fun">
            <button className="rt fun" 
            onClick={clickFun}
            >
            <AiOutlineRetweet /> 
            &nbsp;
              {rtBtn === "rtBtn" ?"Retweet" : "UndoRetweet" } 
            </button>
            <button className="rt fun" 
            onClick={onQute}
            >
              <BsPencil/>
              &nbsp;
              Quote tweet
            </button>  
          </div>
        }
    </div>
  )
}

export default Rt;