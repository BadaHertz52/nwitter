import { dbService, storageService } from '../Fbase';
import React, { useEffect, useState } from 'react';
import RtAndLikeFun from './RtAndLikeFun';
import UserProfile from './UserProfile';
import { getProfile } from './GetData';
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
//edit, delete 
const Nweet =({nweetObj , userObj ,isOwner  }) =>{
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

  useEffect(()=>{
    nweetObj.who && getProfile(nweetObj.who , setUserProfile)
    },[]);
  
  return(
    <div className="nweet" >
      {nweetObj.value === "rt" && 
        <div> 
          <AiOutlineRetweet/> {userProfile.creatorId === userObj.uid  ? '내가' : `${userProfile.userName}님이`} 리트윗함
        </div>
      }
      {nweetObj.value === "heart" &&
        <div>
          <AiOutlineHeart/> {userProfile.userName}님이 내 트윗을 마음에 들어함
        </div>
      }
      <UserProfile nweetObj ={nweetObj}/>
      <h4>{nweetObj.text}</h4>
      <div>
        { nweetObj.attachmentUrl && 
        <img src={nweetObj.attachmentUrl}  max-width="300px" height="150px" alt="Nweet_photofile"/>}
      </div>
      <div className="rtAndLikeFun">
        <RtAndLikeFun nweetObj={nweetObj} userObj={userObj}/>
      </div>
      
      {isOwner && 
        <>
          <button onClick={onDeleteClick}>Delete Nweet</button>
        </>
      }
    </div>
  )
}

export default Nweet ;