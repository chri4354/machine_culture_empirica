import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { Centered } from 'meteor/empirica:core';

const InstructionStepTwo = ({ hasPrev, hasNext, onNext, onPrev }) => (
  <Centered>
    <div className="instructions">
      <h1> Instructions 2 </h1>
      <p>
        In each round, you will see the following pattern. This might seem a bit complicated at
        first, but don’t worry! It’s actually pretty simple!
      </p>

      <p>
        You will see a starting node (marked in purple). Your task is to move from one node to
        connected ones to try to collect as many points as possible.
      </p>

      <p>
        <img
          style={{ width: '500px', padding: '30px' }}
          src="images/instructions/image1.png"
          alt="Instructions"
        />
      </p>

      <p>
        You will have 8 steps in every round. On each step, you can either lose or gain points. The
        points you lose or gain with each step are indicated along with the arrows connecting nodes.
      </p>
      <p>
        <b>
          In the end, you will be compensated for the total number of points you gained, so try to
          do as best as you can!
        </b>
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

export default InstructionStepTwo;
