import styled, { css } from 'styled-components';

export const StyledSvg = styled.svg`
  background-color: #fffeee;
  cursor: none;
`;

export const StyledLine = styled.line`
  stroke: gray;
  stroke-width: 1;
`;

export const StyledCursor = styled.circle`
  stroke: gray;
  stroke-width: 1;
  fill: transparent;
`;

export const StyledCurrentPlayerMark = styled.circle`
  stroke: black;
  stroke-width: 1;
`;

export const StyledPreviousPlayerMark = styled.rect`
  stroke: black;
  stroke-width: 1;

  ${({ inactive }) =>
    inactive &&
    css`
      opacity: 0.4;
    `}
`;

export const StyledMarkScoreText = styled.text`
  font-size: 11px;

  ${({ inactive }) =>
    inactive &&
    css`
      opacity: 0.4;
    `}
`;
