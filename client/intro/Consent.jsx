import React from 'react';

import { Centered, ConsentButton } from 'meteor/empirica:core';

export default class Consent extends React.Component {
  render() {
    return (
      <Centered>
        <div className="consent">
          <h1> Consent Form </h1>
          <p>
            This experiment is part of a scientific project at the Max Planck Institute for Human
            Development in Berlin. Your decision to participate in this experiment is entirely
            voluntary. There are no known or anticipated risks to participating in this experiment.
            There is no way for us to identify you. The only information we will store, in addition
            to your responses, is the timestamps of your interactions with our site. The results of
            our research may be presented at scientific meetings or published in scientific
            journals. The study data may be made publicly accessible via research databases or
            scientific publications. Please note the publicly accessible data may also be used for
            purposes going beyond this particular study.
          </p>
          <p>
            You will receive a base payment through Prolific for participating. In addition, in some
            studies, you may earn a bonus depending on your performance. You may exit the study at
            any time before the end and will receive partial compensation. By clicking on the
            ‘AGREE’ button, you confirm that you are at least 18 years of age and agree to
            participate voluntarily.
          </p>
          <br />
          <ConsentButton text="I AGREE" />
        </div>
      </Centered>
    );
  }
}
