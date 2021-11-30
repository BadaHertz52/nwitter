import React from 'react';
import { HashRouter  as Router , Route ,Switch } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';
import MyProfile from '../routes/MyProfile';
import Profile from '../routes/Profile';
import EditProfile from '../routes/EditProfile';
import Alarm from '../routes/Alarm';
import Nweet from './Nweet';
import Search from '../routes/Search';
import NweetFactory from './NweetFactory';
import '../css/router.css';
import List from '../routes/List';
import { useEffect, useState } from 'react/cjs/react.development';
import { getProfile } from './GetData';


const NwitterRouter =({isLoggedIn , userobj ,IsMyProfile }) => {
  const [myProfile, setMyProfile] =useState({});
  const myProfilePath =`/${userobj.id}`;  

  useEffect(()=>{
    const getMyProfile= async()=>{
      await getProfile(userobj.uid, setMyProfile);
    }
    getMyProfile();
  },[])
  return (  
  <div id="inner">
  <Router>
    {isLoggedIn && 
    <Navigation userobj={userobj}  myProfile={myProfile}/>
    }
    <Switch>
      <>
      {isLoggedIn  ?
      <div id="main">
        <Route exact path="/"> 
          <Home userobj={userobj} myProfile={myProfile} />
        </Route> 
        <Route exact path="/notification">
          <Alarm userobj={userobj}  />
        </Route>
        <Route exact path={myProfilePath}> 
          <MyProfile userobj={userobj} IsMyProfile={IsMyProfile}  />
        </Route>
        <Route strict path="/user/">
          <Profile userobj={userobj} />
        </Route>
        <Route exact path="/editProfile">
          <EditProfile userobj={userobj}  />
        </Route>
        <Route strict path="/status/" >
          <Nweet userobj={userobj}/>
        </Route>
        <Route exact path="/nweet">
          <NweetFactory userobj={userobj} myProfile={myProfile} />
        </Route>
        <Route strict path="/list/">
          <List />
        </Route>
      </div>
      : 
      <div id="main">
        <Route  exact path="/"> 
          <Auth/>
        </Route> 
      </div>
      }
      </>
    </Switch>
    {isLoggedIn && 
    <div id="side">
      <Search/>
    </div>
    }
  </Router>
  </div>
  )
};

export default NwitterRouter ;