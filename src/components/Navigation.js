import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { BsBell, BsBellFill, BsPencil, BsTwitter } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";

import { ProfileContext } from "../context/ProfileContext";
import { profileForm } from "./GetData";

const Navigation = ({ userobj, setUserId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { myProfile } = useContext(ProfileContext);
  const inner = document.getElementById("inner");
  const [set, setSet] = useState(false);
  const [profile, setProfile] = useState(profileForm);

  const goMyProfile = () => {
    setUserId(userobj.id);
    navigate(`/twitter/${userobj.id}`, {
      state: { value: "profile", previous: location.pathname },
    });
  };

  const goTweetFactory = () => {
    location.pathname.includes("list")
      ? navigate(`/twitter/tweet`, {
          state: {
            value: "tweet",
            previous: location.pathname,
            isMine: location.state.isMine,
            userId: location.state.userId,
          },
        })
      : navigate(`/twitter/tweet`, {
          state: {
            value: "tweet",
            previous: location.pathname,
          },
        });
  };

  set &&
    inner !== null &&
    inner.addEventListener("click", (event) => {
      const target = event.target;
      !target.className.includes("account") && setSet(false);
    });

  useEffect(() => {
    myProfile !== undefined && setProfile(myProfile);
  }, [myProfile]);

  return (
    <>
      <nav id="nav">
        <div id="nav_menu">
          <button onClick={() => navigate(`/twitter/home`)} id="nav_home">
            <div className="twitter_icon">
              <BsTwitter />
            </div>
          </button>
          <button onClick={() => navigate(`/twitter/home`)} id="nav_homeBtn">
            {location.pathname === `/twitter/home` ? (
              <>
                <AiFillHome />
                <div className="nav_label on">Home</div>
              </>
            ) : (
              <>
                <AiOutlineHome title="Home" />
                <div className="nav_label">Home</div>
              </>
            )}
            <div className=" title">Home</div>
          </button>
          <button
            onClick={() => navigate(`/twitter/notification`)}
            id="nav_notificationBtn"
          >
            {location.pathname === `/twitter/notification` ? (
              <>
                <BsBellFill />
                <div className="nav_label on"> Notifications </div>
              </>
            ) : (
              <>
                <BsBell />
                <div className="nav_label" title="Notification">
                  {" "}
                  Notifications{" "}
                </div>
              </>
            )}
            <div className="title"> Notifications </div>
          </button>
          <button id="nav_myProfile" onClick={goMyProfile}>
            {location.pathname === `/twitter/${userobj.id}` ? (
              <>
                <FaUser />
                <div className="nav_label on"> Profile </div>
              </>
            ) : (
              <>
                <FaRegUser title="Profile" />
                <div className="nav_label"> Profile </div>
              </>
            )}
            <div className="title"> Profile </div>
          </button>
        </div>
        <div id="nav_tweetFactory">
          <button id="nav_popUp" onClick={goTweetFactory}>
            <BsPencil />
            <div className="title">Tweet</div>
            <div id="do_tweet">Tweet</div>
          </button>
        </div>
        <div id="nav_profile">
          {set && (
            <div class="account" id="account">
              <div class="account" id="account_user">
                <img
                  className="profile_photo dark_target account"
                  src={profile.photoUrl}
                  alt="myProfile"
                ></img>
                <div className="nav_label account">
                  <div class="account">{profile.userName}</div>
                  <div class="account">@{profile.userId}</div>
                </div>
              </div>
              <div class="account" id="account_btn">
                <button
                  class="account"
                  id="account_logOut"
                  onClick={() => navigate(`/twitter/logout`)}
                >
                  Log out @{profile.userId}
                </button>
                <button
                  class="account"
                  id="account_logOut"
                  onClick={() => {
                    navigate("/twitter/delete");
                    setSet(false);
                  }}
                >
                  Delete @{profile.userId}
                </button>
              </div>
            </div>
          )}
          <button onClick={() => setSet(!set)} id="nav_accountBtn">
            <img
              className="profile_photo dark_target"
              src={profile.photoUrl}
              alt="myProfile"
            ></img>
            <div className="title">Account</div>
            <div className="nav_label">
              <div>{profile.userName}</div>
              <div>@{profile.userId}</div>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};

export default React.memo(Navigation);
