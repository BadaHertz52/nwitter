import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {  getProfileDoc } from '../components/GetData';
import { dbService } from '../Fbase';

const Alarm = ({userObj}) => {
  //const [heart , setHeart] =useState([]);
  //const [rt , setRt] =useState([]);
  const [alarms, setAlarms]= useState();

  const getAlarm = async() =>{
    const getDocs =  await dbService.collection(`nweets_${userObj.uid}`).where('alarm' , '==' , true).get();
  
    const getUserName = (id)=>  getProfileDoc(id).get().then(doc=> ({
      name: doc.data().userName ,
      userId: id}));
  
    const Docs = getDocs.docs.map(doc=> doc.data());

    await Promise.all 
      (Docs.map( (doc) => { 
        const users = []; 
        doc.heartAlarm.length >0 &&  users.push(
        Promise.all ( doc.heartAlarm.map(id => getUserName(id) ).concat({nweet:doc , value :"heart"})) ) ;

        doc.rtAlarm.length>0 && users.push(
        Promise.all ( doc.rtAlarm.map(id => getUserName(id) ).concat({nweet:doc , value :"rt"}))); 
        return users 
      } 
        //const heartUsers = getNames(doc.heartAlarm ,"heart") ;
        //const rtUsers = getNames(doc.rtAlarm ,"rt") ;
    ))
    .then(values => {setAlarms(values); console.log(alarms)})
    .catch(err => console.log('Erro', err));

    // await Promise.all 
    //   (Docs.map( (doc) => doc.rtAlarm.length >0 &&
    //     Promise.all ( doc.rtAlarm.map(id => getUserName(id) ).concat({nweet:doc , value :"rt"})) 
    //     const heartUsers = getNames(doc.heartAlarm ,"heart") ;
    //     const rtUsers = getNames(doc.rtAlarm ,"rt") ;
    // ))
    // .then(values =>  setRt(values))
    // .catch(err => console.log('Erro', err));
    
  };

  // const makeAlarm = async()=>{
  //   await getAlarm();
  //   setAlarms({
  //     heartAlarm :heart ,
  //     rtAlarm:rt
  //   })
    
  // }
  useEffect(()=>{
    //getRtAlarm();
    getAlarm();
    console.log(alarms)
  },[])

  return (
    <>
      <div id='alarm'>
        {/* {Array.isArray(alarms)&& 
          alarms.ma[]
        } */}
      </div>
    </> 
)}
export default Alarm ;