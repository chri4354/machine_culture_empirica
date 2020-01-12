import React from "react";

import { Network } from "../components/Network";

export default class TaskStimulus extends React.Component {
  state = {};

  componentDidMount() {
    this.setState(() => ({
      numberOfStepsRemaining: this.props.round.get("environment").solutionLength
    }));
  }

  render() {
    const { round, stage, player } = this.props;
    const network = round.get("environment");
    const { nodes, actions, startingNodeId, solutionLength } = network;
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
          startingNodeId={startingNodeId}
          onNodeClick={id => {
            // TODO ensure a valid node was selected
            console.log(`Node ${id} clicked`);
            const previousSolution = player.round.get("solution") || [];
            const solution = [...previousSolution, id];
            player.round.set("solution", [...previousSolution, id]);
            this.setState(() => ({
              numberOfStepsRemaining: Math.max(
                solutionLength - solution.length,
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
