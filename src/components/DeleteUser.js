import React  from 'react';
import authSerVice, { dbService} from '../Fbase';
import { getNweetDoc, getNweetsDocs, getProfileDoc } from './GetData';


const DeleteUser =async(myProfile, myNweets, state,dispatch, setDeleteError  )=> {
    const currentUser =authSerVice.currentUser;
    const {doneFollower,doneFollowing,doneNweet,doneOtherUserNweet}=state;

    //clean up following ,follower 
    if(myProfile.following[0]!==undefined){
      let i=0;
      myProfile.following.forEach(async(user)=>
      {
        i++;
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

        if(i=== myProfile.following.length){
          dispatch({
            type:"FOLLOWING"
          })
        }
      })
    }else{
      dispatch({
        type:"FOLLOWING"
      })
    }

    if(myProfile.follower[0]!== undefined){
      let i=0;
      myProfile.follower.forEach(async(user)=>{
        i++;
        await getProfileDoc(user).get().then(
          (result) => {
            const profile= result.data();
            const newFollowing =profile.following.filter(f=> f!==currentUser.uid);
            getProfileDoc(user).set({
              following: newFollowing
            },{merge:true})
          }
        );
      if(i=== myProfile.follower.length){
        dispatch({
          type:"FOLLOWER"
        })
      }
      })
    }else{
      dispatch({
        type:"FOLLOWER"
      })
    }
    
    //clean up rn,heart,answer,qn
      // 유저가 작성한 nweet에 대한 rn.heart,qn 삭제
    const targets =myProfile.notifications.filter(n=> n.docId !== null);

    if(targets[0]!== undefined){
      let i=0;
      targets.forEach(async(target)=>{
        i++;
        getNweetsDocs(target.user, target.aboutDocId).delete();
        if(i== targets.length){
          dispatch({
            type:"NWEET"
          })
        }
      })
    }else{
      dispatch({
        type:"NWEET"
      })
    }
    // 유저가 rn.heart,qn,answer 한 것 에 대한 삭제
    const targetNweets= myNweets.filter(nweet => nweet.about !== null);
    
    if(targetNweets[0]!== undefined){
      let i=0;
      targetNweets.forEach(async(nweet)=>{
        i++;
        const targetUser = nweet.about.creatorId;
        await getNweetDoc(targetUser, nweet.about.docId).then(doc=> {
          const userNweet= doc.data();
          const newNotifications= userNweet.notifications.filter(n=>n.user!== currentUser.uid);
          dbService.collection(`nweets_${targetUser}`).doc(`${nweet.about.docId}`).set({notifications:newNotifications,
          ...nweet});
        });
        await getProfileDoc(targetUser).get().then(doc=> {
          const profile =doc.data();
          const newNotifications= profile.notifications.filter(n=> n.user !== currentUser.uid);

          getProfileDoc(targetUser).set({
            notifications:newNotifications
          },{merget:true})
        });

        if(i=== targetNweets.length){
          dispatch({
            type:"OTHER_USER_NWEET"
          })
        }
      });
    }else{
      dispatch({
        type:"OTHER_USER_NWEET"
      })
    }

    // // clean up collection 
    const deleteNweets = async()=>{ 
      await getNweetsDocs(currentUser.uid).then(result=>{
      const docs =result.docs;
      docs.forEach(doc=> {
        const id=doc.id;
        dbService.collection(`nweets_${currentUser.uid}`).doc(id).delete();
      }
      )
    });
    getProfileDoc(currentUser.uid).delete();
    }; 
    deleteNweets();
    currentUser.delete().then(()=>{
      console.log("delete user");
      setDeleteError(false)
    }
    ).catch(error=> {
      console.log(error);
    setDeleteError(true)});
  }


export default DeleteUser;