import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { Centered } from 'meteor/empirica:core';

const InstructionStepFive = ({ hasPrev, hasNext, onNext, onPrev }) => (
  <Centered>
    <div className="instructions">
      <h1> Instructions 5 </h1>
      <p>
        On the top you will see the number of steps remaining for each round and your current round
        score:
      </p>

      <p>
        <img
          style={{ width: '500px', padding: '30px' }}
          src="images/instructions/round-stats.jpg"
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

export default InstructionStepFive;
