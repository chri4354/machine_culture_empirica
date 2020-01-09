export const calculateReward = (network, path) => {
  if (!path || !path.length) {
    return 0;
  }

  // TODO
  return 10;
};

export const isPlayerBot = player => {
  return player.bot;
};
