import React, { useContext } from "react";
import { BsTwitter } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { TweetContext } from "../context/TweetContext";
import { ProfileContext } from "../context/ProfileContext";
import { UserContext } from "../context/UserContext";
import authSerVice from "../Fbase";

const LogOut = ({ setIsLoggedIn }) => {
  const { tweetDispatch } = useContext(TweetContext);
  const { profileDispatch } = useContext(ProfileContext);
  const { userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const onLogOut = () => {
    userDispatch({
      type: "CLEAR_USER",
    });
    tweetDispatch({
      type: "CLEAR_TWEETS",
    });
    profileDispatch({
      type: "CLEAR_MY_PROFILE",
    });
    setIsLoggedIn(false);
    localStorage.clear();
    navigate(`/twitter/auth`);
    authSerVice.signOut();
  };

  return (
    <section id="logOut">
      <div id="logOut_inner">
        <div className="twitter_icon">
          <BsTwitter />
        </div>
        <div id="logOut_alert">
          <div>Log out of Twitter?</div>
          <div>
            You can always log back in at any time. If you just want to switch
            accounts, you can do that by adding an existing account.
          </div>
        </div>
        <div id="logOut_Btn">
          <button onClick={onLogOut}>Log out</button>
          <button
            onClick={() => {
              navigate("/twitter/home");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LogOut);
