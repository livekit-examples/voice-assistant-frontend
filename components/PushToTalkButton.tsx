import { useLocalParticipant, useParticipants } from "@livekit/components-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export function PushToTalkButton() {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isPressed, setIsPressed] = useState(false);
  const lastReleaseTime = useRef(0);

  // Find agent participant that supports PTT
  const agent = participants.find((p) => p.attributes?.['supports-ptt'] === '1');

  const handlePushStart = useCallback(async () => {
    if (!agent || !localParticipant) return;

    try {
      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: 'ptt',
        payload: 'push'
      });
      setIsPressed(true);
    } catch (error) {
      console.error('Failed to send PTT push:', error);
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
      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: 'ptt',
        payload: 'release'
      });
      setIsPressed(false);
    } catch (error) {
      console.error('Failed to send PTT release:', error);
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
        backgroundColor: isPressed ? '#004085' : '#007bff',
        scale: isPressed ? 0.95 : 1
      }}
    >
      {isPressed ? 'Speaking...' : 'Press to Talk'}
    </motion.button>
  );
} 