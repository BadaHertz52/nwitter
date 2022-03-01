
import React, { useCallback, useContext, useState, useEffect } from 'react' ;

import {MdAddPhotoAlternate } from "react-icons/md";

import { HiArrowNarrowLeft } from 'react-icons/hi';
import { ProfileContext } from '../context/ProfileContex';
import { storageService } from '../Fbase';
import { getProfileDoc, goBack } from '../components/GetData';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const EditProfile = ( { userobj ,setIsMyProfile}) =>{
  const navigate =useNavigate();
  const location =useLocation();
  const basicPhoto ='https://firebasestorage.googleapis.com/v0/b/nwitter-c8556.appspot.com/o/icons8-user-64.png?alt=media&token=0e76967a-3740-4666-a169-35523d1e07cb' ;
  const basicHeader ='https://firebasestorage.googleapis.com/v0/b/nwitter-c8556.appspot.com/o/basicHeader.png?alt=media&token=3fb9d8ee-95ba-4747-a64f-65c838247ca9';
  const {myProfile, profileInput, profileDispatch} =useContext(ProfileContext);
  const {userName, introduce}=myProfile;

  const [header ,setHeader] =useState(myProfile.headerUrl === "" ? basicHeader: myProfile.headerUrl);
  const [photo, setProfilePhoto] =useState(
    myProfile.photoUrl === "" ? basicPhoto : myProfile.photoUrl) ;
  const [loading, setLoading] =useState(false);

  const closeEdit =()=>{
    goBack(location, navigate);
    profileDispatch({
      type:'CLEAR_INPUT'
    })
    const inner =document.getElementById('inner');
    if(inner !== null){
      inner.style.zIndex='0';
    }
    
  };

  const onChange =useCallback((event)=>{
    event.preventDefault();
    const {name, value} =event.target ;
      profileDispatch({
        type:'CHANGE_PROFILE',
        name ,
        value
      });
  } ,[]); 

  const fileChange =(event , what)=>{
    const {target:{files}} =event ;
    const theFile = files[0];
    const reader = new FileReader() ;
    //파일 읽기 성공
    reader.onloadend = (finishedEvent) => {
      const {currentTarget:{result}} =finishedEvent;
      switch (what) {
      case "header":
        setHeader(result);
        navigate("/twitter/crop", {state:{
          pre_previous:location.state.previous,
          previous:location.pathname,
          what:"header",
          src:result ,}})
        break;

      case "photo":
        setProfilePhoto(result);
        navigate("/twitter/crop", {state:{
        pre_previous:location.state.previous,
        previous:location.pathname,
        what:"photo",
        src:result ,}});
      break;
      default:
      break;
    }
    };
    reader.readAsDataURL(theFile);
  };


  const saveStorage =async(where,what, set)=>{
    const photoRef=storageService.ref().child(`${userobj.uid}/${where}`);
    const response =await photoRef.putString(what , "data_url");
    const url =await response.ref.getDownloadURL();
    set(url); 
    switch (where) {
      case "profile_photo":
        userobj.updateProfile({
          photoURL:url
        })
        getProfileDoc(userobj.uid).update({photoUrl: url})
        getProfileDoc(userobj.uid).update({url:url})
        break;
      case  "profile_header":
        getProfileDoc(userobj.uid).update({headerUrl:url})
        break ;
      default:
        break;
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();

    profileInput.userName !== "" && getProfileDoc(userobj.uid).update({userName: profileInput.userName}); 
    profileInput.introduce !== "" && getProfileDoc(userobj.uid).update({introduce: profileInput.introduce}); 

    const changeUrl =async()=>{
    if(profileInput.headerUrl !==""){
      await  saveStorage("profile_header", profileInput.headerUrl, setHeader);
    }
    if(profileInput.photoUrl !==""){
      await  saveStorage("profile_photo" ,profileInput.photoUrl , setProfilePhoto);
    };
    };
    await changeUrl();
    const newProfile = {
      userName: profileInput.userName === "" ?  myProfile.userName:profileInput.userName ,
      userId:  myProfile.userId,
      introduce: profileInput.introduce === "" ?  myProfile.introduce:profileInput.introduce ,
      photoUrl: profileInput.photoUrl === "" ?  myProfile.photoUrl:photo ,
      headerUrl: profileInput.headerUrl === "" ?  myProfile.headerUrl:header ,
      follower: myProfile.follower ,
      following: myProfile.following,
      notifications :myProfile.notifications
    }
    profileDispatch({
      type:"EDIT_PROFILE",
      myProfile :newProfile
    });
    setIsMyProfile!==undefined && setIsMyProfile(true);

    closeEdit();
    setLoading(true)
  };

  useEffect(()=>{
    if(location.state !==null){
      const state= location.state;
      if(state.what !== undefined && profileInput!==undefined){
        const what =state.what ; 
        switch (what) {
          case "header":
            profileInput.headerUrl!=="" && setHeader(profileInput.headerUrl)
            break;
          case "photo" :
            profileInput.photoUrl !=="" && setProfilePhoto(profileInput.photoUrl)
            break;
          default:
            break;
        }
      }
    }
  },[location.state , profileInput]) ;

  return (
    <section id="editProfile">
      {loading &&
          <Loading/>
      }
      <form onSubmit={onSubmit} className='back' >
        <div id="edit_header">
        <button onClick={closeEdit}>
          <HiArrowNarrowLeft/>
        </button>
        <div>프로필 수정</div>
        <input id="updateProfileBtn" type="submit" value=" 저장 " />
        </div>
        <div id="editProfile_header">
          <img
            src={(profileInput!==undefined && profileInput.headerUrl!=="")? 
            profileInput.headerUrl
            :header}
            alt="profileHeader"
            min-width="50px"
            min-height= "50px"
          />
          <div>
            <label for="profile_header_input"> 
              <MdAddPhotoAlternate/>
            </label>
            <input
              id="profile_header_input"
              name="headerUrl"
              type="file"
              accept="image/*"
              onChange={(event)=>{fileChange(event ,"header")}}
              style={{display:"none"}}
            />
          </div>
        </div>
        <div id="profile_photo">
          <img 
          src={(profileInput!==undefined && profileInput.photoUrl!=="")? 
          profileInput.photoUrl
          :photo}  
          alt="profile"/>
          <div>
            <label for="profile_photo_input">
              <MdAddPhotoAlternate/>
            </label>
            <input
              id="profile_photo_input"
              type="file"
              accept="image/*"
              name="photoUrl"
              onChange={(event)=> fileChange(event, "photo")}
              style={{display:"none"}}
            />
          </div>
          
        </div>
        <div class="editProfile_introduce">
          <p>이름</p>
          <input
            type="text"
            name="userName"
            onChange={onChange}
            placeholder={userName}
            id="profile_userName"
          />
        </div>
        <div class="editProfile_introduce">
          <p>자기 소개</p>
          <input
            id="profile_introduce"
            type="text"
            name="introduce"
            onChange={onChange}
            placeholder={introduce}
            maxLength="80"
          />
        </div>
      </form>

    </section>
  )
} ;

export default React.memo( EditProfile)