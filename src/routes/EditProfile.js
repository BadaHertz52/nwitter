import {  storageService } from '../Fbase';
import React, { useState } from 'react' ;
import { getProfileDoc } from '../components/GetData';
import Cropper from '../components/Cropper';
import {MdAddPhotoAlternate } from "react-icons/md";
import { useEffect } from 'react/cjs/react.development';

const EditProfile = ( {userobj }) =>{
  const initialProfileCrop ={
    unit:'%',
    width: 50,
    x:100,
    y:100,
    aspect:1/1
  };
  const initialHearCrop={
    unit:'%',
    width: 300,
    x:100,
    y:100,
    aspect:3/1
  }
  const [profile, setProfile]=useState({
    headerUrl:"",
    introduce:""
  });
  const [toggle, setToggle] =useState(false);
  const [newDisplayName , setNewDisplayName] = useState(userobj.displayName);
  const [introduce, setIntroduce] =useState(profile.introduce);
  const [profilePhoto, setProfilePhoto] =useState(userobj.photoURL);
  const [headerChange, setHeaderChange]=useState(false);
  const [phothoChange, setphotoChange]=useState(false);
  const [header, setHeader]= useState(profile.headerUrl);
  const [cropPopup, setCropPopup]= useState(false);

  const [src, setSrc]=useState("");
  const onUserNameChange =(event) => {
    const {target:{value}} = event ;
    setNewDisplayName(value);
  };
  const onIntroduceChange =(event)=>{
    const {target:{value}}=event;
    setIntroduce(value);
  };
  const fileChange =(event)=>{
    const {target:{files}} =event ;
    const theFile = files[0]; 
    const reader = new FileReader() ;
    //파일 읽기 성공 
    reader.onloadend = (finishedEvent) => {
      const {currentTarget:{result}} =finishedEvent;
      setSrc(result);
    };
    reader.readAsDataURL(theFile);
    setCropPopup(true);
  };
  const onHeaderChange=(event)=>{
    fileChange(event); 
    setHeaderChange(true);
  }
  const onPhotoFileChange = (event)=>{
    fileChange(event);
    setphotoChange(true);
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
    //헤더
    if(header !== profile.headerUrl && header !== ""){
      const profilePhotoRef = storageService.ref().child(`${userobj.uid}/profile_header`);
      const response = await profilePhotoRef.putString(header , "data_url") ; 
      const PhotoUrl =  await response.ref.getDownloadURL();
      await getProfileDoc(userobj.uid).update({headerUrl:PhotoUrl}); 
    }
    //프포
    if(profilePhoto !== userobj.photoURL && profilePhoto !=="" ){
      const profilePhotoRef = storageService.ref().child(`${userobj.uid}/profile_photo`);
      const response = await profilePhotoRef.putString(profilePhoto , "data_url") ; 
      const PhotoUrl =  await response.ref.getDownloadURL();
      await userobj.updateProfile({
        photoURL:PhotoUrl
      });
      await  getProfileDoc(userobj.uid).update({photoUrl:PhotoUrl });
    }
    // 소개 변경
    if(introduce !==""){
      await getProfileDoc(userobj.uid).update({introduce: introduce});
    }
    } 
    setToggle(true);
  }
  useEffect(()=>{
  const getProfile =async()=> await getProfileDoc(userobj.uid).get()
    .then((doc)=>{
      if(doc.exists){
        setProfile({
          headerUrlL : doc.data().headerUrl,
          introduce : doc.data().introduce
        });
      }else{
        console.log("Can't find Profile")
      }
    }
    ).catch(
      error=> console.log("Error", error) 
      ) ;
 getProfile();
  },[])
  return (
    <section>
      {!toggle &&
        (
          <form onSubmit={onSubmit}>
            <h2>Edit your profile</h2>
            <input type="submit" value="Update Profile" />
            {/*프로필 헤더*/}
            <div id="profile_hearder">
              <img 
                src={header}
                alt="profileHeader"
                width="300px" height="100px"
              />
              <label for="profile_header_input"> <MdAddPhotoAlternate/></label>
              <input 
                id="profile_header_input" 
                type="file" 
                accept="image/*" 
                onChange={onHeaderChange} 
                style={{display:"none"}}
              />
            </div>
            <div id="profile_profile">
              {/*프로필 사진 */}
              <img  id="profile_photo" src={profilePhoto} width="100px" height="100px"   alt="profile"/>
              <label for="profile_photo_input"><MdAddPhotoAlternate/></label>
              <input 
                id="profile_photo_input" 
                type="file" 
                accept="image/*"  
                onChange={onPhotoFileChange}
                style={{display:"none"}}
              />
               {/*프로필 username */}
              <div>
                <p>이름</p>
                <input
                  type="text" 
                  placeholder="User name을 수정할 수 있습니다." 
                  onChange={onUserNameChange}  
                  value={newDisplayName} 
                  id="profile_useName"
                />
              </div>
              <div>
                <p>자기 소개</p>
                <input 
                  id="profile_introduce"
                  type="text" 
                  placeholder="소개글을 적어보세요" 
                  onChange={onIntroduceChange}  
                  value={introduce} 
                  maxLength="80"
                />
              </div>

            </div>
          </form>
        )
      }
      {cropPopup && headerChange &&
          <Cropper initialCrop={initialHearCrop} src={src} setAttachment={setHeader} setCropPopup={setCropPopup}/>
      }
      {cropPopup && phothoChange &&
        <Cropper initialCrop={initialProfileCrop} src={src} setAttachment={setProfilePhoto} setCropPopup={setCropPopup}/>
      }
    </section>
  )
} ; 

export default EditProfile