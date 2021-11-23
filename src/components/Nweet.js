import { dbService, storageService } from '../Fbase';
import React, { useEffect, useState } from 'react';
import RnAndLikeFun from './RnAndLikeFun';
import UserProfile from './UserProfile';
import { getProfile } from './GetData';
import { AiOutlineRetweet ,AiOutlineHeart } from "react-icons/ai";
import { useHistory } from 'react-router';
import '../css/nweet.css' ;
import {FiMessageCircle} from 'react-icons/fi';
import { Link } from 'react-router-dom';
//edit, delete
const Nweet =({nweetObj , userobj ,isOwner  }) =>{
  const historyState =useHistory().location.state ;
  if( nweetObj === undefined){
    nweetObj = historyState.nweetObj;
    userobj =historyState.userobj ;
    isOwner =historyState.isOwner;
  }
  const [whoProfile, setWhoProfile] =useState();
  const [ownerProfile, setOwnerProfile] =useState();
  const [nweetClassName ,setNCName]=useState("nweet");
  const [nweetContentClassName ,setNCCName]=useState("nweet_content");
  const onDeleteClick = async () =>{
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if(ok){
      //delete nweet
      await dbService.doc(`nweets_${userobj.uid}/${nweetObj.id}`).delete();
      //delete photo
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  const chagneClassName =()=>{
  if(nweetObj.value === "answer"){
    setNCName("nweet answer");
    setNCCName("nweet_content answer");
  }
};
  useEffect(()=>{
    const getUsersProfile = async() =>{
      await getProfile(nweetObj.creatorId , setOwnerProfile); 
      nweetObj.who && await getProfile(nweetObj.who , setWhoProfile)
      };
    getUsersProfile();
    chagneClassName();
    },[]);

  return(
    <>
      {nweetObj !==undefined && 
        <div className={nweetClassName} >
          <div className="nweet_value">
            {nweetObj.value === "rt" &&
              <div>
                <AiOutlineRetweet/> 
                {whoProfile.creatorId === userobj.uid  ? 
                '내가' 
                : 
                `${whoProfile.userName}님이`} 리트윗함
              </div>
            }
            {nweetObj.value === "heart" &&
              <div>
                <AiOutlineHeart/> 
                {whoProfile.creatorId === userobj.uid  ? 
                '내가' 
                : 
                `${whoProfile.userName}님이`} 이 트윗을 마음에 들어함
              </div>
            }
            {nweetObj.value === "answer" &&
              <Nweet nweetObj={nweetObj.answer} isOwner={false} userobj={userobj} />
            }
          </div>
          <div className={nweetContentClassName}>
            <UserProfile userId ={nweetObj.creatorId}/> 
            <div className="nweet_content_text" >{nweetObj.text}</div>
            <div  className="nweet_content_attachment">
              { nweetObj.attachmentUrl &&
              <img src={nweetObj.attachmentUrl}  max-width="300px" height="150px" alt="Nweet_photofile"/>}
            </div>
            {nweetObj.citingNweet && nweetObj.citingNweet !== {} &&(
              <div className="nweet_cn">
                <UserProfile userId ={nweetObj.citingNweet.creatorId}/> 
                <div className="nweet_content_text" >{nweetObj.citingNweet.text}</div>
                <div  className="nweet_content_attachment">
                  { nweetObj.citingNweet.attachmentUrl &&
                    <img src={nweetObj.citingNweet.attachmentUrl}  max-width="300px" height="150px" alt="Nweet_photofile"/>}
                </div>
              </div>
            )}
          </div>
          <div className="nweet_fun">
            <div className="nweet_fun_answer">
              <Link to={{
                pathname:"/nweet",
                state :{
                  value:"answer",
                  nweetObj :nweetObj,
                  userobj:userobj
                }
              }}>
                <FiMessageCircle/>
              </Link>
            </div>
            <div className="nweet_fun_rtAndLikeFun">
              <RnAndLikeFun nweetObj={nweetObj} userobj={userobj} whoProfile={whoProfile
              } ownerProfile={ownerProfile}/>
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