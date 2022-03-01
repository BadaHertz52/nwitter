import React, {  useState ,useContext, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from 'react-router-dom';
import { getProfileDoc } from "../components/GetData";
import Loading from "../components/Loading";
import { ProfileContext } from "../context/ProfileContex";
import { UserContext } from "../context/UserContext";

const List =({userobj})=>{
  const [showFollower, setShowFollower] =useState(true);
  const {myProfile, profileDispatch}=useContext(ProfileContext);
  const {userProfile}=useContext(UserContext);

  const [profile, setProfile]=useState({userName:"", userId:"", follower:[], following:[]});

  const [followers,setFollowers]=useState([{photoUrl:"", userName:"", userId:"", uid:"" , introduce:""}]);

  const [followings, setFollowings]=useState([{photoUrl:"", userName:"", userId:"", uid:"" , introduce:""}]);

  const navigate =useNavigate();
  const location =useLocation();
  const state =location.state;

  const listBtns =document.querySelectorAll('.listBtn');
  const listFollower =document.getElementById('listFollower');
  const listFollowing =document.getElementById('listFollowing');
  

  const changeStyle =(what)=>{
    listBtns.forEach(btn=>btn.classList.remove('check'));
    what !== null && what.parentNode.classList.add('check');
  }
  const pushFollower=async()=>{
    const users = await Promise.all( profile.follower.map(user => getProfileDoc(user).get().then(doc=> doc.data())));
    setFollowers(users);
    setShowFollower(true);
    changeStyle(listFollower);
  };
  const pushFollowing=async()=>{
    const users=await Promise.all( profile.following.map(user => getProfileDoc(user).get().then(doc=>doc.data())));
    setFollowings(users);
    setShowFollower(false);
    changeStyle(listFollowing);
  };
  const goBack=()=>{
    if(state!==null){
      const {previous}=state;
      navigate( {previous}, {state:state })
    }
   
  };
  const goListFollower=()=>{
    
    navigate(`/twitter/${profile.userId}/list/follower` , 
  {state:state})};

  const goListFollowing =()=>{
    navigate(`/twitter/${profile.userId}/list/following` , 
    {state:state})
  };


  useEffect(()=>{
    if(state !== null && state.isMine !== undefined){
      const isMine =state.isMine;
      isMine ? setProfile(myProfile): setProfile(userProfile);
  } ;
},[state, userProfile , myProfile]);

  useEffect(()=>{
    location.pathname.includes("following") && pushFollowing();
    location.pathname.includes("follower") && pushFollower();
  },[profile])

  const UserList =({user , followingMe})=>{
    const isFollowing = myProfile.following.includes(user.uid); 

    const onOver =(event)=>{
      const target =event.target;
      target.classList.add("unFollow"
          );
      target.innerText ="Unfollow";
      };
    const onOut =(event)=>{
      const target =event.target;
      target.classList.remove("unFollow"
          );
      target.innerText ="Following";
      };

    const unFollow =()=>{
      profileDispatch({
        type:"UNFOLLOWING",
        id:user.uid,
        userNotifications: user.notifications.filter(n=> 
          n.value !=="following" || 
          n.user !== userobj.uid ),
        userFollower: user.follower.filter(f=> f !== userobj.uid),
        following: myProfile.following.filter( f=> f!== userProfile.uid)
      });
    };

    const onFollow =()=>{
      profileDispatch({
        type:"FOLLOWING",
        id:user.uid,
        userNotifications:user.notifications,
        userFollower:[userobj.uid].concat(user.follower),
        following: [user.uid].concat(myProfile.following)
      });
    };

    const goProfile =async(event)=>{
      const target =event.target;
      const condition1 =target.classList.contains("list_followBtn");
      if(!condition1){
        localStorage.setItem('user', JSON.stringify(user) );
        navigate(`/twitter/${user.userId}` ,{state:{
          pre_previous:state.previous,
          previous:location.pathname,
          value:"userProfile"}})
      };
    };

    return(
    <button 
      className="list_UserList"
      onClick={goProfile}
    >
      <div className="list_profile">
          <img 
          src={user.photoUrl}
          alt="profile"
          >
          </img>
          <div className="list_profile_userInform">
            <div className="list_profile_user"> 
              <div className="list_userName">
                  <div>{user.userName}</div>
                  <div>
                    <span>
                      @{user.userId}
                    </span>
                    {followingMe && 
                      <span className="followingMe">
                        나를 팔로우합니다.
                      </span>
                    }
                  </div>
              </div>
              { isFollowing  ?
                <button 
                className="list_followBtn  following"

                onClick={unFollow}
                onMouseOver={onOver}
                onMouseOut={onOut}
                >
                  Following
                </button>
              :
                <button 
                className="list_followBtn  unfollowing"
                onClick={onFollow} 
                >
                Follow
                </button>
                }

            </div>
            <div className="list_userIntroduce">{user.introduce}</div>
          </div>
      </div>
    </button>
    )
  };

  return (
    <>
      {profile.userId!=="" ?

          <div id="list">
            <div id="list_header">
              <button className='back' onClick={goBack}>
                <FiArrowLeft/>
              </button>
              <div id="list_userInform"> 
                <div>{profile.userName}</div>
                <div>@{profile.userId}</div>
              </div>
            </div>
          <div id="list_btn">
            <button  className="listBtn" 
            onClick={goListFollower} >
              <div id="listFollower"  >
                Follower
              </div>
            </button>
            <button className="listBtn"  
            onClick={goListFollowing}>
              <div  id="listFollowing">
                Following
              </div>
            </button>
          </div>
          <div id="list_list">
          {showFollower ? 
            (followers[0]!==undefined?
            followers.map(f =>
              <UserList user={f} followingMe={myProfile.follower.includes(f.uid)}/>
            )
            :
            <div className="notListUser">
              There is no user .
            </div>
            )
          : 
          (followings[0]!==undefined ?
            followings.map(f=>
              <UserList user ={f} followingMe={myProfile.follower.includes(f.uid)}/>
          )
          :
          <div className="notListUser">
            There is no user
          </div>
          )
          }
                  
          </div>
        </div>
        :
        <Loading/>
      }
    </>
  )
}

export default React.memo(List) ;