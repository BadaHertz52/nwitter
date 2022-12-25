import React from "react";
import { BiArrowBack, BiX } from "react-icons/bi";

const Suspension =({setOpenSusp})=>{

  return (
  <div id="susp">
    <div className="inner">
      <button 
        className="closeBtn_susp"
        name="close button"
        placeholder="back"
        onClick={()=>setOpenSusp(false)}
      >
        <BiArrowBack/>
      </button>
      <div className="notice">
        <p> 🥲 Sorry, We are not accepting new membership to prevent problems caused by reckless membership. 
        </p>
        <p>
        🤗 You can watch the site usage video on  &nbsp;
        <a href="https://github.com/BadaHertz52/twitter">
        the project's GitHub site 
        </a>
        </p>
        <p>
        ☺️ If you want to use the site yourself, use the account on the developer's portfolio or contact the developer.
        </p>
      </div>
    </div>
  </div>
  )
};

export default React.memo(Suspension);