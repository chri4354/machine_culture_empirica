import React from "react";
import _ from "lodash";

const Node = ({ x, y, text, r, isActive, id, onClick, isInvalidClick }) => {
  return (
    <g
      className={"node"}
      style={{ cursor: "pointer", transition: "fill .4s ease" }}
      onClick={() => onClick(id)}
    >
      <circle
        cx={x}
        cy={y}
        r={r}
        className={isInvalidClick ? "invalid-click" : isActive ? "active" : ""}
        key={"circle"}
        stroke="black"
        strokeWidth="3"
      />
      <text
        x={x}
        y={y + r * 0.3}
        textAnchor="middle"
        style={{ fontSize: "30px" }}
        key={"state-name"}
      >
        {text}
      </text>
    </g>
  );
};

const Link = ({ source, target }) => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dr = Math.sqrt(dx * dx + dy * dy) * 3;
  const d =
    "M" +
    source.x +
    " " +
    source.y +
    "A" +
    dr +
    " " +
    dr +
    " 0 0 1 " +
    target.x +
    " " +
    target.y;
  return <path className="link" markerEnd={"url(#markerArrow)"} d={d}></path>;
};

class Network extends React.Component {
  render() {
    const {
      activeNodeId,
      actions,
      invalidClickNodeId,
      nodes,
      onNodeClick
    } = this.props;
    const size = { width: 500, height: 500 };
    const nodesById = _.keyBy(nodes, "id");
    return (
      <svg className="network-game" width={size.height} height={size.height}>
        <defs>
          <marker
            id="markerArrow"
            markerWidth="13"
            markerHeight="13"
            refX={size.width / 15}
            refY="6"
            orient="auto"
          >
            <path d="M2,2 L2,11 L10,6 L2,2" />
          </marker>
        </defs>
        <g>
          {actions.map(({ sourceId, targetId, reward }, idx) => (
            <Link
              r={size.width / 15}
              source={{
                x: size.width * nodesById[sourceId].x,
                y: size.height * nodesById[sourceId].y
              }}
              target={{
                x: size.width * nodesById[targetId].x,
                y: size.height * nodesById[targetId].y
              }}
              key={"link-" + idx}
            />
          ))}
        </g>
        <g>
          {nodes.map(({ x, y, displayName, id }, idx) => (
            <Node
              x={size.width * x}
              y={size.height * y}
              r={size.width / 15}
              isInvalidClick={id === invalidClickNodeId}
              isActive={id === activeNodeId}
              text={displayName}
              onClick={onNodeClick}
              id={id}
              key={"point-" + idx}
            />
          ))}
        </g>
      </svg>
    );
  }
}

export { Network };