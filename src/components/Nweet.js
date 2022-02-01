import React, {  useContext, useEffect, useRef, useState } from 'react';
import UserProfile from './UserProfile';
import {  AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import {FiArrowLeft, FiMessageCircle} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import Heart from './Heart';
import Rn from './Rn';
import {  deleteNweetNotification, deleteProfileNotification, getNweet, getNweetDoc, getProfile, getProfileDoc, goBack} from './GetData';
import  { NweetContext } from '../context/NweetContex';
import {ProfileContext} from '../context/ProfileContex';
import {BiDotsHorizontalRounded } from 'react-icons/bi';
import Loading from './Loading';


const Nweet =({key, nweetObj , userobj ,isOwner ,answer}) =>{
  const navigate =useNavigate();
  const location =useLocation();
  const state =location.state !==null && location.state.previousState !==null ? location.state.previousState :location.state ;
  const nweetobj = nweetObj!==undefined? nweetObj :   state.nweetObj;
  const is_owner = isOwner !==undefined? isOwner :state.isOwner;
  const is_answer = answer !==undefined? answer : state.answer;
  const {myProfile} =useContext(ProfileContext);
  const {nweetDispatch} =useContext(NweetContext);
  const profileForm ={
    userId:"" ,
    userName:"",
    uid:"",
    photoUrl:""
  };
  const nweetForm ={
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
  const [aboutNweet, setAboutNweet]= useState(nweetForm); 
  const [answerNweets, setAnswerNweets]=useState([{
    nweet:nweetForm, 
    profile:profileForm}]);
  const [statusAnswer ,setStatusAnswer]=useState(false);
  const [nweetClassName ,setNCName]=useState("nweet");
  const answerForm =useRef();
  const rn_heart =(nweetobj!==undefined&& 
    nweetobj.notifications!==undefined&& 
    nweetobj.notifications[0]!==undefined) ?
  nweetobj.notifications.filter(n=> (n.user ===userobj.uid)&&(n.value==="heart"|| n.value==="rn"))[0] :undefined;
  const [loading,setLoading]=useState(false);

  const getAnswerNweets=async(nweet)=>{
    const answerNotifications = nweet.notifications.filter(n=> n.value=="answer");
    const array = await Promise.all(answerNotifications.map( async(answer) =>{
      const answerProfile =await getProfileDoc(answer.user).get().then(doc=>doc.data());
        const answerNweet = await getNweetDoc(answer.user, answer.aboutDocId).then(doc=> doc.data());
        return {nweet:answerNweet , profile:answerProfile}
      })).then(result => result);
      setAnswerNweets(array);
      setStatusAnswer(true);
  }
  //fun

  const chagneClassName =()=>{
  if(nweetobj.value === "answer"){
    setNCName("nweet answer");
  }
};
  const onAnswer=()=>{
    navigate(`nweet`, {state:{
    previous:location.pathname,
    nweetObj:nweetobj.value =="nweet"? nweetobj: aboutNweet, 
    value:"answer",
    profile:{uid:ownerProfile.uid, notifications:ownerProfile.notifications}, 
    isOwner:false}})
  };
    const onBack=()=>{
      location.pathname.includes("nweet")?
      goBack(location, "/nweet",navigate):
      goBack(location, `/${location.state.previousState.userId}/status`,navigate)
    }
  useEffect(()=>{

    if( location.pathname.includes("status")||
    location.pathname.includes("timeLine")){
      nweetobj.value==="answer"? getAnswerNweets(aboutNweet) :getAnswerNweets(nweetobj)
      }
  },[location ,nweetobj,aboutNweet]);

  useEffect(()=>{
  nweetClassName !=="nweet answer" && chagneClassName();
  if(myProfile.userName !==""){
    if(ownerProfile.userId ===""){
      location.pathname.includes("status")?
      setOwnerProfile(state.ownerProfile):
      getProfile(nweetobj.creatorId ,setOwnerProfile);
      };
    if(aboutProfile.userId ===""){
      if( nweetobj.about !== null ){
        getProfile(nweetobj.about.creatorId ,setAboutProfile);
        getNweet(nweetobj.about.creatorId, nweetobj.about.docId, setAboutNweet);
      }
    };
  }else {
      console.log("Can't find myProfile")
    };
  },[myProfile ,aboutProfile]);
  useEffect(()=>{
    if(nweetobj.about!==null){
      (ownerProfile.photoUrl!=="" &&aboutProfile.photoUrl!=="" && aboutNweet.docId!=="")
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
  },[ownerProfile,aboutProfile,aboutNweet]);
  
  const NweetForm =({what ,IsAnswer, profile})=>{
    const now = new Date();
    const year = now.getFullYear();
    const date = now.getDate();
    const month =now.getMonth()+1;
    const [time ,setTime] =useState("");
    const [aboutTime ,setAboutTime]=useState("");
    const textId =what.docId;
    const nweet ={
      id:what.id,
      docId:what.docId,
      text :what.text,
      attachmentUrl:what.attachmentUrl,
      createdAt:what.createdAt,
      creatorId:what.creatorId,
      value:what.value,
      notifications:what.notifications,
      about:what.about,
    } ;
    const monthArry =["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul","Aug","sep","Oct","Nov","Dec"];


    const onDeleteClick = (event) =>{
      event.preventDefault();
      const ok = window.confirm("Are you sure you want to delete this nweet?");
      nweetDispatch({
        type:"DELETE",
        uid:userobj.uid,
        docId: nweet.docId ,
        attachmentUrl:nweet.attachmentUrl
      });
      switch (nweet.value) {
        case "qn":
          deleteNweetNotification(aboutNweet,nweet,userobj,nweetobj.value);
          deleteProfileNotification(aboutProfile,aboutNweet,nweet,userobj,nweetobj.value )
          break;
        case "answer":
          deleteNweetNotification(nweetobj,nweet,userobj,nweetobj.value);
          deleteProfileNotification(ownerProfile,nweetobj,nweet,userobj,nweet.value )
          break;
        default:
          break;
      }
    };


    const goState =(event)=>{
      const target =event.target;
      const condition = nweet.creatorId===ownerProfile.uid;
      const condition1 =!target.classList.contains("fun");
      const condition2 = !target.parentNode.classList.contains("fun");
      const pathName = `${profile.userId}/status/${nweet.docId}`;
  
      if(condition1 && condition2){
        navigate(`${pathName}` , {state:{
            previous:location.pathname,
            previousState:{                         
              nweetObj:nweet,
              isOwner:condition,
              answer:false,
              ownerProfile:profile,
              value :"status",
              userId:condition? ownerProfile.userId : aboutProfile.userId,
              docId:condition? nweetobj.docId: aboutNweet.docId},
            value:"status"
          }
          })
      }
    };

    useEffect(()=>{
      (time !==""&&
      nweet.createdAt[0]== year &&
      nweet.createdAt[1]==month &&
      nweet.createdAt[2] == date )?
      setTime(`${nweet.createdAt[3]}h`)
      : setTime(`${monthArry[nweet.createdAt[1]]} ${nweet.createdAt[2]},${nweet.createdAt[0]}`)
    },[nweet]);

    useEffect(()=>{
      (aboutTime !== ""&& 
      aboutNweet.docId !==""&&
      aboutNweet.createdAt[0]== year &&
      aboutNweet.createdAt[1]==month &&
      aboutNweet.createdAt[2] == date )?
      setAboutTime(`${aboutNweet.createdAt[3]}h`)
      : setAboutTime(`${monthArry[aboutNweet.createdAt[1]]} ${aboutNweet.createdAt[2]},${aboutNweet.createdAt[0]}`)
    },[aboutNweet]);

    const target =document.getElementById(`${textId}`);
    if(target !==null && target.innerHTML !== nweet.text){
      target.innerHTML =nweet.text
    };
  
  return (
  <div 
  className={!location.pathname.includes("status")&&"statusBtn"}
  >
      <div
      className='nweet_form'
      id={key}
      ref={answerForm} 
      onClick={goState} 
      >
      <div className='nweetSide'>
        <UserProfile profile={profile}/>
        {  IsAnswer &&   !statusAnswer &&
          <div className='answerLine'  >
          </div> 
        }
        
      </div>
        {/*nweet_content*/}
      <div className="nweet_content">
        <div className='nweet_header'>
          <div>
            <span>{profile.userName}</span>
            <span>@{profile.userId}</span>
            <span className='nweet_time'>
              {time}
            </span>
          </div>
          { is_owner && 
          <button className='fun' onClick={onDeleteClick} name={nweet.docId}>
            <BiDotsHorizontalRounded/>
          </button>
          }
        </div>
        <div className="text" 
        id={textId} >
          {nweet.text}
        </div>
        { nweet.attachmentUrl !=="" &&
        <div  className="attachment">
          <img src={nweet.attachmentUrl}  alt="nweet_attachment"/>
        </div>
        }
        {nweet.value==="qn" &&(
          <div className="nweet qn">
            <div className="nweet_content">
              <div className='nweet_header'>
                <UserProfile profile={aboutProfile} />
                <div>
                  <span>{aboutProfile.userName}</span>
                  <span>@{aboutProfile.userId}</span>
                  <span className='qn_time'>{aboutTime}</span>
                </div>
              </div>
              <div className="text" >{aboutNweet.text}</div>
              { aboutNweet.attachmentUrl !== "" &&
              <div  className="attachment">
                <img src={aboutNweet.attachmentUrl}  alt="nweet_attachment"/>
              </div>
              }
            </div>
          </div>
            )}
          <div 
            className="nweet_fun fun"
          >
            <button className="fun answer" onClick={onAnswer}> 
                <FiMessageCircle/>
            </button>
              <Rn nweetObj={what} original={nweetobj} userobj={userobj} profile={profile} ownerProfile={ownerProfile}
              />
              <Heart nweetObj={what} original={nweetobj} userobj={userobj} profile={profile} ownerProfile={ownerProfile}/>
          </div>
          {IsAnswer &&  !statusAnswer &&
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
      {(nweetobj !==undefined && !loading)?
      <>
        <div className={nweetClassName} 
        id={location.pathname !==undefined && 
            location.pathname.includes("status")&& "status" }
        >
          {location.pathname.includes("status") &&
            <div id="status_header" >
              <button className='back' onClick={onBack}>
                <FiArrowLeft/>
              </button>
              <div>
                Nweet
              </div>
            </div>
          }
          <div className="value">
            {(nweetobj.value ==="rn" &&
              rn_heart==undefined) 
            &&
              <div className="value_explain">
                <AiOutlineRetweet/>
                {ownerProfile.uid === userobj.uid  ?
                '내가'
                :
                `${ownerProfile.userName}님이`} Renweeted
              </div>
            }
            {(nweetobj.value ==="heart" &&
              rn_heart==undefined)
              
              &&
              <div className="value_explain">
                <AiOutlineHeart/>
                {ownerProfile.uid === userobj.uid  ?
                '내가'
                :
                `${ownerProfile.userName}님이`} liked
              </div>
            }
            {((nweetobj.value ==="rn" &&
              rn_heart!==undefined)||
              (nweetobj.value ==="heart" &&
              nweetobj.notifications.filter(n=> (n.user ===userobj.uid)&&(n.value==="rn"))[0]!==undefined)) &&
              <div className="value_explain">
                <AiOutlineRetweet/>
                <AiOutlineHeart/>
                {ownerProfile.uid === userobj.uid  ?
                '내가'
                :
                `${ownerProfile.userName}님이`} Renweeted and liked
              </div>
            }
            { nweetobj.value === "answer"  &&
            <>
              <NweetForm what={aboutNweet} IsAnswer={true}  profile={aboutProfile} />
            </>
            }
          </div>
          {(
          nweetobj.value === "qn" ||
          nweetobj.value ==="nweet" )&&
          <NweetForm 
            what={nweetobj} 
            IsAnswer={is_answer} 
            profile={ownerProfile}  /> 
          }
          {(nweetobj.value==="rn" ||
            nweetobj.value === "heart"
            )&&
          <NweetForm 
            what={aboutNweet}  
            IsAnswer={false} 
            profile={aboutProfile}
          />
          }
          {nweetobj.value ==="answer" &&  !statusAnswer &&
            <NweetForm 
              what={nweetobj} 
              IsAnswer={false} 
              profile={ownerProfile}/>
          }
        </div>
      {statusAnswer&& 
        <div class="nweet answers" >
          {answerNweets.map(
            answer => 
            <NweetForm what={answer.nweet} IsAnswer={false} profile={answer.profile}  />
          )}
        </div>}
      </>
      :
      <Loading/>
      }
    </div>
  )
};
export default React.memo( Nweet ) 