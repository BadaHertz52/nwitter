import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getProfileDoc } from '../components/GetData';
import { dbService } from '../Fbase';

const Alarm = ({userobj}) => {
  const [profile, setProfile] =useState({
    alarm:[]
  }) ;
  const [alarms ,setAlarms] =useState([]);
  
  useEffect(()=>{
    async function makeAlarm(){
      await getProfile(userobj.uid, setProfile);
      const alarm = await Promise.all(
        profile.alarm.map( async (a) =>{
          //nweet에 대한 알림
          const user_name = await getProfileDoc(a.userId).get().then(doc=>doc.data().userName);
          if(a.value !== "follow"){
            const nweetData = await dbService.collection(`nweets_${a.creatorId}`).doc(`${a.createdAt}`)
            .get()
            .then(doc => doc.data());
            // reRT 시에 NWEET은 리트윗 인용한 것이 되도록 코딩해야함 
            return {
              userName:user_name , 
              nweet:nweetData , 
              value: a.value
            }
          }
          // follow 에 대한 알림 
          if(a.value === "follow"){
            return{
              userName:user_name,
              value:a.value
            }
          }
        })
      );
      setAlarms(alarm);
    }
    makeAlarm();
  } ,[profile.alarm])

  return (
    <>
      { alarms.length >0 ?
      (alarms.map
        ( (a) => 
        ( 
        a.value !== "follow" ? (
      <div>
        <Link 
        to={{
        pathname:`/status`,
        state :{
          nweetObj :a.nweet,
          userobj : userobj,
          isOwner : true
        }
        }}>
          <div>
            {a.userName} 님이 내 트윗
            {a.value === "rn"  && '을 리트윗함' }
            {a.value === "cn"  && '을 리트윗함' }
            { a.value === "heart" && '을 마음에 들어함'}
            {a.value ==="answer" && '에 답글을 남김'}
          </div>
        </Link>
      </div>)
      :( 
        <div>
          {a.userName}님이 나를 팔로우했습니다. 
        </div>
      ))))
      :
      <div> 알림이 없습니다. </div>
      }
    </> 
)}
export default Alarm ;