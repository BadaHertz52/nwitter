import React,{ useContext, useEffect, useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import Tweet from './Tweet';
import { FiArrowLeft } from "react-icons/fi";
import { getTweetsDocs, goBack } from './GetData';
import Loading from './Loading';
import { ProfileContext } from '../context/ProfileContex';
import { UserContext } from '../context/UserContext';
import { TweetContext } from '../context/TweetContex';


export const ProfileTopForm = ({ isMine} )=>{
  const {myProfile }=useContext(ProfileContext);
  const {myTweets}=useContext(TweetContext);
  const {userProfile ,userTweets}=useContext(UserContext);

  const location =useLocation();
  const navigate= useNavigate();
  const profile = isMine? myProfile : userProfile ;
  const tweets =isMine? myTweets:userTweets;
  const goList=(what)=>{
    navigate(`${location.pathname}/list/${what}` ,{
      state:{
        previous:location.pathname,
        previousState:{isMine:isMine}
      }})
  };
  const goEdit =()=> {
    navigate(`editProfile` ,{state:{previous:location.pathname}})
    const inner =document.getElementById('inner');
    inner.style.zIndex='-1' ;
    } ;

  return(
    <section id="profileTopForm">
      <div id="profileTopForm_header">
        <button 
        id="profile_goHomeBtn" 
        className='back'
        onClick={()=>goBack(location, `/${profile.userId}`, navigate)}>
          <FiArrowLeft/>
        </button>
        <div>
          <div>{profile.userName}</div>
          <div>{tweets.length} tweets</div>
        </div>
      </div>
      <div id="profileForm_profile">
        <img src={profile.headerUrl} alt="profileHeader" />
        <div>
          <img src={profile.photoUrl}  alt="profile"/>
          <div id="profileForm_userInformation">
            <div>{profile.userName}</div>
            <div>@{profile.userId}</div>
            <div>{profile.introduce}</div>
          </div>
            { isMine &&
              <div id="logOutAndEdit">
                <button onClick={()=>{navigate('/logout')}}> Log Out </button>
                <button onClick={goEdit} >
                  Edit Profile
                </button>
              </div>
              }
        </div>
      </div>
      <div className="profile_follow">
        <button onClick={()=>goList("following")}>
        {profile.following && (
          <div>
            <span className='number'>
              {profile.following[0] === undefined ? 0 :profile.following.length }
            </span>
            &nbsp;
            Following
          </div>
        )}
        </button>
        <button  onClick={()=>goList("follower")}>
          { profile.follower && (
            <div>
              <span className='number'>
                {profile.follower[0] === undefined ? 0 :profile.follower.length}
                </span>
                &nbsp;
                Followers
            </div>
          )}
        </button>
      </div>
    </section>
  )
}

export const ProfileBottomForm = ({isMine, userobj })=>{
  const {myTweets}=useContext(TweetContext);
  const {userTweets}=useContext(UserContext);

  const tweets =isMine? myTweets:userTweets;
  const filterTweets = tweets.filter(tweet => tweet.value=== "tweet"|| tweet.value === "qt");
  const  filterTweetAndAnswer = tweets.filter (tweet=> tweet.value !== 'heart');
  const filterHeartedThings= tweets.filter(tweet=> tweet.value === "heart");
  const filterMediaes =tweets.filter(tweet=> tweet.attachmentUrl !== "");
  const [isTweet, setIstweet]=useState(true);
  const [contents, setContents]=useState([]);
  const buttons =document.querySelectorAll('#pb_buttons button');
  const values =document.querySelectorAll('.value');
  const tweetBtn = document.getElementById('pb_btn_tweet');
  
  const changeStyle =(event)=>{
    const target = event ? event.target :tweetBtn;
    buttons.forEach(button =>button.classList.remove('check'));
    target && (target.classList.add('check'));
  }
  const showtweet =(event)=>{
    setContents(filterTweets);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showNandA =(event)=>{
    setContents(filterTweetAndAnswer);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showMedias=(event)=>{
    setContents(filterMediaes);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showHeartedThings =(event)=>{
    setContents(filterHeartedThings);
    changeStyle(event);
    values.forEach(value=> value.style.display="none");
  }
  const findtweets =async()=>{
    await getTweetsDocs(userobj.uid).then(result=> {
      setIstweet(!result.empty)});
  };
  useEffect(()=>{
    tweets[0]!==undefined? showtweet(): findtweets();
  },[tweets])

  return (
    <section id="profileBottomForm" >
      <div id='pb_buttons'>
        <button id="pb_btn_tweet" onClick={showtweet}>
          tweets
        </button>
        <button onClick={showNandA} >tweets &#38; replies</button>
        <button onClick={showMedias}>Media</button>
        <button onClick={showHeartedThings} >Likes</button>
      </div>
      <div id="contents">
      {tweets[0] === undefined ?
        (isTweet ?
          <Loading/>
          :
          <div class="notweet" >
          There's no tweet
          <br/>
          Write new tweet
          </div>
        )
      :
      contents.map(content => <Tweet 
          key={`tweets_${content.docId}`}
          tweetObj ={content}  
          isOwner={isMine}
          userobj={userobj} 
          answer={false} />  )
      }
      </div>
    </section>
  )
}
