//css
import "../asset/main.css";

import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ProfileContextProvider, {
  ProfileContext,
} from "../context/ProfileContext";
import TweetContextProvider, { TweetContext } from "../context/TweetContext";
import { getTweetsDocs, getProfileDoc, getProfile } from "./GetData";

import Cropper from "../routes/Cropper";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import MyProfile from "../routes/MyProfile";
import Profile from "../routes/Profile";
import EditProfile from "../routes/EditProfile";
import Notification from "../routes/Notification";
import TweetFactory from "../routes/TweetFactory";
import List from "../routes/List";
import Side from "../routes/Side";
import UserContextProvider, { UserContext } from "../context/UserContext";
import TimeLine from "../routes/TimeLine";
import Tweet from "./Tweet";
import LogOut from "../routes/LogOut";
import Loading from "./Loading";
import DeleteUser from "./DeleteUser";
import { dbService } from "../Fbase";

const TwitterRouter = ({
  isLoggedIn,
  setIsLoggedIn,
  userobj,
  IsMyProfile,
  setIsMyProfile,
}) => {
  const [userId, setUserId] = useState("");
  const [docId, setDocId] = useState("");
  const location = useLocation();
  const hash = window.location.hash;
  const state = location.state;
  const navigate = useNavigate();
  const userItem = localStorage.getItem("user");
  const ContextRouter = () => {
    const { profileDispatch } = useContext(ProfileContext);
    const { tweetDispatch } = useContext(TweetContext);
    const { userDispatch } = useContext(UserContext);

    const [tweet, setTweet] = useState(null);
    const [profile, setProfile] = useState(null);

    const setContext = async () => {
      if (tweet == null) {
        const getDocs = await getTweetsDocs(userobj.uid);
        if (getDocs.empty) {
          console.log("Can't find currentUser's tweet");
        } else {
          const tweets = getDocs.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .reverse();
          setTweet(tweets);
          tweetDispatch({
            type: "GET_TWEETS",
            uid: userobj.uid,
            myTweets: tweets,
          });
        }

        if (profile == null) {
          await getProfileDoc(userobj.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const myProfile = doc.data();
                setProfile(myProfile);
                profileDispatch({
                  type: "GET_MY_PROFILE",
                  myProfile: myProfile,
                });
              } else {
                console.log("Can't find the profile");
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        }
      }
    };

    useEffect(() => {
      if (isLoggedIn) {
        setContext();
        if (
          location.pathname.includes("auth") ||
          location.pathname === "/twitter/" ||
          location.pathname === "/"
        ) {
          navigate(`/twitter/home`);
        }
      } else {
        (location.pathname === "/twitter/" || location.pathname === "/") &&
          navigate(`/twitter/auth`);
      }
    }, [isLoggedIn]);

    useEffect(() => {
      if (
        state !== null &&
        state.value === "userProfile" &&
        userItem !== null
      ) {
        const updateUserProfile = async () => {
          const userProfile = await getProfileDoc(userItem)
            .get()
            .then((doc) => doc.data());
          setUserId(userProfile.userId);
          const userUid = userProfile.uid;
          const tweets = await getTweetsDocs(userUid).then((result) => {
            const docs = result.docs;
            const array = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return array;
          });
          userDispatch({
            type: "GET_USER_DATA",
            userProfile: userProfile,
            userTweets: tweets,
          });
        };
        updateUserProfile();
      }
      if (
        state !== null &&
        state.value === "status" &&
        localStorage.getItem("status")
      ) {
        const status = JSON.parse(localStorage.getItem("status"));
        setUserId(status.userId);
        setDocId(status.docId);
      }
    }, [state]);

    useEffect(() => {
      const changeUser = (targetString) => {
        const lastSlash = targetString.lastIndexOf("/");
        const lastPath = targetString.slice(lastSlash + 1);
        setUserId(lastPath);
        dbService.collection(`users`).onSnapshot((shot) => {
          shot.docs.forEach((doc) => {
            if (`${doc.data().userId}` === lastPath) {
              const result = doc.data();
              (async () => {
                const getDocs = await getTweetsDocs(result.uid);
                const tweets = getDocs.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                userDispatch({
                  type: "GET_USER_DATA",
                  userProfile: result,
                  userTweets: tweets,
                });
              })();
            }
          });
        });
      };
      if (hash.includes("/list")) {
        const listIndex = hash.lastIndexOf("/list");
        const targetString = hash.slice(0, listIndex);
        changeUser(targetString);
      } else if (hash.includes("/status")) {
        const listIndex = hash.lastIndexOf("/status");
        const targetString = hash.slice(0, listIndex);
        changeUser(targetString);
        const docId = hash.slice(listIndex + 8);
        setDocId(docId);
      }
    }, [hash]);

    return (
      <div id="inner" className={hash.includes("crop") ? "noScroll" : "scroll"}>
        {isLoggedIn ? (
          IsMyProfile === undefined ? (
            <Loading />
          ) : IsMyProfile ? (
            <>
              <Routes>
                <Route
                  path="/twitter/tweet"
                  element={<TweetFactory userobj={userobj} />}
                />
                <Route path="/twitter/crop" element={<Cropper />} />
                <Route
                  path={`/twitter/editProfile`}
                  element={<EditProfile userobj={userobj} />}
                />
                <Route
                  path={`/twitter/logout`}
                  element={<LogOut setIsLoggedIn={setIsLoggedIn} />}
                />
                <Route
                  path={"/twitter/delete"}
                  element={<DeleteUser userobj={userobj} />}
                />
              </Routes>
              <Navigation userobj={userobj} setUserId={setUserId} />
              <div id="main">
                <Routes>
                  <Route
                    exact
                    path={`/twitter/home`}
                    element={<Home userobj={userobj} />}
                  />
                  <Route
                    exact
                    path={`/twitter/timeLine`}
                    element={<TimeLine userobj={userobj} />}
                  />
                  <Route
                    path={`/twitter/${userId}/status/${docId}`}
                    element={
                      <Tweet userobj={userobj} parentComponent={"router"} />
                    }
                  />
                  <Route
                    path={`/twitter/home/${userId}/status/${docId}`}
                    element={
                      <Tweet userobj={userobj} parentComponent={"router"} />
                    }
                  />
                  <Route
                    path={`/twitter/${userId}/status/${docId}`}
                    element={
                      <Tweet userobj={userobj} parentComponent={"router"} />
                    }
                  />
                  <Route
                    exact
                    path={`/twitter/notification`}
                    element={<Notification userobj={userobj} />}
                  />
                  <Route
                    path={`/twitter/${userId}`}
                    element={
                      userId === userobj.id ? (
                        <MyProfile userobj={userobj} />
                      ) : (
                        <Profile userobj={userobj} userId={userId} />
                      )
                    }
                  />
                  <Route
                    path={`/twitter/${userId}/list/follower`}
                    element={<List userobj={userobj} userId={userId} />}
                  />
                  <Route
                    path={`/twitter/${userId}/list/following`}
                    element={<List userobj={userobj} userId={userId} />}
                  />
                  <Route
                    path={`/twitter/${userobj.id}/list/follower`}
                    element={<List userobj={userobj} userId={userId} />}
                  />
                  <Route
                    path={`/twitter/${userobj.id}/list/following`}
                    element={<List userobj={userobj} userId={userId} />}
                  />
                  <Route
                    path={`/twitter/timeLine`}
                    element={<TimeLine userobj={userobj} />}
                  />
                </Routes>
              </div>
              <div id="side">
                <Side userobj={userobj} />
              </div>
            </>
          ) : (
            <>
              <Routes>
                <Route
                  path={`/twitter/editProfile`}
                  element={
                    <EditProfile
                      userobj={userobj}
                      setIsMyProfile={setIsMyProfile}
                    />
                  }
                />
                <Route path={`/twitter/crop`} element={<Cropper />} />
              </Routes>
            </>
          )
        ) : isLoggedIn !== undefined ? (
          <Routes>
            <Route exact path={`/twitter/auth`} element={<Auth />} />
          </Routes>
        ) : (
          <Loading />
        )}
      </div>
    );
  };
  return (
    <UserContextProvider>
      <ProfileContextProvider>
        <TweetContextProvider>
          <ContextRouter />
        </TweetContextProvider>
      </ProfileContextProvider>
    </UserContextProvider>
  );
};

export default React.memo(TwitterRouter);
