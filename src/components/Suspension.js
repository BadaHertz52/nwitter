import React from "react";
import { BiArrowBack } from "react-icons/bi";

const Suspension = ({ setOpenSuspension }) => {
  return (
    <div id="suspension">
      <div className="inner">
        <button
          className="btn-close_suspension"
          name="close button"
          placeholder="back"
          onClick={() => setOpenSuspension(false)}
        >
          <BiArrowBack />
        </button>
        <div className="notice">
          <p>
            🥲 Sorry, We are not accepting new membership to prevent problems
            caused by reckless membership.
          </p>
          <p>
            🤗 You can watch the site usage video on &nbsp;
            <a href="https://github.com/BadaHertz52/twitter">
              the project's GitHub site
            </a>
          </p>
          <p>
            ☺️ If you want to use the site yourself, use the account on the
            developer's portfolio or contact the developer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Suspension);
