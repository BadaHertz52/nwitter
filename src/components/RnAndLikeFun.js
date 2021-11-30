import React from "react";
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { dbService } from "../Fbase";
import {  getProfileDoc } from "./GetData";

const RnAndLikeFun = ( {nweetObj ,userobj , ownerProfile ,whoProfile,})=> {

  const [heart,setHeart]=useState({
    empty :undefined ,
    id : "" //heart 했을 시 해당 doc.id
  });
  const [rn,setRn]=useState({
    empty : undefined ,
    id : ""
  }
  );
  const [rnBtn,setRnBtn]= useState("rhBtn"); //rn & heart btn
  const [rnPopup, setRnPop] =useState("rnPopup");
  const [heartBtn,setHeartBtn]= useState("rhBtn");
  const date =JSON.stringify(Date.now()) ;
  const body= document.querySelector("body");

  const userobjCollection = dbService.collection(`nweets_${userobj.uid}`)  ;
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
  const newAlarm =(what)=>({userId:userobj.uid , creatorId : nweetObj.creatorId, createdAt: nweetObj.createdAt, value: what });

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
 
  
  const popup = (event)=>{
    const target = event.target.parentNode;
    if(target.className){
      !target.classList.contains("rhBtn") && rnPopup=="rnPopup show"&& setRnPop("rnPopup");
    }else{
      setRnPop("rnPopup");
    }
  };
  const popupRn =async(event)=>{
    event.preventDefault();
    if( rn.empty === false) {
      //rn 해제 
      console.log("CANCLE RN" )
      userobjCollection.doc(`${rn.id}`).delete();
      userobj.uid !== nweetObj.creatorId && deleteAlarm("rn");
      setRn({empty:true ,id:""});
      }
      if(rn.empty === true){        // rn와 인용 
          //popup  창 띄우기 
        setRnPop("rnPopup show");
          //popup 창 닫기
        body.addEventListener('click', popup);
      }
  };
  const reNweet =(event)=>{
    event.preventDefault();
    console.log("re nweet");
    const rn ={
      text: nweetObj.text,
      value :"rn",
      createdAt: nweetObj.createdAt,
      who:userobj.uid , //who는 rt,heart 시에 생성됨 
      creatorId: nweetObj.creatorId,
      attachmentUrl : nweetObj.attachmentUrl,
      alarm:false,
      rnAlarm:[],
      heartAlarm:[],
      answer: null,
      citingNweet:null,
    };
    userobj.uid !== nweetObj.creatorId && updateAlram("rn");
    userobjCollection.doc(`${date}`).set(rn);
    setRn({empty:false, id:date}); 
    };

  const sendHeart = async (event) => {
    console.log("heart버튼 누름")
    event.preventDefault();
    if(heart.empty === true){
      console.log("send heart");
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
        id:date
      });
    }else if( heart.empty === false){
      console.log("delete heart")
      await userobjCollection.doc(`${heart.id}`).delete();
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
  useEffect(()=>{
    checkAlarm();
    return()=>{
      setRn({
        empty :undefined ,
      });
      setHeart({
        empty :undefined ,
      });
    }
  },[]);

  useEffect(()=>{
    changeBtnName(rn, heart);
    return ()=>{
      setRnBtn("rhBtn") ;
      setHeartBtn("rhBtn")   }
  },[rn, heart]);

  return(
    <div className="">
      <button className={rnBtn} onClick={popupRn} name="rn" >
        <AiOutlineRetweet/>
      </button>
      <div className={rnPopup}>
          <button onClick={reNweet}>리트윗</button>
          <button>
            <Link to={{
              pathname:'/nweet',
              state:{
                userobj: userobj,
                nweetObj:nweetObj,
                isOwner:false ,
                value : "cn"}
              
            }}>
            트윗 인용하기
            </Link>
          </button>
        </div>
      <button className={heartBtn} onClick={sendHeart} name="heart">
        <AiOutlineHeart/>
      </button>
    </div>
  )
};

export default RnAndLikeFun;