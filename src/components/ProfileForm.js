import React from 'react';
import { Link } from 'react-router-dom';
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
    <section id="profileForm">
      <div id="profileForm_profile">
        <img src={profile.photoUrl} width="100px" height="100px" border-radius ="50px"  alt="profile"/>
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
  
  return (
    <sectoion >
      {Array.isArray(nweets) && nweets.map(nweet => <Nweet  nweetObj ={nweet}  isOwner={nweet.creatorId === userobj.uid} userobj={userobj}/>  )}
    </sectoion>
  )
}
