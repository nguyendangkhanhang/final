import { useEffect, useRef } from "react";
function UseAutoScroll(dependencies){
  const containerRef = useRef();
  console.log(containerRef);
    useEffect(() => {
    const containerElem = containerRef.current
    containerElem.scrollTop = containerElem.scrollHeight;
  }, dependencies);
  return containerRef        
}
export default UseAutoScroll