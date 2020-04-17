import React from 'react';

import Timer from './Timer';

const PlayerProfile = ({ player, stage }) => {
  const renderProfile = () => (
    <div className="profile-score">
      <h3>Your Profile</h3>
      <img src={player.get('avatar')} className="profile-avatar" alt="avatar" />
    </div>
  );

  const renderScore = () => (
    <div className="profile-score">
      <h4>Total score</h4>
      <span>{(player.get('score') || 0).toFixed(2)}</span>
    </div>
  );

  return (
    <aside className="player-profile">
      {renderProfile()}
      {renderScore()}
      <Timer stage={stage} />
    </aside>
  );
};

export default PlayerProfile;
