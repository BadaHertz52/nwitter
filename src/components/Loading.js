import React from "react";

const Loading = () => {
  return (
    <div className="container">
      <div className="loader">
        <span></span>
      </div>
    </div>
  );
};

export default React.memo(Loading);
