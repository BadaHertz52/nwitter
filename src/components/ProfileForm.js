import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react/cjs/react.development';
import Nweet from './Nweet';

export const ProfileTopForm = ({profile , currentUserProfile} )=>{
  const state ={
    //로그인한 유저
    currentUserProfile : currentUserProfile, 
    // 해당 프로필의 유저
    userName:profile.userName ,
    userId:profile.userId,
    creatorId: profile.creatorId,
    following: profile.following,
    follower:profile.follower
  };
  return(
    <section id="profileTopForm">
      <div id="profileForm_profile">
        <img src={profile.headerUrl} width="100%" height="100px" alt="profileHeader" />
        <img src={profile.photoUrl} width="100px" height="100px" border-radius ="50"  alt="profile"/>
        <span>{profile.userName}</span>
      </div>
      <div className="follow">
        <Link to={{
          pathname:`/list/following/${profile.userId}`,
          state : state
        }}>
        {profile.following && (
          <div> 
            {profile.following[0] === undefined ? 0 :profile.following.length } 팔로우 중 
          </div>
        )}
        </Link>
        <Link to={{
          pathname :`/list/follower/${profile.userId}`,
          state:state
        }}>
          { profile.follwer && (
            <div>
              {profile.follower[0] === undefined ? 0 :profile.follower.length} 팔로워
            </div>
          )}
        </Link>
      </div>
    </section>
  )
}

export const ProfileBottomForm = ({nweets ,userobj})=>{
  const filtering = nweets.filter(nweet => ['nweet', 'rn', 'cn'].includes(nweet.value));
  const [contents, setcontents]=useState(filtering);
  const buttons =document.querySelectorAll('#pb_buttons button');
  const nweetBtn = document.getElementById('pb_btn_nweet');
  const changeStyle =(target)=>{
    buttons.forEach(button =>button.style.color="black");
    target && (target.style.color ="blue");
  }
  const showNweet =(event)=>{
    setcontents(filtering);
    const target = event ? event.target :nweetBtn;
    changeStyle(target);
  };
  const showNweetAnwer =(event)=>{
    const filtering = nweets.filter(nweet =>  nweet.value !== 'heart');
    setcontents(filtering);
    event && changeStyle(event.target);
  };

  const showMedia =(event)=>{
    const filtering = nweets.filter(nweet => nweet.attachmentUrl !=="" && nweet.value == 'nweet');
    setcontents(filtering);
    event &&  changeStyle(event.target);
  };
  const showHeart =(event)=>{
    const filtering =nweets.filter(nweet => nweet.value ==='heart');
    setcontents(filtering);
    event && changeStyle(event.target);
  };
  useEffect(()=>{
    showNweet();
  },[nweets])
  return (
    <section id="profileBootmForm" >
      <div id='pb_buttons'>
        <button id="pb_btn_nweet" onClick={showNweet}>트윗 </button>
        <button  onClick={showNweetAnwer}>트윗 및 답글</button>
        <button onClick={showMedia}>미디어</button>
        <button onClick={showHeart}>마음에 들어요</button>
      </div>
      <div id="contents">
      {nweets[0] == undefined ?
        <div>
          nweet을 불러오는 중 입니다.
        </div>
      :
      contents.map(content => <Nweet  nweetObj ={content}  isOwner={content.creatorId === userobj.uid} userobj={userobj}/>  )
      }
      </div>
    </section>
  )
}
