import React, { useContext, useState } from 'react';
import { AiOutlineRetweet, AiOutlineUser} from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import {VscBell} from 'react-icons/vsc';
import Nweet from '../components/Nweet';
import {ProfileContext} from '../context/ProfileContex';
import { NweetContext } from '../context/NweetContex';
import { getProfileDoc} from '../components/GetData';
import { useEffect } from 'react/cjs/react.development';
import {  useLocation, useNavigate } from 'react-router';
import { dbService } from '../Fbase';
import { UserContext } from '../context/UserContext';
import { goProfile } from '../components/UserProfile';

const Notification = ({userobj}) => {
  const {myProfile} =useContext(ProfileContext);
  const {myNweets} =useContext(NweetContext);
  const {userDispatch}=useContext(UserContext);
  const [notifications, setNotifications]=useState
  ([]);
  const buttons =document.querySelectorAll('.notificationBtn');
  const [showAll, setShowAll]=useState(true);
  const wholeBtn =document.getElementById('wholeBtn');
  const mentionBtn  =document.getElementById('mentionBtn');
  const navigate =useNavigate();
  const location =useLocation();
  const changeStyle =(what)=>{
    buttons.forEach(button =>button.classList.remove('check'));
    what.classList.add('check');
  };

  const go =(n)=>{
    n.value === "following"?
    goProfile(navigate,n.user,location)
    :
    navigate("timeLine" , {state:{
      previous:location.pathname,
      docId:n.nweet.docId , 
      value:n.value, 
      userId:n.user.userId, 
      userName:n.user.userName,
      userUid:n.user.uid ,
      aboutDocId:n.aboutNweet==""? null: n.aboutNweet}})
  };

  useEffect(()=>{
    const getData=async()=>{
      const array = await Promise.all( myProfile.notifications.map( (n) =>{
        const result = getProfileDoc(n.user).get().then(async(doc) =>{
          const nweet =n.docId == null ? null :  myNweets.filter(nt=> nt.docId == n.docId)[0];
          const notificaton ={value:n.value ,nweet:nweet, user:doc.data(), aboutNweet:n.aboutDocId};
          return notificaton
        });
        return result 
      })).then(result => result);
      const array_withNweets= await Promise.all(array.map(a=>{
        if(a.aboutNweet!==""){
          const result= dbService.collection(`nweets_${a.user.uid}`)
          .doc(`${a.aboutNweet}`)
          .get()
          .then(
          doc=> ({...a, aboutNweet:doc.data()}));
          return result
        }else{return a}
          })).then(result=>result);
      setNotifications(array_withNweets);
    }
    myProfile.notifications[0]!==undefined && getData();
  },[myProfile])
  return (
    <section id="notification" className='header'>
      <div>Notification</div>
      <div id="notificationBtns">
        <button className='notificationBtn'id="wholeBtn" onClick={()=>{setShowAll(true); changeStyle(wholeBtn)}}>
          <div id="all">All</div>
        </button>
        <button className='notificationBtn' id="mentionBtn" onClick={()=>{setShowAll(false); changeStyle(mentionBtn)}}>
          <div id="mention">
            Mentions
          </div>
        </button>
      </div>
      <div> 
      {showAll ?
      notifications.map
        ( (n) => 
        ( 
        n.value !== 'answer' ? (
      <div 
      id="notification_notification"
      onClick={()=>go(n)}>
          <div className='notification_left'>
            { (n.value === 'qn'|| n.value ==='rn') &&
              <AiOutlineRetweet className='rnIcon'/>
            }
            {n.value === 'heart'&&
                <AiOutlineHeart className='heartIcon'/>
              }
            {n.value === 'following'&&
                <AiOutlineUser className='followIcon'/>
              }
            {n.value === 'nweet'&&
                <VscBell className='nweetIcon'/>
              }
          </div>
          
            <div className='notification_right'>
            <img className="profile_photo" src={n.user.photoUrl} alt="usrProfilePhoto"/>
            <div className='notification_inform'>
              <>
                { n.value == 'nweet'?
                  (n.value === 'nweet') && 
                  <div>
                  New Nweet Notifications for 
                  &nbsp;
                  <span style={{fontWeight :'bold'}}>{n.user.userName}</span>
                  </div>
                :
                (
                  <div>
                    <span style={{fontWeight :'bold'}}>{n.user.userName}</span> &nbsp; 
                    {n.value==="following" ?
                      'follow you'
                    :
                    <>
                      {n.value ==="heart" &&'like your'}
                      {(n.value === 'qn'|| n.value=== 'rn') && 'ReNweet your'}
                      {n.value ==="answer" && "answer your"} 
                      &nbsp; 
                      { n.aboutDocId ===""? 'nweet' : 'ReNweet'}
                    </>
                    }
                  </div>
                )
                }
              </>
            </div>
        </div>
      </div>)
      :( 
        <div  class="mention" onClick={()=>go(n)}>
          <Nweet isOwner={false} userobj={userobj} nweetObj={n.aboutNweet} answer={true}/>
        </div>
      )))
    :
    ( notifications.filter(n=>n.value === 'answer').map(n=>
      <div class="mention"onClick={()=>go(n)}>
        <Nweet isOwner={false} userobj={userobj} nweetObj={n.aboutNweet} answer={true}/>
      </div>
    ))}
    </div>
    </section> 
)}
export default Notification ;