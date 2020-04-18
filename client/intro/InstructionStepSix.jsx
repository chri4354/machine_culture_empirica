import React from 'react';

import { Centered } from 'meteor/empirica:core';

const InstructionStepSix = ({ hasPrev, hasNext, onNext, onPrev }) => (
  <Centered>
    <div className="instructions">
      <h1> Instructions 6 </h1>
      <p>Each round will last 35 seconds and will contain two phases.</p>
      <p>
        In the first phase you can <b>watch</b> the path of the <b>previous player</b> and the
        number of points they scored. You can also use this phase to plan your own path.
      </p>
      <p>
        In the second phase, you can <b>play yourself</b>.
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

export default InstructionStepSix;
