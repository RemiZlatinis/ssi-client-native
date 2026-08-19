# SSI Client (Native)

> The native client of the Service Status Indicator (SSI) monitoring system, built with Expo.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Tip:** if you're setting up the whole SSI ecosystem (agent, backend, clients) rather than just this repo, use the [workspace setup script](https://github.com/RemiZlatinis/ssi) in the metarepository instead — it clones and bootstraps all components for you.

## 📖 Overview

The **SSI Client (Native)** is the user-facing application of the SSI ecosystem. It is an Expo SDK / React Native app that connects to the `ssi-backend` and displays the real-time status of all your monitored agents and services.

> **Naming note:** this repository is named `ssi-client-native`, but the app slug and package identifier are still `ssi-client-mobile` (the identifier cannot change for Google Play). Web is a first-class platform despite the name.

It is a **display-only** client: the backend is always the source of truth. The app never caches status data, never stores business logic, and does not support offline mode.

## ✨ Key Features

- **Real-Time Status**: Live updates for agents and services via SSE (and REST for everything else).
- **Three Platforms**: Android (primary), iOS, and Web — one codebase.
- **Google Sign-In**: Single sign-on flow, using the browser redirect on Web and the native SDK on mobile.
- **Push Notifications**: Android & iOS notifications for agent and service status changes, delivered through FCM/APNs via `expo-notifications`.
- **Secure Sessions**: Session tokens stored in `expo-secure-store` on native; cookie-based sessions on Web.
- **Agent Onboarding**: Register new agents directly from the app by entering the code printed by the `ssi-agent` CLI.

## 🚀 Getting Started

### Prerequisites

- **Bun**: the runtime and package manager — Node.js, `npm`, `pnpm`, and `yarn` are not used
- **A running SSI Backend**: the app is useless without it — see the [backend README](https://github.com/RemiZlatinis/ssi-backend#readme) or use the [metarepository workspace script](https://github.com/RemiZlatinis/ssi) to set it up
- **A Google OAuth Web Client ID**: required for authentication (see below)

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable                           | Required     | Purpose                                                                                                                                                                           |
| ---------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_BACKEND_URL`          | ✅           | Base URL of the SSI backend (e.g. `https://192.168.1.20:8000/`). The app refuses to start without it.                                                                             |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | ✅           | Google OAuth **Web** client ID used for Google Sign-In. The app refuses to start without it.                                                                                      |
| `EXPO_PUBLIC_DEV_WEB_URL`          | Web dev only | Backend URL for the web platform in development — must be `http://localhost:8000/` style so the browser can reach it without CORS/mixed-content issues. Never used in production. |

> **Google Web Client ID is a hard requirement.** Create a Web client ID in Google Cloud Console for your OAuth 2.0 credentials, then register it as an allowed provider on your SSI backend instance. Without it, every login flow will fail.

> In development on Android/iOS, `EXPO_PUBLIC_BACKEND_URL` must point to a backend reachable from your device/emulator (`localhost` won't work — use your machine's LAN IP, as in `.env.example`).

### Installation

```bash
git clone https://github.com/RemiZlatinis/ssi-client-native.git
cd ssi-client-native
bun install
```

### Running the App

```bash
bun start                 # Start the Expo dev server (QR code for devices)
bun run android           # Build & launch on an Android emulator/device
bun run ios               # Build & launch on an iOS simulator (macOS only)
bun run web               # Launch in the browser
```

- **Android** is the primary platform (Google Play distribution).
- **iOS** runs on the simulator or a device (requires macOS + Xcode).
- **Web** is served via Expo Web; production deployment is configured for Vercel (`vercel.json`).

## 🛠️ Development

### Quality Commands

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `bun run lint`         | ESLint                                    |
| `bun run typecheck`    | TypeScript type checking (`tsc --noEmit`) |
| `bun run test`         | Jest (Expo preset)                        |
| `bun run format`       | Prettier fix                              |
| `bun run format:check` | Prettier check                            |

These run automatically in CI (`.github/workflows/ci.yml`) on every push to `main` and on pull requests.

### Architecture Notes for Contributors

- **Data flow**: `ssi-backend` (authoritative) → REST + SSE → this app (display only). Never reconstruct backend state from partial data.
- **No offline mode**: the app shows "Unable to connect" when the backend is unreachable — status data is never cached.
- **Auth**: native apps exchange a Google ID token for a backend `X-Session-Token`, stored in `expo-secure-store`; web relies on cookie sessions handled by the browser (plus CSRF headers).
- **Push notifications**: native only; devices register themselves with the backend's `notifications` API. Android builds need a `google-services.json` (passed via the `GOOGLE_SERVICES_JSON` env var at build time).

See [AGENTS.md](./AGENTS.md) for the full architecture, non-negotiables, and contribution rules.

### Building with EAS

Cloud builds are configured in `eas.json` with three profiles:

```bash
eas build --profile development   # dev client (internal)
eas build --profile preview       # APK for internal testing
eas build --profile production    # store-ready build (auto-increments version)
```

Refer to the [EAS documentation](https://docs.expo.dev/build/introduction/) for account and signing setup.

## 📚 Documentation

- [**AGENTS.md**](./AGENTS.md) - Architecture, scope, and development rules for this repository.
- [**SSI Metarepository**](https://github.com/RemiZlatinis/ssi) - High-level overview, architecture, and ecosystem docs.
- [**SSI Backend**](https://github.com/RemiZlatinis/ssi-backend) - The API and real-time backend this app connects to.

## 🤝 Contributing

We welcome contributions! Please read the [Contributing Guidelines](https://github.com/RemiZlatinis/ssi/blob/main/CONTRIBUTING.md) in the SSI Metarepository.

**Before submitting a PR, ensure:**

1. Code follows the existing component structure and UX (see AGENTS.md)
2. Your feature branch is based on `main`
3. Commit messages follow conventional commit format
4. All checks pass: `bun run lint && bun run typecheck && bun run format:check`

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
