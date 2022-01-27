import React, {  useContext, useEffect, useState } from 'react';
import HomeNweets from '../components/HomeNweets';
import { Link } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import NweetFactory from './NweetFactory';
import { getNweetsDocs } from '../components/GetData';
import { NweetContext } from '../context/NweetContex';
import { ProfileContext } from '../context/ProfileContex';
import { FaStepBackward } from 'react-icons/fa';


const Home =  ({userobj}) => {
  const [popup, setPopup]=useState(false);
  const {myProfile} =useContext(ProfileContext);
  const {nweetDispatch, allNweets ,myNweets}=useContext(NweetContext);
  const [nweets, setNweets]=useState([]);
  const [end, setEnd]=useState(false);
  let i=0;
  const getAllNweets =async()=>{
    setNweets([]);
    myProfile.following.forEach(async(user)=>
      { 
        if( i===0 &&myNweets[0]!==undefined){
        const filteringArry = myNweets.filter(nweet=> (nweet.notifications.map(n=> 
          myProfile.following.includes(n.user)).includes(true))===false);
        const filteredNweets =filteringArry.filter(nweet=> nweet.about==null|| !myProfile.following.includes(nweet.about.creatorId));
          setNweets(filteredNweets);
          nweetDispatch({
            type:"UPDATE_ALL_NWEETS",
            allNweets:filteredNweets
          })
        };
        const getDocs = await getNweetsDocs(user);
        i++;
        if(!getDocs.empty){
          getDocs.docs.forEach(doc=> nweets.push({id:doc.id,...doc.data()}));
        };
        if(i ===myProfile.following.length){
          setEnd(true);
          const sortedNweets=nweets.sort(function(a,b){return b.docId-a.docId});
          setNweets(sortedNweets)
          nweetDispatch({
                    type:"UPDATE_ALL_NWEETS",
                    allNweets:sortedNweets
                  })
            };
        }
      ); 
  }
  useEffect(()=>{
    if( myProfile.following[0]!==undefined){
      !end && getAllNweets();
    }
  },[myProfile.following ,allNweets ])

  const Popup =()=>{
    return (
      <div id="userInform">
        <div>
          <div>계정 정보</div>
          <button  onClick={()=>setPopup(false)}>x</button>
        </div>
        <div>
        <img 
          className="profile_photo dark_target" 
          src ={userobj.photoURL} 
          alt="myProfile" >
        </img>
        </div>
        <div>
          <div>
            {userobj.dispalyName}
          </div>
          <div>
            {userobj.userId}
          </div>
        </div>
        <div>
          <div>
          <Link to ={{
          pathname: `/${userobj.id}`}}
        > 
          <BiUser/> 
          <div className="nav_label"> Profile </div>
        </Link>
          </div>
          <button > Log Out </button>
        </div>
      </div>
    )
  }
  return (
    <div id="home">
      <div id='smallMobile'>
        <button onClick={()=>setPopup(true)} >
          <img 
            className="profile_photo dark_target" 
            src ={userobj.photoURL} 
            alt="myProfile" >
          </img>
        </button>
        <div>Home</div>
        {popup && <Popup />}
      </div>
        <NweetFactory userobj={userobj}  />
        <HomeNweets userobj={userobj} />  
    </div>
  );
};
export default Home;