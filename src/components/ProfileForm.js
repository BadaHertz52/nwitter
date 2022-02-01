import React, { useCallback, useContext} from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react/cjs/react.development';
import Nweet from './Nweet';
import { FiArrowLeft } from "react-icons/fi";
import authSerVice from '../Fbase';
import { NweetContext } from '../context/NweetContex';
import { ProfileContext } from '../context/ProfileContex';
import { UserContext } from '../context/UserContext';
import { goBack } from './GetData';


export const ProfileTopForm = ({ isMine ,nweets,profile} )=>{
  const location =useLocation();
  const {nweetDispatch} =useContext(NweetContext);
  const {profileDispatch} =useContext(ProfileContext);
  const {userDispatch}=useContext(UserContext);

  const navigate= useNavigate();

  const goList=(what)=>{
    navigate(`${location.pathname}/list/${what}` ,{
      state:{
        previous:location.pathname,
        previousState:{isMine:isMine}
      }})
  };
  const onLogOutClick = () => {
  userDispatch({
    type:"CLEAR_USER"
  });
  nweetDispatch({
    type:"CLEAR_NWEETS"
  });
  profileDispatch({
    type:"CLEAR_MY_PROFILE"
  })
  navigate('/')
  authSerVice.signOut();
};
  const goEdit =()=> {
    navigate(`editProfile` ,{state:{previous:location.pathname}})
    const inner =document.getElementById('inner');
    inner.style.zIndex='-1' ;
    } ;

  return(
    <section id="profileTopForm">
      <div id="profileTopForm_header">
        <button 
        id="profile_goHomeBtn" 
        className='back'
        onClick={()=>goBack(location, `/${profile.userId}`, navigate)}>
          <FiArrowLeft/>
        </button>
        <div>
          <div>{profile.userName}</div>
          <div>{nweets.length} Nweets</div>
        </div>
      </div>
      <div id="profileForm_profile">
        <img src={profile.headerUrl} alt="profileHeader" />
        <div>
          <img src={profile.photoUrl}  alt="profile"/>
          <div id="profileForm_userInformation">
            <div>{profile.userName}</div>
            <div>@{profile.userId}</div>
            <div>{profile.introduce}</div>
          </div>
            { isMine &&
              <div id="logOutAndEdit">
                <button onClick={onLogOutClick}> Log Out </button>
                <button onClick={goEdit} >
                  Edit Profile
                </button>
              </div>
              }
        </div>
      </div>
      <div className="profile_follow">
        <button onClick={()=>goList("following")}>
        {profile.following && (
          <div>
            <span className='number'>
              {profile.following[0] === undefined ? 0 :profile.following.length }
            </span>
            &nbsp;
            Following
          </div>
        )}
        </button>
        <button  onClick={()=>goList("follower")}>
          { profile.follower && (
            <div>
              <span className='number'>
                {profile.follower[0] === undefined ? 0 :profile.follower.length}
                </span>
                &nbsp;
                Followers
            </div>
          )}
        </button>
      </div>
    </section>
  )
}

export const ProfileBottomForm = ({isMine, userobj , nweets})=>{

  const filterNweets = nweets.filter(nweet => nweet.value=== "nweet"|| nweet.value === "qn");
  const  filterNandA = nweets.filter (nweet=> nweet.value !== 'heart');
  const filterHeartedThings= nweets.filter(nweet=> nweet.value === "heart");
  const filterMediaes =nweets.filter(nweet=> nweet.attachmentUrl !== "");

  const [contents, setcontents]=useState([]);
  const buttons =document.querySelectorAll('#pb_buttons button');
  const values =document.querySelectorAll('.value');
  const nweetBtn = document.getElementById('pb_btn_nweet');
  const changeStyle =(event)=>{
    const target = event ? event.target :nweetBtn;
    buttons.forEach(button =>button.classList.remove('check'));
    target && (target.classList.add('check'));
  }
  const shownweet =(event)=>{
    setcontents(filterNweets);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showNandA =(event)=>{
    setcontents(filterNandA);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showMedias=(event)=>{
    setcontents(filterMediaes);
    changeStyle(event);
    values.forEach(value=> value.style.display="block");
  };
  const showHeartedThings =(event)=>{
    setcontents(filterHeartedThings);
    changeStyle(event);
    values.forEach(value=> value.style.display="none");
  }

  useEffect(()=>{
    shownweet();
  },[nweets])

  return (
    <section id="profileBottomForm" >
      <div id='pb_buttons'>
        <button id="pb_btn_nweet" onClick={shownweet}>
          Nweets
        </button>
        <button onClick={showNandA} >Nweets &#38; replies</button>
        <button onClick={showMedias}>Media</button>
        <button onClick={showHeartedThings} >Likes</button>
      </div>
      <div id="contents">
      {nweets[0] == undefined ?
        <div>
          nweet을 불러오는 중 입니다.
        </div>
      :
      contents.map(content => <Nweet 
          key={`nweets_${content.docId}`}
          nweetObj ={content}  
          isOwner={content.creatorId === userobj.userId}
          userobj={userobj} 
          answer={false} />  )
      }
      </div>
    </section>
  )
}
