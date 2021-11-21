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

const NwitterRouter =({isLoggedIn , userObj , refreshUser,currentUser}) => {
  return (  
  <Router>
    {isLoggedIn && 
    <>
      <Navigation userObj={userObj}/>
      <Search />
    </>
    }
    <Switch>
      {isLoggedIn  ?
      <>
        <Route exact path="/"> 
          <Home userObj={userObj}  refreshUser={refreshUser}/>
        </Route> 
        <Route exact path="/notification">
          <Alarm userObj={userObj} />
        </Route>
        <Route exact path="/my_profile"> 
          <MyProfile userObj={userObj} refreshUser={refreshUser}  />
        </Route>
        <Route strict path="/profile/">
          <Profile userObj={userObj} />
        </Route>
        <Route exact path="/editProfile">
          <EditProfile refreshUser={refreshUser}  />
        </Route>
        <Route strict path="/status/" > 
          <Nweet userObj={userObj}/>
        </Route>
        <Route exact path="/nweet">
          <NweetFactory userObj={userObj} />
        </Route>
      </>
      : 
      <>
        <Route  exact path="/"> 
          <Auth/>
        </Route> 
      </>
      }
    
    </Switch>
  </Router>

  )
};

export default NwitterRouter ;