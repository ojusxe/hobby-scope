"use client";

import styled from 'styled-components';

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  z-index: 0;
  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-width: 100vw;
    min-height: 100vh;
    background: radial-gradient(circle at 10% 10%, #3e73f0 5%, transparent 5%),
      radial-gradient(circle at 90% 10%, #3e73f0 5%, transparent 5%),
      radial-gradient(circle at 90% 90%, #3e73f0 5%, transparent 5%),
      radial-gradient(circle at 10% 90%, #3e73f0 5%, transparent 5%);
    background-size: 20px 20px;
    background-attachment: fixed;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }`;

export default Pattern;
