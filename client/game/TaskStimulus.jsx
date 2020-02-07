import React from "react";
import { StageTimeWrapper } from "meteor/empirica:core";
import _ from "lodash";

import Network from "../components/Network2";
import {
  calculateScore,
  findAction,
  isSolutionValid
} from "../../imports/utils";

class TaskStimulus extends React.Component {
  state = {};

  isPlanStage() {
    return this.props.stage.name === "plan";
  }

  isReviewStage() {
    return this.props.stage.name === "review";
  }

  isResponseStage() {
    return this.props.stage.name === "response";
  }

  getNetwork() {
    return this.props.player.round.get("network");
  }

  getPreviousSolutionInChain() {
    return this.props.player.round.get("previousSolutionInChain");
  }

  async componentDidMount() {
    const network = this.getNetwork();
    if (!this.isReviewStage()) {
      this.setState({
        activeNodeId: network.startingNodeId,
        numberOfActionsRemaining: network.requiredSolutionLength,
        roundScore: 0
      });
    }
    if (this.isResponseStage()) {
      this.updateSolution(network.id, [], network.requiredSolutionLength);
    }
    if (this.isPlanStage()) {
      // run animation of previous solution
      const previousSolutionInChain = this.getPreviousSolutionInChain();
      const { actions } = previousSolutionInChain;
      for (const action of actions) {
        const that = this;
        await new Promise(function(resolve) {
          setTimeout(() => {
            that.setState({
              activeNodeId: action.sourceId
            });
            resolve();
          }, 1.5 * 1000);
        });
      }

      // Show the use a static image of the network
      this.setState({
        activeNodeId: network.startingNodeId
      });
    }
  }

  updateSolution(networkId, actions, requiredSolutionLength) {
    const network = this.getNetwork();
    const {
      planningStageDurationInSeconds,
      responseStageDurationInSeconds,
      reviewStageDurationInSeconds
    } = this.props.round.get("environment");
    const isValid = isSolutionValid(actions, requiredSolutionLength);
    const solution = {
      actions,
      networkId,
      isValid,
      planningStageDurationInSeconds,
      responseStageDurationInSeconds,
      reviewStageDurationInSeconds,
      timeElapsedInSeconds:
        this.props.stage.durationInSeconds - this.props.remainingSeconds,
      totalReward: isValid
        ? calculateScore(actions)
        : network.missingSolutionPenalty
    };
    this.props.player.round.set("solution", solution);
    return solution;
  }

  onNodeClick(targetId) {
    const { player } = this.props;
    if (player.stage.submitted) {
      // prevents the user from double clicking on the final node and recording an extra action
      return;
    }
    const network = this.getNetwork();
    const { actions, requiredSolutionLength } = network;
    if (!this.isResponseStage() || this.state.numberOfActionsRemaining === 0) {
      return;
    }
    const action = findAction(this.state.activeNodeId, targetId, actions);
    if (!action) {
      this.setState({
        invalidClickNodeId: targetId
      });
      setTimeout(() => {
        this.setState({
          invalidClickNodeId: null
        });
      }, 500);
      return;
    }
    const solution = this.updateSolution(
      network.id,
      [...player.round.get("solution").actions, { ...action }],
      requiredSolutionLength
    );
    if (solution.isValid) {
      player.stage.submit();
      return;
    }
    this.setState(() => ({
      activeNodeId: targetId,
      lastScoreReceived: action.reward,
      numberOfActionsRemaining: Math.max(
        network.requiredSolutionLength - solution.actions.length,
        0
      ),
      roundScore: calculateScore(solution.actions)
    }));
  }

  render() {
    const { player } = this.props;
    const playerSolution = player.round.get("solution");
    const network = this.getNetwork();
    const { nodes, actions, version } = network;
    // const nodesById = _.keyBy(nodes, "id");
    return (
      <div className="task-stimulus">
        {network.experimentName === "practice" && !this.isReviewStage() && (
          <h2 style={{ color: "red" }}>
            This is a trial round. You will have more time to complete this
            round.
          </h2>
        )}
        {this.isReviewStage() && (
          <div>
            {!playerSolution.isValid && (
              <h2>
                Oh no! You were too slow! You received{" "}
                {network.missingSolutionPenalty} points penalty.
              </h2>
            )}
            {playerSolution.isValid && (
              <h2>
                Great Job! You scored {player.round.get("solution").totalReward}{" "}
                points!
              </h2>
            )}
          </div>
        )}
        {(this.isPlanStage() || this.isResponseStage()) && (
          <>
            <h1 style={{ color: "green" }}>
              {this.isPlanStage() && "Planning Phase"}
              {this.isResponseStage() && "GO!"}
            </h1>
            <div>
              <div className="round-stat">
                <h4>Number of steps remaining: </h4>
                <span className="round-stat-value">
                  {this.state.numberOfActionsRemaining}
                </span>
              </div>
              <div className="round-stat">
                <h4>Round Score: </h4>
                <span className="round-stat-value">
                  {this.state.roundScore}
                </span>
              </div>
              <div className="round-stat">
                <h4>Last Score Received: </h4>
                <span className="round-stat-value">
                  {this.state.lastScoreReceived || "--"}
                </span>
              </div>
            </div>
            <Network
              nodes={nodes}
              version={version}
              activeNodeId={this.state.activeNodeId}
              isDisabled={this.isPlanStage()}
              invalidClickNodeId={this.state.invalidClickNodeId}
              onNodeClick={targetId => this.onNodeClick(targetId)}
              actions={actions}
            />
          </>
        )}
      </div>
    );
  }
}

export default StageTimeWrapper(TaskStimulus);
