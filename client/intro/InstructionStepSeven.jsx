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
            will follow afterwards and has a total of <b>87 rounds</b>.
          </p>
          <p>
            In addition to your base payment you will be compensated with
            <b>1 pence per 100 points</b>. Most players got a bonus payment of
            around 3 - 4 pounds in total. Let's see if you can beat the average!
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
