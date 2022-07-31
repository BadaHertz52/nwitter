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

const Tweet =({key, tweetObj , userobj ,answer}) =>{
  const navigate =useNavigate();
  const location =useLocation();

  const [tweetobj,setTweetObj]=useState(tweetObj);
  const [is_answer ,setIsAnswer]=useState(answer);

  const {myProfile} =useContext(ProfileContext);
  const {tweetDispatch} =useContext(TweetContext);

  const [aboutProfile, setAboutProfile] =useState(profileForm);
  const [ownerProfile, setOwnerProfile] =useState(profileForm);
  const [aboutTweet, setAbouttweet]= useState(tweetForm);
  const [answerTweets, setAnswerTweets]=useState([{
    tweet:tweetForm,
    profile:profileForm}]);
  const [statusAnswer ,setStatusAnswer]=useState(false);
  const [tweetClassName ,setTCName]=useState("tweet");
  const answerForm =useRef();
  const rt_heart =(tweetobj!==undefined&&
    tweetobj.notifications!==undefined&&
    tweetobj.notifications[0]!==undefined) ?
  tweetobj.notifications.filter(n=> (n.user ===userobj.uid)&&(n.value==="heart"|| n.value==="rt"))[0] :undefined;
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
  if(tweetobj!==undefined && tweetobj.value === "answer"){
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
    if( location.pathname.includes("status")){
      if(localStorage.getItem("status")){
        const status =JSON.parse(localStorage.getItem("status"));
        setTweetObj(status.tweetObj);
        setIsAnswer(status.answer);
        setOwnerProfile(status.ownerProfile);
        const userName =status.ownerProfile.userName;
        const tweetText =status.tweetObj.text;
        changeTitle(`${userName} on Twitter: ${tweetText}`);
      }
      }
  },[location]);

  useEffect(()=>{
    if(tweetobj!==undefined){
      tweetobj.value==="answer"? getAnswerTweets(aboutTweet) :getAnswerTweets(tweetobj)
    }
  },[tweetobj])

  useEffect(()=>{
      tweetClassName !=="tweet answer" && chagneClassName();
      if(tweetobj!==undefined&& myProfile.userName !==""){
      if(ownerProfile.userId ===""){
        !location.pathname.includes("status")&&
        getProfile(tweetobj.creatorId ,setOwnerProfile);
        };
      if(tweetobj!==undefined&& aboutProfile.userId ===""){
        if( tweetobj.about !== null ){
          getProfile(tweetobj.about.creatorId ,setAboutProfile);
          getTweet(tweetobj.about.creatorId, tweetobj.about.docId, setAbouttweet);
        }
      };
    }

  },[tweetobj,myProfile ,aboutProfile]);

  useEffect(()=>{
    if(tweetobj!==undefined && tweetobj.about!==null){
      ownerProfile.photoUrl!=="" 
        ?
        setLoading(false)
        :
        setLoading(true);
      }else{
        (ownerProfile.photoUrl!=="")
        ?
        setLoading(false)
        :
        setLoading(true);
      };
  },[tweetobj,ownerProfile,aboutProfile,aboutTweet]);

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
          deleteTweetNotification(aboutTweet,tweet,userobj,tweetobj.value);
          deleteProfileNotification(aboutProfile,aboutTweet,tweet,userobj,tweetobj.value )
          break;
        case "answer":
          deleteTweetNotification(tweetobj,tweet,userobj,tweetobj.value);
          deleteProfileNotification(ownerProfile,tweetobj,tweet,userobj,tweet.value )
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
      const condition = tweet.creatorId===ownerProfile.uid;
      const condition1 =!target.classList.contains("fun");
      const condition2 = !target.parentNode.classList.contains("fun");
      const pathName = `/twitter/${profile.userId}/status/${tweet.docId}`;

      const status = JSON.stringify({
        tweetObj:tweet,
        answer:false,
        ownerProfile:profile,
        value :"status",
        userId:condition? ownerProfile.userId : aboutProfile.userId,
        docId:tweet.docId
      });
      localStorage.setItem("status", status);

      if(condition1 && condition2){
        navigate(`${pathName}` , {state:{
            previous:location.pathname,
            value:"status"
          }
          })
      }
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
    {tweet.docId==""?
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
            <Rt tweetObj={what} original={tweetobj} userobj={userobj} profile={profile} ownerProfile={ownerProfile}
            />
            <Heart tweetObj={what} original={tweetobj} userobj={userobj} profile={profile} ownerProfile={ownerProfile}/>
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
      {(!loading&& tweetobj!==undefined)?
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
                tweetobj.value ==="rt" &&
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
                tweetobj.value ==="heart" &&
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
                (tweetobj.value ==="rt" &&
                rt_heart!==undefined)||
                (tweetobj.value ==="heart" &&
                tweetobj.notifications.filter(n=> 
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
              { tweetobj.value === "answer"  &&
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
            <div className='tweetobj'>
            {(
            tweetobj.value === "qt" ||
            tweetobj.value ==="tweet" )&&
            <TweetBox
              what={tweetobj}
              IsAnswer={is_answer}
              profile={ownerProfile}  />
            }
            {(tweetobj.value==="rt" ||
              tweetobj.value === "heart"
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
            {tweetobj.value ==="answer" &&
              <TweetBox
                what={tweetobj}
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