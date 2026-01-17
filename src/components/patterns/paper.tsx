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
    background: #f1f1f1;
    background-image: linear-gradient(
        90deg,
        transparent 50px,
        #ffb4b8 50px,
        #ffb4b8 52px,
        transparent 52px
      ),
      linear-gradient(#e1e1e1 0.1em, transparent 0.1em);
    background-size: 100% 30px;
    background-attachment: fixed;
  }`;

export default Pattern;
