import React, { useContext, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import grey from '../asset/img/grey.png'
import { NweetContext } from '../context/NweetContex';
import { UserContext } from '../context/UserContext';
const Media =({who})=>{
  const {myNweets} =useContext(NweetContext);
  const {userNweets} =useContext(UserContext);
  const [medias, setMedias] =useState([]);
  const getMedias =async(nweets)=>{
    const filtedNweets =nweets.filter(nweet=> nweet.attachmentUrl !=="");
    let array = filtedNweets.map(nweet => nweet.attachmentUrl);
    if(array.length !==6){
      array.length >6 ? array =array.slice(0,6): addGrey();
      function addGrey (){
        for (let i = 0; array.length<6; i++) {
          array.push(grey);
        };
      }
    };
    setMedias(array);
    };

  useEffect(()=>{
    switch (who) {
      case "currentUser":
        getMedias(myNweets)
        break;
      case "user":
        getMedias(userNweets)
      default:
        break;
    }
  },[myNweets ,userNweets]);

    return (
      <div id="media">
        { medias.map( media =>  
        <img  src={media} alt="side_media" key={`media`}/>
        )}
      </div>
    )
};


export default Media;