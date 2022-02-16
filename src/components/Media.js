import React, { useContext, useState , useEffect} from 'react';
import grey from '../asset/img/grey.png'
import { TweetContext } from '../context/TweetContex';
import { UserContext } from '../context/UserContext';
const Media =({who})=>{
  const {myTweets} =useContext(TweetContext);
  const {userTweets} =useContext(UserContext);
  const [medias, setMedias] =useState([]);
  const getMedias =async(tweets)=>{
    const filteredtweets =tweets.filter(tweet=> tweet.attachmentUrl !=="");
    let array = filteredtweets.map(tweet => ({media:tweet.attachmentUrl, id: filteredtweets.indexOf(tweet)}));
    if(array.length !==6){
      array.length >6 ? array =array.slice(0,6): addGrey();
      function addGrey (){
        for (let i = 0; array.length<6; i++) {
          array.push({media:grey , id:array.length+1});
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
      <div id="medias">
        { medias.map( media => 
          <img  className='media' src={media.media} alt="side_media" key={media.id}/>
        )}
      </div>
    )
};


export default Media;