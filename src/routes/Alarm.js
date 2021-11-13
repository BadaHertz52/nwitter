import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {  getProfileDoc } from '../components/GetData';
import { dbService } from '../Fbase';

const Alarm =async ({userObj}) => {
  const getDocs = await dbService.collection(`nweets_${userObj.uid}`).where('alarm' , '==' , true).get();
  const Docs = getDocs.docs.map(doc=> doc.data());
  const getUserName = (id)=>  getProfileDoc(id).get().then(doc=> ({
    name: doc.data().userName ,
    userId: id}));

  const getAlarm = async () =>{
    await Promise.all 
      (Docs.map( (doc) =>{
        const getNames =(alarm)=> Promise.all ( alarm.map(id => getUserName(id) ).concat({nweet:doc})) ;
        const heartNames= getNames(doc.heartAlarm);
        return ( 
        heartNames
      )
    }))
    .then(values => console.log(values ))
    .catch(err => console.log('Erro', err));
  };

  useEffect(()=>{
    //getRtAlarm();
    getAlarm();
  },[])
  return (
    <>
      <div id='alarm'>

      </div>
    </> 
)}
export default Alarm ;