import React, { useState, useContext , useEffect} from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom';
import {HiOutlinePhotograph} from "react-icons/hi";
import { storageService } from '../Fbase';
import {NweetContext} from '../context/NweetContex';
import {ProfileContext} from '../context/ProfileContex';
import Nweet from '../components/Nweet';
import { BiArrowBack, BiX } from 'react-icons/bi';
import {  sendNotification, updateMyNweetsByMe, updateNweetNotifications ,getProfileDoc } from '../components/GetData';

const NweetFactory = ({userobj ,setPopup }) => {

  const [nweetFactory, setNweetFactory]=useState("nweetFactory");
  const location= useLocation();
  const state=location.state;
  const navigate =useNavigate();
  const {nweetInput, nweetDispatch ,myNweets} =useContext(NweetContext);
  const {myProfile}=useContext(ProfileContext);
  const [attachment ,setAttachment] = useState("");
  const now = new Date();
  const year = now.getFullYear();
  const month =now.getMonth()+1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const onClose=()=>{
    nweetDispatch(
      {type:'CLEAR_INPUT'}
    );
    const pathname=location.pathname;
    const start =pathname.indexOf('/nweet');
    const back =pathname.slice(0,start);

    location.pathname ==="/nweet"?
    navigate("/" ,{state:{previous:location.pathname}})
    :
    location.pathname.includes("nweet")&&
    navigate(back ,
      {state:{
        previous:location.pathname.includes("list")? location.state.pre_previous: location.pathname , 
        pre_previous:location.state.pre_previous,
        previousState: (location.pathname.includes("status")|| location.pathname.includes("list"))? location.state.previousState : null,
        value :location.pathname.includes("status")? "status": null,
        userUid: state.userUid !==undefined ? state.userUid : undefined,
        userId: state.userId !==undefined ? state.userId : undefined,
      }});
  };
  const onSubmit = async(event) => {
    event.preventDefault();
    const docId= JSON.stringify(Date.now());
    let url ="" ;

    if(attachment !== "" && nweetInput!==undefined){
    const attachmentRef =storageService.ref().child(`${userobj.uid}/${docId}`);
    const response = await attachmentRef.putString(attachment, "data_url");
    url=await response.ref.getDownloadURL();
    }
    const newNweet ={
      value:location.state ==null || location.state.value ==undefined ?
      "nweet" : 
      location.state.value  ,
      text:nweetInput.text.replace(/(\r\n|\n)/g, '<br/>'),
      attachmentUrl:url,
      creatorId: userobj.uid,
      docId:docId,
      createdAt:[
        year,month, date ,hour,minutes
      ],
      about: location.state ==null || location.state.value == undefined? 
      null : 
      {creatorId:location.state.nweetObj.creatorId ,
      docId:location.state.nweetObj.docId
      },
      notifications:[],
    };
    nweetDispatch({
      type:"CREATE",
      docId:docId,
      uid:userobj.uid,
      nweet :newNweet
    });

    setAttachment("");
    
    setPopup !== undefined && setPopup(false)
    // 알림
    
    if(myProfile.follower[0]!==undefined){
      myProfile.follower.forEach(async(user)=>
        { 
          await getProfileDoc(user)
          .get()
          .then(async(doc)=>{
            if(doc.exists){ 
              const profile=doc.data();
              sendNotification("nweet",userobj, newNweet, profile, "")
            }
            else{console.log("Can't find user's profile")}})
          .catch(error=> console.log(error,"in NweetFactory"));
        })
    };
    if(location.state !==null && 
      location.state.value !== undefined && 
      (location.state.value ==="qu" ||
      location.state.value ==="answer" ||
      location.state.value ==="nweet" 
      )){
         //알림 가기, 알림 업데이트 
      const profile =location.state.profile ;
      const nweetObj =location.state.nweetObj;
      const value =location.state.value;
      // 작성자의 nweet에 대한 알림
    if( nweetObj.creatorId !== userobj.uid ){
      updateNweetNotifications(nweetObj,profile ,value,userobj ,docId) 
      //작성자 profile에 대한 알림 
      sendNotification(value, userobj, nweetObj, profile, docId);
    }else{
      updateMyNweetsByMe(myNweets,value,userobj,docId,nweetDispatch,nweetObj.docId)
    }
    }
      onClose()
    };

  const adjustingHeight=(target)=>{
    target.style.height='auto';
    const scrollHeight =target.scrollHeight;
    target.style.height=`${scrollHeight}px`;
  }
  const onChange =  (event) => {
    const target =event.target;
    const {name, value}= event.target;
    target.addEventListener("keyup", adjustingHeight(target));
    nweetDispatch({
      type:"WRITE",
      name,
      value
    })
  }

  const onFileChange =(event) => {
  const {
    target:{files}
  } = event ;
  const theFile =files[0];
  const reader = new FileReader();
  reader.onloadend = (finishedEvent) =>{
    const { currentTarget : {result}} = finishedEvent;
    setAttachment (result);
    nweetDispatch({
      type:"WRITE",
      name:"attachmentUrl",
      value :result
    })
  };
  reader.readAsDataURL(theFile);
};

  const onClearAttachment = ()=> {
    setAttachment("");
  };

  const OnEditAttachment =(event)=>{
    event.preventDefault();
    navigate('crop', {state:{
      pre_previous:location.state!==null? location.state.previous : "",
      previous:location.pathname,
      what:"attachment",
      src:attachment,
      value:location.state!==null? location.state.value:null}})
  };
  useEffect(()=>{

    if(state !==null){
      if(state.what !== undefined){
        state.what =="attachment"&&
        setAttachment(nweetInput.attachmentUrl)
      };
      if(state.value !== undefined){
        const value =state.value;
        (value==="answer" || value ==="qn" || value==="nweet") &&
        setNweetFactory("nweetFactory popup");
      }
    }
  },[state]) ;

  return (
    <div className={nweetFactory}>
      <div class='nweetFactory_inner'>
        {nweetFactory =="nweetFactory popup" &&
          <div class="nweetFactory_header">
            <button  onClick={onClose}>
              {location.state !==null && (location.state.value=="nweet" ?
              <BiX/> :
              <BiArrowBack/>
              )
              }
            </button> 
            <button onClick={onSubmit} id="nweetBtn" >
            Nweet
            </button>
          </div>
        }

        { location.state !== null && (location.state.value === "answer" &&
        <div id="answerNweet">
          <Nweet
            nweetObj={location.state.nweetObj} 
            userobj={userobj} 
            isOwner ={location.state.isOwner} 
            answer={true} 
          />
        </div>
        )}
        <div className={(location.state !== null && location.state.value === "answer") 
        ? "nweetFactory_box answer" : "nweetFactory_box"}>
          <div className="userProfile">
                  <img 
                    className="profile_photo" 
                    src={userobj.photoURL}
                    alt="profile"
                  />
                
          </div>
          <form onSubmit={onSubmit}>
            <textarea
            value={nweetInput!==undefined&&nweetInput.text}
            name='text'
            onChange={onChange}
            type="text"
            placeholder="What's happening?"
            maxLength={120}
            />
            
            {attachment !== ""&& (
              <div id="nweetfactory_attachment">
                <img src={attachment}  alt="nweet attachment"/>
                <button onClick={onClearAttachment}>x</button>
                <button onClick={OnEditAttachment}>Edit</button>
              </div>
            )}
            {location.state !==null && location.state.value=="qn"&&
              <div id="nweetFactory_qn">
                <Nweet 
                  nweetObj={location.state.nweetObj}  
                  userobj={userobj} 
                  isOwner ={location.state.isOwner} 
                  answer={false}
                />
              </div>
            }
            <div>
              <label for="nweet_fileBtn">
                <HiOutlinePhotograph />
              </label>
              <input 
                type="file" 
                accept="image/*" 
                id="nweet_fileBtn" 
                style={{display:"none"}} 
                onChange={onFileChange} 
              />
              <input 
                type="submit" 
                value="Nweet"  
                className='btn'
              />
            </div>
          </form>
        </div>
      </div>
  </div>
  )
}

export default React.memo( NweetFactory );