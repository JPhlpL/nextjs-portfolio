import { useEffect, useRef } from 'react';

const useDecimalCountUp = (endValue, duration = 2, formattingFn = (value) => value.toFixed(1)) => {
  const ref = useRef(null);
  const startValue = useRef(0);
  const startTime = useRef(null);
  const animationFrameId = useRef(null);

  const updateCounter = (timestamp) => {
    if (!startTime.current) startTime.current = timestamp;
    const elapsed = (timestamp - startTime.current) / 1000; 
    const progress = Math.min(elapsed / duration, 1); // Ensure progress does not exceed 1
    const currentValue = startValue.current + (endValue - startValue.current) * progress;

    if (ref.current) {
      ref.current.innerText = formattingFn(currentValue);
    }

    if (progress < 1) {
      animationFrameId.current = requestAnimationFrame(updateCounter);
    }
  };

  useEffect(() => {
    startValue.current = 0; // Reset start value
    startTime.current = null; // Reset start time
    animationFrameId.current = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrameId.current); // Cleanup on unmount
    };
  }, [endValue, duration, formattingFn]);

  return ref;
};

export default useDecimalCountUp;