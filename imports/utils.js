/** These function can be used on server and frontend */

export const calculateReward = (network, solution) => {
  if (!solution || !solution.length) {
    return 0;
  }

  // TODO
  return 10;
};

export const isPlayerBot = player => {
  return player.bot;
};
