import React, { useState, useEffect } from "react";

import { dbService} from "../Fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
//import myNweets from "../components/GeData";
import EditProfile from "./EditProfile";
import UserProfile from "../components/UserProfile";

const Home =  ({userObj ,refreshUser}) => {
  const [nweets, setNweets] = useState([]);
  const [myNweets, setMyNweets]=useState([]);
  const [followNweets, setFollowNweets] =useState([ ]);
  const [IsMyProfile , setIsMyProfile] = useState(false);
  const [users , setUsers]=useState([]); 
  const [follow, setFollow]=useState([]);
  const myProfileStore = dbService.collection("users").doc(userObj.uid) ;
  const getFollow = ()=> myProfileStore.get().then(
      doc => setFollow(doc.data().following) 
    );
  
  const getAllUser =()=> dbService.collection('users').onSnapshot( (sanpShot)=> {
    const allUser =sanpShot.docs.map(doc=> doc.data()).filter(data => data.creatorId !== userObj.uid);
    setUsers(allUser);
  } 
  
  ) ;

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
      follow.forEach(
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

  const getNweets = async( )=>{
    let allNweets ;

    if(follow[0] == undefined){
      allNweets=myNweets ;
    }else{
      allNweets =[...myNweets , ...followNweets]; 
    }
    allNweets.sort(function(a, b){
      return b.id-a.id //작성일별로 내림차순 정렬
    });
    setNweets(allNweets);
  };

  useEffect(() => {
      findMyProfile();
      getFollow();
      getFollowNweets() ;
      getAllUser();
      getMyNweets();
      getNweets();
      
      //내가 쓴 글 가져오는 함수 
      //내가 rt한 글 가져오는 함수
      //팔로잉 한 사람이 쓴 글  가져오는 함수 - 최근 시간으로 정열해서 가져오는 메시지수 제한 걸기 
      // 가져온 함수의 nweet을 배열로 만들고 이를 보여주도록
      //getNweets();
    
  }, []);
//mynweet바뀔 때 마다 getmynweet 
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
              {follow[0]==undefined && ( 
                (users.map((user) =>
                  <>
                    <span>팔로우 추천</span>
                    <UserProfile nweetObj={user} />
                  </>
              )))}
              
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