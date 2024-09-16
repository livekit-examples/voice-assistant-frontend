import {
  AccessToken,
  AccessTokenOptions,
  VideoGrant,
} from "livekit-server-sdk";
import { NextResponse } from "next/server";

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function GET() {
  try {
    // Generate participant token
    const participantIdentity = `voice_assistant_user_${Math.round(
      Math.random() * 10_000
    )}`;
    const participantToken = await createParticipantToken(
      {
        identity: participantIdentity,
      },
      "roomName"
    );

    if (LIVEKIT_URL === undefined) {
      throw new Error("LIVEKIT_URL is not defined");
    }

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName: "voice_assistant_room",
      participantToken: participantToken,
      participantName: participantIdentity,
    };
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);

      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string
) {
  const at = new AccessToken(API_KEY, API_SECRET, userInfo);
  at.ttl = "5m";
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  return at.toJwt();
}
