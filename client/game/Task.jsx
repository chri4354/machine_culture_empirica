import React from 'react';

import TaskResponse from './TaskResponse';
import TaskStimulus from './TaskStimulus';

const Task = props => (
  <div className="task">
    <TaskStimulus {...props} />
    <TaskResponse {...props} />
  </div>
);

export default Task;
