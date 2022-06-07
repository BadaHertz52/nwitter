import React,{ useContext, useEffect, useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import Tweet from './Tweet';
import { FiArrowLeft } from "react-icons/fi";
import { getTweetsDocs, goBack, profileForm } from './GetData';
import Loading from './Loading';
import { ProfileContext } from '../context/ProfileContex';
import { UserContext } from '../context/UserContext';
import { TweetContext } from '../context/TweetContex';


export const ProfileTopForm = ({who, isMine , userobj } )=>{
  const {myProfile, profileDispatch }=useContext(ProfileContext);
  const {myTweets}=useContext(TweetContext);
  const {userProfile ,userTweets}=useContext(UserContext);

  const location =useLocation();
  const navigate= useNavigate();
  
  const [profile,setProfile]=useState(profileForm);

  const tweets =isMine? myTweets:userTweets;

  const goList=(what)=>{
    navigate(`/twitter/${profile.userId}/list/${what}` ,{
      state:{
        previous:location.pathname,
        userId: profile.userId,
      }})
  };
  const goEdit =()=> {
    navigate(`/twitter/editProfile` ,{state:{previous:location.pathname}})
    const inner =document.getElementById('inner');
    inner.style.zIndex='-1' ;
    } ;

    const myFollowingList =myProfile!==undefined? myProfile.following:[];
  const [onFollow ,setOnFollow] = useState({following:false , text:"Follow"});
  const followBtn =document.getElementById('profile_followBtn');

  const changeFollowBtn = ()=>{
    myFollowingList.includes(profile.uid) ? 
    setOnFollow({
      following: true , text : "Following"
    }) :
    setOnFollow({
      following: false , text : "Follow"
    });
  }

  const follow = (event)=> {
    event.preventDefault();
    if(!onFollow.following ){
      //follow 
      profileDispatch({
        type:"FOLLOWING",
        id:profile.uid,
        userNotifications:profile.notifications,
        userFollower:profile.follower.concat(userobj.uid),
        following: myFollowingList.concat(profile.uid)
      });

      setOnFollow({
        following: true , text : "Following"
      }) ;
      setProfile({...profile, follower:[userobj.uid].concat(profile.follower)});
    }else {
      //unFollow
      profileDispatch({
        type:"UNFOLLOWING",
        id:profile.uid,
        userNotifications: profile.notifications.filter(n=> 
          n.value !=="following" || 
          n.user !== userobj.uid || 
          n.docId !== null),
        userFollower :profile.follower.filter(f=> f !== userobj.uid),
        following: myFollowingList.filter( f=> f!== profile.uid)
      });
      setOnFollow({
        following: false , text : "Follow"
      });

      setProfile({...profile, follower:profile.follower.filter(f=> f!==userobj.uid)});
    }

  }
  useEffect(()=>{
    profile.userId==="" && setProfile(who);
  },[]);
  
  useEffect(()=>{
    myFollowingList[0]!== undefined && changeFollowBtn();
    if(followBtn !==null){
      userProfile!== undefined ?
    followBtn.style.disable=false:
    followBtn.style.disable=true;
    }
    
  },[userProfile])

  return(
    <>
      <section id="profileTopForm">
        <div id="profileTopForm_header">
          <button 
          id="profile_goHomeBtn" 
          className='back'
          onClick={()=>goBack(location, navigate)}>
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
              { isMine ?
                <div id="logOutAndEdit">
                  <button onClick={()=>{navigate(`/twitter/logout`)}}> Log Out </button>
                  <button onClick={goEdit} >
                    Edit Profile
                  </button>
                </div>
                :
                <button id='profile_followBtn' onClick= {follow} >
                {onFollow.text}
              </button>
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
    </>


  )
}

export const ProfileBottomForm = ({isMine, userobj })=>{
  const {myTweets}=useContext(TweetContext);
  const {userTweets}=useContext(UserContext);

  const tweets =isMine? myTweets:userTweets;
  const filterTweets = tweets.filter(tweet => 
    tweet.value=== "tweet"|| 
    tweet.value === "qt" || 
    tweet.value === "rt" );
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
  const showTweet =(event)=>{
    setContents(filterTweets);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showTandA =(event)=>{
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
  const findTweets =async()=>{
    await getTweetsDocs(userobj.uid).then(result=> {
      setIstweet(!result.empty)});
  };
  useEffect(()=>{
    tweets[0]!==undefined? showTweet(): findTweets();
  },[tweets])

  return (
    <section id="profileBottomForm" >
      <div id='pb_buttons'>
        <button id="pb_btn_tweet" onClick={showTweet}>
          tweets
        </button>
        <button onClick={showTandA} >tweets &#38; replies</button>
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
          userobj={userobj} 
          answer={false} />  )
      }
      </div>
    </section>
  )
}
