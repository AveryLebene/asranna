import React from "react";

const Gifts = () => {
  return (
    <div className="container">
      <h2>
        Let us know what gift you want to send to your loved one. We got you
        covered.
      </h2>
      <div>
        <form>
          <label>Already have a gift in mind?</label>
          <button>Yes</button>
          <button>No</button>
        </form>
      </div>

      <div id="tetimonials"></div>
    </div>
  );
};

export default Gifts;
