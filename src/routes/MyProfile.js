import React, { useContext } from 'react' ;
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm'
import { TweetContext } from '../context/TweetContex';
import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';


const MyProfile = ({ userobj} ) => {
  const {myTweets} =useContext(TweetContext);
  const {myProfile} =useContext(ProfileContext);
  return (
    <>
    {(myTweets===undefined || myProfile===undefined)?
      <Loading/>
    :
      <>
        <section>
          <ProfileTopForm  isMine={true} profile={myProfile} tweets={myTweets} />
        </section>
        <section>
          <ProfileBottomForm  isMine={true}  userobj={userobj} tweets={myTweets}/>
        </section>
      </>
    }
    </>
  )
}

export default MyProfile