//css
import '../asset/main.css';

import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes ,useLocation , useNavigate} from 'react-router-dom';
import ProfileContextProvier, { ProfileContext } from '../context/ProfileContex';
import TweetContextProvier, { TweetContext } from '../context/TweetContex';
import { getTweetsDocs, getProfileDoc } from './GetData';

import Cropper from '../routes/Cropper';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';
import MyProfile from '../routes/MyProfile';
import Profile from '../routes/Profile';
import EditProfile from '../routes/EditProfile';
import Notification from '../routes/Notification';
import TweetFactory from '../routes/TweetFactory';
import List from '../routes/List';
import Side from '../routes/Side';
import UserContextProvider, { UserContext } from '../context/UserContext';
import TimeLine from '../routes/TimeLine';
import Tweet from './Tweet';
import LogOut from '../routes/LogOut';
import Loading from './Loading';

const TwitterRouter =({isLoggedIn ,setIsLoggedIn, userobj , IsMyProfile, setIsMyProfile }) => {
  const home ="/twitter/" ;
  const [userId, setUserId]=useState("");
  const [docId, setDocId]=useState("");

  const location = useLocation();
  const state =location.state; 
  const navigate =useNavigate();
  const ContextRouter =()=>{
    const {profileDispatch} =useContext(ProfileContext);
    const {tweetDispatch}= useContext(TweetContext);
    const  {userDispatch} =useContext(UserContext);

    const [tweet,setTweet]=useState(null);
    const [profile, setProfile] =useState(null);

    const setContext =async()=>{
      if(tweet ==null){
        const getDocs =await getTweetsDocs(userobj.uid);
        if(getDocs.empty){
          console.log("Can't find currentUser's tweet")
        }else{
          const tweets =getDocs.docs.map(doc=>({id:doc.id, ...doc.data()})).reverse();
          setTweet(tweets);
          tweetDispatch({
            type:"GET_TWEETS",
            uid:userobj.uid,
            myTweets:tweets
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
    if(isLoggedIn){
      setContext();
      if(location.pathname.includes("auth") ||
        location.pathname=== home  ) {
        navigate(`${home}home`) 
      } 
      }else{
        location.pathname=== home && navigate(`${home}auth`) 
      }
  },[isLoggedIn]);

  useEffect(()=>{
    if(state!==null && state.value ==="userProfile"){
      const userProfile =JSON.parse(localStorage.getItem('user'));
      setUserId(userProfile.userId);
      const updateUserProfile =async()=>{
        const userUid =userProfile.uid;
        const tweets =await getTweetsDocs(userUid).then(
          result =>{
            const docs =result.docs;
            const array= docs.map(doc =>({ id:doc.id ,...doc.data()}))
            return array
          }); 
        userDispatch({
          type:'GET_USER_DATA',
          userProfile:userProfile,
          userTweets:tweets
        })
      };
      updateUserProfile();
    }
    if(state!==null && state.value ==="status" &&
    localStorage.getItem('status')){
      const status  = JSON.parse( localStorage.getItem('status'));
      setUserId(status.userId);
      setDocId(status.docId);
    }
  },[state]);

    return (
      <>
        {isLoggedIn ?
          (IsMyProfile === undefined ?
          <Loading/>
          :
          (IsMyProfile ?
          <>
            <Routes>
              {state!==null && state.previous !==null  &&
                <>
                  <Route  
                  path={`${location.state.previous}/tweet`} 
                  element={ <TweetFactory userobj={userobj}/>}/>
                  <Route 
                    path={`${location.state.previous}/crop`} 
                    element={ <Cropper/>}/>
                </>
              }
              <Route  
                path={`${home}tweet`} 
                element={ <TweetFactory userobj={userobj}/>}/>
              <Route 
                path={`${home}crop`} 
                element={ <Cropper/>}/>
              <Route exact path={`${home}${userobj.id}/editProfile`} 
              element={<EditProfile userobj={userobj}  />}/>
              <Route
                  exact  path={`${home}logout`} 
                  element={<LogOut setIsLoggedIn={setIsLoggedIn}  home={home} />}
                />
            </Routes>
            <div id="inner">
              <>
                <Navigation userobj={userobj} home={home}/>
                <div id="main">
                  <Routes>
                    <Route 
                      exact path={`${home}home`} 
                      element={<Home  userobj={userobj}/>}/> 
                    <Route 
                      exact  path={`${home}timeLine`}
                      element={<TimeLine userobj={userobj} />}
                    />
                    <Route 
                      path={`${home}${userId}/status/${docId}`}
                      element={<Tweet userobj={userobj}/>}
                    />
                    <Route 
                      path={`${home}home/${userId}/status/${docId}`}
                      element={<Tweet userobj={userobj}/>}
                    />
                    <Route  
                      path={`${home}${userobj.id}`} 
                      element={ 
                      <MyProfile userobj={userobj} home={home} />}/>
                    <Route 
                      exact path={`${home}notification`}
                      element={<Notification userobj={userobj}  />} />
                    <Route  
                        path={`${home}${userId}`} 
                        element={<Profile userobj={userobj} home={home} 
                        />}/>
                    <Route 
                      path={`${home}${userId}/list/follower`}
                      element={<List userobj={userobj} home={home}/>}/>
                    <Route 
                      path={`${home}${userId}/list/following`}
                      element={<List userobj={userobj}  home={home}/>}/>
                    <Route 
                      path={`${home}${userobj.id}/list/follower`}
                      element={<List userobj={userobj}  home={home}/>}/>
                    <Route 
                      path={`${home}${userobj.id}/list/following`}
                      element={<List userobj={userobj}  home={home}/>}/>
                      {location.state !== null && location.state.previous !==null &&
                        <>
                        <Route 
                          path={`${home}${location.state.previous}/timeLine`}
                          element={<TimeLine userobj={userobj} />}
                        />
                        <Route 
                          path={`${home}${location.state.previous}/${userId}/status/${docId}`}
                          element={<Tweet userobj={userobj}/>}
                        />
                        <Route 
                          exact path={`${home}${location.state.previous}/notification`}
                          element={<Notification userobj={userobj}  />} />
                        <Route  
                            path={`${home}${location.state.previous}/${userId}`} 
                            element={<Profile userobj={userobj} 
                            />}/>
                        </>

                    }

                </Routes>
                </div>
                <div id="side">
                  <Side userobj={userobj}  home={home} />
                </div>
              </>
            </div>
          </>
          :
          <>
            <Routes>
              <Route
                path={`${home}editProfile`}
                element={<EditProfile userobj={userobj} setIsMyProfile={setIsMyProfile} />}      
              />
              <Route 
                path={`${home}crop`}
                element={ <Cropper/>}/>
            </Routes>
          </>
          )
        )
      :
      (isLoggedIn !==undefined ?
        <Routes>
          <Route  exact path={`${home}auth`} element={ <Auth home={home}/>}/>
        </Routes>
      :
        <Loading/>
      )
    }
      </>
    )
  } 
  return (
    <UserContextProvider>
      <ProfileContextProvier>
        <TweetContextProvier>
          <ContextRouter/>
        </TweetContextProvier>
      </ProfileContextProvier>
    </UserContextProvider>
  )
};

export default  React.memo(TwitterRouter) ;