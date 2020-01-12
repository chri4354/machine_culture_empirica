/** These function can be used on server and frontend */

export const calculateReward = (network, solution) => {
  if (!solution || !solution.length) {
    return 0;
  }

  // TODO
  return 10;
};

export const isValidStep = (sourceId, targetId, actions) => {
  return actions.some(
    action => action.sourceId === sourceId && action.targetId === targetId
  );
};

const getPossibleActionsFromSourceNode = (sourceId, actions) => {
  return actions.find(action => action.sourceId === sourceId);
};

export const isPlayerBot = player => {
  return player.bot;
};
