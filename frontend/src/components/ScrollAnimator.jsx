import React from 'react';
import { useInView } from 'react-intersection-observer';

const ScrollAnimator = ({ children, animationClass = 'animate-slideUpFadeIn', threshold = 0.1, triggerOnce = true, className = '' }) => {
  const { ref, inView } = useInView({
    threshold: threshold,  // Trigger when 10% of the element is visible
    triggerOnce: triggerOnce, // Only trigger the animation once
  });

  return (
    <div ref={ref} className={`${className} ${inView ? animationClass : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default ScrollAnimator; 