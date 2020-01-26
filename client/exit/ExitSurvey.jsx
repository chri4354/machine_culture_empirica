import React from "react";

import { Centered } from "meteor/empirica:core";

export default class ExitSurvey extends React.Component {
  static stepName = "ExitSurvey";
  state = {
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: ""
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
      question8
    } = this.state;

    return (
      <Centered>
        <div className="exit-survey">
          <h1> Exit Survey </h1>
          <p>
            Please answer the following short survey. You do not have to provide
            any information you feel uncomfortable with.
          </p>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="question1">
              Did you notice any irregularities in the interface?
            </label>
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
              Did you get too exhausted to focus on the task? (Y/N) When did you
              notice your loss of focus?
            </label>
            <br />
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
              How many options did you consider before making a decision?
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

            <label htmlFor="question4">
              Did you follow a strategy? If yes, please describe briefly:
            </label>
            <div>
              <textarea
                dir="auto"
                id="question4"
                name="question4"
                value={question4}
                onChange={this.handleChange}
              />
            </div>

            <label htmlFor="question5">
              Please rate the difficulty of the task from 1 (very easy) to 10
              (very hard).
            </label>
            <div>
              <textarea
                dir="auto"
                id="question5"
                name="question5"
                value={question5}
                onChange={this.handleChange}
              />
            </div>

            <label htmlFor="question6">
              Did you experience the time as sufficient to concentrate on each
              trial?
            </label>
            <div>
              <textarea
                dir="auto"
                id="question6"
                name="question6"
                value={question6}
                onChange={this.handleChange}
              />
            </div>

            <label htmlFor="question7">
              Did you guess the purpose of this experiment? Please describe
              briefly:
            </label>
            <div>
              <textarea
                dir="auto"
                id="question7"
                name="question7"
                value={question7}
                onChange={this.handleChange}
              />
            </div>

            <label htmlFor="question8">
              Do you have any additional comments on the experiment?
            </label>
            <div>
              <textarea
                dir="auto"
                id="question8"
                name="question8"
                value={question8}
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
