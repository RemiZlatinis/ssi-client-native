# AGENTS.md — ssi-client-mobile

> **This file takes precedence over README.md when directives conflict.**  
> **Architectural intent must be preserved over convenience.**

---

## Scope

### What This Repository Is

- Native client application built with Expo (SDK 54)/React Native
- Displays real-time system status from backend
- Provides alerts and status summaries to users
- Supports Android, iOS, and Web platforms

### What This Repository Is NOT

- A source of truth for system status
- An offline-capable application
- An admin interface
- A Dashboard
- A business logic engine

### Important Naming Note

> Repository is named `ssi-client-mobile` but supports Web as a first-class platform.  
> Cannot rename due to Google Play package identifier constraints.

### Interacts With

| Component             | Relationship                       |
| --------------------- | ---------------------------------- |
| `ssi-backend`         | Consumes data via REST API and SSE |
| `firebase` (external) | Push notifications                 |

---

## User Role

### Purpose

- Display real-time system status from backend
- Show agent and service status updates
- Provide push notification alerts

### Critical Rules

- **Never act as source of truth** — Backend is authoritative
- **Never cache status data** — Display real-time data only
- **Never infer backend state** — Only display what backend provides
- Show "Unable to connect" immediately when disconnected

---

## Platform Support

| Platform |  Status   | Distribution      |
| -------- | :-------: | ----------------- |
| Android  |  Primary  | Google Play Store |
| iOS      | Supported | App Store         |
| Web      | Supported | Expo Web          |

### Platform Constraints

- Respect OS-specific background execution limits
- Use platform-appropriate secure storage
- Handle push notifications per platform requirements
- Test on all three platforms before merge

---

## UX Stability Rules

AI agents **must preserve UX stability**:

| Rule                                       | Rationale                     |
| ------------------------------------------ | ----------------------------- |
| No breaking navigation flows               | Users expect consistent paths |
| No large visual redesigns without approval | Avoid "redesign enthusiasm"   |
| Incremental UX evolution preferred         | Small, testable changes       |
| Preserve existing component structure      | Maintain code organization    |

---

## API Consumption

### Data Flow

```
ssi-backend (authoritative) → REST/SSE → ssi-client-mobile (display only)
```

### Rules

- Backend is **always authoritative**
- Never reconstruct or infer backend state from partial data
- Never duplicate business logic from backend
- Handle all API errors gracefully with user-friendly messages
- Use SSE for real-time status updates

### Error Handling

- Display user-friendly error messages
- Never crash on malformed responses
- Provide retry affordances where appropriate
- Log errors for debugging (not in production visible)

---

## Offline Behavior

> **This app does NOT support offline mode.**

| Scenario             | Behavior                                |
| -------------------- | --------------------------------------- |
| App launches offline | Show "Unable to connect" screen         |
| Connection lost      | Show "Connection lost" indicator        |
| Reconnection         | Automatically restore real-time updates |

### Forbidden

- Local caching of status data
- Offline fallback logic
- "Last known status" displays
- Background sync for offline viewing

---

## Security Posture

### Allowed

- Use `expo-secure-store` for tokens and sensitive data
- Platform keystore for credentials
- Defensive handling of all API responses

### Forbidden

- Storing secrets outside platform keystores
- Privileged API operations
- Exposing debug information in production
- Trusting unvalidated backend responses

---

## Non-Negotiables

These technologies and patterns **must not be replaced** without explicit architectural approval:

| Category        | Requirement             |
| --------------- | ----------------------- |
| Framework       | Expo SDK + React Native |
| Language        | TypeScript              |
| Navigation      | Expo Router             |
| Secure Storage  | `expo-secure-store`     |
| Package Manager | pnpm                    |

---

## Forbidden Patterns

AI agents **must not introduce** the following:

| Pattern                                | Reason                     |
| -------------------------------------- | -------------------------- |
| Business logic duplication             | Backend is authoritative   |
| Hardcoded environment values           | Use environment config     |
| Debug-only code in production paths    | Security and UX risk       |
| Local caching of status data           | Real-time only             |
| Offline fallback logic                 | Not designed or supported  |
| Direct API URL hardcoding              | Use config/environment     |
| State reconstruction from partial data | Backend is source of truth |

---

## Change Discipline

| Action                      | Allowed Freely | Requires Approval | Forbidden |
| --------------------------- | :------------: | :---------------: | :-------: |
| Add new screen              |       ✅       |                   |           |
| Update component styling    |       ✅       |                   |           |
| Fix bugs                    |       ✅       |                   |           |
| Add utility functions       |       ✅       |                   |           |
| Change navigation structure |                |        ✅         |           |
| Add new npm dependency      |                |        ✅         |           |
| Modify auth flow            |                |        ✅         |           |
| Add platform-specific code  |                |        ✅         |           |
| Store data locally          |                |                   |    ❌     |
| Implement business logic    |                |                   |    ❌     |
| Add offline support         |                |                   |    ❌     |

---

## Commit Message Format

```
type(scope): short description

Optional extended body:
- Explain why, not just what
- Reference related issues if applicable
```

**Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`  
**Scopes**: `screens`, `components`, `api`, `navigation`, `auth`, `notifications`

---

## Explicit Non-Goals

The following are **not responsibilities** of this repository:

- Persisting status data (that's `ssi-backend`)
- Running monitoring checks (that's `ssi-agent`)
- Offline operation
- Admin functionality
- Business logic processing
- Data caching or synchronization
