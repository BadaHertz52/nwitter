import React, { useContext, useState } from 'react';
import Media from '../components/Media';
import Recommend from '../components/Recomend';
import { useLocation, useNavigate } from 'react-router';
import { IoSettingsOutline } from "react-icons/io5";
import {BiSearch } from "react-icons/bi";
import { dbService } from '../Fbase';
import UserProfile from '../components/UserProfile';
import { UserContext } from '../context/UserContext';
import { getNweetsDocs } from '../components/GetData';

const Side =({userobj})=>{
  const location =useLocation();
  const navigate=useNavigate();
  const {userDispatch}=useContext(UserContext);
  const state =location.state; 
  const initialResult ={userId:"" ,userName:""}
  const [result, setResult]=useState(initialResult);
  const [input , setInput]=useState("");
  const onChange=(event)=>{
    const {value}=event.target;
    setInput(value);
    setResult(initialResult)
    dbService.collection(`users`).onSnapshot(shot=>
      {shot.docs.forEach(doc=>
        {`@${doc.data().userId}`=== value && setResult(doc.data())
        })
      })
  };
  const goProfile=async()=>{
    const getDocs=await getNweetsDocs(result.uid);
    const nweets =getDocs.docs.map(doc=> ({id:doc.id,...doc.data()}));
    userDispatch({
      type:"GET_USER_DATA",
      userProfile :result,
      userNweets:nweets
    });
    navigate(`/${result.userId}` ,{state:{
      previous:location.pathname,
      userId:result.userId ,
      value:"userProfile"}})
  }
  return(
    <>
      <div id="search">
        <form>
          <BiSearch/>
          <input 
            type="text"  
            name="text"
            placeholder='Search  @userId'
            onChange={onChange}
          />
          <input type="submit" disabled/>
        </form>
      </div>
      {input !=="" &&(result.userId !==""?
        (result.userId !==""&&
          <div id="search_result" onClick={goProfile}>
            <UserProfile profile={result}/>
            <div id="search_result_userInform">
              <div>{result.userName}</div>
              <div>@{result.userId}</div>
            </div>
          </div>)
          : <div id="search_result">
              <div id='no_result'>
                No result for "{input}"
              </div>
            </div>
      )}
      {location.state !==null &&
        state.value !==null &&
        (state.value === "profile" || state.value === "userProfile") &&
          <Media who={location.pathname===`/${userobj.id}`? "currentUser" :"user"}/>
        }
      <div id="trend">
        <div>
          <span>
            Trends for you
          </span>
          <div><IoSettingsOutline/></div>
        </div>
        <div>
          <ul>
            <li>Try write nweet</li>
            <li>Try push Rn and Heart</li>
            <li>Try follow or unfollow user</li>
            <li>Try click the photo to see the profile</li>
            <li>you can see notifications</li>
            <li>Try edit your profile</li>
          </ul>
        </div>
      </div>
      <Recommend userobj={userobj}/>
    </>
  )
};


export default Side