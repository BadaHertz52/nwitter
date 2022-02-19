import React  from 'react';
import authSerVice, { dbService, storageService} from '../Fbase';
import { getTweetDoc, getTweetsDocs, getProfileDoc } from './GetData';


const DeleteUser =async(myProfile, myTweets, setDeleteError  )=> {
    const currentUser =authSerVice.currentUser;

    //clean up following ,follower 
    if(myProfile.following[0]!==undefined){
      myProfile.following.forEach(async(user)=>
      {
        await getProfileDoc(user).get().then(result=>{
          const profile =result.data();
          const newNotifications =profile.notifications.filter(n=> (n.value!=="following"|| n.user !== currentUser.uid));
          const newFollower = profile.follower.filter(f=> f!== currentUser.uid);

          getProfileDoc(user).set({
            notifications:newNotifications
          },{merge:true});

          getProfileDoc(user).set({
            follower:newFollower
          },{merge:true})
          
        });

        
      })
    };

    if(myProfile.follower[0]!== undefined){
      myProfile.follower.forEach(async(user)=>{
        await getProfileDoc(user).get().then(
          (result) => {
            const profile= result.data();
            const newFollowing =profile.following.filter(f=> f!==currentUser.uid);
            getProfileDoc(user).set({
              following: newFollowing
            },{merge:true})
          }
        );
      })
    };
    
    //clean up rt,heart,answer,qt
      // 유저가 작성한 tweet에 대한 rt.heart,qt 삭제
    const targets =myProfile.notifications.filter(n=> n.docId !== null);

    if(targets[0]!== undefined){
      targets.forEach(async(target)=>{
        getTweetsDocs(target.user, target.aboutDocId).then(
          result=> {
            const docs= result.docs;
            docs.forEach(doc=> doc.delete())
          }
        );
      })
    }
    // 유저가 rt.heart,qt,answer 한 것 에 대한 삭제
    const targetTweets= myTweets.filter(tweet => tweet.about !== null);
    
    if(targetTweets[0]!== undefined){
      targetTweets.forEach(async(tweet)=>{
        const targetUser = tweet.about.creatorId;
        await getTweetDoc(targetUser, tweet.about.docId).then(doc=> {
          const userTweet= doc.data();
          const newNotifications= userTweet.notifications.filter(n=>n.user!== currentUser.uid);
          dbService.collection(`tweets_${targetUser}`).doc(`${tweet.about.docId}`).set({notifications:newNotifications,
          ...userTweet});
        });
        await getProfileDoc(targetUser).get().then(async(doc)=> {
          const profile =doc.data();
          const newNotifications= profile.notifications.filter(n=> n.user !== currentUser.uid);
          await  getProfileDoc(targetUser).set({
            notifications:newNotifications,
            ...profile
          });
        });

      });
    };
    // // clean up collection 
    const deleteTweets = async()=>{ 
      await getTweetsDocs(currentUser.uid).then(result=>{
      const docs =result.docs;
      docs.forEach(doc=> {
        const id=doc.id;
        dbService.collection(`tweets_${currentUser.uid}`).doc(id).delete();
      }
      )
    });
    getProfileDoc(currentUser.uid).delete();
    }; 

    deleteTweets();

    const storage= storageService.ref().child(`${currentUser.uid}`);
    storage.delete();

    currentUser.delete().then(()=>{
      setDeleteError(false)
    }
    ).catch(error=> {
      console.log(error);
    setDeleteError(true)});
  }


export default DeleteUser;