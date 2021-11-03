import React, { useEffect, useState } from "react";
import { getNweets  , toggleCalling} from "./components/GetData";
import Nweet from "./components/Nweet";
import UserProfile from "./components/UserProfile";
import { dbService } from "./Fbase";

const HomeNeets =({userObj})=> {
  const [calling, setCalling] = useState(true); 
  const [nweets, setNweets] = useState([]);
  const [followNweets, setFollowNweets] =useState([ ]);  
  const [myNweets, setMyNweets]=useState([]);
  const [users , setUsers]=useState([]);
  const [follow, setFollow]=useState([]);
  
  const myProfileStore =dbService.collection("users").doc(userObj.uid);
  const getFollow = async()=> await myProfileStore.get().then(
    doc => setFollow(doc.data().following) ,
  );
  const getAllUser =()=> dbService.collection('users').onSnapshot( (sanpShot)=> {
    const allUser =sanpShot.docs.map(doc=> doc.data()).filter(data => data.creatorId !== userObj.uid);
    setUsers(allUser);
  }) ;

  const getFollowNweets = async()=>{
    await getFollow();
    follow.forEach(
      async (user) => getNweets(user,setFollowNweets)
  );};
  const getMyNweets =()=> {
    getNweets(userObj.uid , setMyNweets);
  };

  const plusNweets = async( )=>{
    getFollowNweets() ;
    getMyNweets();
    let allNweets ;
    if(follow[0] === undefined){
      allNweets= myNweets ;
      console.log("팔로우없음")
    }else{
      allNweets =[...myNweets , ...followNweets];
    }
    allNweets.sort(function(a, b){
      return b.id-a.id //작성일별로 내림차순 정렬
    });
    setNweets(allNweets);
    setCalling(false);
    toggleCalling(calling);
  };
  useEffect(()=>{ getAllUser();},[]);
  useEffect(()=>{plusNweets();},[myNweets]);
  useEffect(()=>{plusNweets();},[followNweets]);

  return (
    <section className="nweets">
      <div className="nweets_calling">
        데이터를 가져오고 있습니다. 잠시만 기다려 주세요.
      </div>
      <div id="nweets_noFollow">
        {follow[0] === undefined &&
          <div id='nweets_recommand_follow'>
            <p>팔로우 추천 계정</p>
            <div>
              { follow[0]=== undefined  && (
                  (users.map((user) =>
                    <UserProfile nweetObj={user} />
                )))}
            </div>
        </div>}
      </div>
      <div className='nweets_nweet'>
        { nweets[0] !== undefined ? ( nweets.map((nweet) => (
          <Nweet
          key={nweet.id}
          nweetObj={nweet}
          userObj ={userObj}
          isOwner={nweet.creatorId === userObj.uid}
          />
        ))) :
        (myNweets && myNweets.map((nweet) => (
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
  )
}

export default HomeNeets ;