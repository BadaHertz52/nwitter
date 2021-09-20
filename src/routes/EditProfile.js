import { storageService } from '../Fbase';
import React, { useState } from 'react' ;

const EditProfile = ( {userObj ,refreshUser , myProfileStore , /*getMyProfile*/ }) =>{

  const [newDisplayName , setNewDisplayName] = useState("");
  const [profilePhoto, setProfilePhoto] =useState("");
  const [profilePhotoUrl ,setProfilePhotoUrl] =useState("");
  const profilePhotoRef = storageService.ref().child(`${userObj.uid}/profile_photo`);
  //console.log(profilePhotoRef.getDownloadURL());
      //프로필 저장소 생성 여부 확인 및 생성 
      if (myProfileStore !== true){
        const myProfile = {
          creatorId:userObj.uid,
          userName: userObj.displayName,
          photoUrl:profilePhotoUrl, 
        };
      myProfileStore.set(myProfile); 
      }

      
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

    // username = displayname 변경 
    if(userObj.displayName !== newDisplayName){
      await userObj.updateProfile({
        displayName :newDisplayName ,
      });
      await myProfileStore.update({
        userName: userObj.displayName
      })
    };
    // 프로필 사진 변경 
    if(profilePhoto !== " " ){
      const response = await profilePhotoRef.putString(profilePhoto , "data_url") ; 
      const PhotoUrl =  await response.ref.getDownloadURL();
      setProfilePhotoUrl(PhotoUrl); 
      await myProfileStore.update({
        photoUrl:profilePhotoUrl
      })
    }
    console.log(myProfileStore);

    refreshUser();
    //getMyProfile();
    setProfilePhoto("");
  }

  return (
    <section>
      <h2>Edit your profile</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="User name" onChange={onChange} value={newDisplayName} />
        <img src={profilePhotoUrl} width="150px" height="100px" alt="profile"></img>
        <input type="file" accept="image/*"  onChange={onFileChange}/>
        <input type="submit" value="Update Profile" />
      </form>
    </section>  
  )
} ; 

export default EditProfile