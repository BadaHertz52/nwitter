import React, { useEffect, useRef, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import UserProfile from './UserProfile';


const TweetForm =({tweet, profile  ,is_owner ,onDeleteClick})=>{

  const now = new Date();
  const year = now.getFullYear();
  const date = now.getDate();
  const month =now.getMonth()+1;
  const [time ,setTime] =useState("");
  const targetText =useRef();

  const monthArry =["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul","Aug","sep","Oct","Nov","Dec"];


  useEffect(()=>{
    (time !==""&&
    tweet.createdAt[0]=== year &&
    tweet.createdAt[1]===month &&
    tweet.createdAt[2] === date )?
    setTime(`${tweet.createdAt[3]}h`)
    : setTime(`${monthArry[tweet.createdAt[1]]} ${tweet.createdAt[2]},${tweet.createdAt[0]}`)
  },[tweet]);

  
  if(targetText !==null ){
    const target = targetText.current;
    if(target!==undefined){
      target.innerHTML=tweet.text;
  }};

return (
  <div className=' tweet_form'>
    <div className='tweetSide'>
      <UserProfile profile={profile}/>
    </div>
    <div className="tweet_content">
      <div className='tweet_header'>
        <div>
          <span>{profile.userName}</span>
          <span>@{profile.userId}</span>
          <span className='tweet_time'>
            {time}
          </span>
        </div>
        { is_owner &&
        <button className='fun' onClick={onDeleteClick} name={tweet.docId}>
          <BiDotsHorizontalRounded/>
        </button>
        }
      </div>
      <div className="text" ref={targetText}>
        {tweet.text}
      </div>
      { tweet.attachmentUrl !=="" &&
      <div  className="attachment">
        <img src={tweet.attachmentUrl}  alt="tweet_attachment"/>
      </div>
      }
    </div>
  </div>
)
};

export default  React.memo(TweetForm) ;