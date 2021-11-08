import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getProfileDoc } from '../components/GetData';

const Alarm = ({userObj}) => {
  const [profile, setProfile] =useState({
    alarm:[]
  }) ;
  let alarms =[];
  const makeAlarm =async() =>{
    // userName 가져오기 
    const nameArry = await Promise.all(
      profile.alarm.map( a =>{
        ;
      return getProfileDoc(a.who).get().then(doc=>doc.data().userName)
    }));
    // userName 과  rt or heart  조합하기 
    for(let i=0 ;i<profile.alarm.length ;i++){
      alarms.push({who:nameArry[i], how: profile.alarm[i].how});};
      console.log(alarms ,alarms[0] !== undefined)
  };

  useEffect(()=>{
    getProfile(userObj.uid, setProfile);
    makeAlarm();
  } ,[])


  return (
    <>
      { alarms? 
      (alarms.map( (a) => (
      <div>
        아
        <Link 
        to={{
        pathname:"/profile",
        state :{
          nweetObj : a.what,
          userObj : userObj,
          isOwner : true
        }}}>
          <div>
          {a.who} 님이 {a.how === "rt" ? '리트윗' : '마음에 들어함'} 함
          </div>
        </Link>
      </div>)))
      :
      <div></div>
      }
    </> 
)}
export default Alarm ;