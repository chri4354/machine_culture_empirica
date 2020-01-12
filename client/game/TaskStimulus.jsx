import React from "react";

import { Network } from "../components/Network";
import sampleNetwork from "../sample-environment.json";

export default class TaskStimulus extends React.Component {
  render() {
    const { round, stage, player } = this.props;

    const { nodes, actions } = sampleNetwork;
    const description = `Find a path of ${nodes.length -
      1} steps, starting from node ${
      nodes[0].displayName
    }. The larger the reward, the better.`;
    return (
      <div className="task-stimulus">
        <p>{description}</p>
        <Network
          nodes={nodes}
          onNodeClick={id => {
            // TODO ensure a valid node was selected
            console.log(`Node ${id} clicked`);
            const previousPath = player.round.get("path") || [];
            player.round.set("path", [...previousPath, id]);
          }}
          actions={actions}
        />
      </div>
    );
  }
}
