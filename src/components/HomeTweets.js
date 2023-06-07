import React, { useContext } from "react";
import { TweetContext } from "../context/TweetContext";
import Tweet from "./Tweet";

const HomeTweets = ({ userobj }) => {
  const { allTweets } = useContext(TweetContext);

  return (
    <section className="tweets">
      <div className="tweets_tweet">
        {allTweets !== undefined && allTweets[0] !== undefined ? (
          allTweets.map((tweet) => (
            <Tweet
              key={`tweet'_${tweet.docId}`}
              tweetObj={tweet}
              userobj={userobj}
              isOwner={tweet.creatorId === userobj.uid}
              answer={false}
              parentComponent={"home"}
            />
          ))
        ) : (
          <div class="notweet">
            There's no tweet
            <br />
            Write new tweet
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(HomeTweets);
