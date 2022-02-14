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
    userTweets:[],
  };
  const reducer =(state,action)=>{
    switch (action.type) {
      case "GET_USER_DATA":
        return {
          userProfile:action.userProfile,
          userTweets:action.userTweets
        };
      case "CLEAR_USER":
        return{
          state :initialState
        };
      default:
        break;
    }
  };
  const [state, dispatch] =useReducer(reducer,initialState );

  return (  
    state!==undefined &&
    <UserContext.Provider value={{userProfile:state.userProfile ,
    userTweets:state.userTweets ,
    userDispatch:dispatch}}>
      {props.children}
    </UserContext.Provider>
  )
};

export default UserContextProvider