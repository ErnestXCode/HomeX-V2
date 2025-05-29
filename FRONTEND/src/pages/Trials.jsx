import React, { useEffect, useRef } from "react";

const Trials = () => {
  const dragRef = useRef(false);
  
  
  useEffect(() => {
    const box = dragRef?.current;
    const onMouseDown = (e) => {
      dragRef.current = true
      console.log('clicked down', e.clientX)
      e.clientX = 60
    };
    const onMouseUp = () => {
      dragRef.current = false
      console.log('clicked up')
    };
    const onMouseMove = (e) => {
      if(!dragRef.current) return 
      console.log(e)
    };
    box.addEventListener("click", onMouseDown);
    box.addEventListener("mouseUp", onMouseUp);
    box.addEventListener("mouseMove", onMouseMove);
    return () => {
      box.removeEventListener("mouseDown", onMouseDown);
      box.removeEventListener("mouseUp", onMouseUp);
      box.removeEventListener("mouseMove", onMouseMove);
    };
  });

  return (
    <div ref={dragRef} className="bg-gray-600 size-10 rounded-full m-2"></div>
  );
};

export default Trials;
