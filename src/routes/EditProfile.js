import {  storageService } from '../Fbase';
import React, { useState } from 'react' ;
import {  getProfileDoc } from '../components/GetData';

const EditProfile = ( {userobj }) =>{
  const [toggle, setToggle] =useState(false);
  const [newDisplayName , setNewDisplayName] = useState(userobj.displayName);
  const [profilePhoto, setProfilePhoto] =useState("");
  const [profilePhotoUrl ,setProfilePhotoUrl] =useState("");

  const onChange =(event) => {
    const {target:{value}} = event ;
    setNewDisplayName(value);
  };
  const onFileChange = (event)=>{
    const {target:{files}} =event ;
    const theFile = files[0]; 
    const reader = new FileReader() ;
    //파일 읽기 성공 
    reader.onloadend = (finishedEvent) => {
      const {currentTarget:{result}} =finishedEvent;
    setProfilePhoto(result); 
    };
    reader.readAsDataURL(theFile);
  } ;
  const onSubmit = async(event) => {
    event.preventDefault();
     //프로필 저장소 생성 여부 확인 및 생성 
    if(userobj !== undefined){
          // username = displayname 변경 
    if(newDisplayName!== userobj.displayName  ){
      await userobj.updateProfile({
        displayName :newDisplayName ,
      });
      await  getProfileDoc(userobj.uid).update({userName: newDisplayName});
    };
    // 프로필 사진 변경 
    if(profilePhoto !== "" ){
      const profilePhotoRef = storageService.ref().child(`${userobj.uid}/profile_photo`);
      const response = await profilePhotoRef.putString(profilePhoto , "data_url") ; 
      const PhotoUrl =  await response.ref.getDownloadURL();
      setProfilePhotoUrl(PhotoUrl); 
      await userobj.updateProfile({
        photoURL:PhotoUrl
      });
      await  getProfileDoc(userobj.uid).update({photoUrl:PhotoUrl ,});
    }
    }
    setProfilePhoto("");
    setToggle(true);
  }

  return (
    <section>
      {!toggle &&
        (
          <>
            <h2>Edit your profile</h2>
            <form onSubmit={onSubmit}>
              <input type="text" placeholder="User name" onChange={onChange}  value={newDisplayName} />
              <img src={profilePhotoUrl} width="150px" height="100px"   alt="profile"></img>
              <input type="file" accept="image/*"  onChange={onFileChange}/>
              <input type="submit" value="Update Profile" />
            </form>
          </>
        )
      }

    </section>
  )
} ; 

export default EditProfile