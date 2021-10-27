import React from 'react';
import Nweet from './Nweet';

export const ProfileTopForm = ({profile} )=>{
  
  return(
    <section>
      <div>
        <img src={profile.photoUrl} width="150px" height="100px"  alt="profile"/>
        <span>{profile.userName}</span>
      </div>
      <div>following : {profile.following === []|| profile.following === undefined ? 0 :profile.following.length }</div>
      <div> follower:{profile.follower ===[] || profile.follower === undefined ? 0 :profile.follower.length  }</div>
    </section>
  )
}

export const ProfileBottomForm = ({nweets ,userObj})=>{
  
  return (
    <sectoion >
      {Array.isArray(nweets) && nweets.map(nweet => <Nweet  nweetObj ={nweet}  isOwner={nweet.creatorId === userObj.uid} userObj={userObj}/>  )}
    </sectoion>
  )
}
