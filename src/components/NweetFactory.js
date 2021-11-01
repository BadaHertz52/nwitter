import React, { useEffect, useState } from 'react';
import { dbService, storageService } from '../Fbase';
import {v4 as uuidv4} from 'uuid';
import { getNweets, HomeNeets } from './GetData';

const NweetFactory = ({userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment ,setAttachment] = useState("");
  const [myNweets, setMyNweets]=useState([]);
  const getMyNweets =()=> {
    getNweets(userObj.uid , setMyNweets);
    console.log("myNweets 가져옴" , myNweets);
  };
  const date =Date.now();

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if(attachment !== ""){
      
      const attachmentRef =storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl =await response.ref.getDownloadURL();
    }
    await dbService.collection(`nweets_${userObj.uid}`).doc(`${date}`).set({
      text:nweet,
      createdAt: date,
      creatorId: userObj.uid ,
      attachmentUrl
    });
    setNweet("");
    setAttachment("");
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
  useEffect( ()=>{
    getMyNweets();
  },[nweet]);
  return (
    <>
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
      <HomeNeets userObj={userObj} myNweets={myNweets}/>
  </>
  )
}

export default NweetFactory ; 