import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {  getProfileDoc } from '../components/GetData';
import { dbService } from '../Fbase';

const Alarm = ({userObj}) => {
  const [heart , setHeart] =useState([]);
  const [rt , setRt] =useState([]);

  const getAlarm =async () =>{
    const getDocs =  await dbService.collection(`nweets_${userObj.uid}`).where('alarm' , '==' , true).get();
  
    const getUserName = (id)=>  getProfileDoc(id).get().then(doc=> ({
      name: doc.data().userName ,
      userId: id}));
  
    const Docs = getDocs.docs.map(doc=> doc.data());

    await Promise.all 
      (Docs.map( (doc) => doc.heartAlarm.length >0 &&
        Promise.all ( doc.heartAlarm.map(id => getUserName(id) ).concat({nweet:doc , value :"heart"})) 
        //const heartUsers = getNames(doc.heartAlarm ,"heart") ;
        //const rtUsers = getNames(doc.rtAlarm ,"rt") ;
    ))
    .then(values => setHeart(values))
    .catch(err => console.log('Erro', err));

    await Promise.all 
      (Docs.map( (doc) => doc.rtAlarm.length >0 &&
        Promise.all ( doc.rtAlarm.map(id => getUserName(id) ).concat({nweet:doc , value :"rt"})) 
        //const heartUsers = getNames(doc.heartAlarm ,"heart") ;
        //const rtUsers = getNames(doc.rtAlarm ,"rt") ;
    ))
    .then(values =>  setRt(values))
    .catch(err => console.log('Erro', err));
    
    
  };

  useEffect(()=>{
    //getRtAlarm();
    getAlarm();
    console.log(heart, rt)
  },[])
  return (
    <>
      <div id='alarm'>

      </div>
    </> 
)}
export default Alarm ;