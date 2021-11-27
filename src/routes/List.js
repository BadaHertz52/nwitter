import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { getProfile, getProfileDoc } from "../components/GetData";


const List =()=>{
  const history=useHistory();
  const state =history.location.state;
  const [follower ,setFollower] =useState([]);
  const [following, setFollowing] =useState([]);
  // follower, followoing list user
  const [listUserProfile, setListUserProfile] =useState([]);
  // about following btn
  const [userProfile, setUserProfile]=useState({
    alarm:[],
    follower:[]
  });
  //로그인한 유저
  const [currentUser, setCurrentUser]= useState({
    follower:[],
    following:[],
  });
  // 해당 프로필의 유저
  const [profileUser, setProfileUser] =useState({
    userId:"",
    userName:""
  });

  const showFollower =async()=>{
    if(state.follower !== undefined){
      const followers = await Promise.all 
      (state.follower.map(
        user => {
          getProfile(user,setListUserProfile );
          return listUserProfile
        }
      ))
      .then(data => data);
      setFollower(followers);
    }
  };

  const  showFollowing =async()=>{
    if(state !== undefined && state.following !== undefined){
      const followings = await Promise.all 
      (state.following.map(
        user =>{ 
          getProfile(user,setListUserProfile ); 
          return listUserProfile
        }
      ))
      .then(data => data);
      await setFollowing(followings);
      console.log(following, followings)
    }
    console.log("followingBtn", following);
  };
  const clickFollower=(event)=>{
    event.preventDefault();
    history.push({
      pathname:`/list/follower/${profileUser.userId}`,
      state:{
        ...state
      }
    });
    showFollower();
  };
  const clickFollowing=(event)=>{
    event.preventDefault();
    history.push({
      pathname:`/list/following/${profileUser.userId}`,
      state:{
        ...state
      }
    });
    showFollowing();
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
    if(targetText ==="팔로우 하기"){
      console.log("팔로우 합니다.")
      userProfile.alarm.unshift(newAlarm);
      userProfile.follower.unshift(currentUser.creatorId);
      userProfileDoc.update({
        alarm: userProfile.alarm ,
        follower:userProfile.follower
      });

      currentUser.following.unshift(targetId);
      currentUserProfileDoc.update({
        following: currentUser.following
      })

    }else{
      console.log("언팔로우")
      //언팔로우 
      const newFollowerList =userProfile.follower.filter(user=> user !== currentUser.creatorId);
      userProfileDoc.update({
        follower: newFollowerList
      });

      const newFollowingLis = currentUser.following.filter(user => user!== targetId);
      currentUserProfileDoc.update({
        following:newFollowingLis
      })
    }
  };

  const UserList =({user})=>{
    return(
    <>
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
            {currentUser.following.includes(user) ?
              "팔로잉"
              :"팔로우 하기"
              }
          </button>
        </Link>
      </div>
    </>
    )
  };

  useEffect(()=>{
    const setData =async()=>{
      history.location.pathname.indexOf('follower') === -1 ?
      await showFollowing()
      :
      await showFollower()
    };
    setCurrentUser(state.currentUserProfile);
    setProfileUser({
      userId:state.userId ,
      userName:state.userName
    })
    setData();
  } 
  ,[]) ;

  return (
    <>
      {state !== undefined && (
          <div id="list">
          { state.userId !== "id" &&
            <div id="list_profile">
              <div>{state.userName}</div>
              <div>{state.userId}</div>
            </div>
          }
          <div id="list_btn">
            <button onClick={clickFollower}>팔로워</button>
            <button onClick={clickFollowing}>팔로잉</button>
          </div>
          <div id="list_list">
            { history.location.pathname.indexOf('follower') === -1 ?
            //show following 
              (following[0] !== undefined ?
                following.map(user=> 
                  <UserList user={user} key={user.userId}/>
                  )
                :
                "팔로우하는 사용자가 없습니다."
              )
            :
            //show follower
              (follower[0]!== undefined ?
                follower.map(user =>
                  <UserList user={user} key={user.userId}/>)
                :
                "팔로워하는 사용자가 없습니다."
              )
          }  
          </div>
        </div>
      )}
    </>
  )
}

export default List ;