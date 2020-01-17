import React from "react";
import { Fragment } from "react";
import _ from "lodash";

import { Network } from "../components/Network";
import { calculateScore, findAction } from "../../imports/utils";

export default class TaskStimulus extends React.Component {
  state = {};

  isPlanning() {
    return this.props.stage.name === "plan";
  }

  componentDidMount() {
    const { network, solutions } = this.props.round.get("environment");
    this.setState(() => ({
      activeNodeId: network.startingNodeId,
      numberOfActionsRemaining: network.requiredSolutionLength,
      roundScore: 0
    }));
  }

  onNodeClick(targetId) {
    const { round, player } = this.props;
    const { network } = round.get("environment");
    const { actions, requiredSolutionLength } = network;
    if (this.isPlanning() || this.state.numberOfActionsRemaining === 0) {
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
    let solution = player.round.get("solution");
    if (!solution) {
      solution = {
        networkId: network.id,
        actions: [],
        totalReward: 0
      };
    }
    const solutionActions = [...solution.actions, { ...action }];
    player.round.set("solution", {
      ...solution,
      actions: solutionActions,
      totalReward: calculateScore(solutionActions)
    });
    const numberOfActionsRemaining = Math.max(
      requiredSolutionLength - solutionActions.length,
      0
    );
    this.setState(() => ({
      activeNodeId: targetId,
      lastScoreReceived: action.reward,
      numberOfActionsRemaining,
      roundScore: calculateScore(solutionActions)
    }));

    if (numberOfActionsRemaining === 0) {
      player.stage.submit();
    }
  }

  render() {
    const { round } = this.props;
    const { network, solutions } = round.get("environment");
    const previousSolution =
      (solutions && solutions.length && solutions[solutions.length - 1]) ||
      null;
    const {
      nodes,
      actions,
      startingNodeId,
      requiredSolutionLength,
      version
    } = network;
    const nodesById = _.keyBy(nodes, "id");
    return (
      <div className="task-stimulus">
        <h2>
          Find a path of {requiredSolutionLength} steps, starting from Node{" "}
          {nodes.find(n => n.id === startingNodeId).displayName}. The larger the
          reward, the better.
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
            <span className="round-stat-value">{this.state.roundScore}</span>
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
          isDisabled={this.isPlanning()}
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
      </div>
    );
  }
}
