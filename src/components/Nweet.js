import { dbService, storageService } from '../Fbase';
import React, { useEffect, useState } from 'react';
import RtAndLikeFun from './RtAndLikeFun';
import UserProfile from './UserProfile';
import { getProfile } from './GetData';
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import '../css/nweet.css'
//edit, delete 
const Nweet =({nweetObj , userObj ,isOwner  }) =>{
  const [ownerProfile, setOwnerProfile] = useState({alarm:[]});
  const [whoProfile, setWhoProfile] = useState({alarm:[]});

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
    nweetObj.who && getProfile(nweetObj.who , setWhoProfile);
    getProfile(nweetObj.creatorId ,setOwnerProfile);
    },[]);
  
  return(
    <div className="nweet" >
      {nweetObj.value === "rt" && 
        <div> 
          <AiOutlineRetweet/> 
          {whoProfile.creatorId === userObj.uid  ? '내가' : `${whoProfile.userName}님이`} 리트윗함
        </div>
      }
      {nweetObj.value === "heart" &&
        <div>
          <AiOutlineHeart/> 
          {whoProfile.creatorId === userObj.uid  ? '내가' : `${whoProfile.userName}님이`}  마음에 들어함
        </div>
      }
      <UserProfile nweetObj ={nweetObj}/>
      <h4>{nweetObj.text}</h4>
      <div>
        { nweetObj.attachmentUrl && 
        <img src={nweetObj.attachmentUrl}  max-width="300px" height="150px" alt="Nweet_photofile"/>}
      </div>
      <div className="rtAndLikeFun">
        <RtAndLikeFun 
        nweetObj={nweetObj} 
        userObj={userObj} 
        ownerProfile={ownerProfile} 
        whoProfile={whoProfile}
        />
      </div>
      
      {isOwner && 
        <>
          <button onClick={onDeleteClick}>
            Delete Nweet
          </button>
        </>
      }
    </div>
  )
}

export default Nweet ;