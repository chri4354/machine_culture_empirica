/** These function can be used on server and frontend */

export const calculateScore = actions => {
  if (!actions || !actions.length) {
    return 0;
  }

  return actions.reduce((sum, action) => {
    return sum + action.reward;
  }, 0);
};

export const isSolutionValid = (actions, requiredSolutionLength) => {
  return actions && actions.length === requiredSolutionLength;
};

export const findAction = (sourceId, targetId, actions) => {
  return actions.find(action => action.sourceId === sourceId && action.targetId === targetId);
};

export const isPlayerBot = player => {
  return player.bot;
};
