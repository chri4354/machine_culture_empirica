import React from 'react';

import { Centered } from 'meteor/empirica:core';

const Radio = ({ selected, name, value, label, onChange }) => (
  <label>
    <input
      type="radio"
      name={name}
      value={value}
      checked={selected === value}
      onChange={onChange}
    />
    {label}
  </label>
);

const trueValue = 'true';
const falseValue = 'false';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);

    this.state = { question1: '', question2: '', question3: '', question4: '' };
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value.trim().toLowerCase() });
  };

  handleSubmit = event => {
    const { onNext } = this.props;
    const { question1, question2, question3, question4 } = this.state;
    event.preventDefault();
    if (
      question1 !== falseValue ||
      question2 !== trueValue ||
      question3 !== falseValue ||
      question4 !== trueValue
    ) {
      // eslint-disable-next-line no-alert
      alert('Incorrect! Read the instructions, and please try again.');
    } else {
      onNext();
    }
  };

  render() {
    const { hasPrev, onPrev } = this.props;
    const { question1, question2, question3, question4 } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <div className="question-group">
              <label>I will have unlimited time to submit my answer in each round:</label>
              <div>
                <Radio
                  selected={question1}
                  name="question1"
                  value={trueValue}
                  label="True"
                  onChange={this.handleChange}
                />
                <Radio
                  selected={question1}
                  name="question1"
                  value={falseValue}
                  label="False"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="question-group">
              <label>It is better to finish on time even if it is only a random solution:</label>
              <div>
                <Radio
                  selected={question2}
                  name="question2"
                  value={trueValue}
                  label="True"
                  onChange={this.handleChange}
                />
                <Radio
                  selected={question2}
                  name="question2"
                  value={falseValue}
                  label="False"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="question-group">
              <label>I can start from any circle I choose:</label>
              <div>
                <Radio
                  selected={question3}
                  name="question3"
                  value={trueValue}
                  label="True"
                  onChange={this.handleChange}
                />
                <Radio
                  selected={question3}
                  name="question3"
                  value={falseValue}
                  label="False"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="question-group">
              <label>
                The sum of the points between the circles I choose is my total score for the round:
              </label>
              <div>
                <Radio
                  selected={question4}
                  name="question4"
                  value={trueValue}
                  label="True"
                  onChange={this.handleChange}
                />
                <Radio
                  selected={question4}
                  name="question4"
                  value={falseValue}
                  label="False"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <p>
              <button type="button" onClick={onPrev} disabled={!hasPrev}>
                Back to instructions
              </button>
              <button type="submit">Submit</button>
            </p>
          </form>
        </div>
      </Centered>
    );
  }
}
