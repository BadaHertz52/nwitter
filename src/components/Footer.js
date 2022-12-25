import React from 'react';

const Footer =()=>{
  return(
    <footer id="footer">
      <div>
        This is cloning 
        <a href='https://twitter.com/?lang=ko' >Twitter</a>
        &nbsp;
        ⓒ2022.
      </div>
      <div>
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