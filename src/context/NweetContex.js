import React, { createContext,useReducer } from 'react'

import  { dbService, storageService } from '../Fbase';

export const NweetContext = createContext(null);

const NweetContextProvier =(props)=>{

  const initialState = {
    input:{
      text:"",
      attachmentUrl:"",
    },
    uid:"",
    myNweets:[],
    allNweets:[]
  };
  const reducer =(state, action) =>{ 
    switch (action.type) {
      case "GET_NWEETS":
        return {
          ...state,
          uid:action.uid,
          myNweets:action.myNweets,
        }
      case "UPDATE_ALL_NWEETS":
        return{
          ...state,
          allNweets:action.allNweets
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
        const newMyNweets= [action.nweet].concat(state.myNweets);
        const newAllNweets=[action.nweet].concat(state.allNweets);
        dbService.collection(`nweets_${action.uid}`).doc(`${action.docId}`).set(action.nweet);
        return {
          ...state,
          myNweets:newMyNweets,
          allNweets:newAllNweets
        }
      case "EDIT": 
      dbService.collection(`nweets_${action.uid}`).doc(`${action.docId}`).set(action.nweet);
        return {
          ...state,
          myNweets:action.myNweets
        }
      case 'DELETE':
        dbService.doc(`nweets_${action.uid}/${action.docId}`).delete();
        action.attachmentUrl !=="" && storageService.refFromURL(action.attachmentUrl).delete();
        return {
          ...state,
          myNweets: state.myNweets.filter(nweet => nweet.docId !== action.docId),
          allNweets:state.allNweets.filter(nweet=> nweet.docId !== action.docId)
        }
      case 'CLEAR_INPUT':
        return {
          ...state,
          input: initialState.input
        }
      case "CLEAR_NWEETS":
        return{
          state:initialState
        } 
      default:
        break;
    }
  }
  const [state,dispatch]= useReducer(reducer, initialState);
  return (
    <NweetContext.Provider value={{
    nweetInput:state.input , myNweets:state.myNweets, allNweets:state.allNweets , nweetDispatch:dispatch 
  }}>
    {props.children}
    </NweetContext.Provider> 
    )
};

export default NweetContextProvier
