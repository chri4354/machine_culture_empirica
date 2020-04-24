/* eslint-disable react/sort-comp */
/* eslint-disable no-await-in-loop */
import React from 'react';

import Network from '../../components/deprecated/Network2';
import { calculateScore, findAction, isSolutionValid } from '../../../imports/utils';

class OldTaskStimulus extends React.Component {
  planningDelayBeforeAnimationMs = 1.5 * 1000;

  constructor(props) {
    super(props);

    this.state = {
      planningAnimationTargetNodeId: null,
      animationTarget: false,
      animationLink: false,
      animationSource: true,
      numberOfActionsTaken: 0,
    };
  }

  getStageName() {
    const { stage } = this.props;
    return stage.name;
  }

  getStageDisplayName() {
    const { stage } = this.props;
    return stage.displayName;
  }

  isPlanStage() {
    return this.getStageName() === 'plan';
  }

  isPractice() {
    const { round } = this.props;
    return round.get('isPractice');
  }

  isReviewStage() {
    return this.getStageName() === 'review';
  }

  isResponseStage() {
    return this.getStageName() === 'response';
  }

  getChain() {
    const { player } = this.props;
    return player.round.get('chain');
  }

  getPreviousSolutionAnimationDurationInSeconds() {
    return this.getChain().previousSolutionAnimationDurationInSeconds;
  }

  getEnvironment() {
    const { player } = this.props;
    return player.round.get('environment');
  }

  getPreviousSolutionInChain() {
    const { player } = this.props;
    return player.round.get('previousSolutionInChain');
  }

  getPreviousSolutionInChainScore() {
    return this.getPreviousSolutionInChain().totalReward;
  }

  async componentDidMount() {
    const { startingNodeId, requiredSolutionLength } = this.getEnvironment();
    if (this.isResponseStage()) {
      this.setState({
        activeNodeId: startingNodeId,
        numberOfActionsRemaining: requiredSolutionLength,
        roundScore: 0,
      });
    }
    if (this.isResponseStage()) {
      this.updateSolution([], requiredSolutionLength);
    }
    if (this.isPlanStage()) {
      // run animation of previous solution
      const previousSolutionInChain = this.getPreviousSolutionInChain();
      const { actions } = previousSolutionInChain;
      if (actions && actions.length) {
        this.setState({
          activeNodeId: actions[0].sourceId,
          isDisplayNetworkForPlanningStage: false,
          planningAnimationTargetNodeId: null,
        });
      }

      const that = this;
      await new Promise(resolve => {
        setTimeout(() => {
          that.setState({
            isDisplayNetworkForPlanningStage: true,
          });
          resolve();
        }, that.planningDelayBeforeAnimationMs);
      });
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1 * 1000);
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const action of actions) {
        const durationOfIterationMs =
          (this.getPreviousSolutionAnimationDurationInSeconds() / actions.length) * 1000;
        const numberOfAnimationsStepsPerIteration = 4;
        const durationOfAnimationStepMs =
          durationOfIterationMs / numberOfAnimationsStepsPerIteration;
        await new Promise(resolve => {
          setTimeout(() => {
            that.setState({
              activeNodeId: action.sourceId,
              planningAnimationTargetNodeId: action.targetId,
              animationLink: true,
              animationTarget: false,
              animationSource: true,
            });
            resolve();
          }, 0.1 * durationOfAnimationStepMs);
        });
        await new Promise(resolve => {
          setTimeout(() => {
            that.setState({
              animationTarget: true,
            });
            resolve();
          }, 0.1 * durationOfAnimationStepMs);
        });
        await new Promise(resolve => {
          setTimeout(() => {
            that.setState({
              animationLink: true,
              animationSource: false,
            });
            resolve();
          }, 0.1 * durationOfAnimationStepMs);
        });
        await new Promise(resolve => {
          setTimeout(() => {
            that.setState(prevState => ({
              animationLink: false,
              animationSource: false,
              numberOfActionsTaken: prevState.numberOfActionsTaken + 1,
            }));
            resolve();
          }, 1 * durationOfAnimationStepMs);
        });
      }
      that.setState({
        activeNodeId: null,
        planningAnimationTargetNodeId: null,
      });
      await new Promise(resolve => {
        setTimeout(() => {
          that.setState({
            activeNodeId: startingNodeId,
            planningAnimationTargetNodeId: null,
            numberOfActionsTaken: 0,
          });
          resolve();
        }, 1 * 1000);
      });

      // Show the use a static image of the environment
    }
  }

  updateSolution(actions, requiredSolutionLength) {
    const { stage, remainingSeconds, player } = this.props;
    const {
      environmentId,
      experimentName,
      experimentEnvironmentId,
      missingSolutionPenalty,
      networkId,
    } = this.getEnvironment();
    const chain = this.getChain();
    const previousSolution = this.getPreviousSolutionInChain();
    const isValid = isSolutionValid(actions, requiredSolutionLength);
    const solution = {
      actions,
      environmentId,
      experimentEnvironmentId,
      experimentName,
      isValid,
      networkId,
      chainId: chain._id,
      previousSolutionId: previousSolution._id,
      timeElapsedInSeconds: isValid ? stage.durationInSeconds - remainingSeconds : null,
      totalReward: isValid ? calculateScore(actions) : missingSolutionPenalty,
    };
    player.round.set('solution', solution);
    return solution;
  }

  onNodeClick(targetId) {
    const { numberOfActionsRemaining, activeNodeId } = this.state;
    const { player } = this.props;
    if (player.stage.submitted) {
      // prevents the user from double clicking on the final node and recording an extra action
      return;
    }
    const { actions, requiredSolutionLength } = this.getEnvironment();
    if (!this.isResponseStage() || numberOfActionsRemaining === 0) {
      return;
    }
    const action = findAction(activeNodeId, targetId, actions);
    if (!action) {
      this.setState({
        invalidClickNodeId: targetId,
      });
      setTimeout(() => {
        this.setState({
          invalidClickNodeId: null,
        });
      }, 500);
      return;
    }
    const solution = this.updateSolution(
      [...player.round.get('solution').actions, { ...action }],
      requiredSolutionLength
    );
    if (solution.isValid) {
      player.stage.submit();
      return;
    }
    this.setState(prevState => ({
      activeNodeId: targetId,
      lastScoreReceived: action.reward,
      numberOfActionsTaken: prevState.numberOfActionsTaken + 1,
      numberOfActionsRemaining: Math.max(requiredSolutionLength - solution.actions.length, 0),
      roundScore: calculateScore(solution.actions),
    }));
  }

  render() {
    const {
      numberOfActionsRemaining,
      roundScore,
      lastScoreReceived,
      isDisplayNetworkForPlanningStage,
      planningAnimationTargetNodeId,
      animationLink,
      animationTarget,
      animationSource,
      activeNodeId,
      invalidClickNodeId,
      numberOfActionsTaken,
    } = this.state;
    const { player } = this.props;

    const playerSolution = player.round.get('solution');
    const {
      actions,
      missingSolutionPenalty,
      nodes,
      version,
      startingNodeId,
    } = this.getEnvironment();
    return (
      <div className="task-stimulus">
        <h1 style={{ color: 'green' }}>{this.getStageDisplayName()}</h1>
        {this.isPractice() && !this.isReviewStage() && (
          <h2 style={{ color: 'red' }}>This is a trial round.</h2>
        )}
        {this.isReviewStage() && (
          <div>
            {!playerSolution.isValid && (
              <h2>
                Oh no! You were too slow! You received {missingSolutionPenalty} points penalty.
              </h2>
            )}
            {playerSolution.isValid && (
              <h2>Great Job! You scored {player.round.get('solution').totalReward} points!</h2>
            )}
          </div>
        )}
        {this.isResponseStage() && (
          <>
            <div>
              <div className="round-stat">
                <h4>Number of steps remaining: </h4>
                <span className="round-stat-value">{numberOfActionsRemaining}</span>
              </div>
              <div className="round-stat">
                <h4>Round Score: </h4>
                <span className="round-stat-value">{roundScore}</span>
              </div>
              <div className="round-stat">
                <h4>Last Score Received: </h4>
                <span className="round-stat-value">{lastScoreReceived || '--'}</span>
              </div>
            </div>
          </>
        )}
        {this.isPlanStage() && (
          <>
            <h2>
              The previous player scored {this.getPreviousSolutionInChainScore()} points. Watch the
              path.
            </h2>
          </>
        )}
        {((this.isPlanStage() && isDisplayNetworkForPlanningStage) || this.isResponseStage()) && (
          <Network
            nodes={nodes}
            version={version}
            planningAnimationTargetNodeId={planningAnimationTargetNodeId}
            animationLink={animationLink}
            animationTarget={animationTarget}
            animationSource={animationSource}
            activeNodeId={activeNodeId}
            isDisabled={this.isPlanStage()}
            startingNodeId={startingNodeId}
            invalidClickNodeId={invalidClickNodeId}
            numberOfActionsTaken={numberOfActionsTaken}
            onNodeClick={targetId => this.onNodeClick(targetId)}
            actions={actions}
          />
        )}
      </div>
    );
  }
}

export default OldTaskStimulus;
