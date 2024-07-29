import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  display: flex;
  justify-content: center;
  width: 100px;
`;

function Loading() {
  return <Img src='/spinner.gif' />;
}

export default Loading;
