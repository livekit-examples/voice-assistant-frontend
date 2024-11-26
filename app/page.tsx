"use client";

import { motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import urlConfig from "./config-url";
import { useRouter } from 'next/navigation';
import { CloseIcon } from "@/components/CloseIcon";

const generateRandomRoomName = () => {
  return `single-${Math.floor(10000000 + Math.random() * 90000000)}`;
};


export default function Page() {
  
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [secretCode, setSecretCode] = useState<string>("");
  const serverUrl = urlConfig.webSocketUrl;
  const [type, setType] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>("Loading...");
  const [language, setLanguage] = useState("english");
  const [roomID, setRoomID] = useState("");
  const router = useRouter();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '' || !window.location.hash.includes('secret_code')) {
        window.location.replace(`${window.location.origin}/#/?secret_code=${urlConfig.secretCode}`);
        return;
      }
    }
  }, []);

  useEffect(() => {
    const extractSecretCode = () => {
      const hashContent = window.location.hash.substring(1);
      const queryParams = new URLSearchParams(hashContent.substring(2));
      const code = queryParams.get('secret_code');
      
      if (code) {
        console.log("Found secret code:", code);
        setSecretCode(code);
      } else {
        console.error('No secret code found in URL');
        window.location.replace(`${window.location.origin}/#/?secret_code=${urlConfig.secretCode}`);
      }
    };

    extractSecretCode();
  }, []);

  const onConnectButtonClicked = useCallback(async () => {
    if (loading || token || !secretCode) return;
    setLoading(true);
    
    try {
      const userName = localStorage.getItem("name") || "anonymous";
      const room = generateRandomRoomName();
      setRoomID(room);
      console.log("Generated room ID:", room);
      
      const response = await fetch(`${urlConfig.apiBaseUrl}/getToken?name=${userName}&room_name=${room}&secret_code=${secretCode}`, {  //before using this please remove authentication from the api 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error("Error fetching token", error);
      alert("Failed to connect: " + error);
    } finally {
      setLoading(false);
    }
  }, [loading, token, secretCode]);

  // Move the fetch type and title logic into a useEffect
  useEffect(() => {
    const fetchTitleAndType = async () => {
      console.log("Secret code:", secretCode);
      if (!secretCode) return;
      
      try {
        const url = `${urlConfig.apiBaseUrl}/usecase/${secretCode}/title`;
        console.log("Fetching from URL:", url);
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setType(data.type);
          setTitle(data.title);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch type and title. Status:", response.status, "Error:", errorData);
        }
      } catch (error) {
        console.error("Error fetching type and title:", error);
        setTitle("Error loading title");
      }
    };

    fetchTitleAndType();
  }, [secretCode]);

  const updateLanguage = async (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    console.log("Updating language with room ID:", roomID);
    
    try {
      const response = await fetch(`${urlConfig.apiBaseUrl}/session/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomID,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update language: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating language:", error);
      // Optionally handle the error in the UI
    }
  };

  const handleDisconnect = async () => {
    setToken(undefined);
    
    if (roomID) {
      try {
        // Wait for a few seconds to ensure the session is properly ended
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Make initial call to trigger summary generation
        await fetch(`${urlConfig.apiBaseUrl}/session/${roomID}/summary`, {
          method: 'POST',  // or GET depending on your API
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Now navigate to thank-you page
        router.push(`/thank-you?room_id=${roomID}`);
      } catch (error) {
        console.error("Error handling disconnect:", error);
        alert("There was an error ending the session. Please try again.");
      }
    }
  };

  // Add a debug log for state changes
  useEffect(() => {
    console.log("Agent state changed to:", agentState);
  }, [agentState]);

  
  return (
    <main
      data-lk-theme="default"
      className="h-full flex flex-col bg-[#fdfeff] relative p-4 md:p-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        {/* Title */}
        <h1 className="text-[2.5rem] leading-tight tracking-wide font-light text-gray-900"
            style={{
              fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: '0.02em',
              fontWeight: 300,
            }}
        >
          {title}
        </h1>
        
        <div className="relative inline-block">
          <select
            value={language}
            onChange={(e) => updateLanguage(e.target.value)}
            className="appearance-none bg-[rgba(162,103,71,255)] text-white px-4 py-2 rounded-md cursor-pointer
                     hover:bg-[rgba(142,83,51,255)] transition-all duration-200"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="mandarin">Mandarin</option>
          </select>
        </div>
      </div>

      {/* Main Content - Now white with brown accents */}
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={token !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={handleDisconnect}
        className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full bg-white rounded-lg p-8 
                   shadow-lg border border-[rgba(162,103,71,0.3)]"
      >
        {/* Visualizer Section */}
        <div className="flex-1 flex items-center justify-center">
          <SimpleVoiceAssistant 
            onStateChange={(state) => {
              console.log("SimpleVoiceAssistant state change:", state);
              setAgentState(state);
            }} 
          />
        </div>

        {/* Controls Section */}
        <div className="mt-auto pt-8">
          <ControlBar
            onConnectButtonClicked={onConnectButtonClicked}
            agentState={agentState}
          />
          <RoomAudioRenderer />
          <NoAgentNotification state={agentState} />
        </div>
      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void;
}) {
  const { state, audioTrack } = useVoiceAssistant();
  
  useEffect(() => {
    console.log("Voice Assistant state:", state);
    props.onStateChange(state);
  }, [state, props]);

  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
      <div className="w-full bg-white rounded-lg p-4"> 
        <BarVisualizer
          state={state}
          barCount={7}
          trackRef={audioTrack}
          className="agent-visualizer w-full h-64"
          options={{ 
            minHeight: 4,
            maxHeight: 200,
            barWidth: 16,
            gap: 16,
          }}
        >
          <span className="bg-[rgba(162,103,71,1)]" />
        </BarVisualizer>
      </div>
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
}) {
  
  return (
    <div className="relative h-[80px] flex items-center justify-center">
      {/* Start Conversation Button - Only show when disconnected */}
      {props.agentState === "disconnected" && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="px-8 py-3 bg-[rgba(162,103,71,255)] text-white rounded-md font-medium 
                   uppercase tracking-wide hover:bg-[rgba(142,83,51,255)] transition-all shadow-md"
          onClick={() => props.onConnectButtonClicked()}
        >
          Start a conversation
        </motion.button>
      )}

      {/* Audio Controls - Show for all states except disconnected */}
      {props.agentState !== "disconnected" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <VoiceAssistantControlBar
              className="custom-control-bar"
              controls={{ 
                leave: false,
                microphone: true 
              }}
              saveUserChoices={true}
              onDeviceError={(error) => {
                console.error('Device error:', error);
                alert('Error with audio device. Please check your microphone settings.');
              }}
              style={{
                "--lk-control-bar-bg": "transparent",
                "--lk-button-bg": "rgba(162,103,71,255)",
                "--lk-button-hover-bg": "rgba(142,83,51,255)",
                "--lk-menu-bg": "white",
                "--lk-menu-color": "#333",
                "--lk-bar-bg": "white",
                "--lk-bar-color": "white",
              } as React.CSSProperties}
            />
          </div>
          <DisconnectButton className="h-10 w-10 flex items-center justify-center bg-[rgba(162,103,71,255)] 
                                     hover:bg-[rgba(142,83,51,255)] transition-all duration-200 rounded-md">
            <CloseIcon />
          </DisconnectButton>
        </motion.div>
      )}
    </div>
  );
}
function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

