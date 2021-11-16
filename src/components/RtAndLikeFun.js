import React from "react";
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react/cjs/react.development";
import { dbService } from "../Fbase";
import {  getProfileDoc } from "./GetData";

const RtAndLikeFun = ( {nweetObj ,userObj , ownerProfile ,whoProfile,})=> {
  const date = Date.now();
  const [rt,setRt]=useState({
    empty : undefined ,
    id : ""
  });
  const [heart,setHeart]=useState(
    {
      empty :undefined ,
      id : ""
    }
  ); 
  const newAlarm =(what)=>({userId:userObj.uid , creatorId : nweetObj.creatorId, createdAt: nweetObj.createdAt, value: what });
  const rtBtn = document.getElementsByClassName("rtBtn");
  const heartBtn = document.getElementsByClassName("heartBtn");
  const userObjCollection = dbService.collection(`nweets_${userObj.uid}`)  ; 

  const whereRt = userObjCollection
  .where("creatorId" , "==" , `${nweetObj.creatorId}` )
  .where("createdAt" , "==" , `${nweetObj.createdAt}`)
  .where("value" , "==" , "rt");

  const whereHeart= userObjCollection
  .where("creatorId" , "==" , `${nweetObj.creatorId}` )
  .where("createdAt" , "==" , `${nweetObj.createdAt}`)
  .where("value" , "==" , "heart");

  const checkAlarm = async()=>{
    await whereRt
    .get()
    .then(doc =>setRt({
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
  const changeBtn =(rt, heart)=> {
    rt.empty ? console.log("rt" ,!rt.empty, rtBtn.style) :console.log("rt" ,!rt.empty);
    heart.empty ? console.log("heart" ,!heart.empty, heartBtn.style) :console.log("heart" ,!heart.empty);
  };

  useEffect(()=>{
    checkAlarm();
  },[]);

  useEffect(()=>{
    changeBtn(rt,heart);
  },[rt, heart]);

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
  const Rt =(event)=>{ 
    (async()=> await checkAlarm())(); 
    console.log("rt버튼 누름" ,"rt 했던 글 인지 여부" ,!rt.empty)
    event.preventDefault();
    if(rt.empty === true){
      console.log("rt");
      const rt ={
        text: nweetObj.text,
        value :"rt",
        createdAt: nweetObj.createdAt,
        who:userObj.uid , 
        creatorId: nweetObj.creatorId,
        attachmentUrl : nweetObj.attachmentUrl
      };
    updateAlram("rt");
    userObjCollection.doc(`${date}`).set(rt);
    setRt({empty:false, id:""});
    }else if( rt.empty === false) {
    console.log("delete" )
    userObjCollection.doc(`${rt.id}`).delete();
    deleteAlarm("rt"); 
    setRt({empty:true ,id:""});
    }else{
      console.log("alarm 을 아직 불러오는 중 입니다.",  rt)
    }
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
        who:userObj.uid ,
        attachmentUrl : nweetObj.attachmentUrl
      };
      await userObjCollection.doc(`${date}`).set(heart);
      updateAlram( "heart");
      setHeart({
        empty:false ,
        id: heart.id
      });
    }else if( heart.empty === false){
      console.log("delete")
      await userObjCollection.where("text" , "==" , `${nweetObj.text}`).delete();
      deleteAlarm("heart");
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
      <button className="rtBtn" onClick={Rt} value={rt.empty}>
        <AiOutlineRetweet/>
      </button>
      <button className="heartBtn" onClick={sendHeart} value={heart.empty}>
        <AiOutlineHeart/>
      </button>
    </>
  )
};

export default RtAndLikeFun;