import React, { useEffect, useState } from 'react';
import { dbService, storageService } from '../Fbase';
import {v4 as uuidv4} from 'uuid';
import { useHistory } from 'react-router';
import Nweet from './Nweet';
import { getProfile, getProfileDoc } from './GetData';

const NweetFactory = ({userobj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment ,setAttachment] = useState("");
  const date = JSON.stringify(Date.now());
  const history =useHistory();
  const[historyNweetObj ,setHistoryNweetObj] =useState({
    value :"",
    nweetObj:{ creatorId:"null" , createdAt:"null"},
    userobj:{}
  })  ;
  const [profile, setProfile]=useState();
  const isOwner =false ;
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if(attachment !== ""){
      
      const attachmentRef =storageService.ref().child(`${userobj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl =await response.ref.getDownloadURL();
    };
    const newNweet = {
      text:nweet,
      value :historyNweetObj.value !=="answer" ? "nweet" : "answer",
      createdAt: JSON.stringify(date) ,
      creatorId: userobj.uid ,
      attachmentUrl,
      alarm : false,
      rtAlarm:[],
      heartAlarm:[],
      answer: historyNweetObj.nweetObj
    };
    await dbService.collection(`nweets_${userobj.uid}`).doc(`${date}`).set(newNweet);
    setNweet("");
    setAttachment("");

    if(history.location.state !==undefined){
    const newAlarm = {userId:userobj.uid , creatorId : historyNweetObj.nweetObj.creatorId, createdAt: historyNweetObj.nweetObj.createdAt, value: "answer" } ;
    profile.alarm.unshift(newAlarm);
    getProfileDoc(historyNweetObj.nweetObj.creatorId).update({alarm:profile.alarm })
  }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange =(event) => {
  const {
    target:{files}
  } = event ;
  const theFile =files[0];
  const reader = new FileReader(); 
  reader.onloadend = (finishedEvent) =>{
    const { currentTarget : {result}} = finishedEvent;
    setAttachment (result);
    
  };
  reader.readAsDataURL(theFile);
  };
  const onClearAttachment = ()=> {
    setAttachment(null);
  };

  useEffect(()=>{
    setHistoryNweetObj(history.location.state);
    console.log(historyNweetObj);
    historyNweetObj.nweetObj.creatorId !== "null" && getProfile(historyNweetObj.nweetObj.creatorId ,setProfile);
  },[])

  return (
    <>
      { history.location.state !== undefined &&
        <div className="answerNweet">
          <Nweet nweetObj={historyNweetObj.nweetObj}  userobj={historyNweetObj.userobj} isOwner ={isOwner} />
        </div>
      }
      <div className="nweetFactory">
        <form onSubmit={onSubmit}>
          <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="무슨 일이 일어나고 있나요?"
            maxLength={120}
          />
          <input type="file" accept="image/*" onChange={onFileChange} />
          <input type="submit" value="Nweet" />
          {attachment && (
            <div>
              <img src={attachment} width="50px"  height="50px" alt="nweet attachment"/>
              <button onClick={onClearAttachment}>Clear</button>
            </div>
          )}
        </form>
      </div>
  </> 
  )
}

export default NweetFactory ; 