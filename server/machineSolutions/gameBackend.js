import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';
import { getRandomClickAction, pixelsFrom0to1 } from '../utils';

export const fetchReward = async (seed, position) => {
  const data = {
    requestId: uuidv4(),
    data: {
      action: position,
      environment: {
        type: 'catwell',
        version: '1',
        experimentName: 'test',
        seed,
      },
    },
  };

  logger.log({
    level: 'debug',
    message: `Fetching reward value for with params: ${JSON.stringify(data)}`,
  });

  const response = await axios({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data,
    url: `${Meteor.settings.gameBackendUrl}/eval`,
  });

  const {
    data: {
      data: { x, y, reward },
    },
  } = response;

  return { x, y, reward: Math.round(reward) };
};

export const fetchRandomReward = ({ seed }) => fetchReward(seed, getRandomClickAction());

Meteor.methods({
  async newAction(seed, { x, y }) {
    logger.log({
      level: 'debug',
      message: `Called calculate reward from Frontend in seed ${seed} and position ${JSON.stringify(
        { x: pixelsFrom0to1(x), y: pixelsFrom0to1(y) }
      )}`,
    });

    const reward = await fetchReward(seed, { x: pixelsFrom0to1(x), y: pixelsFrom0to1(y) });

    return reward;
  },
});
