import { dbService } from "../Fbase";

export  const profileForm ={
  userId:"" ,
  userName:"",
  uid:"",
  photoUrl:""
};
export const tweetForm ={
  docId:"",
  text:"",
  attachmentUrl:"",
  value:"",
  createdAt:"",
  creatorId:"",
  about:null ,
  notifications:[]
}

export const getTweetDoc=(uid, docId) =>dbService.collection(`tweets_${uid}`).doc(`${docId}`)
.get();
export const getTweetsDocs=(uid)=> dbService.collection(`tweets_${uid}`).get() ;
//tweet
export const getTweets =(id,setFun)=> {
  dbService
  .collection(`tweets_${id}`)
  .onSnapshot(querysnpshot =>{
      const array = querysnpshot.docs.map(doc=> ({...doc.data()})) ;
      setFun(array.reverse());
  } );    
  
}
export const getTweet =(uid,docId,setFun)=>{
  getTweetDoc(uid,docId).then(doc=>{if(doc.exists){
    setFun({...doc.data()}) ;
  }else{
    setFun(tweetForm)
    console.log("Can't find the tweet")
  }}).catch(error=> console.log(error))
};

//프로필 

export const getProfileDoc = (id)=>dbService.collection("users").doc(`${id}`)  ;

export const getProfile = async(id ,setProfile)=>{
  //onsnapshot 
  await getProfileDoc(id).onSnapshot((doc)=>{
    if(doc.exists){
      setProfile(doc.data())
    }else {
      setProfile(profileForm)
      console.log("Can't find the profile")
    }
  });
};
//타깃이 되는 tweets의 ntification을 추가 
export  const updateTweetNotifications=async(tweet, profile ,value, userobj , aboutDocId)=>{
  const newNotification= [{value:value , user:userobj.uid ,aboutDocId:aboutDocId}];
  const newNotifications =newNotification.concat(tweet.notifications);
  const newTweet = 
  {
    ...tweet,
    notifications:newNotifications 
  };
  await dbService.collection(`tweets_${profile.uid}`)
  .doc(`${tweet.docId}`)
  .set(newTweet);
};
//당사자의 profile notification update
export const updateProfileNotification = async(user,id ,notifications)=>{
  const newNotification =notifications!==undefined?[user].concat(notifications): []; 
  await getProfileDoc(id).set({notifications: newNotification },{merge:true})
} 
export const sendNotification=async(value,userobj, tweetObj, profile, aboutDocId)=>{
  const user = {
    value:value,
    docId: tweetObj===""? "" :tweetObj.docId, //알람을 받는 상대방의 docId
    aboutDocId:aboutDocId, //작성자의 docId
    user :userobj.uid,
    tweet:tweetObj.value!=="heart" && tweetObj.value!=="rt",
  };

  updateProfileNotification(user,profile.uid , profile.notifications);
} ;
export const updateMytweetsByMe=(myTweets,value,userobj,docId, tweetDispatch,tweet_docId)=>{
  myTweets.forEach(tweet=> {if(tweet.docId === tweet_docId){
    const INDEX = myTweets.indexOf(tweet);
    myTweets[INDEX] ={
      ...tweet,
      notifications:[{value:value , user:userobj.uid, aboutDocId:docId}].concat(tweet.notifications)
    };
    tweetDispatch({
        type:"EDIT",
        uid:userobj.uid,
        docId:myTweets[INDEX].docId,
        myTweets: myTweets,
        tweet:myTweets[INDEX]
      })
  }})
};
export const OnRtHeart=(tweetObj,original, userobj, profile,ownerProfile, tweetDispatch, value , myTweets)=>{
  const docId= JSON.stringify(Date.now());
  const now = new Date();
  const year =now.getFullYear();
  const month =now.getMonth()+1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const newTweet = {
    docId: docId,
    text: "",
    value:value,
    createdAt:[
      year,month, date ,hour,minutes
    ],
    creatorId: userobj.uid,
    attachmentUrl :"",
    about:{docId:tweetObj.docId , creatorId:tweetObj.creatorId },
    notifications:[]
  };

  if(tweetObj.creatorId=== userobj.uid){
    updateMytweetsByMe(myTweets,value,userobj,docId, tweetDispatch,tweetObj.docId)
  }else{
    (original.value!=="rt" &&
    original.value!=="heart") &&
    tweetDispatch({
      type:"CREATE",
      docId:docId,
      uid:userobj.uid,
      tweet:newTweet
    });
    sendNotification(value,userobj, tweetObj, profile, docId);
    updateTweetNotifications(tweetObj,profile, value,userobj,docId );
  };
      // rt, heart된 tweet인 경우 rt, heart한 사용자에게 알림 보내기
  if(original.value === "rt"|| 
  original.value==="heart"){
    if(original.creatorId === userobj.uid){
      updateMytweetsByMe(myTweets,value,userobj,docId, tweetDispatch,original.docId); 
    }else{
      sendNotification(value, userobj,original,ownerProfile,docId);
      updateTweetNotifications(original, ownerProfile,value, userobj,docId);
    }
  }
};
export   const deleteTweetNotification =(tweet, target_myTweet ,userobj, value)=>{  
  const newNotifications =tweet.notifications.filter (n => 
    (n.aboutDocId !== target_myTweet.docId|| n.user !== userobj.uid || n.value !== value));
  const newtweet={...tweet, notifications:newNotifications};
  dbService.collection(`tweets_${tweet.creatorId}`).doc(`${tweet.docId}`).set(newtweet)};
  //프로필 알림 삭제
export const deleteProfileNotification =(userProfile, tweet ,target_myTweet, userobj,value)=>{
  const newNotifications =userProfile.notifications.filter(n=> 
    (n.docId!== tweet.docId||
    n.aboutDocId!==target_myTweet.docId ||
    n.user !== userobj.uid||
    n.value !== value));
  
  dbService.collection(`users`).doc(`${userProfile.uid}`).set({
    notifications:newNotifications
  },{merge:true})
};
export const OffRtHeart =(value ,tweetObj, original, userobj, profile,ownerProfile, tweetDispatch ,myTweets )=>{
  //tweet 알림 
   // currentUser  
  const modifyMytweetNotifications=(tweet_docId)=>{
    myTweets.forEach(tweet=> {if(tweet.docId === tweet_docId){
      const INDEX = myTweets.indexOf(tweet);
      myTweets[INDEX] ={
        ...tweet,
        notifications:tweet.notifications.filter(n=>( n.user !==userobj.uid || n.value!== value))
      };
      tweetDispatch({
          type:"EDIT",
          myTweets: myTweets,
          uid:userobj.uid,
          docId:myTweets[INDEX].docId,
          tweet:myTweets[INDEX]
        })
    }})
  } 
  // other user 
// rt, heart 대상 tweet이 내 것이였을 경우 TweetContext의 myTweets의 해당 tweet의 notification 변경 
  if(tweetObj.creatorId ===userobj.uid){
    modifyMytweetNotifications(tweetObj.docId);
  }else{
      const targetAboutDocId= tweetObj.value==="tweet" && tweetObj.notifications.filter(n=>(n.user=== userobj.uid && n.value===value))[0].aboutDocId;

      const targetMytweet = tweetObj.value==="tweet"? 
        myTweets.filter(tweet=> targetAboutDocId === tweet.docId )[0]
        :myTweets.filter(tweet=> tweet.about !==null).filter(tweet=>( tweet.about.creatorId=== tweetObj.creatorId && tweet.about.docId=== tweetObj.docId))[0];

    tweetDispatch({
      type:"DELETE",
      uid:userobj.uid,
      docId:targetMytweet.docId,
      attachmentUrl:""
    });
    // 타켓 tweets 작성자
    deleteTweetNotification(tweetObj ,targetMytweet,userobj,value);
    deleteProfileNotification(profile,tweetObj ,targetMytweet,userobj,value );
    };
    // rt, heart된 tweet인 경우 rt, heart한 사용자에게 알림 지우기
    if(original.value==="rt"|| original.value==="heart"){
      const targetMytweet =myTweets.filter(tweet=>( tweet.about.creatorId=== original.creatorId && tweet.about.docId=== original.docId))[0];
      deleteTweetNotification(original,targetMytweet ,userobj,value );
      deleteProfileNotification(ownerProfile, original ,targetMytweet,userobj,value )
      }
} ;

export  const goBack=(location, what ,navigate)=>{
  const pathname=location.pathname;
  const state =location.state;
  const start =pathname.indexOf(what);
  const back=pathname.slice(0,start);
  if(back===""){
    navigate('/tiwtter/home')
  }else{
    state!==null && state.userUid!==undefined?
    navigate(back ,{state:{
      previous:location.pathname,
      userUid:location.state.userUid,
      userId:location.state.userId ,
      value:"userProfile", 
    }})
    :navigate(back )
}
};