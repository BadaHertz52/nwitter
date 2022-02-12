import React, { createContext,useReducer } from 'react'

import  { dbService, storageService } from '../Fbase';

export const TweetContext = createContext(null);

const TweetContextProvier =(props)=>{

  const initialState = {
    input:{
      text:"",
      attachmentUrl:"",
    },
    uid:"",
    myTweets:[],
    allTweets:[]
  };
  const reducer =(state, action) =>{ 
    switch (action.type) {
      case "GET_TWEETS":
        return {
          ...state,
          uid:action.uid,
          myTweets:action.myTweets,
        }
      case "UPDATE_ALL_TWEETS":
        return{
          ...state,
          allTweets:action.allTweets
        }
      case "WRITE":
        return {
          ...state,
          input:{
            ...state.input,
            [action.name]:action.value
          }
        }
      case "CREATE":
        const newMytweets= [action.tweet].concat(state.myTweets);
        const newAlltweets=[action.tweet].concat(state.allTweets);
        dbService.collection(`tweets_${action.uid}`).doc(`${action.docId}`).set(action.tweet);
        return {
          ...state,
          myTweets:newMytweets,
          allTweets:newAlltweets
        }
      case "EDIT": 
      dbService.collection(`tweets_${action.uid}`).doc(`${action.docId}`).set(action.tweet);
        return {
          ...state,
          myTweets:action.myTweets
        }
      case 'DELETE':
        dbService.doc(`tweets_${action.uid}/${action.docId}`).delete();
        action.attachmentUrl !=="" && storageService.refFromURL(action.attachmentUrl).delete();
        return {
          ...state,
          myTweets: state.myTweets.filter(tweet => tweet.docId !== action.docId),
          allTweets:state.allTweets.filter(tweet=> tweet.docId !== action.docId)
        }
      case 'CLEAR_INPUT':
        return {
          ...state,
          input: initialState.input
        }
      case "CLEAR_TWEETS":
        return{
          state:initialState
        } 
      default:
        break;
    }
  }
  const [state,dispatch]= useReducer(reducer, initialState);
  return (
    <TweetContext.Provider value={{
    tweetInput:state.input , myTweets:state.myTweets, allTweets:state.allTweets , tweetDispatch:dispatch 
  }}>
    {props.children}
    </TweetContext.Provider> 
    )
};

export default TweetContextProvier
