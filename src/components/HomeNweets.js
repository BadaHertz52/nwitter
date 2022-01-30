import React from "react";
import { useContext } from "react/cjs/react.development";
import { NweetContext } from "../context/NweetContex";
import Loading from "./Loading";
import Nweet from "./Nweet";


const HomeNeets =({userobj})=> {
  const {allNweets}=useContext(NweetContext);
  return (
      <section className="nweets">
      <div className='nweets_nweet'>
        { (allNweets!== undefined) ?
        allNweets.map((nweet) => (
          <Nweet
          key={`nweet'_${nweet.docId}`}
          nweetObj={nweet}
          userobj ={userobj}
          isOwner={nweet.creatorId === userobj.uid}
          answer={false}
          />
        ))
        :
        <Loading/>
        }
      </div>
    </section>
  )
}

export default React.memo(HomeNeets)  ;