import type { VoiceAssistantState } from "@livekit/components-react";
import React from "react";
interface NoAgentNotificationProps extends React.PropsWithChildren<object> {
  state: VoiceAssistantState;
}

/**
 * Renders some user info when no agent connects to the room after a certain time.
 */
export function NoAgentNotification(props: NoAgentNotificationProps) {
  const timeToWaitMs = 6000;
  const timeoutRef = React.useRef<number | null>(null);
  const [showNotification, setShowNotification] = React.useState(false);

  React.useEffect(() => {
    if (props.state === "connecting") {
      timeoutRef.current = window.setTimeout(() => {
        if (props.state === "connecting") {
          setShowNotification(true);
        }
      }, timeToWaitMs);
    } else {
      setShowNotification(false);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [props.state]);

  React.useEffect(() => {}, [props.state]);

  return (
    <>
      {showNotification ? (
        <div className="fixed text-sm bottom-[var(--lk-control-bar-height)] border border-cyan-500 font-mono m-4 w-96 max-w-[80vw] px-4 py-3 rounded left-0 bg-[var(--lk-bg)]">
          {props.children}
        </div>
      ) : null}
    </>
  );
}
