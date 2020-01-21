import React from "react";

import { Centered } from "meteor/empirica:core";

export default class InstructionStepThree extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions 3 </h1>
          <p>
            You will see the remaining time and your total score on the left:
          </p>
          <p>
            <img
              style={{ width: "500px", padding: "30px" }}
              src="images/instructions/total-score.jpg"
            />
          </p>
          <p>
            On the top you will see the number of steps remaining for each round
            and your current round score:
          </p>
          <p>
            <img
              style={{ width: "500px", padding: "30px" }}
              src="images/instructions/round-stats.jpg"
            />
          </p>
          <p>Your starting point will be marked in grey:</p>
          <p>
            <img
              style={{ width: "500px", padding: "30px" }}
              src="images/instructions/network-active-node.jpg"
            />
          </p>
          <p>
            <button type="button" onClick={onPrev} disabled={!hasPrev}>
              Previous
            </button>
            <button type="button" onClick={onNext} disabled={!hasNext}>
              Next
            </button>
          </p>
        </div>
      </Centered>
    );
  }
}
