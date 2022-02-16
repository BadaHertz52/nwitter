import React, { useContext } from 'react' ;
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm'
import { TweetContext } from '../context/TweetContex';
import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';


const MyProfile = ({ userobj ,home} ) => {
  const {myTweets} =useContext(TweetContext);
  const {myProfile} =useContext(ProfileContext);
  return (
    <>
    {(myTweets.uid ==="" || myProfile===undefined)?
      <Loading/>
    :
      <>
        <section>
          <ProfileTopForm  isMine={true}  userobj={userobj}  home={home}/>
        </section>
        <section>
          <ProfileBottomForm  isMine={true}  userobj={userobj}/>
        </section>
      </>
    }
    </>
  )
}

export default MyProfile