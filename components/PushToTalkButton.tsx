import { useLocalParticipant, useParticipants } from "@livekit/components-react";
import { motion } from "framer-motion";
import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function PushToTalkButton() {
  // state and refs
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isPressed, setIsPressed] = useState(false);
  const [isOutside, setIsOutside] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastActionTime = useRef(0);
  const rpcTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // find agent participant that supports PTT
  const agent = participants.find((p) => p.attributes?.["push-to-talk"] === "1");

  // initialize mic state
  useEffect(() => {
    if (agent && localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
    }
  }, [localParticipant, agent]);

  // perform RPC call with timeout handling
  const performRpcWithTimeout = useCallback(
    async (method: string, timeoutMs = 3000) => {
      if (!agent || !localParticipant) return false;

      let succeeded = false;
      setIsLoading(true);

      try {
        const timeoutPromise = new Promise<void>((_, reject) => {
          rpcTimeoutRef.current = setTimeout(() => {
            reject(new Error(`RPC timeout after ${timeoutMs}ms`));
          }, timeoutMs);
        });

        const startTime = Date.now();
        await Promise.race([
          (async () => {
            await localParticipant.performRpc({
              destinationIdentity: agent.identity,
              method,
              payload: "",
            });
            succeeded = true;
          })(),
          timeoutPromise,
        ]);

        const endTime = Date.now();
        console.log(`${method} RPC completed in ${endTime - startTime}ms`);
      } catch (error) {
        console.error(`RPC ${method} failed:`, error);
      } finally {
        if (rpcTimeoutRef.current) {
          clearTimeout(rpcTimeoutRef.current);
          rpcTimeoutRef.current = null;
        }
        setIsLoading(false);
      }

      return succeeded;
    },
    [agent, localParticipant]
  );

  // shared function to end turn with specified method
  const endTurn = useCallback(
    async (method: string) => {
      if (!agent || !localParticipant || !isPressed || isLoading) return;

      // prevent multiple actions within 250ms
      const now = Date.now();
      if (now - lastActionTime.current < 250) return;
      lastActionTime.current = now;

      console.log(`ending turn with method: ${method}`);
      try {
        await localParticipant.setMicrophoneEnabled(false);
        await performRpcWithTimeout(method);
      } finally {
        setIsPressed(false);
        setIsOutside(false);
      }
    },
    [agent, localParticipant, isPressed, isLoading, performRpcWithTimeout]
  );

  // start turn (mouse or touch)
  const startTurn = useCallback(async () => {
    if (!agent || !localParticipant || isLoading) return;

    console.log("starting turn");
    try {
      await localParticipant.setMicrophoneEnabled(true);
      const success = await performRpcWithTimeout("start_turn");
      if (success) {
        setIsPressed(true);
        setIsOutside(false);
      }
    } catch (error) {
      console.error("Failed to start turn:", error);
    }
  }, [agent, localParticipant, isLoading, performRpcWithTimeout]);

  // mouse event handlers
  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      startTurn();
    },
    [startTurn]
  );

  const handleMouseLeave = useCallback(() => {
    if (isPressed) {
      console.log("mouse left button while pressed");
      setIsOutside(true);
    }
  }, [isPressed]);

  const handleMouseEnter = useCallback(() => {
    if (isPressed && isOutside) {
      console.log("mouse re-entered button while pressed");
      setIsOutside(false);
    }
  }, [isPressed, isOutside]);

  const handleMouseUp = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      if (!isPressed) return;

      const method = isOutside ? "cancel_turn" : "end_turn";
      endTurn(method);
    },
    [isPressed, isOutside, endTurn]
  );

  // touch event handlers
  const handleTouchStart = useCallback(
    (e: ReactTouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      startTurn();
    },
    [startTurn]
  );

  // check if touch is outside the button
  const isTouchOutside = useCallback((clientX: number, clientY: number): boolean => {
    if (!buttonRef.current) return false;

    const rect = buttonRef.current.getBoundingClientRect();
    return (
      clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom
    );
  }, []);

  const handleTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      if (!isPressed) return;

      const touch = e.touches[0];
      const touchIsOutside = isTouchOutside(touch.clientX, touch.clientY);

      if (touchIsOutside && !isOutside) {
        console.log("touch moved outside button");
        setIsOutside(true);
      } else if (!touchIsOutside && isOutside) {
        console.log("touch moved back inside button");
        setIsOutside(false);
      }
    },
    [isPressed, isOutside, isTouchOutside]
  );

  const handleTouchEnd = useCallback(
    (e: ReactTouchEvent) => {
      e.preventDefault();
      if (!isPressed) return;

      const method = isOutside ? "cancel_turn" : "end_turn";
      endTurn(method);
    },
    [isPressed, isOutside, endTurn]
  );

  const handleTouchCancel = useCallback(() => {
    if (!isPressed) return;

    console.log("touch cancelled - ending turn");
    endTurn("end_turn");
  }, [isPressed, endTurn]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (isPressed) {
        endTurn("end_turn");
      }

      if (rpcTimeoutRef.current) {
        clearTimeout(rpcTimeoutRef.current);
        rpcTimeoutRef.current = null;
      }
    };
  }, [isPressed, endTurn]);

  // global event handlers
  useEffect(() => {
    if (isPressed) {
      // global mouse handler
      const handleGlobalMouseUp = (e: MouseEvent) => {
        const syntheticEvent = {
          ...e,
          preventDefault: () => e.preventDefault(),
        } as unknown as ReactMouseEvent;

        handleMouseUp(syntheticEvent);
      };

      // global touch handler
      const handleGlobalTouchEnd = (e: TouchEvent) => {
        const syntheticEvent = {
          ...e,
          preventDefault: () => e.preventDefault(),
        } as unknown as ReactTouchEvent;

        handleTouchEnd(syntheticEvent);
      };

      window.addEventListener("mouseup", handleGlobalMouseUp, { once: true });
      window.addEventListener("touchend", handleGlobalTouchEnd, { once: true });

      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("touchend", handleGlobalTouchEnd);
      };
    }
  }, [isPressed, handleMouseUp, handleTouchEnd]);

  // prevent context menu (long press) on touch devices
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    if (buttonRef.current) {
      buttonRef.current.addEventListener("contextmenu", preventDefault);
      return () => {
        if (buttonRef.current) {
          buttonRef.current.removeEventListener("contextmenu", preventDefault);
        }
      };
    }
  }, []);

  if (!agent) return null;

  // visual and text state based on current status
  const getButtonColor = () => {
    if (isLoading) return "#cccccc"; // gray when loading
    if (isPressed) {
      return isOutside ? "#d9534f" : "#004085"; // red when cancelling, blue when speaking
    }
    return "#007bff"; // default blue
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    if (isPressed) return isOutside ? "Release to Cancel" : "Speaking...";
    return "Press to Talk";
  };

  return (
    <motion.button
      ref={buttonRef}
      className="ptt-button"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      disabled={isLoading}
      initial={false}
      animate={{
        backgroundColor: getButtonColor(),
        scale: isPressed ? 0.95 : 1,
        boxShadow:
          isOutside && isPressed
            ? "0 0 0 3px rgba(217, 83, 79, 0.5)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {getButtonText()}
    </motion.button>
  );
}
