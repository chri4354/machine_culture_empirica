import React from "react";

import { Network } from "../components/Network";
import { calculateScore, findAction } from "../../imports/utils";

export default class TaskStimulus extends React.Component {
  state = {};

  componentDidMount() {
    const network = this.props.round.get("network");
    this.setState(() => ({
      activeNodeId: network.startingNodeId,
      numberOfActionsRemaining: network.requiredSolutionLength,
      roundScore: 0
    }));
  }

  onNodeClick(targetId) {
    const { round, player } = this.props;
    const network = round.get("network");
    const { actions, requiredSolutionLength } = network;
    if (this.state.numberOfActionsRemaining === 0) {
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
        environmentId: 1, // TODO
        actions: []
      };
    }
    const solutionActions = [...solution.actions, { ...action }];
    player.round.set("solution", {
      ...solution,
      actions: solutionActions
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
    const network = round.get("network");
    const { nodes, actions, startingNodeId, requiredSolutionLength } = network;
    const description = `Find a path of ${requiredSolutionLength} steps, starting from node "${
      nodes.find(n => n.id === startingNodeId).displayName
    }". The larger the reward, the better.`;
    return (
      <div className="task-stimulus">
        <p>{description}</p>
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
            <h4>
              {this.state.lastScoreReceived && (
                <span>
                  <h4>Last Score Received: </h4>
                  <span className="round-stat-value">
                    {this.state.lastScoreReceived}
                  </span>
                </span>
              )}
            </h4>
          </div>
        </div>
        <Network
          nodes={nodes}
          activeNodeId={this.state.activeNodeId}
          invalidClickNodeId={this.state.invalidClickNodeId}
          onNodeClick={targetId => this.onNodeClick(targetId)}
          actions={actions}
        />
      </div>
    );
  }
}
