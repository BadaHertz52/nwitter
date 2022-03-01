import { useState ,useRef, useEffect, useContext } from 'react';
import ReactCrop from 'react-image-crop';
import '../../node_modules/react-image-crop/dist/ReactCrop.css';
import React from 'react';
import {BiArrowBack} from "react-icons/bi";

import { useLocation, useNavigate } from 'react-router-dom';
import { TweetContext } from '../context/TweetContex';
import { ProfileContext } from '../context/ProfileContex';

const Cropper =()=> {
  const location =useLocation();
  const navigate =useNavigate();
  const {tweetDispatch} =useContext(TweetContext);
  const {profileDispatch} =useContext(ProfileContext);
  const [initialCrop, setInitialCrop]=useState({
    unit:"%",
    
  });
  const [src ,setSrc]=useState("");
  const [what, setWhat]=useState("");
  const cropper =useRef();

  const saveBtn =document.getElementById('cropper_savBtn');
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop]= useState(initialCrop); 
  const [completedCrop, setCompletedCrop]=useState(null);
  const [cropResult, setCropResult]=useState("");

  const onBack=()=>{
    const state =location.state;
    const value =state.value;
    navigate( state.previous , {state:
      {what:what ,
      value:value ,
      previous: state.pre_previous
    }})
  } ;

  
  const onImageLoaded=(img)=>{
    imageRef.current =img;
    return false
  };
  const getCroppedImg=(image, completedCrop)=>{
    const canvas = previewCanvasRef.current;
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = completedCrop.width * pixelRatio * scaleX;
    canvas.height = completedCrop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
      
    const base64Image = canvas.toDataURL("image/jpeg", 1);
    return base64Image ;
  };
  
  const makeClientCrop = async(completedCrop)=> {
    if(imageRef && completedCrop.width && completedCrop.height){
      const croppedImageUrl = await getCroppedImg(
        imageRef.current, completedCrop , 'newFile.jpeg'
      );
      setCropResult(croppedImageUrl);
    } 
  };

  const onCropComplete =(completedCrop)=>{
    setCompletedCrop(completedCrop);
    makeClientCrop(completedCrop);
    cropResult!==""? saveBtn.style.display="block" :saveBtn.style.display="none";
  };

  const onCropChange=(c)=>{
    setCrop(c);
  };

  const onSaveImg =(event)=>{
    event.preventDefault();
    switch (what) {
      case "header":
        profileDispatch({
          type:"CHANGE_PROFILE",
          name:"headerUrl",
          value :cropResult
        })
        break;
      case "photo":
        profileDispatch({
          type:"CHANGE_PROFILE",
          name:"photoUrl",
          value :cropResult
        })
        break;
      case "attachment":
        tweetDispatch({
          type:"WRITE",
          name:"attachmentUrl",
          value :cropResult
        });
        break;
      default :
        break;
    };
    onBack();
  } ;

  useEffect(()=>{

    if(location.state !==null){
      const state =location.state ;
      const attahcnmentCrop ={
        aspect:16/9,
      };
      const photoCrop ={
        aspect:1/1,
        disabled:true
      };
      const headerCrop={
        unit:"px",
        width:440,
        aspect:4/1,
        disabled:true
      }
        setSrc(state.src);
        setWhat(state.what);
        switch (state.what) {
          case 'attachment':
            cropper.current.classList.remove('factory')
            setInitialCrop(attahcnmentCrop)
            break;
          case "photo":
            cropper.current.classList.add('factory');
            setInitialCrop(photoCrop);
            break;
          case "header":
            cropper.current.classList.add('factory');
            setInitialCrop(headerCrop);
            break;
          default:
            break;
        }   
    }
  },[location.pathname])
  return (
    <div id="cropper" className='cropper' ref={cropper} >
      <div id="cropper_inner">
      <div id="cropper_header">
        <button  onClick={onBack}>
          <BiArrowBack/>
        </button> 
        <div>미디어 수정</div>
        <button 
          id="cropper_savBtn" 
          disabled={!completedCrop?.width || !completedCrop?.height}
          onClick={onSaveImg}
        >
          저장
        </button>
      </div>
      <div id="cropper_crop">
        <ReactCrop 
          src={src}
          crop={crop}
          ruleOfThirds
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
        />
        <canvas
          ref={previewCanvasRef}
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
            display: 'none'
          }}
        />
      </div>
      </div>
    </div>
  );


}

export default React.memo( Cropper );
