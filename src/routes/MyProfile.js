import React, { useContext, useEffect } from 'react' ;
import { ProfileTopForm, ProfileBottomForm } from '../components/ProfileForm'
import { TweetContext } from '../context/TweetContex';
import { ProfileContext } from '../context/ProfileContex';
import Loading from '../components/Loading';
import {changeTitle} from '../components/TwitterRouter';

const MyProfile = ({ userobj} ) => {
  const {myTweets} =useContext(TweetContext);
  const {myProfile} =useContext(ProfileContext);
  changeTitle(`${myProfile.userName}(@${myProfile.userId})`);
  return (
    <>
    {(myTweets ===undefined|| myProfile===undefined)?
      <Loading/>
    :
      <>
        <section>
          <ProfileTopForm who={myProfile} isMine={true}  userobj={userobj} />
        </section>
        <section>
          <ProfileBottomForm  isMine={true}  userobj={userobj}/>
        </section>
      </>
    }
    </>
  )
}

export default  React.memo(MyProfile);