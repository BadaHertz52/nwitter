import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Nweet from './Nweet';

export const ProfileTopForm = ({profile , currentUserProfile} )=>{

  return(
    <section id="profileForm">
      <div id="profileForm_profile">
        <img src={profile.photoUrl} width="100px" height="100px" border-radius ="50px"  alt="profile"/>
        <span>{profile.userName}</span>
      </div>
      <div className="follow">
        <Link to={{
          pathname:`/list/${profile.userId}`,
          state :{
            currentUserProfile : currentUserProfile,
            userId: profile.creatorId,
            following: profile.following
          }
        }}>
        {profile.following && (
          <div> 
            {profile.following[0] === undefined ? 0 :profile.following.length } 팔로워 중 
          </div>
        )}
        </Link>
        <Link to={{
          pathname :`/list/${profile.userId}`,
          state:{
            currentUserProfile : currentUserProfile,
            userId: profile.creatorId,
            follower:profile.follwer
          }
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
