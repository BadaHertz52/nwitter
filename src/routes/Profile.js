import React, { useContext,useEffect, useState } from 'react' ;

import { ProfileBottomForm, ProfileTopForm } from '../components/ProfileForm';
import Loading from '../components/Loading';
import { UserContext } from '../context/UserContext';

const Profile = ({userobj , userId}) => {
  const {userProfile }=useContext(UserContext);
  const [profile, setProfile]=useState(null);
  
  useEffect(()=>{
    if(userProfile.userId ===userId){
      console.log("userprofiule", userProfile)
      setProfile(userProfile);
    };
    
  },[userProfile])
  console.log("userProfile", userProfile,);
  return (
    <>
    {(profile === null)?
      <Loading/>
    :
    <>
      <section>
        <ProfileTopForm who={profile} isMine={false} userobj={userobj} />
      </section>
      <section >
        <ProfileBottomForm  isMine={false} userobj={userobj} /> 
      </section> 
    </>
    }
      
    </> 
  ) 
}

export default React.memo(Profile);