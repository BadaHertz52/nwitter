import { storageService } from 'Fbase';
import React, { useState } from 'react' ;

const EditProfile = ( {userObj ,refreshUser , myProfileStore , getMyProfile}) =>{

  const [newDisplayName , setNewDisplayName] = useState(userObj.displayName);
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
    
    if(userObj.displayName !== newDisplayName){
      await userObj.updateProfile({
        displayName :newDisplayName ,
      });
      myProfileStore && await myProfileStore.update({
        userName: userObj.displayName
      })
    };
    if(profilePhoto !== " " ){
      const profilePhotoRef = storageService.ref().child(`${userObj.uid}/profile_photo`);
      const response = await profilePhotoRef.putString(profilePhoto , "data_url") ; 
      const PhotoUrl =  await response.ref.getDownloadURL();
      setProfilePhotoUrl(PhotoUrl); 
      if (myProfileStore !== true){
      const myProfile = {
        creatorId:userObj.uid,
        userName:userObj.displayName,
        photoUrl: PhotoUrl , 
      };
      await myProfileStore.set(myProfile);
    }else
    //수정
      // 기존 프로필 사진 변경 
      {
      myProfileStore.update({
        photoUrl:PhotoUrl
      })
    }
    };

    refreshUser();
    getMyProfile();
    setProfilePhoto("");
  };

  return (
    <section>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="User name" onChange={onChange} value={newDisplayName} />
        <img src={profilePhotoUrl} alt="profile"></img>
        <input type="file" accept="image/*"  onChange={onFileChange}/>
        <input type="submit" value="Update Profile" />
      </form>
    </section>  
  )
} ; 

export default EditProfile