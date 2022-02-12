import React from "react";
import { useContext } from "react/cjs/react.development";
import { TweetContext } from "../context/TweetContex";
import Tweet from "./Tweet";


const HomeTweets =({userobj})=> {
  const {allTweets}=useContext(TweetContext);
  
  return (
      <section className="tweets">
      <div className='tweets_tweet'>
        { allTweets!== undefined && allTweets[0]!==undefined?
        allTweets.map((tweet) => (
          <Tweet
          key={`tweet'_${tweet.docId}`}
          tweetObj={tweet}
          userobj ={userobj}
          isOwner={tweet.creatorId === userobj.uid}
          answer={false}
          />
        ))
        :
        <div class="notweet" >
        There's no tweet
        <br/>
        Write new tweet
        </div>
        }
      </div>
    </section>
  )
}

export default React.memo(HomeTweets)  ;