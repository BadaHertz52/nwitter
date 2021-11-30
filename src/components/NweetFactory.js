import React, { useEffect, useState } from 'react';
import { dbService, storageService } from '../Fbase';
import {v4 as uuidv4} from 'uuid';
import { useHistory } from 'react-router';
import Nweet from './Nweet';
import { getProfile, getProfileDoc } from './GetData';
import { Link } from 'react-router-dom';

const NweetFactory = ({userobj}) => {
  const [nweet, setNweet] = useState("");
  const [attachment ,setAttachment] = useState("");
  const date = JSON.stringify(Date.now());
  const history =useHistory();
  const historyState =history.location.state;
  const[historyNweetObj ,setHistoryNweetObj] =useState({
    value : null,
    nweetObj:{ creatorId: "id" , createdAt:"date"},
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
      value :historyState !== undefined? historyState.value : "nweet",
      createdAt: JSON.stringify(date) ,
      creatorId: userobj.uid ,
      attachmentUrl,
      alarm : false,
      rnAlarm:[],
      heartAlarm:[],
      answer: historyState !== undefined ? historyState.value === "answer" && historyState.nweetObj : null,
      citingNweet:historyState !== undefined ? historyState.value === "cn" && historyState.nweetObj : null
    };
    await dbService.collection(`nweets_${userobj.uid}`).doc(`${date}`).set(newNweet);
    setNweet("");
    setAttachment("");

    if(historyState !==undefined){
    const newAlarm = {userId:userobj.uid , creatorId : historyNweetObj.nweetObj.creatorId, createdAt: historyNweetObj.nweetObj.createdAt, value: "answer" } ;
    //내 nweet에 대한 나의 답글,인용 알람x
    if(userobj.uid !== historyNweetObj.userobj.uid){
      profile.alarm.unshift(newAlarm);
      getProfileDoc(historyNweetObj.nweetObj.creatorId).update({alarm:profile.alarm });
    }
    history.push('/')
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
    const getHistoryNweetObj =async()=>{
      if( historyState !== undefined){
      setHistoryNweetObj(historyState);
      await getProfile(historyNweetObj.nweetObj.creatorId ,setProfile);
    };
    }
    getHistoryNweetObj();
    
  },[])

  return (
    <>
      { historyState !== undefined && (historyState.value === "answer" &&
        <div id="answerNweet">
          <Nweet nweetObj={historyNweetObj.nweetObj}  userobj={historyNweetObj.userobj} isOwner ={isOwner} />
        </div>
      )}
      <div className="nweetFactory">
        <div className="userProfile">
              <Link  to={{
                pathname:`/${userobj.id}`,
              }}>
                <img src={userobj.photoURL}  
                  width="50px" height="50px"    alt="profile"/>
              </Link>
        </div>
        <form onSubmit={onSubmit}>
          <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="무슨 일이 일어나고 있나요?"
            maxLength={120}
          />
          {historyState !== undefined &&(
            historyState.value === "cn" &&
            <div className="cnNweet">
              <Nweet nweetObj={historyNweetObj.nweetObj}  userobj={historyNweetObj.userobj} isOwner ={isOwner} />
            </div>

          )}
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