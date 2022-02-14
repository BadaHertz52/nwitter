import React, { useContext, useEffect, useState } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';
import { UserContext } from '../context/UserContext';


const Profile = ({userobj}) => {
  const {userProfile }=useContext(UserContext);

  return (
    <>
    {(userProfile===undefined)?
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