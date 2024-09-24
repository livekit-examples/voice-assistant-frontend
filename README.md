# Voice assistant frontend

A minimalistic frontend for interacting with [LiveKit Agents](https://docs.livekit.io/agents).

![Screenshot of the frontend application.](/.github/assets/frontent-screenshot.jpeg)

> [!TIP]
> The best way to test this application along with many others is to use [LiveKit Sandbox](https://cloud.livekit.io/projects/p_/sandbox). Spin up your sandbox in a matter of seconds and test and share your local agents without having to worry about hosting your front end.

## Development setup

- Copy and rename `.env.example` to `.env.local`, then add the required environment variables to connect to your LiveKit server.

> [!TIP]
> If you are using **LiveKit Cloud**, you can find your project environment variables [here](https://cloud.livekit.io/projects/p_/settings/keys).

```shell
# Make sure dependencies are installed (only required once).
pnpm install
# Run den local development server.
pnpm dev
# Open http://localhost:3000 in your browser.
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
