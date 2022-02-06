import { dbService } from "../Fbase";

export const getNweetDoc=(uid, docId) =>dbService.collection(`nweets_${uid}`).doc(`${docId}`)
.get();
export const getNweetsDocs=(uid)=> dbService.collection(`nweets_${uid}`).get() ;
//nweet
export const getNweets =(id,setFun)=> {
  dbService
  .collection(`nweets_${id}`)
  .onSnapshot(querysnpshot =>{
      const array = querysnpshot.docs.map(doc=> ({...doc.data()})) ;
      setFun(array.reverse());
  } );    
  
}
export const getNweet =(uid,docId,setFun)=>{
  getNweetDoc(uid,docId).then(doc=>{if(doc.exists){
    setFun({...doc.data()}) ;
  }else{
    console.log("Can't find the nweet")
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
      console.log("Can't find the profile")
    }
  });
};
//타깃이 되는 nweets의 ntification을 추가 
export  const updateNweetNotifications=async(nweet, profile ,value, userobj , aboutDocId)=>{
  const newNotification= [{value:value , user:userobj.uid ,aboutDocId:aboutDocId}];
  const newNotifications =newNotification.concat(nweet.notifications);
  const newNweet = 
  {
    ...nweet,
    notifications:newNotifications 
  };
  await dbService.collection(`nweets_${profile.uid}`)
  .doc(`${nweet.docId}`)
  .set(newNweet);
};
//당사자의 profile notification update
export const updateProfileNotification = async(user,id ,notifications)=>{
  const newNotification =notifications!==undefined?[user].concat(notifications): []; 
  await getProfileDoc(id).set({notifications: newNotification },{merge:true})
} 
export const sendNotification=async(value,userobj, nweetObj, profile, aboutDocId)=>{
  const user = {
    value:value,
    docId:  nweetObj.docId,
    aboutDocId:aboutDocId,
    user :userobj.uid
  };

  updateProfileNotification(user,profile.uid , profile.notifications);
} ;
export const updateMyNweetsByMe=(myNweets,value,userobj,docId, nweetDispatch,nweet_docId)=>{
  myNweets.forEach(nweet=> {if(nweet.docId === nweet_docId){
    const INDEX = myNweets.indexOf(nweet);
    myNweets[INDEX] ={
      ...nweet,
      notifications:[{value:value , user:userobj.uid, aboutDocId:docId}].concat(nweet.notifications)
    };
    nweetDispatch({
        type:"EDIT",
        uid:userobj.uid,
        docId:myNweets[INDEX].docId,
        myNweets: myNweets,
        nweet:myNweets[INDEX]
      })
  }})
};
export const OnRnHeart=(nweetObj,original, userobj, profile,ownerProfile, nweetDispatch, value , myNweets)=>{
  const docId= JSON.stringify(Date.now());
  const now = new Date();
  const year =now.getFullYear();
  const month =now.getMonth()+1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const newNweet = {
    docId: docId,
    text: "",
    value:value,
    createdAt:[
      year,month, date ,hour,minutes
    ],
    creatorId: userobj.uid,
    attachmentUrl :"",
    about:{docId:nweetObj.docId , creatorId:nweetObj.creatorId },
    notifications:[]
  };

  if(nweetObj.creatorId=== userobj.uid){
    updateMyNweetsByMe(myNweets,value,userobj,docId, nweetDispatch,nweetObj.docId)
  }else{
    (original.value!=="rn" &&
    original.value!=="heart") &&
    nweetDispatch({
      type:"CREATE",
      docId:docId,
      uid:userobj.uid,
      nweet:newNweet
    });
    sendNotification(value,userobj, nweetObj, profile, docId);
    updateNweetNotifications(nweetObj,profile, value,userobj,docId );
  };
      // rn, heart된 nweet인 경우 rn, heart한 사용자에게 알림 보내기
  if(original.value === "rn"|| 
  original.value==="heart"){
    if(original.creatorId == userobj.uid){
      updateMyNweetsByMe(myNweets,value,userobj,docId, nweetDispatch,original.docId); 
    }else{
      sendNotification(value, userobj,original,ownerProfile,docId);
      updateNweetNotifications(original, ownerProfile,value, userobj,docId);
    }
  }
};
export   const deleteNweetNotification =(nweet, target_myNweet ,userobj, value)=>{  
  const newNotifications =nweet.notifications.filter (n => 
    (n.aboutDocId !== target_myNweet.docId|| n.user !== userobj.uid || n.value !== value));
  const newNweet={...nweet, notifications:newNotifications};
  dbService.collection(`nweets_${nweet.creatorId}`).doc(`${nweet.docId}`).set(newNweet)};
  //프로필 알림 삭제
export const deleteProfileNotification =(userProfile, nweet ,target_myNweet, userobj,value)=>{
  const newNotifications =userProfile.notifications.filter(n=> 
    (n.docId!== nweet.docId||
    n.aboutDocId!==target_myNweet.docId ||
    n.user !== userobj.uid||
    n.value !== value));
  
  dbService.collection(`users`).doc(`${userProfile.uid}`).set({
    notifications:newNotifications
  },{merge:true})
};
export const OffRnHeart =(value ,nweetObj, original, userobj, profile,ownerProfile, nweetDispatch ,myNweets )=>{
  //nweet 알림 
   // currentUser  
  const modifyMyNweetNotifications=(nweet_docId)=>{
    myNweets.forEach(nweet=> {if(nweet.docId === nweet_docId){
      const INDEX = myNweets.indexOf(nweet);
      myNweets[INDEX] ={
        ...nweet,
        notifications:nweet.notifications.filter(n=>( n.user !==userobj.uid || n.value!== value))
      };
      nweetDispatch({
          type:"EDIT",
          myNweets: myNweets,
          uid:userobj.uid,
          docId:myNweets[INDEX].docId,
          nweet:myNweets[INDEX]
        })
    }})
  } 
  // other user 
// rn, heart 대상 nweet이 내 것이였을 경우 nweetContext의 myNweets의 해당 nweet의 notification 변경 
  if(nweetObj.creatorId ===userobj.uid){
    modifyMyNweetNotifications(nweetObj.docId);
  }else{
      const targetAboutDocId= nweetObj.value=="nweet" && nweetObj.notifications.filter(n=>(n.user=== userobj.uid && n.value===value))[0].aboutDocId;

      const targetMyNweet = nweetObj.value==="nweet"? 
        myNweets.filter(nweet=> targetAboutDocId === nweet.docId )[0]
        :myNweets.filter(nweet=> nweet.about !==null).filter(nweet=>( nweet.about.creatorId=== nweetObj.creatorId && nweet.about.docId=== nweetObj.docId))[0];

    nweetDispatch({
      type:"DELETE",
      uid:userobj.uid,
      docId:targetMyNweet.docId,
      attachmentUrl:""
    });
    // 타켓 nweets 작성자
    deleteNweetNotification(nweetObj ,targetMyNweet,userobj,value);
    deleteProfileNotification(profile,nweetObj ,targetMyNweet,userobj,value );
    };
    // rn, heart된 nweet인 경우 rn, heart한 사용자에게 알림 지우기
    if(original.value==="rn"|| original.value==="heart"){
      const targetMyNweet =myNweets.filter(nweet=>( nweet.about.creatorId=== original.creatorId && nweet.about.docId=== original.docId))[0];
      deleteNweetNotification(original,targetMyNweet ,userobj,value );
      deleteProfileNotification(ownerProfile, original ,targetMyNweet,userobj,value )
      }
} ;

export  const goBack=(location, what ,navigate)=>{
  const pathname=location.pathname;
  const start =pathname.indexOf(what);
  const back=pathname.slice(0,start);
  if(back===""){
    navigate('/')
  }else{
    navigate(back);
  }
}