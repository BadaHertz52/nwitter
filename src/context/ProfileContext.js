import React, { createContext, useReducer } from "react";
import {
  getProfileDoc,
  updateProfileNotification,
} from "../components/GetData";

export const ProfileContext = createContext(null);

const ProfileContextProvider = (props) => {
  const initialState = {
    //firebase에서는 데이터를 불러오는 것으로
    input: {
      photoUrl: "",
      headerUrl: "",
      userName: "",
      introduce: "",
    },
    myProfile: {
      userId: "",
      userName: "",
      photoUrl: "",
      headerUrl: "",
      introduce: "",
      following: [],
      follower: [],
      notifications: [{ docId: "", user: "" }],
    },
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "GET_MY_PROFILE":
        return {
          ...state,
          myProfile: action.myProfile,
        };
      case "CHANGE_PROFILE":
        return {
          ...state,
          input: {
            ...state.input,
            [action.name]: action.value,
          },
        };
      case "EDIT_PROFILE":
        return {
          ...state,
          myProfile: action.myProfile,
        };

      case "CLEAR_INPUT":
        return {
          ...state,
          input: initialState.input,
        };
      case "CLEAR_MY_PROFILE":
        return {
          state: initialState,
        };
      case "FOLLOWING":
        //following 한 대상
        const USER = {
          user: state.myProfile.uid,
          docId: null,
          value: "following",
          aboutDocId: "",
        };
        updateProfileNotification(USER, action.id, action.userNotifications);
        //action.id :내가 팔로우하는 사람 uid
        //나의 profile
        getProfileDoc(state.myProfile.uid).set(
          { following: action.following },
          { merge: true }
        );
        //해당 유저
        getProfileDoc(action.id).set(
          { follower: action.userFollower },
          { merge: true }
        );

        return {
          ...state,
          myProfile: {
            ...state.myProfile,
            following: action.following,
          },
        };
      case "UNFOLLOWING":
        //당사자
        getProfileDoc(action.id).set(
          {
            follower: action.userFollower,
            notifications: action.userNotifications,
          },
          { merge: true }
        );

        //나의 profile
        getProfileDoc(state.myProfile.uid).set(
          { following: action.following },
          { merge: true }
        );
        return {
          ...state,
          myProfile: {
            ...state.myProfile,
            following: action.following,
          },
        };
      default:
        break;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProfileContext.Provider
      value={{
        myProfile: state.myProfile,
        profileInput: state.input,
        profileDispatch: dispatch,
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;
