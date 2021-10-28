import React, { useState, useEffect } from "react";

import { dbService} from "../Fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
//import myNweets from "../components/GeData";
import EditProfile from "./EditProfile";

const Home =  ({userObj ,refreshUser}) => {
  const [nweets, setNweets] = useState([]);
  const [myNweets, setMyNweets]=useState([]);
  const [followNweets, setFollowNweets] =useState([ ]);
  const [IsMyProfile , setIsMyProfile] = useState(false);
  const myProfileStore = dbService.collection("users").doc(userObj.uid) ;

  const findMyProfile =()=> myProfileStore.get()
  .then(doc => {
    if(doc.exists){
      setIsMyProfile(true);
    }else {
      setIsMyProfile(false);
      console.log("No such document");
    }
  }).catch((e) => {
    console.log("Error getting document", e)
  });
  
    const getFollowNweets = async()=>{
      const currentUserProfile =  dbService.collection('users').doc(userObj.uid);
      const getFollow = await currentUserProfile.get().then(
          doc => doc.data().following
        );
        console.log("follow" , getFollow);
      getFollow.forEach(
        user => {
          dbService.collection(`nweets_${user}`).onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFollowNweets(nweetArray);
          })
    });
    };
  
    const getMyNweets = async()=>{
      const nweets = await dbService
        .collection(`nweets_${userObj.uid}`)
        .get();
      const MyNweets = nweets.docs.map(doc => ({
        id: doc.id ,
        ...doc.data()}))  ;
      setMyNweets(MyNweets);
      
    };

  const getNweets = ( )=>{
    const allNweets =[...myNweets , ...followNweets];  
    allNweets.sort(function(a, b){
      return b.id-a.id //작성일별로 내림차순 정렬
    });
    setNweets(allNweets);
    console.log(nweets);
  };

  useEffect(() => {
      findMyProfile();
      getFollowNweets();
      getMyNweets();
      getNweets();
      
      //내가 쓴 글 가져오는 함수 
      //내가 rt한 글 가져오는 함수
      //팔로잉 한 사람이 쓴 글  가져오는 함수 - 최근 시간으로 정열해서 가져오는 메시지수 제한 걸기 
      // 가져온 함수의 nweet을 배열로 만들고 이를 보여주도록
      //getNweets();
    
  }, []);

  return (
    <div>
      {IsMyProfile ?  
        (
          <>
            <NweetFactory userObj={userObj}/>
            <section className="nweets">
              <div className="nweets_calling">
                {nweets[0]=== undefined ? '데이터를 가져오고 있습니다. 잠시만 기다려 주세요.' : ''} 
              </div>
              <div>
                { nweets !==[] ? ( nweets.map((nweet) => (
                  <Nweet
                  key={nweet.id}
                  nweetObj={nweet}
                  userObj ={userObj}
                  isOwner={nweet.creatorId === userObj.uid}
                  />
                ))) :
                (myNweets.map((nweet) => (
                  <Nweet
                  key={nweet.id}
                  nweetObj={nweet}
                  userObj ={userObj}
                  isOwner={nweet.creatorId === userObj.uid}
                  />
                )))
              }
              </div>
          </section>
        </>
        )
      : 
        (
          <EditProfile userObj={userObj} myProfileStore ={myProfileStore} refreshUser={refreshUser}/>
        )
      }
    </div>
  );
};
export default Home;