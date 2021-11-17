import React, { useEffect, useState } from 'react';
import { AiFillInstagram } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getNweets, getProfile, getProfileDoc } from '../components/GetData';
import { dbService } from '../Fbase';

const Alarm = ({userObj}) => {
  const [profile, setProfile] =useState({
    alarm:[]
  }) ;
  const [alarms ,setAlarms] =useState([]);

  useEffect(()=>{
    getProfile(userObj.uid, setProfile);
    async function makeAlarm(){
      const alarm = await Promise.all (profile.alarm.map( async (a) =>{
        const user_name = await getProfileDoc(a.userId).get().then(doc=>doc.data().userName);
        const nweetData = await dbService.collection(`nweets_${a.creatorId}`).doc(`${a.createdAt}`).get().then(doc => doc.data());
        return {userName:user_name , nweet:nweetData , value: a.value}
      }));
    setAlarms(alarm);
    }
    makeAlarm();
  } ,[profile.alarm])

  return (
    <>
      { alarms.length >0 &&
      (alarms.map( (a) => (
      <div>
        <Link 
        to={{
        pathname:"/nweet",
        state :{
          nweetObj : a.nweet,
          userObj : userObj,
          isOwner : true
        }}}>
          <div>
          {a.userName} 님이 내 트윗을  {a.value === "rt" ? '리트윗' : '마음에 들어함'} 함
          </div>
        </Link>
      </div>)))
      }
    </> 
)}
export default Alarm ;