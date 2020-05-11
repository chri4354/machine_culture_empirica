import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";
  render() {
    return (
      <div className="finished">
        <div>
          <h4>Finished!</h4>
          <p>
            Thank you for your participation! You have successfully finished the
            game.
          </p>
          <p>Please click on the link below to confirm your submission:</p>
          <p>
            <a href="https://app.prolific.co/submissions/complete?cc=2FDBCB78">
            https://app.prolific.co/submissions/complete?cc=2FDBCB78
            </a>
          </p>
        </div>
      </div>
    );
  }
}
