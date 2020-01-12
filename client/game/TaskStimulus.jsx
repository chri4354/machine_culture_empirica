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

  render() {
    const { round, stage, player } = this.props;
    const network = round.get("network");
    const { nodes, actions, startingNodeId, requiredSolutionLength } = network;
    const description = `Find a path of ${
      network.requiredSolutionLength
    } steps, starting from node "${
      nodes.find(n => n.id === startingNodeId).displayName
    }". The larger the reward, the better.`;
    return (
      <div className="task-stimulus">
        <p>{description}</p>
        <p>Number of steps remaining: {this.state.numberOfActionsRemaining}</p>
        <p>Round Score: {this.state.roundScore}</p>
        <Network
          nodes={nodes}
          activeNodeId={this.state.activeNodeId}
          invalidClickNodeId={this.state.invalidClickNodeId}
          onNodeClick={targetId => {
            const action = findAction(
              this.state.activeNodeId,
              targetId,
              actions
            );
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
              numberOfActionsRemaining,
              roundScore: calculateScore(solutionActions)
            }));

            if (numberOfActionsRemaining === 0) {
              player.stage.submit();
            }
          }}
          actions={actions}
        />
      </div>
    );
  }
}
