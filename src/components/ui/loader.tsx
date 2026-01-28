import React from 'react';
import styled from 'styled-components';

interface LoaderFiveProps {
  text?: string;
  className?: string; // Kept for compatibility
}

export const LoaderFive: React.FC<LoaderFiveProps> = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <span className="l">B</span>
        <span className="o">O</span>
        <span className="a">U</span>
        <span className="d">C</span>
        <span className="ispan">L</span>
        <span className="n">E</span>
        <span className="g">S</span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FEF9EF;

  .loader {
    --ANIMATION-DELAY-MULTIPLIER: 70ms;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .loader span {
    padding: 0;
    margin: 0;
    letter-spacing: -0.5rem; /* Adjusted for text density */
    animation-delay: 0s;
    transform: translateY(4rem);
    animation: hideAndSeek 1s alternate infinite cubic-bezier(0.86, 0, 0.07, 1);
    
    /* Font styling for text letters */
    font-family: 'Archivo', sans-serif;
    font-weight: 900;
    font-size: 3rem;
    color: black;
    display: inline-block;
  }
  
  .loader .l { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 0); }
  .loader .o { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 1); }
  .loader .a { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 2); }
  .loader .d { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 3); }
  .loader .ispan { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 4); }
  .loader .n { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 5); }
  .loader .g { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 6); }
  
  @keyframes hideAndSeek {
    0% { transform: translateY(4rem); }
    100% { transform: translateY(0rem); }
  }
`;

export default LoaderFive;
