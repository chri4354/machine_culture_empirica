import React from "react";
import _ from "lodash";
import shortid from "shortid";

const Node = ({
  x,
  y,
  text,
  r,
  isActive,
  id,
  onClick,
  isDisabled,
  isInvalidClick
}) => {
  return (
    <g
      className={"node"}
      style={{ cursor: !isDisabled && "pointer" }}
      onClick={() => onClick(id)}
    >
      <circle
        cx={x}
        cy={y}
        r={r}
        className={
          isActive
            ? "active"
            : isDisabled
            ? "disabled"
            : isInvalidClick
            ? "invalid-click"
            : ""
        }
        key={"circle"}
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

const Link = ({ source, target, text, colorClass, id, size }) => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let markerEnd, markerStart, textx, d;
  const dr = dist * 2.5;

  // drawing direction must be adjusted, to keep text upright
  if (dx >= 0) {
    markerEnd = `url(#marker-arrow-end-${colorClass})`;
    d = `M ${source.x} ${source.y} A ${dr} ${dr} 0 0 1 ${target.x} ${target.y}`;
    textx = 80;
  } else {
    markerStart = `url(#marker-arrow-start-${colorClass})`;
    d = `M ${target.x} ${target.y} A ${dr} ${dr} 0 0 0 ${source.x} ${source.y}`;
    textx = dist * 0.9 - 80;
  }

  return (
    <g className={colorClass}>
      <path
        id={id}
        className="link colored-stroke"
        style={{ strokeWidth: `${size}px` }}
        markerEnd={markerEnd}
        markerStart={markerStart}
        markerUnits="userSpaceOnUse"
        d={d}
      ></path>
      <text
        id={"link-text-bg-" + id}
        className="link-text link-text-bg"
        x={textx}
        dy={5}
      >
        <textPath alignmentBaseline="text-bottom" xlinkHref={`#${id}`}>
          {text}
        </textPath>
      </text>
      <text
        id={"link-text-" + id}
        className="link-text colored-fill"
        x={textx}
        dy={5}
      >
        <textPath alignmentBaseline="text-bottom" xlinkHref={`#${id}`}>
          {text}
        </textPath>
      </text>
    </g>
  );
};

// we need to define a link marker for each link color

const colorClasses = [
  "large-negative",
  "negative",
  "positive",
  "large-positive"
];

const Marker = ({ size, orient, prefix, name }) => (
  <marker
    markerUnits="userSpaceOnUse"
    id={`${prefix}-${name}`}
    className={name}
    markerWidth="26"
    markerHeight="26"
    refX={size.width / 10.5}
    refY="11"
    orient={orient}
  >
    <path className="colored-fill" d="M4,4 L4,22 L20,12 L4,4" />
  </marker>
);

const LinkMarker = ({ size }) => (
  <defs>
    {[
      ...colorClasses.map((name, idx) => (
        <Marker
          key={"marker-" + idx}
          orient="auto"
          prefix="marker-arrow-end"
          name={name}
          size={size}
        />
      )),
      ...colorClasses.map((name, idx) => (
        <Marker
          key={"marker-reverse" + idx}
          orient="auto-start-reverse"
          prefix="marker-arrow-start"
          name={name}
          size={size}
        />
      ))
    ]}
  </defs>
);

const Links = ({ actions, nodeSize }) => (
  <>
    <g>
      {actions.map(({ id, source, target, text, colorClass, size }, idx) => (
        <Link
          r={nodeSize}
          text={text}
          colorClass={colorClass}
          size={size}
          id={id}
          source={source}
          target={target}
          key={"link-" + idx}
        />
      ))}
    </g>
    {/* to bring the link describtion (rewards) to the front */}
    <g>
      {actions.map(({ id, colorClass }, idx) => (
        <g className={colorClass} key={"use-text-" + idx}>
          <use
            className="link-text link-text-bg"
            xlinkHref={`#link-text-bg-${id}`}
          />
          <use
            className="link-text colored-fill"
            xlinkHref={`#link-text-${id}`}
          />
        </g>
      ))}
    </g>
  </>
);

const parseNodes = (nodes, size) =>
  nodes.map(node => ({
    ...node,
    x: node.x * size.width,
    y: node.y * size.height
  }));

const parseAction = (
  { sourceId, targetId, reward, rewardName },
  showRewards,
  linkSize,
  nodesById
) => ({
  id: shortid.generate(),
  source: nodesById[sourceId],
  target: nodesById[targetId],
  text: showRewards ? reward : null,
  colorClass: rewardName,
  size: linkSize
});

const parseActions = (actions, showRewards, linkSize, nodesById) =>
  actions.map(action => parseAction(action, showRewards, linkSize, nodesById));

// const parseSolutions = (actions, nodesById) =>
//   _.chain(actions)
//     .groupBy(({ sourceId, targetId }) => `${sourceId}_${targetId}`)
//     .map(ga => ({
//       id: shortid.generate(),
//       source: nodesById[ga[0].sourceId],
//       target: nodesById[ga[0].targetId],
//       text: "[" + ga.map(a => `${a.step}`).join(",") + "]",
//       colorClass: ga[0].rewardName,
//       size: 3 * ga.length
//     }))
//     .value();

class Network extends React.Component {
  render() {
    const {
      activeNodeId,
      actions,
      invalidClickNodeId,
      nodes,
      onNodeClick,
      version,
      solution
    } = this.props;
    const size = { width: 600, height: 600 };
    const nodeSize = size.width / 15;
    const parsedNodes = parseNodes(nodes, size);
    const nodesById = _.keyBy(parsedNodes, "id");
    const parsedActions = parseActions(actions, true, 3, nodesById);
    // const parsedSolution = parseSolutions(solution, nodesById);
    return (
      <svg
        className={`network-game ${version}`}
        width={size.height}
        height={size.height}
      >
        <LinkMarker size={size} />
        <Links actions={parsedActions} nodeSize={nodeSize} />
        {/* <Links actions={parsedSolution} nodeSize={nodeSize} /> */}
        <g>
          {parsedNodes.map(({ x, y, displayName, id }, idx) => (
            <Node
              x={x}
              y={y}
              r={nodeSize}
              isDisabled={this.props.isDisabled}
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

export default Network;