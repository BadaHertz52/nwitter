import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { getProfile, getProfileDoc } from "../components/GetData";
import UserProfile from "../components/UserProfile";
import { dbService } from "../Fbase";

const List =()=>{
  const history=useHistory();
  const state =history.location.state;
  const [follower ,setFollower] =useState([]);
  const [following, setFollowing] =useState([]);
  const [userId, setUserId]=useState("id");
  const[users, setUsers]=useState([]);
  const [profile, setProfile] =useState([]);
  const [userProfile, setUserProfile]=useState({
    alarm:[],
    follower:[]
  });
  const [currentUser, setCurrentUser]= useState({
    follower:[],
    following:[]
  });
  const clickFollower =(event)=>{
    event.preventDefault();
    setUsers(follower);
  };

  const  clickFollowing =(event)=>{
    event.preventDefault();
    setUsers(following);
  };
  const followBtn =async(event)=>{
    event.preventDefault();
    const newAlarm ={
      userId:currentUser.creatorId , 
      creatorId : "none", 
      createdAt: "none", 
      value: "follow" };
    const targetId= event.target.parentNode.firstChild.firstChild.id;
    const targetText = event.target.textContent ;
    const currentUserProfileDoc= getProfileDoc(currentUser.creatorId);
    const userProfileDoc=getProfileDoc(targetId);
    
    await getProfile(targetId, setUserProfile);
    console.log(targetId ,userProfile);
    if(targetText ==="팔로우 하기"){
      console.log("팔로우 합니다.")
      userProfile.alarm.unshift(newAlarm);
      userProfile.follower.unshift(currentUser.creatorId);
      console.log(userProfile.follower)
      // userProfileDoc.update({
      //   alarm: userProfile.alarm ,
      //   follower:userProfile.follower
      // });

      currentUser.following.unshift(targetId);
      // currentUserProfileDoc.update({
      //   following: currentUser.following
      // })

    }else{
      console.log("언팔로우")
      //언팔로우 
      const newFollowerList =userProfile.follower.filter(user=> user !== currentUser.creatorId);
      // userProfileDoc.update({
      //   follower: newFollowerList
      // });

      const newFollowingLis = currentUser.following.filter(user => user!== targetId);
      // currentUserProfileDoc.update({
      //   following:newFollowingLis
      // })

      console.log(userProfile.follower , newFollowerList, currentUser.following ,newFollowingLis);
    }
  }

  useEffect(()=>{
    const setData =async()=>{
      if(state !== undefined){
        setUserId(state.userId);    
        if(state.follower !== undefined){
        const followers = await Promise.all 
        (state.follower.map(
          user => {
            getProfile(user,setProfile );
            return profile
          }
        ))
        .then(data => data);
        setFollower(followers);
      }
      if(state.following !== undefined){
        const followings = await Promise.all 
        (state.following.map(
          user =>{ 
            getProfile(user,setProfile ); 
            return profile
          }
        ))
        .then(data => data);
        setFollowing(followings);
      }
      }};
    setCurrentUser(state.currentUserProfile);
    setData();
  } 
  ,[])
  return(
    <div id="list">
      { userId !== "id" &&
      <UserProfile userId={userId} />
      }
      <div id="list_btn">
        <button onClick={clickFollower}>팔로워</button>
        <button onClick={clickFollowing}>팔로잉</button>
      </div>
      <div id="list_list">
        { users[0] !== undefined
        ?
          users.map(user => 
          <div className="list_profile">
            <Link
              to={{
                pathname:`/profile/${user.userId}`,
                state :{
                  userProfile :user
                }
              }}
            >
              <img 
              src={user.photoUrl}
              width="50px" height="50px"    alt="profile"
              >
              </img>
              <div>
                <div>{user.userName}</div>
                <div>프로필 상태</div>
              </div>
              <div>
                {currentUser.follower.includes(user) && "나를 팔로우 합니다."
                }
              </div>
              <button className="list_followBtn" onClick={followBtn}>
                {currentUser.following.includes(user)? 
                  "팔로잉"
                  :"팔로우 하기"
                  }
              </button>
            </Link>
          </div>
            )
        : 
        (follower[0] ===undefined ? "팔로워가 없습니다." : "팔로잉이 없습니다.")
      }  
      </div>
    </div>
  )
}

export default List ;