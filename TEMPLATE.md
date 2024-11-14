## Overview

A Next.js frontend for a simple AI voice assistant using LiveKit's official [React Components](https://github.com/livekit/components-js/) library and styled with TailwindCSS. The application implements its own token server, and is designed to be used with any voice-enabled agent built using our [Agents Framework](https://docs.livekit.io/agents/).

## Sandbox

When deployed in a sandbox, LiveKit will host an instance of this application for you, providing a unique, shareable URL through which you can access it. Any agents running with the same LiveKit project credentials will join, meaning that you can rapidly iterate on your agent prototypes, and share the results instantly with friends and colleagues. To begin testing your agent, deploy this app in sandbox then set up an agent on your local machine using the [LiveKit CLI](https://docs.livekit.io/home/cli/cli-setup/):

```console
lk app create --template voice-pipeline-agent-python 
```

**NOTE:** For a list of all available templates, run `lk app create` with no arguments.


## Installation

To run this application locally, clone the repo or use the [LiveKit CLI](https://docs.livekit.io/home/cli/cli-setup/):

```console
lk app create --template voice-assistant-frontend
```

For more information on prototyping using LiveKit Sandbox, see the [documentation](https://docs.livekit.io/home/cloud/sandbox/).
