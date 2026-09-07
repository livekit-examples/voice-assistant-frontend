import { App } from '@/components/app/app';

// Without LiveKit credentials in .env.local, the app connects to the LiveKit homepage agent,
// which takes voice and text input only.
const isHomepageAgent = !process.env.LIVEKIT_URL;
const tokenEndpoint = isHomepageAgent
  ? 'https://livekit.com/api/homepage-agent/token'
  : '/api/token';

export default function Page() {
  return (
    <App
      tokenEndpoint={tokenEndpoint}
      agentName={process.env.AGENT_NAME}
      videoEnabled={!isHomepageAgent}
    />
  );
}
