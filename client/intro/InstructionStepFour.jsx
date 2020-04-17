import React from 'react';

import { Centered } from 'meteor/empirica:core';

export default class InstructionStepFour extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions 4 </h1>
          <p>You will see the remaining time and your total score on the left:</p>

          <p>
            <img
              style={{ width: '500px', padding: '30px' }}
              src="images/instructions/timer-and-score.jpg"
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
