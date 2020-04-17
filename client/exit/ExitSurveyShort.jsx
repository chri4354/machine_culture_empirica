import React from 'react';

import { Centered } from 'meteor/empirica:core';

export default class ExitSurvey extends React.Component {
  static stepName = 'ExitSurvey';
  state = {
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    question7: '',
    question8: '',
  };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { player } = this.props;
    const {
      question1,
      question2,
      question3,
      question4,
      question5,
      question6,
      question7,
      question8,
    } = this.state;

    return (
      <Centered>
        <div className="exit-survey">
          <h1> Exit Survey </h1>
          <p>Please help us to improve the study.</p>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="question1">Did you notice any irregularities in the interface?</label>
            <div>
              <textarea
                dir="auto"
                id="question1"
                name="question1"
                value={question1}
                onChange={this.handleChange}
              />
            </div>

            <label htmlFor="question2">
              Could you make use of the solution provided by the previous player?
            </label>
            <div>
              <textarea
                dir="auto"
                id="question2"
                name="question2"
                value={question2}
                onChange={this.handleChange}
              />
            </div>

            <label htmlFor="question3">
              Please rate the difficulty of the task from 1 (very easy) to 10 (very hard).
            </label>
            <div>
              <textarea
                dir="auto"
                id="question3"
                name="question3"
                value={question3}
                onChange={this.handleChange}
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </Centered>
    );
  }
}
