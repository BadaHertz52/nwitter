import React, {  useContext, useEffect, useRef, useState } from 'react';
import UserProfile from './UserProfile';
import {  AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import {FiArrowLeft, FiMessageCircle} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import Heart from './Heart';
import Rt from './Rt';
import {  deleteTweetNotification, deleteProfileNotification, getTweet, getTweetDoc, getProfile, getProfileDoc, goBack, profileForm, tweetForm} from './GetData';
import  { TweetContext } from '../context/TweetContex';
import {ProfileContext} from '../context/ProfileContex';
import Loading from './Loading';
import { storageService } from '../Fbase';
import TweetForm from './TweetForm'
import {changeTitle}from './TwitterRouter';

const Tweet =({key, tweetObj , userobj ,answer ,setStatusTweetObj ,setMetaData}) =>{
  const navigate =useNavigate();
  const location =useLocation();
  const {myProfile} =useContext(ProfileContext);
  const {tweetDispatch} =useContext(TweetContext);
  const hash =window.location.hash;
  const [aboutProfile, setAboutProfile] =useState(profileForm);
  const [ownerProfile, setOwnerProfile] =useState(profileForm);
  const [aboutTweet, setAbouttweet]= useState(tweetForm);
  const [answerTweets, setAnswerTweets]=useState([{
    tweet:tweetForm,
    profile:profileForm}]);
  const [statusAnswer ,setStatusAnswer]=useState(false);
  const [tweetClassName ,setTCName]=useState("tweet");
  const answerForm =useRef();
  const rt_heart =(tweetObj!==undefined&&
    tweetObj.notifications!==undefined&&
    tweetObj.notifications[0]!==undefined) ?
  tweetObj.notifications.filter(n=> (n.user ===userobj.uid)&&(n.value==="heart"|| n.value==="rt"))[0] :undefined;
  const [loading,setLoading]=useState(false);

  const getAnswerTweets=async(tweet)=>{
    const answerNotifications = tweet.notifications.filter(n=> n.value==="answer");
    const array = await Promise.all(answerNotifications.map( async(answer) =>{
      const answerProfile =await getProfileDoc(answer.user).get().then(doc=>doc.data());
        const answerTweet = await getTweetDoc(answer.user, answer.aboutDocId).then(doc=> doc.data());
        return {tweet:answerTweet , profile:answerProfile}
      })).then(result => result);
      setAnswerTweets(array);
      setStatusAnswer(true);
  }
  //fun

  const chagneClassName =()=>{
  if(tweetObj!==undefined && tweetObj.value === "answer"){
    setTCName("tweet answer");
  }
};

    const onBack=()=>{
      localStorage.removeItem('status')
      location.pathname.includes("tweet")&&
      goBack(location,navigate);

      location.pathname.includes("status")&&
      goBack(location,navigate);
    };

  useEffect(()=>{
    if(tweetObj!==undefined){
      tweetObj.value==="answer"? getAnswerTweets(aboutTweet) :getAnswerTweets(tweetObj)
    }
  },[tweetObj])

  useEffect(()=>{
      tweetClassName !=="tweet answer" && chagneClassName();
      if(tweetObj!==undefined&& myProfile.userName !==""){
      if(ownerProfile.userId ===""){
        getProfile(tweetObj.creatorId ,setOwnerProfile);
        };
      if(tweetObj!==undefined&& aboutProfile.userId ===""){
        if( tweetObj.about !== null ){
          getProfile(tweetObj.about.creatorId ,setAboutProfile);
          getTweet(tweetObj.about.creatorId, tweetObj.about.docId, setAbouttweet);
        }
      };
    }

  },[tweetObj,myProfile ,aboutProfile]);

  useEffect(()=>{
    if(ownerProfile.photoUrl !==""){
    setLoading(false);

    }else{
      setLoading(true);
    }
  },[ownerProfile])
  const TweetBox =({what ,IsAnswer, profile})=>{
    const now = new Date();
    const year = now.getFullYear();
    const date = now.getDate();
    const month =now.getMonth()+1;
    const [time ,setTime] =useState("");
    const [aboutTime ,setAboutTime]=useState("");
    const targetText =useRef();

    const tweet =what!==undefined? {
      id:what.id,
      docId:what.docId,
      text :what.text,
      attachmentUrl:what.attachmentUrl,
      createdAt:what.createdAt,
      creatorId:what.creatorId,
      value:what.value,
      notifications:what.notifications,
      about:what.about,
    }:tweetForm ;

    const monthArry =["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul","Aug","sep","Oct","Nov","Dec"];

    const onDeleteClick = (event) =>{
      event.preventDefault();
      const ok = window.confirm("Are you sure you want to delete this tweet?");
      tweetDispatch({
        type:"DELETE",
        uid:userobj.uid,
        docId: tweet.docId ,
        attachmentUrl:tweet.attachmentUrl
      });
      const storage= storageService.ref().child(`${userobj.uid}/${tweet.docId}`);
      storage.delete();
      switch (tweet.value) {
        case "qt":
          deleteTweetNotification(aboutTweet,tweet,userobj,tweetObj.value);
          deleteProfileNotification(aboutProfile,aboutTweet,tweet,userobj,tweetObj.value )
          break;
        case "answer":
          deleteTweetNotification(tweetObj,tweet,userobj,tweetObj.value);
          deleteProfileNotification(ownerProfile,tweetObj,tweet,userobj,tweet.value )
          break;
        default:
          break;
      }
    };

    const onAnswer=()=>{
      localStorage.setItem("tweet", JSON.stringify({
        tweetObj:tweet,
        profile:profile,
        isOwner:false,
      }
        ));
  
      navigate(`/twitter/tweet`, {state:{
      previous:location.pathname,
      value:"answer"
    }});
    };
    const goTweet =(event)=>{
      const target =event.target;
      const condition1 =!target.classList.contains("fun");
      const condition2 = !target.parentNode.classList.contains("fun");
      const condition3 = !target.classList.contains("profile");
      const pathName = `/twitter/${profile.userId}/status/${tweet.docId}`;

      if(condition1 && condition2&& condition3){
        setStatusTweetObj(tweet);
        navigate(`${pathName}` , {state:{
            previous:location.pathname,
            value:"status"
          }
          });
        changeTitle(`${profile.userName} on Twitter ${tweetObj.text}`);
        setMetaData({
          tweet:tweetObj.text,
          image: tweetObj.attachmentUrl,
          userName:profile.userName
        })  
      };
        
    };

    useEffect(()=>{
      (time !==""&&
      tweet.createdAt[0]=== year &&
      tweet.createdAt[1]===month &&
      tweet.createdAt[2] === date )?
      setTime(`${tweet.createdAt[3]}h`)
      : setTime(`${monthArry[tweet.createdAt[1]]} ${tweet.createdAt[2]},${tweet.createdAt[0]}`)
    },[tweet]);

    useEffect(()=>{
      (aboutTime !== ""&&
      aboutTweet.docId !==""&&
      aboutTweet.createdAt[0]=== year &&
      aboutTweet.createdAt[1]===month &&
      aboutTweet.createdAt[2] === date )?
      setAboutTime(`${aboutTweet.createdAt[3]}h`)
      : setAboutTime(`${monthArry[aboutTweet.createdAt[1]]} ${aboutTweet.createdAt[2]},${aboutTweet.createdAt[0]}`)
    },[aboutTweet]);

    
    if(targetText !==null ){
      const target = targetText.current;
      if(target!==undefined){
        target.innerHTML=tweet.text;
    }};
  
  return (
    <>
    {tweet.docId===""?
    <div className='noTweet'>
      Tweet does not exist.
    </div>
    :
    <div
    className={location.pathname.includes("status")?"statusBtn tweetBox": "tweetBox"}
    id={key}
    ref={answerForm}
    onClick={goTweet}
    >
      {/*tweet_content*/}
      <TweetForm 
        tweet={tweet} 
        profile={profile} 
        is_owner={tweet.creatorId===userobj.uid} 
        onDeleteClick={onDeleteClick} />
      {  IsAnswer && 
        <div className='answerLine'  >
        </div>
      }
      <div className='tweet_other'>
        {tweet.value==="qt" && 
        !location.pathname.includes('tweet') &&
          <div className="tweet qt">
            <div className="tweet_content">
              <div className='tweet_header'>
                <UserProfile profile={aboutProfile} />
                <div>
                  <span>{aboutProfile.userName}</span>
                  <span>@{aboutProfile.userId}</span>
                  <span className='qn_time'>{aboutTime}</span>
                </div>
              </div>
              <div className="text">
                {aboutTweet.text.replaceAll("<br/>", "\r\n")}
              </div>
              { aboutTweet.attachmentUrl !== "" &&
              <div  className="attachment">
                <img src={aboutTweet.attachmentUrl}  alt="tweet_attachment"/>
              </div>
              }
            </div>
          </div>
        }
        {
          !location.pathname.includes('tweet') &&
          <div
          className="tweet_fun fun"
        >
          <button className="fun answer" onClick={onAnswer}>
              <FiMessageCircle/>
          </button>
          {profile!==undefined && what!==undefined && 
          <>
            <Rt tweetObj={what} original={tweetObj} userobj={userobj} profile={profile} ownerProfile={ownerProfile}
            />
            <Heart tweetObj={what} original={tweetObj} userobj={userobj} profile={profile} ownerProfile={ownerProfile}/>
          </>}
        </div>
        }
        {IsAnswer &&  
        !statusAnswer && 
        aboutProfile.userId!== "" &&
          <div className='answer_who'>
            @{aboutProfile.userId}
            에 대한 답글
          </div>
        }
      </div>
    </div>
    }
    </>
  )
  };

  return(
    <div >
      {(!loading&& tweetObj!==undefined)?
        <>
          <div className={tweetClassName}
          id={location.pathname !==undefined &&
              location.pathname.includes("status")&& "status" }
          >
            {location.pathname.includes("status") &&
              <div id="status_header" >
                <button className='back' onClick={onBack}>
                  <FiArrowLeft/>
                </button>
                <div>
                  tweet
                </div>
              </div>
            }
            
            <div className="value">
              {(
                tweetObj.value ==="rt" &&
                rt_heart===undefined
                )
              &&
                <div className="value_explain">
                  <AiOutlineRetweet/>
                  {ownerProfile.uid === userobj.uid  ?
                  'I'
                  :
                  `${ownerProfile.userName}`} Retweeted
                </div>
              }
              {(
                tweetObj.value ==="heart" &&
                rt_heart===undefined
                )
                &&
                <div className="value_explain">
                  <AiOutlineHeart/>
                  {ownerProfile.uid === userobj.uid  ?
                  'I'
                  :
                  `${ownerProfile.userName}`} liked
                </div>
              }
              {(
                (tweetObj.value ==="rt" &&
                rt_heart!==undefined)||
                (tweetObj.value ==="heart" &&
                tweetObj.notifications.filter(n=> 
                  (n.user ===userobj.uid)&&(n.value==="rt"))[0]!==undefined)
                ) 
                &&
                <div className="value_explain">
                  <AiOutlineRetweet/>
                  <AiOutlineHeart/>
                  {ownerProfile.uid === userobj.uid  ?
                  'I'
                  :
                  `${ownerProfile.userName}`} ReTweeted and liked
                </div>
              }
              { tweetObj.value === "answer"  &&
              (aboutTweet.docId==="" ?
              location.pathname.includes("status") &&
                <div className='noTweet'>
                  Tweet does not exist.
                </div>
              : 
                <TweetBox what={aboutTweet} IsAnswer={true}  profile={aboutProfile} />
              )
              }
            </div>
            <div className='tweetObj'>
            {(
            tweetObj.value === "qt" ||
            tweetObj.value ==="tweet" )&&
            <TweetBox
              what={tweetObj}
              IsAnswer={answer}
              profile={ownerProfile}  />
            }
            {(tweetObj.value==="rt" ||
              tweetObj.value === "heart"
              )&&(
                (aboutTweet.about !==null && aboutTweet.value==="qt" )?
                <Tweet 
                key={aboutTweet.docId} 
                tweetObj={aboutTweet}  
                userobj={userobj} 
                isOwner ={aboutTweet.creatorId=== userobj.uid}
                answer={false} 
                />
                :
                <TweetBox
                what={aboutTweet}
                IsAnswer={false}
                profile={aboutProfile}
              />
              ) 
            }
            {tweetObj.value ==="answer" &&
              <TweetBox
                what={tweetObj}
                IsAnswer={false}
                profile={ownerProfile}/>
            }
          </div>
        {  location.pathname.includes("status")&&statusAnswer&&
          <div class="tweet statusAnswers" >
            {answerTweets.map(
              answer =>
              <TweetBox what={answer.tweet} IsAnswer={false} profile={answer.profile}  />
            )}
          </div>}
          </div>
        </>
      :
        <Loading/>
      }
    </div>
  )
};
export default React.memo( Tweet )