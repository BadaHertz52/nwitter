import { dbService, storageService } from '../Fbase';
import React, { useEffect, useState } from 'react';
import RtAndLikeFun from './RtAndLikeFun';
import UserProfile from './UserProfile';
import { getProfile } from './GetData';
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useHistory } from 'react-router';
import '../css/nweet.css' ;
import {FiMessageCircle} from 'react-icons/fi';
import { Link } from 'react-router-dom';
//edit, delete
const Nweet =({nweetObj , userObj ,isOwner  }) =>{
  const historyState =useHistory().location.state ;
  if( nweetObj === undefined){
    nweetObj = historyState.nweetObj;
    userObj =historyState.userObj ;
    isOwner =historyState.isOwner;
  }
  const [userProfile, setUserProfile] =useState({});

  const onDeleteClick = async () =>{
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if(ok){
      //delete nweet
      await dbService.doc(`nweets_${userObj.uid}/${nweetObj.id}`).delete();
      //delete photo
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  const AnswerFun = ()=>{
    return (
      <Link to={{
        pathname:"/nweet",
        state :{
          nweetObj :nweetObj
        }
      }}>
        <FiMessageCircle/>
      </Link>
    )

  }
  useEffect(()=>{
    nweetObj.who && getProfile(nweetObj.who , setUserProfile)
    },[]);

  return(
    <>
      {nweetObj !==undefined &&
        <div className="nweet" >
          <div className="nweet_value">
            {nweetObj.value === "rt" &&
              <div>
                <AiOutlineRetweet/> 
                {userProfile.creatorId === userObj.uid  ? 
                '내가' 
                : 
                `${userProfile.userName}님이`} 리트윗함
              </div>
            }
            {nweetObj.value === "heart" &&
              <div>
                <AiOutlineHeart/> 
                {userProfile.creatorId === userObj.uid  ? 
                '내가' 
                : 
                `${userProfile.userName}님이`} 이 트윗을 마음에 들어함
              </div>
            }
          </div>
          <div className="nweet_content">
            <UserProfile nweetObj ={nweetObj}/>
            <div className="nweet_content_text" >{nweetObj.text}</div>
            <div  className="nweet_content_attachment">
              { nweetObj.attachmentUrl &&
              <img src={nweetObj.attachmentUrl}  max-width="300px" height="150px" alt="Nweet_photofile"/>}
            </div>
          </div>
          <div className="nweet_fun">
            <div className="nweet_fun_answer">
              <AnswerFun nweetObj={nweetObj}/>
            </div>
            <div className="nweet_fun_rtAndLikeFun">
              <RtAndLikeFun nweetObj={nweetObj} userObj={userObj}/>
            </div>

          </div>
            
            
            {isOwner &&
              <>
                <button onClick={onDeleteClick}>Delete Nweet</button>
              </>
            }
          </div>
      }
    </>

  )
}

export default Nweet ;