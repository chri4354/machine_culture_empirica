import React from 'react';

import { Centered } from 'meteor/empirica:core';

export default class InstructionShort extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions </h1>
          <p>
            In this game you will see a pattern with a starting node (marked in grey) which
            conncects to other nodes. Your task is to move from one node to connected ones to
            collect as many points as possible.
          </p>

          <p>
            <img style={{ width: '500px', padding: '30px' }} src="images/instructions/image1.png" />
          </p>

          <p>
            In each round you will have to make 8 steps. On each step, you can either lose or gain
            points (indicated along with the arrows). The goal is to collect as many points as
            possible. If you don't finish in time there will be a penalty of -500 points. So make
            sure to be quick!
          </p>

          <p>
            {' '}
            Each round will last 30 seconds and contains two phases. First you will have some time
            to plan your steps and in the second phase you can take actions.
          </p>

          <p>Good luck!</p>

          <p>
            {/* <button type="button" onClick={onPrev} disabled={!hasPrev}>
              Previous
            </button> */}
            <button type="button" onClick={onNext} disabled={false}>
              Start
            </button>
          </p>
        </div>
      </Centered>
    );
  }
}
