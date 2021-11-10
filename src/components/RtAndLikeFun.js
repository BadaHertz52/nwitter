import React from "react";
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useState } from "react/cjs/react.development";
import { dbService } from "../Fbase";


const RtAndLikeFun = ( {nweetObj ,userObj})=> {
  const date = Date.now();
  const [rt_alarm, setRtAlarm] =useState(nweetObj.rtAlarm);
  const [heart_alarm, setHeartAlarm] = useState(nweetObj.heartAlarm) ;
  const db_nweetObj = dbService.collection(`nweets_${nweetObj.creatorId}`).doc(`${nweetObj.id}`) ;
  const originCreatedAt =JSON.stringify(nweetObj.createdAt) ;
  const originDoc = dbService.collection(`nweets_${nweetObj.creatorId}`).doc(`${originCreatedAt}`);
  const whoDoc =dbService.collection(`nweets_${nweetObj.who}`).doc(`${nweetObj.id}`);

  const Rt =async(event)=>{ 
    event.preventDefault();
    const rt ={
      text: nweetObj.text,
      value :"rt",
      createdAt: nweetObj.createdAt,
      who:userObj.uid , 
      creatorId: nweetObj.creatorId,
      attachmentUrl : nweetObj.attachmentUrl,
      alarm: false,
      rtAlarm :[],
      heartAlarm:[]
    };
    //RT 한 user db 에 저장 
    dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set(rt);

    //update Alarm 
    rt_alarm.push(userObj.uid);
    setRtAlarm(rt_alarm);
    if(nweetObj.value === "nweet"){
      db_nweetObj.set({rtAlarm :rt_alarm , alarm: true},{merge:true});
    }else{
      //다른 사람의 rt or heart에 rt 한 경우 
      //1. 원본 nweet에 알림
        const originRt = await originDoc.get().then(doc=> doc.data().rtAlarm);
        originRt.push(userObj.uid);
        originDoc.set({
          rtAlarm :originRt
        },{merge:true})
      // 2. rt, heart 한  유저에게 알림
        whoDoc.set({
          rtAlarm: rt_alarm
        },{merge:true})
    }
    };

  const sendHeart =async (event) => {
    event.preventDefault();
    const heart ={
      text: nweetObj.text,
      value :"heart",
      createdAt:nweetObj.createdAt,
      creatorId: nweetObj.creatorId,
      who:userObj.uid ,
      attachmentUrl : nweetObj.attachmentUrl,
      alarm :false,
      rtAlarm :[],
      heartAlarm:[]
    };
    // heart 한 user의 db 에 저장 
    dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set(heart);

    //update Alarm 
    heart_alarm.push(userObj.uid);
    setHeartAlarm(heart_alarm);

    if(nweetObj.value === "nweet"){
      db_nweetObj.set({heartAlarm :heart_alarm , alarm: true},{merge:true});
    }else{
      //다른 사람의 rt or heart에 heart 를 누를 경우 
      //1. 원본 nweet에 알림
        const originHeart = await originDoc.get().then(doc=> doc.data().heartAlarm);
        originHeart.push(userObj.uid);
        originDoc.set({
          heartAlarm :originHeart
        },{merge:true})
      // 2. rt, heart 한  유저에게 알림
        whoDoc.set({
          heartAlarm: heart_alarm
        },{merge:true})
    }

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