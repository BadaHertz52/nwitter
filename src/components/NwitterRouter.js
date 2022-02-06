import React, { useState } from 'react';
import { Route, Routes ,useLocation } from 'react-router-dom';
import ProfileContextProvier, { ProfileContext } from '../context/ProfileContex';
import NweetContextProvier, { NweetContext } from '../context/NweetContex';
import { useContext, useEffect } from 'react/cjs/react.development';
import { getNweetsDocs, getProfileDoc } from './GetData';

import Cropper from '../routes/Cropper';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';
import MyProfile from '../routes/MyProfile';
import Profile from '../routes/Profile';
import EditProfile from '../routes/EditProfile';
import Notification from '../routes/Notification';
import NweetFactory from '../routes/NweetFactory';
import List from '../routes/List';
import Side from '../routes/Side';
import UserContextProvider from '../context/UserContext';
import TimeLine from '../routes/TimeLine';
import Nweet from './Nweet';

//css
import '../asset/main.css';
import LogOut from '../routes/LogOut';


const NwitterRouter =({isLoggedIn , userobj , IsMyProfile, setIsMyProfile }) => {

  const myProfilePath =`/${userobj.id}`;
  const [userId, setUserId]=useState("");
  const [docId, setDocId]=useState("");
  const location = useLocation();
  const state =location.state; 

  const ContextRouter =()=>{
    const {profileDispatch} =useContext(ProfileContext);
    const {nweetDispatch}= useContext(NweetContext);

    const [nweet,setNweet]=useState(null);
    const [profile, setProfile] =useState(null);

    const setContext =async()=>{
      if(nweet ==null){
        const getDocs =await getNweetsDocs(userobj.uid);
        if(getDocs.empty){
          console.log("Can't find currentUser's nweet")
        }else{
          const nweets =getDocs.docs.map(doc=>({id:doc.id, ...doc.data()})).reverse();
          setNweet(nweets);
          nweetDispatch({
            type:"GET_NWEETS",
            uid:userobj.uid,
            myNweets:nweets
          }); 
        };

      if(profile ==null){
        await getProfileDoc(userobj.uid).get()
        .then((doc)=>{
          if(doc.exists){
            const myProfile =doc.data();
            setProfile(myProfile);
            profileDispatch({
              type:'GET_MY_PROFILE',
              myProfile:myProfile
            });
          }else {
          console.log("Can't find the profile")
        }
        })
        .catch(error => {
          console.log("Error getting document:" ,error)
      })
    }
  }
};

  useEffect(()=>{
    isLoggedIn &&setContext()
    },[]);

  useEffect(()=>{
    if(state !==null && state.value !==null ){
      state.value  === "userProfile" && setUserId(state.userId);
      if(state.value ==="status"){
        setUserId(state.previousState.userId)
        setDocId(state.previousState.docId)
      }
    }
  },[location]);


    return (
      <>
        {isLoggedIn ?
          (IsMyProfile ?
        <>
          <Routes>
            {location.state!==null && location.state.previous !==null  &&
              <>
                <Route  
                path="/nweet" 
                element={ <NweetFactory userobj={userobj}/>}/>
                <Route  
                path={`${location.state.previous}/nweet`} 
                element={ <NweetFactory userobj={userobj}/>}/>
              <Route 
                path="/crop" 
                element={ <Cropper/>}/>
              <Route 
                path={`${location.state.previous}/crop`} 
                element={ <Cropper/>}/>
              </>
            }
              <Route exact path={`/${userobj.id}/editProfile`} 
              element={<EditProfile userobj={userobj}  />}/>
              <Route
                  exact path="/logout"
                  element={<LogOut />}
                />
          </Routes>
          <div id="inner">
            <>
              <Navigation userobj={userobj} />
              <div id="main">
                <Routes>
                  <Route 
                    exact path="/" 
                    element={<Home  userobj={userobj}/>}/> 
                  <Route 
                    exact path="/timeLine"
                    element={<TimeLine userobj={userobj} />}
                  />
                  <Route 
                    path={`${userId}/status/${docId}`}
                    element={<Nweet userobj={userobj}/>}
                  />
                  <Route  
                    path={myProfilePath} 
                    element={ 
                    <MyProfile userobj={userobj} />}/>
                  <Route 
                    exact path="/notification" 
                    element={<Notification userobj={userobj}  />} />
                  <Route  
                      path={`/${userId}`} 
                      element={<Profile userobj={userobj} 
                      />}/>
                  <Route 
                    path={`/${userId}/list/follower`}
                    element={<List userobj={userobj}/>}/>
                  <Route 
                    path={`${userId}/list/following`}
                    element={<List userobj={userobj}/>}/>
                    {location.state !== null && location.state.previous !==null &&
                      <>
                      <Route 
                        path={`/${location.state.previous}/timeLine`}
                        element={<TimeLine userobj={userobj} />}
                      />
                      <Route 
                        path={`/${location.state.previous}/${userId}/status/${docId}`}
                        element={<Nweet userobj={userobj}/>}
                      />
                      <Route 
                        exact path={`/${location.state.previous}/notification`}
                        element={<Notification userobj={userobj}  />} />
                      <Route  
                          path={`/${location.state.previous}/${userId}`} 
                          element={<Profile userobj={userobj} 
                          />}/>
                      </>
                                    
                  }
  
              </Routes>
              </div>
              <div id="side">
                <Side userobj={userobj} />
              </div>
            </>
          </div>
        </>
        :
        <EditProfile userobj={userobj} setIsMyProfile={setIsMyProfile} />
        )
      :
      <Routes>
        <Route  exact path="/" element={ <Auth/>}/>
      </Routes>
    }
      </>
    )
  } 
  return (
    <UserContextProvider>
      <ProfileContextProvier>
        <NweetContextProvier>
          <ContextRouter/>
        </NweetContextProvier>
      </ProfileContextProvier>
    </UserContextProvider>
  )
};

export default  React.memo(NwitterRouter) ;