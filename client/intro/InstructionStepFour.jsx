import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { Centered } from 'meteor/empirica:core';

const InstructionStepFour = ({ hasPrev, hasNext, onNext, onPrev }) => (
  <Centered>
    <div className="instructions">
      <h1> Instructions 4 </h1>
      <p>You will see the remaining time and your total score on the left:</p>

      <p>
        <img
          style={{ width: '500px', padding: '30px' }}
          src="images/instructions/timer-and-score.jpg"
          alt="Instructions"
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

export default InstructionStepFour;
