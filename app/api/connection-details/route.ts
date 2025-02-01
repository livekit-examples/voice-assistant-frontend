import {
  AccessToken,
  AccessTokenOptions,
  VideoGrant,
  AgentDispatchClient,
} from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { RoomConfiguration, RoomAgentDispatch } from "@livekit/protocol";

// Gerekli environment değişkenleri
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const SIP_OUTBOUND_TRUNK_ID = process.env.SIP_OUTBOUND_TRUNK_ID; // Çağrı tetikleme için gerekli

export const revalidate = 0;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function GET() {
  try {
    if (!LIVEKIT_URL) {
      throw new Error("LIVEKIT_URL is not defined");
    }
    if (!API_KEY) {
      throw new Error("LIVEKIT_API_KEY is not defined");
    }
    if (!API_SECRET) {
      throw new Error("LIVEKIT_API_SECRET is not defined");
    }

    // landing-denis agent için oda ve token oluşturuluyor
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10000)}`;
    const participantToken = await createParticipantToken(
      { identity: participantIdentity },
      roomName,
    );

    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName: participantIdentity,
    };
    const headers = new Headers({
      "Cache-Control": "no-store",
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phoneNumber = body.phoneNumber;
    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (!SIP_OUTBOUND_TRUNK_ID) {
      throw new Error("SIP_OUTBOUND_TRUNK_ID is not defined");
    }
    // Yeni çağrı odası oluşturuluyor
    const roomName = `voice_assistant_call_room_${Math.floor(Math.random() * 10000)}`;

    // Explicit dispatch için AgentDispatchClient kullanılıyor.
    const agentDispatchClient = new AgentDispatchClient(LIVEKIT_URL!, API_KEY!, API_SECRET!);
    const dispatch = await agentDispatchClient.createDispatch(roomName, "landing-denis-call", {
      metadata: phoneNumber,
    });

    return NextResponse.json({
      message: "Dispatch created successfully",
      roomName: roomName,
      dispatch,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(userInfo: AccessTokenOptions, roomName: string) {
  const at = new AccessToken(API_KEY!, API_SECRET!, { ...userInfo, ttl: "15m" });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  const config = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: "landing-denis",
      }),
    ],
  });
  at.roomConfig = config;
  return at.toJwt();
}