import React from 'react' ;
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm'
import '../asset/profile.css';


const MyProfile = ({ userobj} ) => {
  return (
    <>
      <section>
          <ProfileTopForm  isMine={true}  />
      </section>
      
      <section>
      <ProfileBottomForm  isMine={true}  userobj={userobj}/>
      </section>

    </>
  )
}

export default MyProfile