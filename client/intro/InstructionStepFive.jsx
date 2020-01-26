import React from "react";

import { Centered } from "meteor/empirica:core";

export default class InstructionStepFour extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions 5 </h1>
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
