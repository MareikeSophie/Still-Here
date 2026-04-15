import { useRef } from 'react';

export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50 }) {
  const startX = useRef(null);
  const startY = useRef(null);

  function onTouchStart(e) {
    if (e.target.type === 'range') return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (startX.current === null) return;
    const diffX = startX.current - e.changedTouches[0].clientX;
    const diffY = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) >= Math.abs(diffY)) {
      if (Math.abs(diffX) >= threshold) {
        if (diffX > 0 && onSwipeLeft) onSwipeLeft();
        if (diffX < 0 && onSwipeRight) onSwipeRight();
      }
    } else {
      if (diffY > threshold && onSwipeUp) onSwipeUp();
      if (diffY < -threshold && onSwipeDown) onSwipeDown();
    }
    startX.current = null;
    startY.current = null;
  }

  // Mouse drag fallback (for desktop testing)
  const mouseX = useRef(null);
  const mouseY = useRef(null);

  function onMouseDown(e) {
    if (e.target.type === 'range') return;
    mouseX.current = e.clientX;
    mouseY.current = e.clientY;
  }

  function onMouseUp(e) {
    if (mouseX.current === null) return;
    const diffX = mouseX.current - e.clientX;
    const diffY = mouseY.current - e.clientY;
    if (Math.abs(diffX) >= Math.abs(diffY)) {
      if (Math.abs(diffX) >= threshold) {
        if (diffX > 0 && onSwipeLeft) onSwipeLeft();
        if (diffX < 0 && onSwipeRight) onSwipeRight();
      }
    } else {
      if (diffY > threshold && onSwipeUp) onSwipeUp();
      if (diffY < -threshold && onSwipeDown) onSwipeDown();
    }
    mouseX.current = null;
    mouseY.current = null;
  }

  return { onTouchStart, onTouchEnd, onMouseDown, onMouseUp };
}
