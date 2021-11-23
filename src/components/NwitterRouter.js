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


const NwitterRouter =({isLoggedIn , userobj , refreshUser}) => {
  return (  
  <div id="inner">
  <Router>
    {isLoggedIn && 
    <Navigation userobj={userobj}/>
    }
    <Switch>
      {isLoggedIn  ?
      <div id="main">
        <Route exact path="/"> 
          <Home userobj={userobj}  refreshUser={refreshUser}/>
        </Route> 
        <Route exact path="/notification">
          <Alarm userobj={userobj} />
        </Route>
        <Route exact path="/my_profile"> 
          <MyProfile userobj={userobj} refreshUser={refreshUser}  />
        </Route>
        <Route strict path="/profile/">
          <Profile userobj={userobj} />
        </Route>
        <Route exact path="/editProfile">
          <EditProfile refreshUser={refreshUser}  />
        </Route>
        <Route strict path="/status/" >
          <Nweet userobj={userobj}/>
        </Route>
        <Route exact path="/nweet">
          <NweetFactory userobj={userobj} />
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