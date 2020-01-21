import React from "react";

import { Centered } from "meteor/empirica:core";

export default class InstructionStepTwo extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1> Instructions 2 </h1>
          <p>
            In each round, you will see 6 circles, each marked be letters from A
            to F. From each circle, there are two options to go to another
            circle, marked by a line with an arrow pointing to the circle you
            can reach.
          </p>

          <p>
            Each line has a point assigned to it. If you take the one with
            “+20”, you will collect 20 points. If you take the one with “-20”,
            you will lose 20 points.
          </p>

          <p>
            <img
              style={{ width: "500px", padding: "30px" }}
              src="images/instructions/network.png"
            />
          </p>

          <p>
            You will be shown the starting circle before each round, and your
            task is to collect the highest number of points you can by moving 8
            times from the starting circ
          </p>
          <p>
            You will be told, which is the starting circle before each round,
            and your task is to collect the highest number of points you can by
            moving 8 times from the starting circ
          </p>
          <p>
            To gain the most points, you will have to think about the path you
            want to take before!
          </p>
          <p>
            You will have some time to look at the graph first (you will see the
            countdown clock on the left). When the clock resets, you will be
            allowed to make your choice. Make sure you submit your answer on
            time!
          </p>
          <p>
            If you do not make any choice in time you will lose (the maximum
            amount of points you can lose in this round).
          </p>
          <p>Each point you collect worth about £x.x</p>
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
