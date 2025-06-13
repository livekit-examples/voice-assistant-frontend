import React from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import { useTracks } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { AgentTile } from './agent-tile';
import { VideoTile } from './video-tile';

const MotionAgentTile = motion.create(AgentTile);
const MotionVideoTile = motion.create(VideoTile);

const animationProps = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
  transition: {
    type: 'spring',
    stiffness: 675,
    damping: 75,
    mass: 1,
  },
};

const classNames = {
  // Agent chat open with second tile
  // Column 1 / Row 1
  // x-end y-center
  agentChatOpenWithSecondTile: ['col-start-1 row-start-1', 'self-center justify-self-end'],
  // Agent chat open without second tile
  // Column 1 / Row 1 / Column-Span 2
  // x-center y-center
  agentChatOpenWithoutSecondTile: ['col-start-1 row-start-1', 'col-span-2', 'place-content-center'],
  // Agent chat closed
  // Column 1 / Row 1 / Column-Span 2 / Row-Span 3
  // x-center y-center
  agentChatClosed: ['col-start-1 row-start-1', 'col-span-2 row-span-3', 'place-content-center'],
  // Second tile chat open
  // Column 2 / Row 1
  // x-start y-center
  secondTileChatOpen: ['col-start-2 row-start-1', 'self-center justify-self-start'],
  // Second tile chat closed
  // Column 2 / Row 2
  // x-end y-end
  secondTileChatClosed: ['col-start-2 row-start-2', 'place-content-end'],
};

interface MediaTilesProps {
  chatOpen: boolean;
}

export function MediaTiles({ chatOpen }: MediaTilesProps) {
  const [cameraTrack] = useTracks([Track.Source.Camera]);
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);

  const isCameraVisible = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareVisible = screenShareTrack && !screenShareTrack.publication.isMuted;
  const hasSecondTile = isCameraVisible || isScreenShareVisible;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-8 bottom-32 z-50 md:top-12 md:bottom-40">
      <div className="relative mx-auto h-full max-w-2xl px-4 md:px-0">
        {/* GRID: 2 columns x 3 rows / min-content, 1fr, min-content */}
        <div className="grid h-full w-full grid-cols-2 grid-rows-[min-content_1fr_min-content] place-content-center">
          {/* agent */}
          <div
            className={cn([
              'grid place-content-center',
              !chatOpen && classNames.agentChatClosed,
              chatOpen && hasSecondTile && classNames.agentChatOpenWithSecondTile,
              chatOpen && !hasSecondTile && classNames.agentChatOpenWithoutSecondTile,
            ])}
          >
            <MotionAgentTile
              key="agent"
              layoutId="agent"
              animate={{
                scale: chatOpen ? 1 : 3,
                transition: {
                  ...animationProps.transition,
                  delay: chatOpen ? 0 : 0.15,
                },
              }}
              transition={{
                ...animationProps.transition,
                delay: chatOpen ? 0 : 0.15,
              }}
            />
          </div>

          {/* camera */}
          <div
            className={cn([
              'grid',
              chatOpen && classNames.secondTileChatOpen,
              !chatOpen && classNames.secondTileChatClosed,
            ])}
          >
            <AnimatePresence>
              {isCameraVisible && (
                <MotionVideoTile
                  key="camera"
                  layout="position"
                  layoutId="camera"
                  {...animationProps}
                  trackRef={cameraTrack}
                  transition={{
                    ...animationProps.transition,
                    delay: chatOpen ? 0 : 0.15,
                  }}
                  className="h-[90px]"
                />
              )}
            </AnimatePresence>
          </div>

          {/* screen */}
          <div
            className={cn([
              'grid',
              chatOpen && classNames.secondTileChatOpen,
              !chatOpen && classNames.secondTileChatClosed,
            ])}
          >
            <AnimatePresence>
              {isScreenShareVisible && (
                <MotionVideoTile
                  key="screen"
                  layout="position"
                  layoutId="screen"
                  {...animationProps}
                  trackRef={screenShareTrack}
                  transition={{
                    ...animationProps.transition,
                    delay: chatOpen ? 0 : 0.15,
                  }}
                  className="h-[90px]"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
