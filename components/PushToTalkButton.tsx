import {
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function PushToTalkButton() {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isPressed, setIsPressed] = useState(false);
  const lastReleaseTime = useRef(0);

  // Find agent participant that supports PTT
  const agent = participants.find(
    (p) => p.attributes?.["supports-ptt"] === "1"
  );

  useEffect(() => {
    // start with microphone enabled for PTT agents
    if (agent && localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
    }
  }, [localParticipant, agent]);

  const handlePushStart = useCallback(async () => {
    if (!agent || !localParticipant) return;

    try {
      await localParticipant.setMicrophoneEnabled(true);
      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "ptt.start",
      });
      setIsPressed(true);
    } catch (error) {
      console.error("Failed to send PTT push:", error);
    }
  }, [agent, localParticipant]);

  const handlePushEnd = useCallback(async () => {
    if (!agent || !localParticipant || !isPressed) return;

    // Prevent multiple releases within 100ms
    const now = Date.now();
    if (now - lastReleaseTime.current < 100) {
      return;
    }
    lastReleaseTime.current = now;

    try {
      await localParticipant.setMicrophoneEnabled(false);
      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "ptt.end",
      });
    } catch (error) {
      console.error("Failed to send PTT release:", error);
    } finally {
      setIsPressed(false);
    }
  }, [agent, localParticipant, isPressed]);

  // Clean up pressed state when component unmounts
  useEffect(() => {
    return () => {
      if (isPressed) {
        handlePushEnd();
      }
    };
  }, [isPressed, handlePushEnd]);

  if (!agent) return null;

  return (
    <motion.button
      className="ptt-button"
      onMouseDown={handlePushStart}
      onMouseUp={handlePushEnd}
      initial={false}
      animate={{
        backgroundColor: isPressed ? "#004085" : "#007bff",
        scale: isPressed ? 0.95 : 1,
      }}
    >
      {isPressed ? "Speaking..." : "Press to Talk"}
    </motion.button>
  );
}
