import React from 'react';

import { Centered } from 'meteor/empirica:core';

const InstructionStepOne = ({ hasPrev, hasNext, onNext, onPrev }) => (
  <Centered>
    <div className="instructions">
      <h1> Instructions 1 </h1>
      <p>Hi!</p>
      <p>Thank you for participating in our experiment.</p>
      <p>
        On the following pages, you will see the instructions. Please make sure you{' '}
        <b>read them carefully</b>.
      </p>
      <p>Good luck!</p>
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

export default InstructionStepOne;
