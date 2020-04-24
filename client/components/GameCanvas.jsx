import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import getScoreColor from '../helpers/getScoreColor';
import { getCanvasPosition } from '../helpers/getCanvasPosition';
import {
  StyledCursor,
  StyledCurrentPlayerMark,
  StyledPreviousPlayerMark,
  StyledLine,
  StyledMarkScoreText,
  StyledSvg,
} from './GameCanvas.styled';

const Cursor = React.memo(({ x, y, crossed }) => {
  const radius = 5;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <StyledCursor r={radius} />
      {crossed && (
        <>
          <StyledLine x1={-radius} y1={-radius} x2={radius} y2={radius} />
          <StyledLine x1={radius} y1={-radius} x2={-radius} y2={radius} />
        </>
      )}
    </g>
  );
});

const CurrentPlayerMark = React.memo(({ x, y, score }) => {
  const radius = 5;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <StyledCurrentPlayerMark r={radius} fill={getScoreColor(score)} />
      <StyledMarkScoreText x={radius} y={radius * 3}>
        {score}
      </StyledMarkScoreText>
    </g>
  );
});

const PreviousPlayerMark = React.memo(({ x, y, score, animationDelay, isPlanStage }) => {
  const width = 10;
  const height = 10;

  const props = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, delay: animationDelay });
  console.log(isPlanStage);

  return (
    <animated.g transform={`translate(${x - 5}, ${y - 5})`} style={props}>
      <StyledPreviousPlayerMark
        width={10}
        height={10}
        inactive={!isPlanStage}
        fill={getScoreColor(score)}
        transform={`rotate(45 ${width / 2} ${height / 2})`}
      />
      <StyledMarkScoreText inactive={!isPlanStage} x={width} y={height * 2}>
        {score}
      </StyledMarkScoreText>
    </animated.g>
  );
});

const previousPlayerMarks = (previousPlayerActions, isPlanStage) =>
  previousPlayerActions.map(({ x, y, reward, step }) => {
    return (
      <PreviousPlayerMark
        key={`previous-player-mark-${step}`}
        x={x * 500}
        y={y * 500}
        score={reward}
        animationDelay={isPlanStage ? step * 1000 : 0}
        isPlanStage={isPlanStage}
      />
    );
  });

const playerMarks = playerActions =>
  playerActions.map(({ x, y, reward, step }) => {
    return (
      <CurrentPlayerMark
        key={`current-player-mark-${step}`}
        x={x * 500}
        y={y * 500}
        score={reward}
      />
    );
  });

const GameCanvas = ({
  previousPlayerActions,
  currentPlayerActions,
  isPlanStage,
  playerCanAdd,
  addAction,
}) => {
  const [mousePosition, setMousePosition] = useState(null);
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(true);

  const trackMouse = event => {
    const { x, y } = getCanvasPosition(event);

    setMousePosition({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <StyledSvg
      id="game-canvas"
      width={500}
      height={500}
      onMouseMove={trackMouse}
      onClick={() => playerCanAdd && addAction(mousePosition)}
      onMouseLeave={() => setIsMouseInCanvas(false)}
      onMouseEnter={() => setIsMouseInCanvas(true)}
    >
      <g>
        {previousPlayerMarks(previousPlayerActions, isPlanStage)}
        {playerMarks(currentPlayerActions)}
        {mousePosition && isMouseInCanvas && (
          <Cursor x={mousePosition.x} y={mousePosition.y} crossed={!playerCanAdd} />
        )}
      </g>
    </StyledSvg>
  );
};

export default GameCanvas;
