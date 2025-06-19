import * as React from 'react';
import { LogLevel, setLogLevel } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';

export const useDebugMode = ({ logLevel }: { logLevel?: LogLevel } = {}) => {
  const room = useRoomContext();

  React.useEffect(() => {
    setLogLevel(logLevel ?? 'debug');

    // @ts-expect-error
    window.__lk_room = room;

    return () => {
      // @ts-expect-error
      window.__lk_room = undefined;
    };
  }, [room, logLevel]);
};
