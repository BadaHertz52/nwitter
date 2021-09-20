import { storageService } from '../Fbase';
import React, { useState } from 'react' ;

const EditProfile = ( {userObj ,refreshUser , myProfileStore , getMyProfile }) =>{
  const [toggle, setToggle] =useState(false);
  const [newDisplayName , setNewDisplayName] = useState(userObj.displayName);
  const [profilePhoto, setProfilePhoto] =useState("");
  const [profilePhotoUrl ,setProfilePhotoUrl] =useState("");
  

  //console.log(profilePhotoRef.getDownloadURL());

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
    if (myProfileStore !== true){
      const myProfile = {
        creatorId:userObj.uid,
        userName: userObj.displayName,
        photoUrl:profilePhotoUrl, 
      };
    myProfileStore.set(myProfile); 
    }
    // username = displayname 변경 
    if(newDisplayName!== userObj.displayName  ){
      console.log(newDisplayName);
      await userObj.updateProfile({
        displayName :newDisplayName ,
      });
      await myProfileStore.update({
        userName: newDisplayName
      });
      console.log(userObj.displayName);
    };
    // 프로필 사진 변경 
    if(profilePhoto !== "" ){
      const profilePhotoRef = storageService.ref().child(`${userObj.uid}/profile_photo`);
      const response = await profilePhotoRef.putString(profilePhoto , "data_url") ; 
      const PhotoUrl =  await response.ref.getDownloadURL();
      setProfilePhotoUrl(PhotoUrl); 
      await myProfileStore.update({
        photoUrl:PhotoUrl
      })
    }
    refreshUser();
    getMyProfile();
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