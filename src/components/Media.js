import React, { useContext, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import grey from '../asset/img/grey.png'
import { TweetContext } from '../context/TweetContex';
import { UserContext } from '../context/UserContext';
const Media =({who})=>{
  const {myTweets} =useContext(TweetContext);
  const {userTweets} =useContext(UserContext);
  const [medias, setMedias] =useState([]);
  const getMedias =async(tweets)=>{
    const filtedtweets =tweets.filter(tweet=> tweet.attachmentUrl !=="");
    let array = filtedtweets.map(tweet => tweet.attachmentUrl);
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
        getMedias(myTweets)
        break;
      case "user":
        getMedias(userTweets);
        break;
      default:
        break;
    }
  },[myTweets ,userTweets]);

    return (
      <div id="media">
        { medias.map( media =>  
        <img  src={media} alt="side_media" key={`media`}/>
        )}
      </div>
    )
};


export default Media;