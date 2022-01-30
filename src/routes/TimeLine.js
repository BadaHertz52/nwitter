import React from 'react'
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate} from 'react-router';
import { useContext, useEffect, useState } from 'react/cjs/react.development';
import { goBack } from '../components/GetData';
import Loading from '../components/Loading';
import Nweet from '../components/Nweet';
import { NweetContext } from '../context/NweetContex';

const TimeLine =({userobj})=>{
  const location =useLocation();
  const state=location.state; 
  const navigate =useNavigate();
  const {myNweets}=useContext(NweetContext);
  const [nweet,setNweet]=useState({docId:"" ,about:null});

  useEffect(()=>{ 
      if(state.value.aboutDocId == null){
        const targetNweet =myNweets.filter(n=> n.docId == state.docId)[0];
      setNweet(targetNweet);
      }else{
        setNweet(state.aboutDocId)
      }

  },[state, myNweets]);

  return (
    <div id="timeLine">
      <div id="timeLine_header">
        <button  
        className='back'
        onClick={()=> goBack(location, "/timeLine", navigate)}
        >
            <FiArrowLeft/>
        </button>
        <div> 
          <div id="timeLine_value">
            {state.value=="heart" && "Liked"}
            {state.value=="rn" && "Renweeted"}
            {(state.value=="answer" ||
              state.value=="nweets"  ||
              state.value =="qn"
              )
              && "Nweets"}
          </div>
          <div id="tiemLine_userId">
            {state.userName}
          </div>
        </div>
      </div>
      <div id="timeLine_nweet">
        {(nweet !==undefined && nweet.docId!=="") ?
        <Nweet  
          nweetObj={nweet} 
          userobj={userobj} 
          isOwner={true} 
          answer={ false} />
          :
          <Loading/>
      }
      </div>
    </div>
  )
};

export default TimeLine;