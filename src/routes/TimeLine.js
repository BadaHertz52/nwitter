import React,{ useContext, useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate} from 'react-router-dom';
import Loading from '../components/Loading';
import Tweet from '../components/Tweet';
import { TweetContext } from '../context/TweetContex';

const TimeLine =({userobj})=>{
  const location =useLocation();
  const state=location.state; 
  const navigate =useNavigate();
  const {myTweets}=useContext(TweetContext);
  const [tweet,setTweet]=useState({docId:"" ,about:null});
  const goNotification =()=>{
    navigate('/twitter/notification')
  };
  useEffect(()=>{ 
      if(state.aboutDocId == null){
        const targetTweet =myTweets.filter(n=> n.docId === state.docId)[0];
      setTweet(targetTweet);
      }else{
      setTweet(state.aboutDocId);
      }

  },[state, myTweets]);

  return (
    <div id="timeLine">
      <div id="timeLine_header">
        <button  
        className='back'
        onClick={goNotification}
        >
            <FiArrowLeft/>
        </button>
        <div> 
          <div id="timeLine_value">
            {state.value==="heart" && "Liked"}
            {state.value==="rt" && "Retweeted"}
            {(state.value==="answer" ||
              state.value==="tweet"  ||
              state.value ==="qt"
              )
              && "tweets"}
          </div>
          <div id="tiemLine_userId">
            {state.userName}
          </div>
        </div>
      </div>
      <div id="timeLine_tweet">
        {(tweet !==undefined && tweet.docId!=="") ?
        <Tweet
          tweetObj={tweet} 
          userobj={userobj} 
          answer={ false}
          parentComponent={"timeline"} 
        />
          :
          <Loading/>
      }
      </div>
    </div>
  )
};

export default  React.memo(TimeLine);