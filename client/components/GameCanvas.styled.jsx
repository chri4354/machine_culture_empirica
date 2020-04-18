import styled, { css } from 'styled-components';

export const StyledSvg = styled.svg`
  background-color: #fffeee;
`;

export const StyledCurrentPlayerMark = styled.circle`
  stroke: black;
  stroke-width: 1;
`;

export const StyledLastPlayerMark = styled.rect`
  stroke: black;
  stroke-width: 1;
  opacity: 0.4;
`;

export const StyledMarkScoreText = styled.text`
  font-size: 11px;

  ${({ inactive }) =>
    inactive &&
    css`
      opacity: 0.4;
    `}
`;
