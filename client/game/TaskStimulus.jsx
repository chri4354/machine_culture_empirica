import React from "react";

import { Network } from "../components/Network";
import { isValidStep } from "../../imports/utils";

export default class TaskStimulus extends React.Component {
  state = {};

  componentDidMount() {
    const network = this.props.round.get("network");
    this.setState(() => ({
      activeNodeId: network.startingNodeId,
      numberOfStepsRemaining: network.requiredSolutionLength
    }));
  }

  render() {
    const { round, stage, player } = this.props;
    const network = round.get("network");
    const { nodes, actions, startingNodeId, requiredSolutionLength } = network;
    const description = `Find a path of ${nodes.length -
      1} steps, starting from node "${
      nodes.find(n => n.id === startingNodeId).displayName
    }". The larger the reward, the better.`;
    return (
      <div className="task-stimulus">
        <p>{description}</p>
        <p>Number of steps remaining: {this.state.numberOfStepsRemaining}</p>
        <p>Round Score: TODO</p>
        <p>Error messages: TODO</p>
        <Network
          nodes={nodes}
          activeNodeId={this.state.activeNodeId}
          invalidClickNodeId={this.state.invalidClickNodeId}
          onNodeClick={id => {
            if (!isValidStep(this.state.activeNodeId, id, actions)) {
              this.setState({
                invalidClickNodeId: id
              });
              setTimeout(() => {
                this.setState({
                  invalidClickNodeId: null
                });
              }, 500);
              return;
            }
            // TODO store soution in correct format
            const solution = [...(player.round.get("solution") || []), id];
            player.round.set("solution", solution);
            this.setState(() => ({
              activeNodeId: id,
              numberOfStepsRemaining: Math.max(
                requiredSolutionLength - solution.length,
                0
              )
            }));
          }}
          actions={actions}
        />
      </div>
    );
  }
}
