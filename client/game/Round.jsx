import React from 'react';

import PlayerProfile from './PlayerProfile';
import SocialExposure from './SocialExposure';
import Task from './Task';

const Round = ({ round, stage, player, game }) => (
  <div className="round">
    <div className="content">
      <PlayerProfile player={player} stage={stage} game={game} />
      <Task game={game} round={round} stage={stage} player={player} />
      <SocialExposure stage={stage} player={player} game={game} />
    </div>
  </div>
);

export default Round;
