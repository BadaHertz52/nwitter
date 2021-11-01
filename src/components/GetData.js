import { useEffect, useState } from "react";
import { dbService } from "../Fbase";
import Nweet from "./Nweet";
import UserProfile from "./UserProfile";


export const getNweets = async(id , setFun)=>{
  const getDocs = await dbService
    .collection(`nweets_${id}`)
    .get();
  const nweets = getDocs.docs.map(doc => ({
    id: doc.id ,
    ...doc.data()}))  ;
  setFun(nweets)
};


export const HomeNeets =({userObj , myNweets})=> {
  const [nweets, setNweets] = useState([]);
  const [followNweets, setFollowNweets] =useState([ ]);  
  const [users , setUsers]=useState([]);
  const [follow, setFollow]=useState([]);
  
  const myProfileStore =dbService.collection("users").doc(userObj.uid);
  console.log("getdata", myNweets);
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



  const plusNweets = async( )=>{
    getFollowNweets() ;
    let allNweets ;
    if(follow[0] === undefined){
      allNweets= myNweets ;
      console.log("팔로우없음")
    }else{
      allNweets =[...myNweets , ...followNweets];
      console.log("팔로우있음" ,myNweets, followNweets, allNweets);
    }
    allNweets.sort(function(a, b){
      return b.id-a.id //작성일별로 내림차순 정렬
    });
    setNweets(allNweets);
  };

  useEffect(()=>{
    getAllUser();
    plusNweets();
  },[myNweets])

  return (
    <section id="nweets">
      <div id="nweets_calling">
        {nweets[0]=== undefined ? '데이터를 가져오고 있습니다. 잠시만 기다려 주세요.' : ''}
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
      <div id='nweets_nweet'>
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