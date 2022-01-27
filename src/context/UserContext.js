import { createContext, useReducer } from "react";

export const   UserContext =createContext(null);

const UserContextProvider=(props)=>{
  const initialState ={
    userProfile:{ 
      userName:"",
      userId:"",
      hotoUrl:"",
      headerUrl:"",
      introduce:"",
      follower:[],
      following:[],
      notifications:[]
    },
    userNweets:[]
  };
  const reducer =(state,action)=>{
    switch (action.type) {
      case "GET_USER_DATA":
        return {
          userProfile:action.userProfile,
          userNweets:action.userNweets
        }
      case "UPDATE_USER_DATA":
        return {
          ...state,
          userProfile:{
            ...state.userProfile,
            follower: action.newFollower
          }
        }
      case "CLEAR_USER":
        return{
          state :initialState
        }
        break;
      default:
        break;
    }
  };
  const [state, dispatch] =useReducer(reducer,initialState );

  return (
    <UserContext.Provider value={{userProfile:state.userProfile ,
    userNweets:state.userNweets ,
    userDispatch:dispatch}}>
      {props.children}
    </UserContext.Provider>
  )
};

export default UserContextProvider