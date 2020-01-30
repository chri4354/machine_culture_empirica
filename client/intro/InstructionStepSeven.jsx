import React from "react";

import { Centered } from "meteor/empirica:core";

export default class InstructionStepFour extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions 7 </h1>
          <p>
            You will now have two practice rounds to try it out! The actual game
            will follow afterwards and has a total of <b>82 rounds</b>.
          </p>
          <p>
            The goal is to score better than the average! Since an average score
            is 400 points per round and 32000 points in total, you will be
            compensated with <b>10 pence for every 100 points above 32000</b>.
          </p>
          <p>
            You can reach a bonus of up to <b>£14.96</b>!
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
