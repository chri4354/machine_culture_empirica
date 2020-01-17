import React from "react";
import _ from "lodash";

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

const Link = ({ source, target, reward, rewardName, id }) => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let markerEnd, markerStart, textx, d;
  const dr = dist * 2.5;

  // drawing direction must be adjusted, to keep text upright
  if (dx >= 0) {
    markerEnd = `url(#marker-arrow-end-${rewardName})`;
    d = `M ${source.x} ${source.y} A ${dr} ${dr} 0 0 1 ${target.x} ${target.y}`;
    textx = 80;
  } else {
    markerStart = `url(#marker-arrow-start-${rewardName})`;
    d = `M ${target.x} ${target.y} A ${dr} ${dr} 0 0 0 ${source.x} ${source.y}`;
    textx = dist * 0.9 - 80;
  }

  return (
    <g className={rewardName}>
      <path
        id={id}
        className="link colored-stroke"
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
          {reward}
        </textPath>
      </text>
      <text
        id={"link-text-" + id}
        className="link-text colored-fill"
        x={textx}
        dy={5}
      >
        <textPath alignmentBaseline="text-bottom" xlinkHref={`#${id}`}>
          {reward}
        </textPath>
      </text>
    </g>
  );
};

// we need to define a link marker for each link color

const rewardNames = [
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
      ...rewardNames.map((name, idx) => (
        <Marker
          key={"marker-" + idx}
          orient="auto"
          prefix="marker-arrow-end"
          name={name}
          size={size}
        />
      )),
      ...rewardNames.map((name, idx) => (
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

class Network extends React.Component {
  render() {
    const {
      activeNodeId,
      actions,
      invalidClickNodeId,
      nodes,
      onNodeClick,
      version
    } = this.props;
    const size = { width: 700, height: 700 };
    const nodesById = _.keyBy(nodes, "id");
    return (
      <svg
        className={`network-game ${version}`}
        width={size.height}
        height={size.height}
      >
        <LinkMarker size={size} />
        <g>
          {actions.map(({ sourceId, targetId, reward, rewardName }, idx) => (
            <Link
              r={size.width / 15}
              reward={reward}
              rewardName={rewardName}
              id={`${sourceId}_${targetId}`}
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
        {/* to bring the link describtion (rewards) to the front */}
        <g>
          {actions.map(({ sourceId, targetId }, idx) => [
            <use
              key={"use-bg-" + idx}
              xlinkHref={`#link-text-bg-${sourceId}_${targetId}`}
            />,
            <use
              key={"use-" + idx}
              xlinkHref={`#link-text-${sourceId}_${targetId}`}
            />
          ])}
        </g>
      </svg>
    );
  }
}

export { Network };
