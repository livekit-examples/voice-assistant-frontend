import { useEffect } from "react";

export function useAutoScroll(
  scrollAreaRef: React.RefObject<HTMLDivElement | null>,
  scrollContentContainerRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const scrollToBottom = () => {
      const scrollArea = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    };
    if (scrollContentContainerRef.current) {
      scrollToBottom();
      const resizeObserver = new ResizeObserver(() => {
        scrollToBottom();
      });
      resizeObserver.observe(scrollContentContainerRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [scrollContentContainerRef, scrollAreaRef]);
}
