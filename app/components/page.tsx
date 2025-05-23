'use client';

import * as React from 'react';
import { Room, Track } from 'livekit-client';
import { RoomContext } from '@livekit/components-react';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { DeviceSelect } from '@/components/livekit/device-select';
import { TrackToggle } from '@/components/livekit/track-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ComponentsOverview() {
  const [source, setSource] = React.useState<Track.Source>(Track.Source.Microphone);
  const room = React.useMemo(() => new Room(), []);

  React.useEffect(() => {
    if (room.state === 'disconnected') {
      room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, process.env.NEXT_PUBLIC_LIVEKIT_TOKEN);
    }
    return () => {
      room.disconnect();
    };
  }, [room]);

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Quick Start UI overview</h1>
        <p className="text-muted-foreground">
          A quick start UI overview for the LiveKit Voice Assistant.
        </p>
      </header>
      <RoomContext.Provider value={room}>
        <main className="flex flex-1 flex-col gap-8">
          <div className="relative flex min-h-[250px] flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-muted-foreground text-sm sm:pl-3">A device select component.</h2>
            </div>
            <div className="relative flex min-h-[100px] items-center justify-center">
              <DeviceSelect variant="default" kind="audioinput" />
            </div>

            <div className="relative flex min-h-[100px] items-center justify-center">
              <DeviceSelect variant="small" kind="audioinput" />
            </div>
          </div>

          <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-muted-foreground text-sm sm:pl-3">A track toggle component.</h2>
              <Select value={source} onValueChange={(value) => setSource(value as Track.Source)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Track.Source.Microphone}>Microphone</SelectItem>
                  <SelectItem value={Track.Source.Camera}>Camera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex min-h-[400px] items-center justify-center">
              <TrackToggle variant="outline" source={source} />
            </div>
          </div>

          <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-muted-foreground text-sm sm:pl-3">A control bar component.</h2>
            </div>
            <div className="relative flex min-h-[200px] items-center justify-center">
              <AgentControlBar />
            </div>
          </div>
        </main>
      </RoomContext.Provider>
    </div>
  );
}
