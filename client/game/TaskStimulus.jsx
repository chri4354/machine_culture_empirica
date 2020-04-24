import React, { useState } from 'react';

import GameCanvas from '../components/GameCanvas';

const TaskStimulus = ({ game, stage, round, player }) => {
  const stageName = stage.name;
  const stageDisplayName = stage.displayName;
  const isPlanStage = stageName === 'plan';
  const isReviewStage = stageName === 'review';
  const isResponseStage = stageName === 'response';
  const isPractice = round.get('isPractice');
  const previousSolutionInChain = player.round.get('previousSolutionInChain');
  const previousSolutionInChainScore = previousSolutionInChain.totalReward;
  const previousSolutionInChainActions = previousSolutionInChain.actions;
  const playerSolution = player.round.get('solution');
  const seed = player.round.get('seed');
  const maxPlayerActions = game.get('globalFactors').numberOfActionsPerRound;

  const [currentPlayerActions, setCurrentPlayerActions] = useState([]);
  const [lastScoreReceived, setLastScoreReceived] = useState(null);
  const [totalReward, setTotalReward] = useState(0);

  const addAction = mousePosition => {
    if (currentPlayerActions.length < maxPlayerActions) {
      Meteor.call('newAction', seed, mousePosition, async (error, newAction) => {
        const newPlayerActionArray = [
          ...currentPlayerActions,
          { ...newAction, step: currentPlayerActions.length + 1 },
        ];
        setCurrentPlayerActions(newPlayerActionArray);

        setLastScoreReceived(newAction.reward);

        setTotalReward(newPlayerActionArray.reduce((acc, curr) => acc + curr.reward, 0));
      });
    }
  };

  return (
    <div className="task-stimulus">
      <h1 style={{ color: 'green' }}>{stageDisplayName}</h1>
      {isPractice && !isReviewStage && <h2 style={{ color: 'red' }}>This is a trial round.</h2>}
      {isReviewStage && (
        <div>
          {!playerSolution.isValid && (
            <h2>
              {/* TODO: Penalty */}
              Oh no! You were too slow! You received &apos;missingSolutionPenalty&apos; points
              penalty.
            </h2>
          )}
          {playerSolution.isValid && (
            <h2>Great Job! You scored {playerSolution.totalReward} points!</h2>
          )}
        </div>
      )}
      {isResponseStage && (
        <div>
          <div className="round-stat">
            <h4>Number of steps remaining: </h4>
            <span className="round-stat-value">
              {maxPlayerActions - currentPlayerActions.length}
            </span>
          </div>
          <div className="round-stat">
            <h4>Round Score: </h4>
            <span className="round-stat-value">{totalReward}</span>
          </div>
          <div className="round-stat">
            <h4>Last Score Received: </h4>
            <span className="round-stat-value">{lastScoreReceived || '--'}</span>
          </div>
        </div>
      )}
      {isPlanStage && (
        <h2>
          The previous player scored {previousSolutionInChainScore} points. Watch what he did:
        </h2>
      )}
      {(isPlanStage || isResponseStage) && (
        <GameCanvas
          previousPlayerActions={previousSolutionInChainActions}
          currentPlayerActions={currentPlayerActions}
          isPlanStage={isPlanStage}
          playerCanAdd={isResponseStage && currentPlayerActions.length < maxPlayerActions}
          addAction={addAction}
        />
      )}
    </div>
  );
};

export default TaskStimulus;
