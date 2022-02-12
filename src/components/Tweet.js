import React, {  useContext, useEffect, useRef, useState } from 'react';
import UserProfile from './UserProfile';
import {  AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import {FiArrowLeft, FiMessageCircle} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import Heart from './Heart';
import Rt from './Rt';
import {  deleteTweetNotification, deleteProfileNotification, getTweet, getTweetDoc, getProfile, getProfileDoc, goBack} from './GetData';
import  { TweetContext } from '../context/TweetContex';
import {ProfileContext} from '../context/ProfileContex';
import {BiDotsHorizontalRounded } from 'react-icons/bi';
import Loading from './Loading';
import { storageService } from '../Fbase';


const Tweet =({key, tweetObj , userobj ,isOwner ,answer}) =>{
  const navigate =useNavigate();
  const location =useLocation();
  const state =location.state !==null && location.state.previousState !==null ? location.state.previousState :location.state ;
  const tweetobj = tweetObj!==undefined? tweetObj :   state.tweetObj;
  const is_owner = isOwner !==undefined? isOwner :state.isOwner;
  const is_answer = answer !==undefined? answer : state.answer;
  const {myProfile} =useContext(ProfileContext);
  const {tweetDispatch} =useContext(TweetContext);
  const profileForm ={
    userId:"" ,
    userName:"",
    uid:"",
    photoUrl:""
  };
  const tweetForm ={
    docId:"",
    text:"",
    attachmentUrl:"",
    value:"",
    createdAt:"",
    creatorId:"",
    about:null ,
    notifications:[]
  }
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
  if(tweetobj.value === "answer"){
    setTCName("tweet answer");
  }
};
  const onAnswer=()=>{
    navigate(`tweet`, {state:{
    previous:location.pathname,
    tweetObj:tweetobj.value ==="tweet"? tweetobj: aboutTweet, 
    value:"answer",
    profile:{uid:ownerProfile.uid, notifications:ownerProfile.notifications}, 
    isOwner:false,
    userId:ownerProfile.udrId,
    userUid:ownerProfile.uid
  }});

  };
    const onBack=()=>{
      location.pathname.includes("tweet")&&
      goBack(location, "/tweet",navigate);

      location.pathname.includes("status")&&
      goBack(location, `/${location.state.previousState.userId}/status`,navigate);
    };


  useEffect(()=>{

    if( location.pathname.includes("status")||
    location.pathname.includes("timeLine")){
      tweetobj.value==="answer"? getAnswerTweets(aboutTweet) :getAnswerTweets(tweetobj)
      }
  },[location ,tweetobj,aboutTweet]);

  useEffect(()=>{
  tweetClassName !=="tweet answer" && chagneClassName();
  if(myProfile.userName !==""){
    if(ownerProfile.userId ===""){
      location.pathname.includes("status")?
      setOwnerProfile(state.ownerProfile):
      getProfile(tweetobj.creatorId ,setOwnerProfile);
      };
    if(aboutProfile.userId ===""){
      if( tweetobj.about !== null ){
        getProfile(tweetobj.about.creatorId ,setAboutProfile);
        getTweet(tweetobj.about.creatorId, tweetobj.about.docId, setAbouttweet);
      }
    };
  }else {
      console.log("Can't find myProfile")
    };
  },[myProfile ,aboutProfile]);
  useEffect(()=>{
    if(tweetobj.about!==null){
      (ownerProfile.photoUrl!=="" &&aboutProfile.photoUrl!=="" && aboutTweet.docId!=="")
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
  },[ownerProfile,aboutProfile,aboutTweet]);
  
  const TweetForm =({what ,IsAnswer, profile})=>{
    const now = new Date();
    const year = now.getFullYear();
    const date = now.getDate();
    const month =now.getMonth()+1;
    const [time ,setTime] =useState("");
    const [aboutTime ,setAboutTime]=useState("");
    const textId =what!==undefined? what.docId:"";
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
    }:{
      id:"",
      docId:"",
      text :"",
      attachmentUrl:"",
      createdAt:"",
      creatorId:"",
      value:"",
      notifications:"",
      about:""
    } ;
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


    const goState =(event)=>{
      const target =event.target;
      const condition = tweet.creatorId===ownerProfile.uid;
      const condition1 =!target.classList.contains("fun");
      const condition2 = !target.parentNode.classList.contains("fun");
      const pathName = `${profile.userId}/status/${tweet.docId}`;
      if(condition1 && condition2){
        navigate(`${pathName}` , {state:{
            previous:location.pathname,
            previousState:{                         
              tweetObj:tweet,
              isOwner:condition,
              answer:false,
              ownerProfile:profile,
              value :"status",
              userId:condition? ownerProfile.userId : aboutProfile.userId,
              docId:condition? tweetobj.docId: aboutTweet.docId},
            value:"status",
            userUid:(location.state!==null&& location.state.userUid !==undefined) ? location.state.userUid :undefined ,
            userId:(location.state!==null&&  location.state.userId !==undefined )? location.state.userId :undefined ,

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

    const target =document.getElementById(`${textId}`);
    if(target !==null && target.innerHTML !== tweet.text){
      target.innerHTML =tweet.text
    };
  ;
  return (
  <div 
  className={!location.pathname.includes("status")&&"statusBtn"}
  >
      <div
      className='tweet_form'
      id={key}
      ref={answerForm} 
      onClick={goState} 
      >
      <div className='tweetSide'>
        <UserProfile profile={profile}/>
        {  IsAnswer &&   !statusAnswer &&
          <div className='answerLine'  >
          </div> 
        }
        
      </div>
        {/*tweet_content*/}
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
        <div className="text" 
        id={textId} >
          {tweet.text}
        </div>
        { tweet.attachmentUrl !=="" &&
        <div  className="attachment">
          <img src={tweet.attachmentUrl}  alt="tweet_attachment"/>
        </div>
        }
        {tweet.value==="qt" &&
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
              <div className="text" >
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
          {IsAnswer &&  !statusAnswer && aboutProfile.userId!== "" &&
            <div className='answer_who'>
              @{aboutProfile.userId}
              에 대한 답글
            </div>
          }
      </div>
    </div>
  </div>
  )
  };

  return(
    <div >
      {(tweetobj !==undefined && !loading)?
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
            {(tweetobj.value ==="rt" &&
              rt_heart===undefined) 
            &&
              <div className="value_explain">
                <AiOutlineRetweet/>
                {ownerProfile.uid === userobj.uid  ?
                'I'
                :
                `${ownerProfile.userName}`} Retweeted
              </div>
            }
            {(tweetobj.value ==="heart" &&
              rt_heart===undefined)
              
              &&
              <div className="value_explain">
                <AiOutlineHeart/>
                {ownerProfile.uid === userobj.uid  ?
                '내가'
                :
                `${ownerProfile.userName}`} liked
              </div>
            }
            {((tweetobj.value ==="rt" &&
              rt_heart!==undefined)||
              (tweetobj.value ==="heart" &&
              tweetobj.notifications.filter(n=> (n.user ===userobj.uid)&&(n.value==="rt"))[0]!==undefined)) &&
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
            <>
              <TweetForm what={aboutTweet} IsAnswer={true}  profile={aboutProfile} />
            </>
            }
          </div>
          {(
          tweetobj.value === "qt" ||
          tweetobj.value ==="tweet" )&&
          <TweetForm 
            what={tweetobj} 
            IsAnswer={is_answer} 
            profile={ownerProfile}  /> 
          }
          {(tweetobj.value==="rt" ||
            tweetobj.value === "heart"
            )&&
          <TweetForm 
            what={aboutTweet}  
            IsAnswer={false} 
            profile={aboutProfile}
          />
          }
          {tweetobj.value ==="answer" &&  !statusAnswer &&
            <TweetForm 
              what={tweetobj} 
              IsAnswer={false} 
              profile={ownerProfile}/>
          }
        </div>
      {statusAnswer&& 
        <div class="tweet statusAnswers" >
          {answerTweets.map(
            answer => 
            <TweetForm what={answer.tweet} IsAnswer={false} profile={answer.profile}  />
          )}
        </div>}
      </>
      :
      <Loading/>
      }
    </div>
  )
};
export default React.memo( Tweet ) 