import React,{ useContext, useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate} from 'react-router-dom';
import { getProfileDoc, goBack } from '../components/GetData';
import Loading from '../components/Loading';
import Tweet from '../components/Tweet';
import { TweetContext } from '../context/TweetContex';
import { UserList } from './List';

const TimeLine =({userobj})=>{
  const location =useLocation();
  const state=location.state; 
  const navigate =useNavigate();
  const {myTweets}=useContext(TweetContext);
  const [tweet,setTweet]=useState({docId:"" ,about:null});
  const [user , setUser]= useState(undefined);
  const [followingMe, setFollowingMe]=useState(false);

  useEffect(()=>{ 
      if(state.aboutDocId == null){
        const targetTweet =myTweets.filter(n=> n.docId === state.docId)[0];
      setTweet(targetTweet);
      }else{
      setTweet(state.aboutDocId);
      }

    getProfileDoc(state.userUid).get().then(doc=> setUser(doc.data()));
  },[state, myTweets]);
  useEffect(()=>{
    if(user !==undefined){
      user.following[0] !==undefined?
      setFollowingMe(user.following.includes(userobj.uid)) :
      setFollowingMe(false);
    };
  },[user])
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
            {state.value==="heart" && "Liked"}
            {state.value==="rt" && "Retweeted"}
            {(state.value==="answer" ||
              state.value==="tweet"  ||
              state.value ==="qt"
              )
              && "tweets"}
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