import React, { useContext, useState } from 'react';
import { AiOutlineRetweet, AiOutlineUser} from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import {VscBell} from 'react-icons/vsc';
import {ProfileContext} from '../context/ProfileContex';
import { TweetContext } from '../context/TweetContex';
import { getProfileDoc} from '../components/GetData';
import { useEffect } from 'react/cjs/react.development';
import {  useLocation, useNavigate } from 'react-router';
import { dbService } from '../Fbase';
import { goProfile } from '../components/UserProfile';
import TweetForm from '../components/TweetForm';

const Notification = ({userobj}) => {
  const {myProfile} =useContext(ProfileContext);
  const {myTweets} =useContext(TweetContext);
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

  const goTimeLine =(n)=>{

    n.value === "following"? 
    goProfile(navigate,n.user,location)
    :
    navigate("/twitter/timeLine" , {state:{
      previous:location.pathname,
      docId:n.value==="tweet"? n.aboutTweet.docId: n.tweet.docId , 
      value:n.value, 
      userId:n.user.userId, 
      userName:n.user.userName,
      userUid:n.user.uid ,
      aboutDocId:(n.value!=="tweet"&&n.aboutTweet==="")? null: n.aboutTweet}})
  };

  useEffect(()=>{
    const getData=async()=>{
      const array = await Promise.all( myProfile.notifications.map( (n) =>{
        const result = getProfileDoc(n.user).get().then(async(doc) =>{
          const tweet =(n.docId === "" || n.docId == null) ?
                        null 
                        :  
                        myTweets.filter(nt=> nt.docId === n.docId)[0];
          const notificaton ={value:n.value ,tweet:tweet, user:doc.data(), aboutTweet:n.aboutDocId};
          return notificaton
        });
        return result 
      })).then(result => result);
      const array_withTweets= await Promise.all(array.map(a=>{
        if(a.aboutTweet!==""){
          const result= dbService.collection(`tweets_${a.user.uid}`)
          .doc(`${a.aboutTweet}`)
          .get()
          .then(
          doc=> ({...a, aboutTweet:doc.data()}));
          return result
        }else{return a}
          })).then(result=>result);
          console.log(array_withTweets)
      setNotifications(array_withTweets);
    }
    myProfile.notifications[0]!==undefined && getData();
  },[myProfile]);
  
  return (
    <section id="notifications" className='header'>
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
        ( (n) => ( 
        n.value !== 'answer' ? (
      <div 
      class="notification"
      onClick={()=>goTimeLine(n)}>
        <div className='notification_left'>
          { (n.value === 'qt'|| n.value ==='rt') &&
            <AiOutlineRetweet className='rnIcon'/>
          }
          {n.value === 'heart'&&
              <AiOutlineHeart className='heartIcon'/>
            }
          {n.value === 'following'&&
              <AiOutlineUser className='followIcon'/>
            }
          {n.value === 'tweet'&&
              <VscBell className='tweetIcon'/>
            }
        </div>
        
        <div className='notification_right'>
          <img className="profile_photo" src={n.user.photoUrl} alt="usrProfilePhoto"/>
          <div className='notification_inform'  >
            <>
              { n.value === 'tweet'?
                <div>
                  New tweet Notifications for 
                  &nbsp;
                  <span style={{fontWeight :'bold'}}>
                    {n.user.userName}
                  </span>
                </div>
              :
              (
                <div>
                  <span style={{fontWeight :'bold'}}>
                    {n.user.userName}
                  </span> 
                  &nbsp; 
                  {n.value==="following" ?
                    'follow you'
                  :
                  < >
                    {n.value ==="heart" &&'like your'}
                    {(n.value === 'qt'|| n.value=== 'rt') && 'retweet your'}
                    {n.value ==="answer" && "answer your"} 
                    &nbsp; 
                    {n.tweet? "tweet" : "reTweet"}
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
        <div  class="mention notification" onClick={()=>goTimeLine(n)}>

          <TweetForm is_owner={false} tweet={n.aboutTweet} profile={n.user} IsAnswer={false}/>
        </div>
      )))
    :
    ( notifications.filter(n=>n.value === 'answer').map(n=>
      <div class="mention notification"onClick={()=>goTimeLine(n)}>
        <TweetForm is_owner={false} tweet={n.aboutTweet} IsAnswer={false} profile={n.user}/>
      </div>
    ))}
    </div>
    </section> 
)}
export default Notification ;