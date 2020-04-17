import React from 'react';

const TaskResponse = ({ player }) => {
  const handleSubmit = event => {
    event.preventDefault();
    player.stage.submit();
  };

  const renderSubmitted = () => {
    return (
      <div className="task-response">
        <div className="response-submitted">
          <h5>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  };

  // If the player already submitted, don't show the slider or submit button
  if (player.stage.submitted) {
    return renderSubmitted();
  }

  return (
    <div className="task-response">
      <form style={{ textAlign: 'right' }} onSubmit={handleSubmit}>
        {/* <button type="submit">Submit</button> */}
      </form>
    </div>
  );
};

export default TaskResponse;
