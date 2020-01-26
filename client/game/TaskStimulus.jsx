import React from "react";
import { Fragment } from "react";
import _ from "lodash";

import { Network } from "../components/Network";
import {
  calculateScore,
  findAction,
  isSolutionValid
} from "../../imports/utils";

export default class TaskStimulus extends React.Component {
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

  componentDidMount() {
    const { network } = this.props.round.get("environment");
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
  }

  updateSolution(networkId, actions, requiredSolutionLength) {
    const { network, planningStageDurationInSeconds } = this.props.round.get(
      "environment"
    );
    const isValid = isSolutionValid(actions, requiredSolutionLength);
    const solution = {
      actions,
      networkId,
      isValid,
      planningStageDurationInSeconds,
      totalReward: isValid
        ? calculateScore(actions)
        : network.missingSolutionPenalty
    };
    this.props.player.round.set("solution", solution);
    return solution;
  }

  onNodeClick(targetId) {
    const { round, player } = this.props;
    const { network } = round.get("environment");
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
    const { round, player } = this.props;
    const playerSolution = player.round.get("solution");
    const { network, solutions } = round.get("environment");
    const previousSolution =
      (solutions && solutions.length && solutions[solutions.length - 1]) ||
      null;
    const { nodes, actions, version } = network;
    const nodesById = _.keyBy(nodes, "id");
    return (
      <div className="task-stimulus">
        {network.isPractice && (
          <h2 style={{ color: "green" }}>Practice Round</h2>
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
            <h2>
              {this.isPlanStage() && "Planning Phase"}
              {this.isResponseStage() && "GO!"}
            </h2>
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
            {previousSolution && (
              <div
                style={{
                  height: "500px",
                  width: "250px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  float: "right"
                }}
              >
                <h3>Previous Player's Solution:</h3>
                <div>
                  <table style={{ margin: "auto" }}>
                    {previousSolution.actions.map((action, idx) => (
                      <Fragment key={"solution-action-" + idx}>
                        <tr>
                          <td>{nodesById[action.sourceId].displayName}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>&darr; </td>
                          <td>{action.reward}</td>
                        </tr>
                        {idx === previousSolution.actions.length - 1 && (
                          <tr>
                            <td>{nodesById[action.targetId].displayName}</td>
                            <td></td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </table>

                  <p style={{ marginTop: "20px" }}>
                    Total Reward: {previousSolution.totalReward}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}
