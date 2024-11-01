declare module 'react-confetti' {
    import React from 'react';
  
    interface ConfettiProps {
      width?: number;
      height?: number;
      numberOfPieces?: number;
      gravity?: number;
      wind?: number;
      recycle?: boolean;
      colors?: string[];
      opacity?: number;
      friction?: number;
      initialVelocityY?: number;
      tweenDuration?: number;
    }
  
    const Confetti: React.FC<ConfettiProps>;
    export default Confetti;
  }
  