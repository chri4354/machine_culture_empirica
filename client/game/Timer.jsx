// eslint-disable-next-line import/no-unresolved
import { StageTimeWrapper } from 'meteor/empirica:core';
import React from 'react';

class Timer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { remainingSeconds } = this.props;
    return nextProps.remainingSeconds !== remainingSeconds;
  }

  render() {
    const { remainingSeconds } = this.props;

    const classes = ['timer'];
    if (remainingSeconds <= 5) {
      classes.push('lessThan5');
    } else if (remainingSeconds <= 10) {
      classes.push('lessThan10');
    }

    return (
      <div className={classes.join(' ')}>
        <h4>Timer</h4>
        <span className="seconds">{remainingSeconds}</span>
      </div>
    );
  }
}

export default StageTimeWrapper(Timer);
