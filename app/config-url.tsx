const urlConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_HTTPS_URL || "https://askme-server-1081098542602.us-central1.run.app/",
    webSocketUrl : process.env.REACT_APP_WS_URL || "wss://jpmc-askme-5ykvxg3u.livekit.cloud",
    secretCode: process.env.REACT_APP_SECRET_CODE || "cdeb49d0-534f-4216-84ed-3261bcc3f7d6",
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
  