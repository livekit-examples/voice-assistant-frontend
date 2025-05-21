"use client";
import * as React from "react";

import { AgentControlBar } from "@/components/livekit/agent-control-bar/agent-control-bar";

export default function SessionView() {
  return (
    <main>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-muted-foreground sm:pl-3">
            A control bar component.
          </h2>
        </div>
        <div className="flex items-center justify-center min-h-[200px] relative">
          <AgentControlBar />
        </div>
      </div>
    </main>
  );
}
