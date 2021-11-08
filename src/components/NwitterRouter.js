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

const NwitterRouter =({isLoggedIn , userObj , refreshUser }) => {

  return (

  <Router>
    {isLoggedIn && <Navigation userObj={userObj}/>}
    <Switch>
      {isLoggedIn ?
      <>
        <Route exact path="/"> 
          <Home userObj={userObj}  refreshUser={refreshUser}/>
        </Route> 
        <Route exact path="/alarm">
          <Alarm userObj={userObj} />
        </Route>
        <Route exact path="/my_profile"> 
          <MyProfile userObj={userObj}   />
        </Route>
        <Route exact path="/profile">
          <Profile userObj={userObj} />
        </Route>
        <Route exact path="/editProfile">
          <EditProfile refreshUser={refreshUser}  />
        </Route>
        <Route exact path='/nweet' > 
          <Nweet userObj={userObj}/>
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