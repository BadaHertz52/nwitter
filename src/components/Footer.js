import React, { useState } from 'react';

const Footer =()=>{
  const [popup,setPopup]=useState(false);
  return(
    <footer id="footer">
      <div className='footer_div'>
        <button  id="footer_more" onClick={()=>setPopup(!popup)}>
          more
        </button>
        {popup &&
        <div id="photoBy">
          : Photo by 
          <a href="https://unsplash.com/@stereophototyp?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sara Kurfeß</a>
          on 
          <a href="https://unsplash.com/s/photos/twitter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </div>
        }
      </div>
      <div className='footer_div' id="copyRight"> 
        This is cloning <a href='https://twitter.com/?lang=ko' >Twitter</a>
        <br/>
        ⓒ2022.
        &nbsp;
        <a href='https://github.com/BadaHertz52/twitter'> 
          Project 
        </a>
        &nbsp;
        by
        &nbsp;
        <a href='https://github.com/BadaHertz52'>
        BadaHertz52 
        </a>
      </div>
  </footer>
  )
};

export default React.memo(Footer);