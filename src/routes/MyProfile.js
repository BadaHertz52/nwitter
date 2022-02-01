import React, { useContext } from 'react' ;
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm'
import { NweetContext } from '../context/NweetContex';
import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';


const MyProfile = ({ userobj} ) => {
  const {myNweets} =useContext(NweetContext);
  const {myProfile} =useContext(ProfileContext);
  return (
    <>
    {(myNweets===undefined || myProfile===undefined)?
      <Loading/>
    :
      <>
        <section>
          <ProfileTopForm  isMine={true} profile={myProfile} nweets={myNweets} />
        </section>
        <section>
          <ProfileBottomForm  isMine={true}  userobj={userobj} nweets={myNweets}/>
        </section>
      </>
    }
    </>
  )
}

export default MyProfile