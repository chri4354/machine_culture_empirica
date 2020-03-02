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
            It is important that you complete <b>all of the 8 steps</b> in every
            round! If you are not able to finish all 8 steps you will receive a
            punishment of -500 points.
          </p>
          <p>
            A random sequence will usually get you more points than not
            finishing on time!
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
