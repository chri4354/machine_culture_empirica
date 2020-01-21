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
    question8: "",
    question9: ""
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
      question9
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
            <div className="form-line">
              <label htmlFor="question1">
                Did you try to find the best path throughout all the trials?
                (This will not reflect on your Prolific Score, but will help us
                to evaluate the data better)
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
            </div>

            <div className="form-line">
              <label htmlFor="question2">
                How many options did you consider before making a decision?
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
            </div>

            <div className="form-line">
              <label htmlFor="question3">
                Have you had a strategy? If yes please describe briefly:
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
            </div>

            <div className="form-line">
              <label htmlFor="question4">
                Please rate the difficulty of the task from 1 (very easy) to 10
                (very hard).
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
            </div>

            <div className="form-line">
              <label htmlFor="question5">
                Did you experience the time as sufficient to concentrate on each
                trial?
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
            </div>

            <div className="form-line">
              <label htmlFor="question6">
                Would you have considered more options, had it been more time
                available?
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
            </div>

            <div className="form-line">
              <label htmlFor="question7">
                Did you guess what the purpose of this experiment? Please
                describe briefly:
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
            </div>

            <div className="form-line">
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
            </div>

            <div className="form-line">
              <label htmlFor="question9">
                Did you notice any irregularities?
              </label>
              <div>
                <textarea
                  dir="auto"
                  id="question9"
                  name="question9"
                  value={question9}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </Centered>
    );
  }
}
