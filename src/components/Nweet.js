import { dbService, storageService } from '../Fbase';
import React, { useState } from 'react';
import LikeFun from './LikeFun';
import RtFun from './RtFun';
import UserProfile from './UserProfile';
//edit, delete 
const Nweet =({nweetObj , userObj ,isOwner  }) =>{
  //editing 모드인지 알려줌 (boolean)
  const [editing, setEditing] = useState(false) ; 
  // newNweet 는 수정본 
  const [newNweet , setNewNweet] = useState(nweetObj.text) ;

  const onDeleteClick = async () =>{
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if(ok){
      //delete nweet
      await dbService.doc(`nweets_${userObj.uid}/${nweetObj.id}`).delete();
      //delete photo 
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
      
    }
  };
  const toggleEditing = () => setEditing((prev)=> !prev);
  const onSubmit = async(event) =>{
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text:newNweet
    });
    setEditing(false);
  }
  const onChange = (event)=>{
    const {target:{value}} = event ;
    setNewNweet(value);
  };

  return(
    <div >
      { editing? 
        ( isOwner && 
          <>
          <form onSubmit={onSubmit}>
            <input
              type="text" 
              placeholder="Edit your nweet" 
              value={newNweet} 
              onChange={onChange} 
              required />
            <input type="submit" value="Updatae Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancle</button>
        </>
        )
        :
        <div>
          <UserProfile nweetObj ={nweetObj}/>
          <h4>{nweetObj.text}</h4>
          { nweetObj.attachmentUrl && 
          <img src={nweetObj.attachmentUrl}  max-width="300px" height="150px" alt="Nweet_photofile"/>}
          <div className="function">
            <LikeFun nweetObj={nweetObj} userObj={userObj}/>
            <RtFun nweetObj={nweetObj} userObj={userObj}/>
          </div>
          
          {isOwner && 
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          }
        </div>
      }
    </div>
  )
}

export default Nweet ;