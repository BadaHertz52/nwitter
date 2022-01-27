import React, { useState, useEffect, useContext } from "react";
import { AiOutlineRetweet} from "react-icons/ai";
import {  useNavigate ,useLocation} from "react-router-dom";
import { NweetContext } from "../context/NweetContex";
import { OffRnHeart, OnRnHeart } from "./GetData";
import { BsPencil } from "react-icons/bs";
import { useRef } from "react/cjs/react.development";
  const Rn = ( {userobj  ,nweetObj, original ,profile, ownerProfile})=> {
    const navigate=useNavigate();
    const location=useLocation();
    const rnRef =useRef();
    const [popup, setPopup]= useState(false);
    const [rnBtn, setRnBtn] =useState(("fun rnBtn"));
    const {nweetDispatch , myNweets} =useContext(NweetContext);
    const inner =document.getElementById('inner');

    const closePopup =(e)=>{
      const target =e.target;
      if(e &&!target.classList.contains('rn')){
        target.addEventListener('click', setPopup(false));
      };
    };
    inner !== null && inner.addEventListener('click', closePopup);

    const clickFun =async(event)=> {
      
      const onRn=()=>{
        event.preventDefault();
        rnRef.current.classList.add("on");
        OnRnHeart(event ,nweetObj, original, userobj, profile,ownerProfile, nweetDispatch, "rn"  , myNweets)
        
      }
      const offRn=()=>{
        event.preventDefault();
        rnRef.current.classList.remove("on")
        OffRnHeart(event ,"rn" ,nweetObj,original,  userobj, profile, ownerProfile, nweetDispatch , myNweets) 
      };
    rnRef.current.classList.contains("on")? offRn() : onRn()
    }; 
    const onQute=()=>{
      navigate("nweet",{state:{
        previous:location.pathname,
          nweetObj:nweetObj,
          profile:{uid:profile.uid, notifications:profile.notifications}, 
          isOwner:false ,
          value : "qn"}
        })
    };
    useEffect(()=>{
      const notifications =nweetObj.notifications;
      if(notifications[0]!==undefined){
        const isIncludes = notifications.map(n=> n.user=== userobj.uid && (n.value === "rn"|| n.value==="qn" )).includes(true);
        if(isIncludes){
            setRnBtn('rnBtn on')
          }
      }
;
    },[]); 
        
    
  return(
    <div className="rn fun">
      <button 
        className={rnBtn} 
        name="rn" 
        ref={rnRef}
        onClick={()=>setPopup(true)}>
        <AiOutlineRetweet/>
      </button>
              {popup &&
          <div className="rn_popup fun">
            <button className="rn fun" 
            onClick={clickFun}
            >
            <AiOutlineRetweet /> 
            &nbsp;
              {rnBtn === "rnBtn" ?"ReNweet" : "UndoRenweet" } 
            </button>
            <button className="rn fun" 
            onClick={onQute}
            >
              <BsPencil/>
              &nbsp;
              Quote Nweet
            </button>  
          </div>
        }
    </div>
  )
}

export default Rn;