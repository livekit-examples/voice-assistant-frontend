const urlConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_HTTPS_URL || "http://localhost:8000",
    webSocketUrl : process.env.REACT_APP_WS_URL || "wss://vassistant-a44r3kjn.livekit.cloud",
    secretCode: process.env.REACT_APP_SECRET_CODE || "c428661b-e82e-49ec-82a9-a46a16b25382",
    getFullUrl: () => {
        if (typeof window === 'undefined') return '';
        return `${window.location.origin}/#/?secret_code=${urlConfig.secretCode}`;
    },
    hasValidSecretCode: () => {
        if (typeof window === 'undefined') return false;
        const hashContent = window.location.hash.substring(1);
        const queryParams = new URLSearchParams(hashContent.substring(2));
        return queryParams.has('secret_code');
    }
  };
  
  export default urlConfig;
  