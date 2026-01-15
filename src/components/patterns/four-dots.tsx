import styled from 'styled-components';

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 10% 10%, #3e73f0 5%, transparent 5%),
      radial-gradient(circle at 90% 10%, #3e73f0 5%, transparent 5%),
      radial-gradient(circle at 90% 90%, #3e73f0 5%, transparent 5%),
      radial-gradient(circle at 10% 90%, #3e73f0 5%, transparent 5%);
    background-size: 20px 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }`;

export default Pattern;
