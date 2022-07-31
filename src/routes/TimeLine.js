import React,{ useContext, useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate} from 'react-router-dom';
import { getProfileDoc, goBack } from '../components/GetData';
import Loading from '../components/Loading';
import Tweet from '../components/Tweet';
import { changeTitle } from '../components/TwitterRouter';
import { TweetContext } from '../context/TweetContex';
import { UserList } from './List';

const TimeLine =({userobj})=>{
  const location =useLocation();
  const state=location.state; 
  const navigate =useNavigate();
  const {myTweets}=useContext(TweetContext);
  const [tweet,setTweet]=useState({docId:"" ,about:null});
  const [timeLineValue,setTimeLineValue]=useState(undefined);
  const [user , setUser]= useState(undefined);
  const [followingMe, setFollowingMe]=useState(false);

  useEffect(()=>{ 
    switch (state.value) {
      case "heart":
        setTimeLineValue("Liked");
        break;
      case "rt":
        setTimeLineValue("Retweeted");
      break;
      case "answer" || "tweet"|| "qt" :
        setTimeLineValue("tweets");
      break;
      default:
        break;
    };
    if(state.aboutDocId == null){
      const targetTweet =myTweets.filter(n=> n.docId === state.docId)[0];
    setTweet(targetTweet);
    }else{
    setTweet(state.aboutDocId);
    };
    getProfileDoc(state.userUid).get().then(doc=> setUser(doc.data()));
  },[state, myTweets]);
  useEffect(()=>{
    if(user !==undefined){
      user.following[0] !==undefined?
      setFollowingMe(user.following.includes(userobj.uid)) :
      setFollowingMe(false);
    };
  },[user])
  useEffect(()=>{
    if(timeLineValue !==undefined){
      changeTitle(`${timeLineValue}`)
    };
  },[timeLineValue])
  return (
    <div id="timeLine">
      <div id="timeLine_header">
        <button  
        className='back'
        onClick={()=> goBack(location, navigate)}
        >
            <FiArrowLeft/>
        </button>
        <div> 
          <div id="timeLine_value">
            {timeLineValue}
          </div>
          <div id="tiemLine_userId">
            by {state.userName}
          </div>
        </div>
      </div>
      <div id="timeLine_tweet">
        {(tweet !==undefined && tweet.docId!=="") ?
        <Tweet
          tweetObj={tweet} 
          userobj={userobj} 
          answer={ false} />
          :
          <Loading/>
      }
      </div>
      {user !== undefined &&
      <div id="timeLine_profile">
        <UserList
          user={user}
          userobj={userobj}
          followingMe={followingMe}
        />
      </div>}
    </div>
  )
};

export default  React.memo(TimeLine);