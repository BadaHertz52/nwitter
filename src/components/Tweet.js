import React, { useContext, useEffect, useRef, useState } from "react";
import UserProfile, { goProfile } from "./UserProfile";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { FiArrowLeft, FiMessageCircle } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import Heart from "./Heart";
import Rt from "./Rt";
import {
  deleteTweetNotification,
  deleteProfileNotification,
  getTweet,
  getTweetDoc,
  getProfile,
  getProfileDoc,
  goBack,
  profileForm,
  tweetForm,
} from "./GetData";
import { TweetContext } from "../context/TweetContext";
import { ProfileContext } from "../context/ProfileContext";
import Loading from "./Loading";
import { storageService } from "../Fbase";
import TweetForm from "./TweetForm";

const Tweet = ({ key, tweetObj, userobj, answer, parentComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tweet, setTweet] = useState(tweetObj);
  const [is_answer, setIsAnswer] = useState(answer);

  const { myProfile } = useContext(ProfileContext);
  const { tweetDispatch } = useContext(TweetContext);

  const [aboutProfile, setAboutProfile] = useState(profileForm);
  const [ownerProfile, setOwnerProfile] = useState(profileForm);
  const [aboutTweet, setAboutTweet] = useState(tweetForm);
  const [answerTweets, setAnswerTweets] = useState([
    {
      tweet: tweetForm,
      profile: profileForm,
    },
  ]);
  const [statusAnswer, setStatusAnswer] = useState(false);
  const [tweetClassName, setTCName] = useState("tweet");
  const answerForm = useRef();
  const rt_heart =
    tweet !== undefined &&
    tweet.notifications !== undefined &&
    tweet.notifications[0] !== undefined
      ? tweet.notifications.filter(
          (n) =>
            n.user === userobj.uid && (n.value === "heart" || n.value === "rt")
        )[0]
      : undefined;
  const [loading, setLoading] = useState(false);

  const getAnswerTweets = async (tweet) => {
    const answerNotifications = tweet.notifications.filter(
      (n) => n.value === "answer"
    );
    const array = await Promise.all(
      answerNotifications.map(async (answer) => {
        const answerProfile = await getProfileDoc(answer.user)
          .get()
          .then((doc) => doc.data());
        const answerTweet = await getTweetDoc(
          answer.user,
          answer.aboutDocId
        ).then((doc) => doc.data());
        return { tweet: answerTweet, profile: answerProfile };
      })
    ).then((result) => result);
    setAnswerTweets(array);
    setStatusAnswer(true);
  };
  //fun

  const changeClassName = () => {
    if (tweet !== undefined && tweet.value === "answer") {
      setTCName("tweet answer");
    }
  };
  const onBack = () => {
    const item = localStorage.getItem("previousPageProfile");
    const previousPage = location.state.previousPage;
    if (previousPage === "profile" && item !== null) {
      //go profile
      const user = JSON.parse(item);
      goProfile(navigate, user.userId, user.uid, location);
    } else {
      goBack(location, navigate);
    }
    localStorage.removeItem("status");
  };

  const setState = async () => {
    if (localStorage.getItem("status")) {
      const status = JSON.parse(localStorage.getItem("status"));
      const profile = await getProfileDoc(status.userUid)
        .get()
        .then((doc) => doc.data());
      setOwnerProfile(profile);
      setTweet(status.tweet);
      setIsAnswer(status.answer);
    }
  };
  useEffect(() => {
    if (location.pathname.includes("status")) {
      setState();
    }
  }, [location]);

  useEffect(() => {
    if (tweet !== undefined) {
      tweet.value === "answer"
        ? getAnswerTweets(aboutTweet)
        : getAnswerTweets(tweet);
    }
  }, [tweet]);

  useEffect(() => {
    tweetClassName !== "tweet answer" && changeClassName();
    if (tweet !== undefined && myProfile.userName !== "") {
      if (ownerProfile.userId === "") {
        !location.pathname.includes("status") &&
          getProfile(tweet.creatorId, setOwnerProfile);
      }
      if (tweet !== undefined && aboutProfile.userId === "") {
        if (tweet.about !== null) {
          getProfile(tweet.about.creatorId, setAboutProfile);
          getTweet(tweet.about.creatorId, tweet.about.docId, setAboutTweet);
        }
      }
    }
  }, [tweet, myProfile, aboutProfile]);

  useEffect(() => {
    ownerProfile.photoUrl !== "" ? setLoading(false) : setLoading(true);
  }, [ownerProfile, aboutProfile]);

  const TweetBox = ({ what, IsAnswer, profile }) => {
    const now = new Date();
    const year = now.getFullYear();
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const [time, setTime] = useState("");
    const [aboutTime, setAboutTime] = useState("");
    const targetText = useRef();

    const tweet =
      what !== undefined
        ? {
            id: what.id,
            docId: what.docId,
            text: what.text,
            attachmentUrl: what.attachmentUrl,
            createdAt: what.createdAt,
            creatorId: what.creatorId,
            value: what.value,
            notifications: what.notifications,
            about: what.about,
          }
        : tweetForm;

    const monthArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const onDeleteClick = (event) => {
      event.preventDefault();
      const ok = window.confirm("Are you sure you want to delete this tweet?");
      tweetDispatch({
        type: "DELETE",
        uid: userobj.uid,
        docId: tweet.docId,
        attachmentUrl: tweet.attachmentUrl,
      });
      const storage = storageService
        .ref()
        .child(`${userobj.uid}/${tweet.docId}`);
      storage.delete();
      switch (tweet.value) {
        case "qt":
          deleteTweetNotification(aboutTweet, tweet, userobj, tweet.value);
          deleteProfileNotification(
            aboutProfile,
            aboutTweet,
            tweet,
            userobj,
            tweet.value
          );
          break;
        case "answer":
          deleteTweetNotification(tweet, tweet, userobj, tweet.value);
          deleteProfileNotification(
            ownerProfile,
            tweet,
            tweet,
            userobj,
            tweet.value
          );
          break;
        default:
          break;
      }
      if (location.pathname.includes("status")) {
        onBack();
      }
    };

    const onAnswer = () => {
      localStorage.setItem(
        "tweet",
        JSON.stringify({
          tweet: tweet,
          profile: profile,
          isOwner: false,
        })
      );

      navigate(`/twitter/tweet`, {
        state: {
          previous: location.pathname,
          value: "answer",
        },
      });
    };
    const goTweet = (event) => {
      const target = event.target;
      const condition = tweet.creatorId === ownerProfile.uid;
      const condition1 = !target.classList.contains("fun");
      const condition2 = !target.parentNode.classList.contains("fun");
      const pathName = `/twitter/${profile.userId}/status/${tweet.docId}`;

      const status = {
        tweet: tweet,
        answer: false,
        value: "status",
        /**
         * tweet 작성자의 userId
         */
        userId: condition ? ownerProfile.userId : aboutProfile.userId,
        /**
         * tweet 작성자의 uid
         */
        userUid: condition ? ownerProfile.uid : aboutProfile.uid,
        docId: tweet.docId,
      };

      localStorage.setItem("status", JSON.stringify(status));

      if (condition1 && condition2) {
        navigate(`${pathName}`, {
          state: {
            ...status,
            previous: location.pathname,
            previousPage: parentComponent,
          },
        });
      }
    };

    useEffect(() => {
      time !== "" &&
      tweet.createdAt[0] === year &&
      tweet.createdAt[1] === month &&
      tweet.createdAt[2] === date
        ? setTime(`${tweet.createdAt[3]}h`)
        : setTime(
            `${monthArray[tweet.createdAt[1]]} ${tweet.createdAt[2]},${
              tweet.createdAt[0]
            }`
          );
    }, [tweet]);

    useEffect(() => {
      aboutTime !== "" &&
      aboutTweet.docId !== "" &&
      aboutTweet.createdAt[0] === year &&
      aboutTweet.createdAt[1] === month &&
      aboutTweet.createdAt[2] === date
        ? setAboutTime(`${aboutTweet.createdAt[3]}h`)
        : setAboutTime(
            `${monthArray[aboutTweet.createdAt[1]]} ${
              aboutTweet.createdAt[2]
            },${aboutTweet.createdAt[0]}`
          );
    }, [aboutTweet]);

    if (targetText !== null) {
      const target = targetText.current;
      if (target !== undefined) {
        target.innerHTML = tweet.text;
      }
    }

    return (
      <>
        {tweet.docId === "" ? (
          <div className="noTweet">Tweet does not exist.</div>
        ) : (
          <div
            className={
              location.pathname.includes("status")
                ? "statusBtn tweetBox"
                : "tweetBox"
            }
            id={key}
            ref={answerForm}
            onClick={goTweet}
          >
            {/*tweet_content*/}
            <TweetForm
              tweet={tweet}
              profile={profile}
              is_owner={tweet.creatorId === userobj.uid}
              onDeleteClick={onDeleteClick}
            />
            {IsAnswer && <div className="answerLine"></div>}
            <div className="tweet_other">
              {tweet.value === "qt" && !location.pathname.includes("tweet") && (
                <div className="tweet qt">
                  <div className="tweet_content">
                    <div className="tweet_header">
                      <UserProfile profile={aboutProfile} />
                      <div>
                        <span>{aboutProfile.userName}</span>
                        <span>@{aboutProfile.userId}</span>
                        <span className="qn_time">{aboutTime}</span>
                      </div>
                    </div>
                    <div className="text">
                      {aboutTweet.text.replaceAll("<br/>", "\r\n")}
                    </div>
                    {aboutTweet.attachmentUrl !== "" && (
                      <div className="attachment">
                        <img
                          src={aboutTweet.attachmentUrl}
                          alt="tweet_attachment"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!location.pathname.includes("tweet") && (
                <div className="tweet_fun fun">
                  <button className="fun answer" onClick={onAnswer}>
                    <FiMessageCircle />
                  </button>
                  {profile !== undefined && what !== undefined && (
                    <>
                      <Rt
                        tweetObj={what}
                        original={tweet}
                        userobj={userobj}
                        profile={profile}
                        ownerProfile={ownerProfile}
                      />
                      <Heart
                        tweetObj={what}
                        original={tweet}
                        userobj={userobj}
                        profile={profile}
                        ownerProfile={ownerProfile}
                      />
                    </>
                  )}
                </div>
              )}
              {IsAnswer && !statusAnswer && aboutProfile.userId !== "" && (
                <div className="answer_who">
                  @{aboutProfile.userId}에 대한 답글
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {!loading ? (
        tweet !== undefined && (
          <div
            className={tweetClassName}
            id={
              location.pathname !== undefined &&
              location.pathname.includes("status") &&
              "status"
            }
          >
            <>
              {location.pathname.includes("status") && (
                <div id="status_header">
                  <button className="back" onClick={onBack}>
                    <FiArrowLeft />
                  </button>
                  <div>tweet</div>
                </div>
              )}

              <div className="value">
                {tweet.value === "rt" && rt_heart === undefined && (
                  <div className="value_explain">
                    <AiOutlineRetweet />
                    {ownerProfile.uid === userobj.uid
                      ? "I"
                      : `${ownerProfile.userName}`}{" "}
                    Retweeted
                  </div>
                )}
                {tweet.value === "heart" && rt_heart === undefined && (
                  <div className="value_explain">
                    <AiOutlineHeart />
                    {ownerProfile.uid === userobj.uid
                      ? "I"
                      : `${ownerProfile.userName}`}{" "}
                    liked
                  </div>
                )}
                {((tweet.value === "rt" && rt_heart !== undefined) ||
                  (tweet.value === "heart" &&
                    tweet.notifications.filter(
                      (n) => n.user === userobj.uid && n.value === "rt"
                    )[0] !== undefined)) && (
                  <div className="value_explain">
                    <AiOutlineRetweet />
                    <AiOutlineHeart />
                    {ownerProfile.uid === userobj.uid
                      ? "I"
                      : `${ownerProfile.userName}`}{" "}
                    ReTweeted and liked
                  </div>
                )}
                {tweet.value === "answer" &&
                  (aboutTweet.docId === "" ? (
                    location.pathname.includes("status") && (
                      <div className="noTweet">Tweet does not exist.</div>
                    )
                  ) : (
                    <TweetBox
                      what={aboutTweet}
                      IsAnswer={true}
                      profile={aboutProfile}
                    />
                  ))}
              </div>
              <div className="tweet">
                {(tweet.value === "qt" || tweet.value === "tweet") && (
                  <TweetBox
                    what={tweet}
                    IsAnswer={is_answer}
                    profile={ownerProfile}
                  />
                )}
                {(tweet.value === "rt" || tweet.value === "heart") &&
                  (aboutTweet.about !== null && aboutTweet.value === "qt" ? (
                    <Tweet
                      key={aboutTweet.docId}
                      tweet={aboutTweet}
                      userobj={userobj}
                      isOwner={aboutTweet.creatorId === userobj.uid}
                      answer={false}
                      parentComponent={parentComponent}
                    />
                  ) : (
                    <TweetBox
                      what={aboutTweet}
                      IsAnswer={false}
                      profile={aboutProfile}
                    />
                  ))}
                {tweet.value === "answer" && (
                  <TweetBox
                    what={tweet}
                    IsAnswer={false}
                    profile={ownerProfile}
                  />
                )}
              </div>
              {location.pathname.includes("status") && statusAnswer && (
                <div class="tweet statusAnswers">
                  {answerTweets.map((answer) => (
                    <TweetBox
                      what={answer.tweet}
                      IsAnswer={false}
                      profile={answer.profile}
                    />
                  ))}
                </div>
              )}
            </>
          </div>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default React.memo(Tweet);
