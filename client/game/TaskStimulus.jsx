import React, { useState, useEffect } from 'react';

import GameCanvas from '../components/GameCanvas';
import { isSolutionValid, calculateScore } from '../../imports/utils';

const TaskStimulus = ({ game, stage, round, player, remainingSeconds }) => {
  const stageName = stage.name;
  const stageDisplayName = stage.displayName;
  const isPlanStage = stageName === 'plan';
  const isReviewStage = stageName === 'review';
  const isResponseStage = stageName === 'response';
  const isPractice = round.get('isPractice');
  const experimentName = game.get('experimentName');
  const missingSolutionPenalty = game.get('missingSolutionPenalty');
  const previousSolutionInChain = player.round.get('previousSolutionInChain');
  const previousSolutionInChainScore = previousSolutionInChain.totalReward;
  const previousSolutionInChainActions = previousSolutionInChain.actions;
  const playerSolution = player.round.get('solution');
  const seed = player.round.get('seed');
  const chain = player.round.get('chain');
  const maxPlayerActions = game.get('globalFactors').numberOfActionsPerRound;

  const [currentPlayerActions, setCurrentPlayerActions] = useState([]);
  const [lastScoreReceived, setLastScoreReceived] = useState(null);
  const [totalReward, setTotalReward] = useState(0);

  const updateSolution = actions => {
    const isValid = isSolutionValid(actions, maxPlayerActions);
    const solution = {
      actions,
      seed,
      experimentName,
      isValid,
      chainId: chain._id,
      previousSolutionId: previousSolutionInChain._id,
      timeElapsedInSeconds: isValid ? stage.durationInSeconds - remainingSeconds : null,
      totalReward: isValid ? calculateScore(actions) : missingSolutionPenalty,
    };
    player.round.set('solution', solution);
    return solution;
  };

  const addAction = mousePosition => {
    if (currentPlayerActions.length < maxPlayerActions) {
      Meteor.call('newAction', seed, experimentName, mousePosition, async (error, newAction) => {
        const newPlayerActionArray = [
          ...currentPlayerActions,
          { ...newAction, step: currentPlayerActions.length + 1 },
        ];

        setCurrentPlayerActions(newPlayerActionArray);

        setLastScoreReceived(newAction.reward);

        setTotalReward(newPlayerActionArray.reduce((acc, curr) => acc + curr.reward, 0));

        const solution = updateSolution(newPlayerActionArray);

        if (solution.isValid) {
          player.stage.submit();
        }
      });
    }
  };

  useEffect(() => {
    if (isResponseStage) {
      // Create an empty solution when response stage starts
      updateSolution([]);
    }
  }, [isResponseStage]);

  return (
    <div className="task-stimulus">
      <h1 style={{ color: 'green' }}>{stageDisplayName}</h1>
      {isPractice && !isReviewStage && <h2 style={{ color: 'red' }}>This is a trial round.</h2>}
      {isReviewStage && (
        <div>
          {!playerSolution.isValid && (
            <h2>
              Oh no! You were too slow! You received{' '}
              <span style={{ color: 'red' }}>{missingSolutionPenalty}</span> points penalty.
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
