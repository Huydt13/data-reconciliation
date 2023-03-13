import { useRef } from 'react';

const useRenderCount = (componentName) => {
  const renders = useRef(0);
  console.log(`${componentName}: ${renders.current += 1}`);
};

export default useRenderCount;
