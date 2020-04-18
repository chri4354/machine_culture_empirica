import React from 'react';
import getScoreColor from '../helpers/getScoreColor';
import {
  StyledCurrentPlayerMark,
  StyledLastPlayerMark,
  StyledMarkScoreText,
  StyledSvg,
} from './GameCanvas.styled';

const CurrentPlayerMark = ({ x, y, score }) => {
  const radius = 5;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <StyledCurrentPlayerMark r={radius} fill={getScoreColor(score)} />
      <StyledMarkScoreText x={radius} y={radius * 3}>
        {score}
      </StyledMarkScoreText>
    </g>
  );
};

const LastPlayerMark = ({ x, y, score }) => {
  const width = 10;
  const height = 10;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <StyledLastPlayerMark
        width={10}
        height={10}
        fill={getScoreColor(score)}
        transform={`rotate(45 ${width / 2} ${height / 2})`}
      />
      <StyledMarkScoreText inactive x={width} y={height * 2}>
        {score}
      </StyledMarkScoreText>
    </g>
  );
};

const GameCanvas = ({ version }) => {
  return (
    <StyledSvg className={version} width={700} height={700}>
      <g>
        <CurrentPlayerMark x={280} y={200} score={20} />
        <CurrentPlayerMark x={50} y={80} score={10} />
        <CurrentPlayerMark x={200} y={500} score={40} />
        <CurrentPlayerMark x={600} y={600} score={70} />
        <CurrentPlayerMark x={500} y={400} score={95} />
        <LastPlayerMark x={320} y={210} score={10} />
        <LastPlayerMark x={60} y={70} score={40} />
        <LastPlayerMark x={240} y={500} score={60} />
        <LastPlayerMark x={500} y={620} score={75} />
        <LastPlayerMark x={510} y={380} score={85} />
      </g>
    </StyledSvg>
  );
};

export default GameCanvas;
