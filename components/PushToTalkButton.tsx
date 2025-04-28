import {
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";

export function PushToTalkButton() {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isPressed, setIsPressed] = useState(false);
  const [isOutside, setIsOutside] = useState(false);
  const lastActionTime = useRef(0);

  // find agent participant that supports PTT
  const agent = participants.find(
    (p) => p.attributes?.["push-to-talk"] === "1"
  );

  useEffect(() => {
    // start with microphone disabled for PTT agents
    if (agent && localParticipant) {
      // localParticipant.setMicrophoneEnabled(false);
    }
  }, [localParticipant, agent]);

  // when user presses the button
  const handleMouseDown = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default browser behavior

    if (!agent || !localParticipant) return;

    console.log("starting turn");
    try {
      // await localParticipant.setMicrophoneEnabled(true);
      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "start_turn",
        payload: "",
      });
      setIsPressed(true);
      setIsOutside(false);
    } catch (error) {
      console.error("Failed to start turn:", error);
    }
  }, [agent, localParticipant]);

  // when mouse leaves the button area while pressed
  const handleMouseLeave = useCallback(() => {
    if (isPressed) {
      console.log("mouse left button while pressed");
      setIsOutside(true);
    }
  }, [isPressed]);

  // when mouse re-enters the button area while pressed
  const handleMouseEnter = useCallback(() => {
    if (isPressed && isOutside) {
      console.log("mouse re-entered button while pressed");
      setIsOutside(false);
    }
  }, [isPressed, isOutside]);

  // shared function to end turn with specified method
  const endTurnWithMethod = useCallback(async (method: string) => {
    if (!agent || !localParticipant || !isPressed) return;

    // Prevent multiple actions within 100ms
    const now = Date.now();
    if (now - lastActionTime.current < 100) return;
    lastActionTime.current = now;

    console.log(`ending turn with method: ${method}`);
    try {
      // await localParticipant.setMicrophoneEnabled(false);
      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: method,
        payload: "",
      });
    } catch (error) {
      console.error(`Failed to ${method}:`, error);
    } finally {
      setIsPressed(false);
      setIsOutside(false);
    }
  }, [agent, localParticipant, isPressed]);

  // when user releases the mouse anywhere
  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault(); // prevent default browser behavior

    if (!isPressed) return;

    // if mouse is outside the button on release, cancel the turn
    // otherwise, end the turn normally
    const method = isOutside ? "cancel_turn" : "end_turn";
    endTurnWithMethod(method);
  }, [isPressed, isOutside, endTurnWithMethod]);

  // ensure turn is ended when component unmounts
  useEffect(() => {
    return () => {
      if (isPressed) {
        endTurnWithMethod("end_turn");
      }
    };
  }, [isPressed, endTurnWithMethod]);

  // add global mouse-up handler to catch events outside the button
  useEffect(() => {
    if (isPressed) {
      const handleGlobalMouseUp = (e: MouseEvent) => {
        handleMouseUp(e);
      };

      window.addEventListener('mouseup', handleGlobalMouseUp as any);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp as any);
      };
    }
  }, [isPressed, handleMouseUp]);

  if (!agent) return null;

  return (
    <motion.button
      className="ptt-button"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      // we handle mouseup at the window level to catch all cases
      // onTouchStart/End would be implemented similarly
      initial={false}
      animate={{
        backgroundColor: isPressed
          ? isOutside
            ? "#d9534f" // red when outside and pressed (about to cancel)
            : "#004085" // blue when speaking normally
          : "#007bff", // default blue
        scale: isPressed ? 0.95 : 1,
        boxShadow: isOutside && isPressed
          ? "0 0 0 3px rgba(217, 83, 79, 0.5)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isPressed
        ? isOutside
          ? "Release to Cancel"
          : "Speaking..."
        : "Press to Talk"}
    </motion.button>
  );
}
