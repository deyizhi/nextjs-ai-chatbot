import { useEffect, useRef, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        // 检查用户是否在底部附近
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        // 只有当用户在底部附近时才自动滚动
        if (isNearBottom) {
         //end.scrollIntoView({ behavior: 'instant', block: 'end' });
       }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}