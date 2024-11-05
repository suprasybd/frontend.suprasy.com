import { useEffect, useState, useCallback } from 'react';
import _ from 'lodash';

const SPEED = 6;

const useResize = (defaultWidth, defaultHeight) => {
  const [size, setSize] = useState({
    width: defaultWidth || 300,
    height: defaultHeight || 300,
  });

  useEffect(() => {
    if (defaultHeight || defaultWidth) {
      setSize({ height: defaultHeight, width: defaultWidth });
    }
  }, [defaultHeight, defaultWidth]);

  const [resizing, setResizing] = useState(false);

  const onMouseDown = () => {
    document.addEventListener('mousemove', throttledOnMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    setResizing(true);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', throttledOnMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    setResizing(false);
  };

  const throttledOnMouseMove = useCallback(
    _.throttle((e) => {
      setSize((currentSize) => ({
        width: currentSize.width + e.movementX * SPEED,
        height: currentSize.height + e.movementY * SPEED,
      }));
    }, 20), // Throttle to 16ms intervals (adjust as needed)
    [] // Empty dependency array to prevent recreating on every render
  );

  const onMouseMove = (e) => throttledOnMouseMove(e); // Call throttled version

  return [size, onMouseDown, resizing];
};

export default useResize;
