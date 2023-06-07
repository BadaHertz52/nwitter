import React, { useContext, useEffect, useState } from "react";
import HomeTweets from "../components/HomeTweets";
import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import TweetFactory from "./TweetFactory";
import { getTweetsDocs } from "../components/GetData";
import { TweetContext } from "../context/TweetContext";
import { ProfileContext } from "../context/ProfileContext";

const Home = ({ userobj }) => {
  const [popup, setPopup] = useState(false);
  const { myProfile } = useContext(ProfileContext);
  const { tweetDispatch, allTweets, myTweets } = useContext(TweetContext);
  const [tweets, setTweets] = useState([]);
  const [end, setEnd] = useState(false);
  let i = 0;
  const getAlltweets = async () => {
    setTweets([]);
    myProfile.following.forEach(async (user) => {
      if (i === 0 && myTweets[0] !== undefined) {
        const filteringArry = myTweets.filter(
          (tweet) =>
            tweet.notifications
              .map((n) => myProfile.following.includes(n.user))
              .includes(true) === false
        );
        const filteredTweets = filteringArry.filter(
          (tweet) =>
            tweet.about == null ||
            tweet.value === "qt" ||
            tweet.value === "answer" ||
            !myProfile.following.includes(tweet.about.creatorId)
        );
        setTweets(filteredTweets);
        tweetDispatch({
          type: "UPDATE_ALL_TWEETS",
          allTweets: filteredTweets,
        });
      }
      const getDocs = await getTweetsDocs(user);
      i++;
      if (!getDocs.empty) {
        getDocs.docs.forEach((doc) => {
          if (doc.data().notifications[0] === undefined) {
            tweets.push({ id: doc.id, ...doc.data() });
          } else {
            if (
              doc
                .data()
                .notifications.filter(
                  (n) =>
                    n.user !== userobj.uid ||
                    (n.value !== "qt" && n.value !== "answer")
                )[0] !== undefined
            ) {
              tweets.push({ id: doc.id, ...doc.data() });
            }
          }
        });
      }
      if (i === myProfile.following.length) {
        setEnd(true);
        const sortedtweets = tweets.sort(function (a, b) {
          return b.docId - a.docId;
        });
        setTweets(sortedtweets);
        tweetDispatch({
          type: "UPDATE_ALL_TWEETS",
          allTweets: sortedtweets,
        });
      }
    });
  };
  useEffect(() => {
    if (myProfile !== undefined && myProfile.following[0] !== undefined) {
      !end && getAlltweets();
    } else {
      tweetDispatch({
        type: "UPDATE_ALL_TWEETS",
        allTweets: myTweets,
      });
    }
  }, [myProfile, allTweets]);

  const Popup = () => {
    return (
      <div id="userInform">
        <div>
          <div>user intorm</div>
          <button onClick={() => setPopup(false)}>x</button>
        </div>
        <div>
          <img
            className="profile_photo dark_target"
            src={userobj.photoURL}
            alt="myProfile"
          ></img>
        </div>
        <div>
          <div>{userobj.dispalyName}</div>
          <div>{userobj.userId}</div>
        </div>
        <div>
          <div>
            <Link
              to={{
                pathname: `/${userobj.id}`,
              }}
            >
              <BiUser />
              <div className="nav_label"> Profile </div>
            </Link>
          </div>
          <button> Log Out </button>
        </div>
      </div>
    );
  };
  return (
    <div id="home">
      <div id="smallMobile">
        <button onClick={() => setPopup(true)}>
          <img
            className="profile_photo dark_target"
            src={userobj.photoURL}
            alt="myProfile"
          ></img>
        </button>
        <div>Home</div>
        {popup && <Popup />}
      </div>
      <TweetFactory userobj={userobj} />
      <HomeTweets userobj={userobj} />
    </div>
  );
};
export default React.memo(Home);
