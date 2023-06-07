import React, { useContext, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { TweetContext } from "../context/TweetContext";
import authSerVice, { dbService, storageService } from "../Fbase";
import { getTweetDoc, getTweetsDocs, getProfileDoc } from "./GetData";
import Loading from "./Loading";

const DeleteUser = ({ userobj }) => {
  const { myProfile } = useContext(ProfileContext);
  const { myTweets } = useContext(TweetContext);

  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState(false);
  const [loading, setLoading] = useState(false);
  //clean up following ,follower
  const cleanUpFollow = async () => {
    if (myProfile.following[0] !== undefined) {
      myProfile.following.forEach(async (user) => {
        await getProfileDoc(user)
          .get()
          .then((result) => {
            const profile = result.data();
            const newNotifications = profile.notifications.filter(
              (n) => n.value !== "following" || n.user !== userobj.uid
            );
            const newFollower = profile.follower.filter(
              (f) => f !== userobj.uid
            );

            getProfileDoc(user).set(
              {
                notifications: newNotifications,
              },
              { merge: true }
            );

            getProfileDoc(user).set(
              {
                follower: newFollower,
              },
              { merge: true }
            );
          });
      });
    }

    if (myProfile.follower[0] !== undefined) {
      myProfile.follower.forEach(async (user) => {
        await getProfileDoc(user)
          .get()
          .then((result) => {
            const profile = result.data();
            const newFollowing = profile.following.filter(
              (f) => f !== userobj.uid
            );
            getProfileDoc(user).set(
              {
                following: newFollowing,
              },
              { merge: true }
            );
          });
      });
    }
  };

  const deleteTweets = async () => {
    //clean up rt,heart,answer,qt
    // 유저가 작성한 tweet에 대한 rt.heart,qt 삭제
    if (myProfile.notifications[0] !== undefined) {
      const targets = myProfile.notifications.filter((n) => n.docId !== null);
      if (targets[0] !== undefined) {
        targets.forEach(async (target) => {
          getTweetsDocs(target.user, target.aboutDocId).then((result) => {
            const docs = result.docs;
            docs.forEach((doc) => doc.delete());
          });
        });
      }
    }
    // 유저가 rt.heart,qt,answer 한 것 에 대한 삭제
    if (myTweets[0] !== undefined) {
      const targetTweets = myTweets.filter((tweet) => tweet.about !== null);

      if (targetTweets[0] !== undefined) {
        targetTweets.forEach(async (tweet) => {
          const targetUser = tweet.about.creatorId;
          await getTweetDoc(targetUser, tweet.about.docId).then((doc) => {
            const userTweet = doc.data();
            const newNotifications = userTweet.notifications.filter(
              (n) => n.user !== userobj.uid
            );
            dbService
              .collection(`tweets_${targetUser}`)
              .doc(`${tweet.about.docId}`)
              .set({ notifications: newNotifications, ...userTweet });
          });
          await getProfileDoc(targetUser)
            .get()
            .then(async (doc) => {
              const profile = doc.data();
              const newNotifications = profile.notifications.filter(
                (n) => n.user !== userobj.uid
              );
              await getProfileDoc(targetUser).set({
                notifications: newNotifications,
                ...profile,
              });
            });
        });
      }
    }

    //collection 삭제
    await getTweetsDocs(userobj.uid).then((result) => {
      const docs = result.docs;
      if (docs[0] !== undefined) {
        docs.forEach((doc) => {
          const id = doc.id;
          dbService.collection(`tweets_${userobj.uid}`).doc(id).delete();
        });
      }
    });
  };

  const onDelete = () => {
    setLoading(true);
    const storage = storageService.ref().child(`${userobj.uid}`);
    const currentUser = authSerVice.currentUser;
    currentUser
      .delete()
      .then(() => {
        storage.delete();
        cleanUpFollow();
        deleteTweets();
        getProfileDoc(userobj.uid).delete();
        setDeleteError(false);
        setLoading(false);
        navigate("/twitter/");
      })
      .catch((error) => {
        console.log(error);
        setDeleteError(true);
        setLoading(false);
      });
  };

  return (
    <section id="deleteUser">
      {deleteError ? (
        <div className="delete_inner">
          <div className="twitter_icon">
            <BsTwitter />
          </div>
          <div className="delete_alret">
            If you want to delete yout account,
            <br />
            Please log out and try again.
          </div>
          <div className="deleteBtns">
            <button
              onClick={() => {
                navigate("/twitter/home");
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                navigate("/twitter/logOut");
              }}
            >
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div className="delete_inner">
          {!loading ? (
            <>
              <div className="twitter_icon">
                <BsTwitter />
              </div>
              <div className="delete_alret">
                Do you want to delete your account?
              </div>
              <div className="deleteBtns">
                <button id="deleteBtn" onClick={onDelete}>
                  Delete
                </button>
                <button id="deleteCancle" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
      )}
    </section>
  );
};

export default DeleteUser;
