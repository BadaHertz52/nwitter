import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlinePhotograph } from "react-icons/hi";
import { storageService } from "../Fbase";
import { TweetContext } from "../context/TweetContext";
import { ProfileContext } from "../context/ProfileContext";
import Tweet from "../components/Tweet";
import { BiArrowBack, BiX } from "react-icons/bi";
import {
  sendNotification,
  updateMyTweetsByMe,
  updateTweetNotifications,
  getProfileDoc,
  tweetForm,
  profileForm,
} from "../components/GetData";
import TweetForm from "../components/TweetForm";

const TweetFactory = ({ userobj, setPopup }) => {
  const [tweetFactory, setTweetFactory] = useState("tweetFactory");
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const { tweetInput, tweetDispatch, myTweets } = useContext(TweetContext);
  const { myProfile } = useContext(ProfileContext);
  const [attachment, setAttachment] = useState("");
  const [storageObj, setStorageObj] = useState({
    tweetObj: tweetForm,
    profile: profileForm,
    isOwner: false,
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const onClose = () => {
    tweetDispatch({ type: "CLEAR_INPUT" });

    localStorage.removeItem("tweet");
    if (state !== null) {
      if (state.previous !== undefined) {
        const back = state.previous;
        if (back.includes("list")) {
          navigate(back, {
            state: {
              isMine: state.isMine,
              previous: state.previous,
              userId: state.userId,
            },
          });
        } else if (back.includes("status")) {
          navigate(back, { state: state });
        } else {
          location.pathname !== "/twitter/home" &&
            navigate(back, {
              state: {
                previous: location.pathname,
                value: null,
              },
            });
        }
      }
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const docId = JSON.stringify(Date.now());
    let url = "";

    if (attachment !== "" && tweetInput !== undefined) {
      const attachmentRef = storageService
        .ref()
        .child(`${userobj.uid}/${docId}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      url = await response.ref.getDownloadURL();
    }

    const text = tweetInput.text
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll(/(\r\n|\n)/g, "<br/>");
    const newTweet = {
      value: storageObj.profile.uid === "" ? "tweet" : state.value,
      text: text,
      attachmentUrl: url,
      creatorId: userobj.uid,
      docId: docId,
      createdAt: [year, month, date, hour, minutes],
      about:
        storageObj.profile.uid === ""
          ? null
          : {
              creatorId: storageObj.tweetObj.creatorId,
              docId: storageObj.tweetObj.docId,
            },
      notifications: [],
    };
    tweetDispatch({
      type: "CREATE",
      docId: docId,
      uid: userobj.uid,
      tweet: newTweet,
    });

    setAttachment("");
    setPopup !== undefined && setPopup(false);
    // 알림

    if (myProfile.follower[0] !== undefined) {
      myProfile.follower.forEach(async (user) => {
        await getProfileDoc(user)
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              const profile = doc.data();
              sendNotification(
                state.value,
                userobj,
                state.value === "tweet" ? "" : storageObj.docId,
                profile,
                newTweet.docId
              );
            } else {
              console.log("Can't find user's profile");
            }
          })
          .catch((error) => console.log(error, "in TweetFactory"));
      });
    }

    if (
      state !== null &&
      state.value !== undefined &&
      (state.value === "qt" || state.value === "answer")
    ) {
      //알림 가기, 알림 업데이트
      const profile = storageObj.profile;
      const tweetObj = storageObj.tweetObj;
      const value = state.value;
      // 작성자의 tweet에 대한 알림
      if (tweetObj.creatorId !== userobj.uid) {
        updateTweetNotifications(tweetObj, profile, value, userobj, docId);
        //작성자 profile에 대한 알림
        sendNotification(value, userobj, tweetObj, profile, docId);
      } else {
        updateMyTweetsByMe(
          myTweets,
          value,
          userobj,
          docId,
          tweetDispatch,
          tweetObj.docId
        );
      }
    }
    onClose();
  };

  const adjustingHeight = (target) => {
    target.style.height = "auto";
    const scrollHeight = target.scrollHeight;
    target.style.height = `${scrollHeight}px`;
  };
  const onChange = (event) => {
    const target = event.target;
    const { name, value } = event.target;
    target.addEventListener("keyup", adjustingHeight(target));
    tweetDispatch({
      type: "WRITE",
      name,
      value,
    });
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
      tweetDispatch({
        type: "WRITE",
        name: "attachmentUrl",
        value: result,
      });
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  const OnEditAttachment = (event) => {
    event.preventDefault();
    navigate("/twitter/crop", {
      state: {
        pre_previous: state !== null ? state.previous : "",
        previous: location.pathname,
        what: "attachment",
        src: attachment,
        value: state !== null ? state.value : null,
      },
    });
  };
  useEffect(() => {
    if (state !== null) {
      if (state.what !== undefined) {
        state.what === "attachment" && setAttachment(tweetInput.attachmentUrl);
      }
      if (state.value !== undefined) {
        const value = state.value;
        if (value === "answer" || value === "qt" || value === "tweet") {
          setTweetFactory("tweetFactory popup");
        }
        if (value === "answer" || value === "qt") {
          setStorageObj(JSON.parse(localStorage.getItem("tweet")));
        }
      }
    }
  }, [state]);

  return (
    <div className={tweetFactory}>
      <div class="tweetFactory_inner">
        {tweetFactory === "tweetFactory popup" && (
          <div class="tweetFactory_header">
            <button onClick={onClose}>
              {state !== null &&
                (state.value === "tweet" ? <BiX /> : <BiArrowBack />)}
            </button>
            <button onClick={onSubmit} id="tweetBtn">
              Tweet
            </button>
          </div>
        )}

        {state !== null && state.value === "answer" && (
          <div id="answerTweet">
            {storageObj.profile.uid !== "" && (
              <>
                <TweetForm
                  tweet={storageObj.tweetObj}
                  is_owner={storageObj.isOwner}
                  profile={storageObj.profile}
                  IsAnswer={true}
                />
                <div className="answerLine"></div>
              </>
            )}
          </div>
        )}
        <div
          className={
            state !== null && state.value === "answer"
              ? "tweetFactory_box answer"
              : "tweetFactory_box"
          }
        >
          <div className="userProfile">
            <img
              className="profile_photo"
              src={userobj.photoURL}
              alt="profile"
            />
          </div>
          <form onSubmit={onSubmit}>
            <textarea
              name="text"
              onChange={onChange}
              value={tweetInput.text}
              type="text"
              placeholder="What's happening?"
              maxLength={120}
            />

            {attachment !== "" && (
              <div id="tweetfactory_attachment">
                <img src={attachment} alt="tweet attachment" />
                <button onClick={onClearAttachment}>x</button>
                <button onClick={OnEditAttachment}>Edit</button>
              </div>
            )}
            {state !== null && state.value === "qt" && (
              <div id="tweetFactory_qt">
                {storageObj.profile.uid !== "" && (
                  <Tweet
                    tweetObj={storageObj.tweetObj}
                    userobj={userobj}
                    isOwner={storageObj.isOwner}
                    answer={false}
                    parentComponent={"tweetFactory"}
                  />
                )}
              </div>
            )}
            <div>
              <label for="tweet_fileBtn">
                <HiOutlinePhotograph />
                <div className="title">Media</div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="tweet_fileBtn"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
              <input type="submit" value="tweet" className="btn" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TweetFactory);
