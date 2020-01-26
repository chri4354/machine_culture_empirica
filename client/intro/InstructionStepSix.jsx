import React from "react";

import { Centered } from "meteor/empirica:core";

export default class InstructionStepFour extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions 6 </h1>
          <p>Each round will last 30 seconds and will contain two phases.</p>
          <p>
            The first phase will be the <b>planning phase</b> where you will be
            able to see the pattern, but you will not be able to click on it.
            This phase might vary in time.
          </p>
          <p>
            In the <b>second phase</b>, you can then take the actions you
            planned.
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
