import React, { useContext } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import Loading from '../components/Loading';
import { UserContext } from '../context/UserContext';


const Profile = ({userobj}) => {
  const {userProfile , userTweets}=useContext(UserContext);

  return (
    <>
    {(userProfile.uid ===""|| userTweets === undefined)?
      <Loading/>
    :
    <>
      <section>
        <ProfileTopForm isMine={false} userobj={userobj} />
      </section>
      <section >
        <ProfileBottomForm  isMine={false} userobj={userobj} /> 
      </section> 
    </>
    }
      
    </> 
  ) 
}

export default Profile