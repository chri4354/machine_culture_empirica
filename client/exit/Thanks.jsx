import React from 'react';

const Thanks = () => (
  <div className="finished">
    <div>
      <h4>Finished!</h4>
      <p>Thank you for your participation! You have successfully finished the game.</p>
      <p>Please click on the link below to confirm your submission:</p>
      <p>
        <a href="https://app.prolific.co/submissions/complete?cc=11609A30">
          https://app.prolific.co/submissions/complete?cc=11609A30
        </a>
      </p>
    </div>
  </div>
);

Thanks.stepName = 'Thanks';

export default Thanks;
