import { useState ,useRef } from 'react';
import ReactCrop from 'react-image-crop';
import '../../node_modules/react-image-crop/dist/ReactCrop.css';
import React from 'react';
import { useHistory } from 'react-router';

const Cropper =({src ,setAttachment ,setCropPopup})=> {
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const initialCrop ={
    unti:'%',
    aspect:16/9,
    width:100
  };
  const [crop, setCrop]= useState(initialCrop); 
  const [completedCrop, setCompletedCrop]=useState(null);
  const [cropResult, setCropResult]=useState(null);

  const onImageLoaded=(img)=>{
    imageRef.current =img;
    return false
  };
  const getCroppedImg=(image, completedCrop, fileName)=>{
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

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          const fileUrl =window.URL.createObjectURL(blob);
          const src = URL.createObjectURL(blob);
          resolve(src);
          window.URL.revokeObjectURL(fileUrl);
        },
        'image/jpeg',
        1
      );
    });
  };
  const makeClientCrop = async(completedCrop)=> {
    if(imageRef && completedCrop.width && completedCrop.height){
      const croppedImageUrl = await getCroppedImg(
        imageRef.current, completedCrop, 'newFile.jpeg'
      );
      setCropResult(croppedImageUrl);
    } 
  };
  const onCropComplete =(completedCrop)=>{
    setCompletedCrop(completedCrop);
    makeClientCrop(completedCrop);
  };

  const onCropChange=(c)=>{
    setCrop(c);
  };

  const onSaveImg =(event)=>{
    event.preventDefault();
    setAttachment(cropResult);
    setCropPopup(false);
  }
  return (
    <div>
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
          <button type="button" 
          disabled={!completedCrop?.width || !completedCrop?.height}
          onClick={onSaveImg}
          >
            저장
          </button>     
    </div>
  );


}

export default Cropper;
