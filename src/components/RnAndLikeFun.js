import React from "react";
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react/cjs/react.development";
import { dbService } from "../Fbase";
import {  getProfileDoc } from "./GetData";

const RnAndLikeFun = ( {nweetObj ,userobj , ownerProfile ,whoProfile,})=> {
  
  const [rn,setRn]=useState({
    empty : undefined ,
    id : ""
  });
  const [heart,setHeart]=useState(
    {
      empty :undefined ,
      id : ""
    }
  ); 
  const [rnBtn,setRnBtn]= useState("rhBtn"); //rn & heart btn
  const [heartBtn,setHeartBtn]= useState("rhBtn");
  const date = Date.now();
  const newAlarm =(what)=>({userId:userobj.uid , creatorId : nweetObj.creatorId, createdAt: nweetObj.createdAt, value: what });
  const userobjCollection = dbService.collection(`nweets_${userobj.uid}`)  ; 
  const rnToggle =document.querySelectorAll('.rnToggle');

  const whereRn = userobjCollection
  .where("creatorId" , "==" , `${nweetObj.creatorId}` )
  .where("createdAt" , "==" , `${nweetObj.createdAt}`)
  .where("value" , "==" , "rn");

  const whereHeart= userobjCollection
  .where("creatorId" , "==" , `${nweetObj.creatorId}` )
  .where("createdAt" , "==" , `${nweetObj.createdAt}`)
  .where("value" , "==" , "heart");

  const checkAlarm = async()=>{
    await whereRn
    .get()
    .then(doc =>setRn({
      empty:doc.empty ,
      id: doc.docs.map(d=> d.id)[0]
    }))
    .catch(error => console.log("Error" , error))
    ;

    await whereHeart
    .get()
    .then(doc =>setHeart({
      empty:doc.empty ,
      id: doc.docs.map(d=> d.id)[0]
    }) )
    .catch(error => console.log("Error" , error)); 
  };
  const changeBtnName = (rn, heart)=>{
    rn.empty ? setRnBtn("rhBtn") : setRnBtn("rhBtn on");
    heart.empty ? setHeartBtn("rhBtn") : setHeartBtn("rhBtn on");
  };
  useEffect(()=>{
    checkAlarm();
    rnToggle.forEach(toggle=> toggle.style.display="none") ;
  },[]);

  useEffect(()=>{
    changeBtnName(rn, heart)
  },[rn, heart]);

  const updateAlram = (what)=> {
    //data : nweetObj 
    const ownerAlarm  = ownerProfile.alarm ; 
    
    //  nweet  원래 작성자
    ownerAlarm.unshift(newAlarm(what));
    getProfileDoc(nweetObj.creatorId).set({alarm: ownerAlarm},{merge:true}) ;
    // rn, heart한 작성자 
    if(nweetObj.who){
      const whoAlarm = whoProfile.alarm ; 
      whoAlarm.unshift(newAlarm(what));
    getProfileDoc(nweetObj.who).set({alarm: whoAlarm},{merge:true}) ;
    } 
  };
  
  const deleteAlarm = (what) => {
    const ownerAlarm = ownerProfile.alarm;
    const filterAlarm =(a)=> {
      if (a.creatorId === newAlarm(what).creatorId &&
      a.createdAt === newAlarm(what).createdAt &&
      a.userId === newAlarm(what).userId &&
      a.value === newAlarm(what).value) {
        return false
      }
      return true ;  
    };
    const newOwnerAlarm =ownerAlarm.filter(a=>filterAlarm(a));
    getProfileDoc(nweetObj.creatorId).set({alarm :newOwnerAlarm} ,{merge:true});
    if(nweetObj.who){
      const whoAlarm =whoProfile.alarm ;
      const newWhoAlarm = whoAlarm.filter(a=>filterAlarm(a)) ;
      getProfileDoc(nweetObj.who).set({alarm:newWhoAlarm} ,{merge:true});
    }
  };
  const reNToggle =async(event)=>{
    event.preventDefault();
    const toggleTarget = await event.target.parentNode.nextSibling;
    if( toggleTarget !== null ){
      toggleTarget.style.display === "none" ? 
      toggleTarget.style.display="block" 
      : toggleTarget.style.display="none" ;
      console.log(toggleTarget.style.display);
        if( rn.empty === false) {
      toggleTarget.style.display="none";
      console.log("CANCLE RN" )
      userobjCollection.doc(`${rn.id}`).delete();
      userobj.uid !== nweetObj.creatorId && deleteAlarm("rn"); 
      setRn({empty:true ,id:""});
      }else if(rn.empty === true){
        toggleTarget.style.display ="block"
      }
    }
  };
  const reNweet =(event)=>{ 
    (async()=> await checkAlarm())(); 
    console.log("rn버튼 누름" ,"rn 했던 글 인지 여부" ,!rn.empty)
    event.preventDefault();
    const toggleTarget = event.target.parentNode.nextSibling;
    console.log(toggleTarget);
    // if(toggleTarget !== null){
    //   console.log("re nweet");
    //   const rn ={
    //     text: nweetObj.text,
    //     value :"rn",
    //     createdAt: nweetObj.createdAt,
    //     who:userobj.uid , 
    //     creatorId: nweetObj.creatorId,
    //     attachmentUrl : nweetObj.attachmentUrl
    //   };
    //   userobj.uid !== nweetObj.creatorId && updateAlram("rn");
    //   userobjCollection.doc(`${date}`).set(rn);
    //   setRn({empty:false, id:""});
    //   toggleTarget.style.display ="none"
    // } 
    };
  
  const citingNweet=(event)=>{
    const toggleTarget = event.target.parentNode ;
    toggleTarget !== null && (toggleTarget.style.display ="none" );
    //citing Nweet page로 이동 
    
  };
  const sendHeart = async (event) => {
    console.log("heart버튼 누름" , "heart 한 적 있는 글인지 " ,!heart.empty)
    event.preventDefault();
    await checkAlarm();
    if(heart.empty === true){
      console.log("heart");
      const heart ={
        text: nweetObj.text,
        value :"heart",
        createdAt:nweetObj.createdAt,
        creatorId: nweetObj.creatorId,
        who:userobj.uid ,
        attachmentUrl : nweetObj.attachmentUrl
      };
      await userobjCollection.doc(`${date}`).set(heart);
      userobj.uid !== nweetObj.creatorId && updateAlram( "heart");
      setHeart({
        empty:false ,
        id: heart.id
      });
    }else if( heart.empty === false){
      console.log("delete")
      await userobjCollection.where("text" , "==" , `${nweetObj.text}`).delete();
    userobj.uid !== nweetObj.creatorId && deleteAlarm("heart");
    setHeart({
      empty:true ,
      id:""
    });
    }
    else {
      console.log( heart , "alarm 을 불러오는 중 입니다.")
    }
  };

  return(
    <>
      <button className={rnBtn} onClick={reNToggle} name="rn" >
        <AiOutlineRetweet/>
      </button>
      <div className="rnToggle">
          <button onClick={reNweet}>리트윗</button>
          <button onClick={citingNweet}>트윗 인용하기</button>
        </div>
      <button className={heartBtn} onClick={sendHeart} name="heart">
        <AiOutlineHeart/>
      </button>  
    </>
  )
};

export default RnAndLikeFun;