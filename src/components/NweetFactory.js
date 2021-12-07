import React, { useEffect, useState } from 'react';
import { dbService, storageService } from '../Fbase';
import {v4 as uuidv4} from 'uuid';
import { useHistory } from 'react-router';
import Nweet from './Nweet';
import { getProfile, getProfileDoc } from './GetData';
import { Link } from 'react-router-dom';
import {HiOutlinePhotograph} from "react-icons/hi";
import Cropper from './Cropper';

const NweetFactory = ({userobj}) => {
  const initialCrop ={
    unti:'%',
    aspect:16/9,
    width:100
  };
  const [nweet, setNweet] = useState("");
  const [attachment ,setAttachment] = useState("");
  const [cropPopup, setCropPopup]=useState(false);
  const date = JSON.stringify(Date.now());
  const history =useHistory();
  const historyState =history.location.state;
  const [profile, setProfile]=useState({photoUrl:""});
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
    //알림
    if(historyState !==undefined && userobj.uid !== historyState.nweetObj.creatorId){
      const newAlarm ={userId:userobj.uid , creatorId : historyState.nweetObj.creatorId, createdAt: historyState.nweetObj.createdAt, value: historyState.value , docId: historyState.value =="cn"? date:null } ;
      profile.alarm.unshift(newAlarm);
      getProfileDoc(historyState.nweetObj.creatorId).update({alarm:profile.alarm });
      }
    history.goBack();
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
  const OnEditAttachment =(event)=>{
    event.preventDefault();
    setCropPopup(true);
  }
  useEffect(()=>{
    const getHistoryNweetObj =async()=>{
      if( historyState !== undefined){
      await getProfile(historyState.nweetObj.creatorId ,setProfile);
    };
    }
    getHistoryNweetObj();
  },[])

  return (
    <>
      { historyState !== undefined && (historyState.value === "answer" &&
        <div id="answerNweet">
          <Nweet nweetObj={historyState.nweetObj}  userobj={historyState.userobj} isOwner ={isOwner} />
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
              <img src={profile.photoUrl} width="100px" height="100px" alt="userProfilePhoto"/>
              <div className="content">
                <div className="text">
                  {historyState.nweetObj.text}
                </div>
              {historyState.nweetObj.attachmentUrl &&
                <div className="attachment">
                  <img src={historyState.nweetObj.attachmentUrl}  max-width="50px" height="50px" alt="Nweet_attachment"/>
                </div>
              }
              </div>
            </div>

          )}
          <label for="nweet_fileBtn"><HiOutlinePhotograph style={{fontSize:"1.5rem"}}/></label>
          <input type="file" accept="image/*" id="nweet_fileBtn" style={{display:"none"}} onChange={onFileChange} />
          <input type="submit" value="Nweet" />
          {attachment !== ""&& (
            <div>
              <img src={attachment} width="50px"  height="50px" alt="nweet attachment"/>
              <button onClick={onClearAttachment}>x</button>
              <button onClick={OnEditAttachment}>수정</button>
            </div>
          )}
          {cropPopup &&
            <Cropper  initialCrop={initialCrop} src={attachment} setAttachment={setAttachment} setCropPopup={setCropPopup}/>
          }
        </form>
      </div>

  </>
  )
}

export default NweetFactory ;