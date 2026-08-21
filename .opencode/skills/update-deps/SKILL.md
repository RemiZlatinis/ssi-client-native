---
name: update-deps
description: Routine dependency updates for ssi-client-native via Expo-aware checks. Use for chore(deps) PRs — bumping in-range packages and realigning Expo-managed packages to the current SDK version. Not for Expo SDK upgrades (see the upgrading-expo skill for that).
---

# Update Dependencies Skill — ssi-client-native

> Repository-local skill for reliably updating dependencies via Expo-aware checks. Use for any `chore(deps)` PR.

## When to Use

- Checking for outdated packages (`bun outdated`, `expo install --check`)
- Bumping truly independent packages and realigning Expo-managed packages to the current SDK version
- Creating a `chore(deps): ...` PR with CI-green guarantees
- **Not** for Expo SDK upgrades (54→57 etc.) — that's a separate `chore(expo): ...` flow with full Android/iOS/Web QA (see the `upgrading-expo` skill)

## Non-Negotiables (AGENTS.md)

- `bun` is the only package manager (`bun.lock`, `packageManager: bun@1.2.0`)
- `bunx expo install --check --bun` / `--fix --bun` is the source of truth for Expo SDK compatibility — never `bun update` an Expo-managed package
- `expo`, `react`, and `react-native` versions are SDK anchors — this skill never bumps them; if any of the three changes as a side effect of this flow, stop (see Phase 3, Guard step)
- Commits follow `type(scope): short description` with `why` in body (`AGENTS.md:195`, scopes: `screens, components, api, navigation, auth, notifications, deps`)
- CI (`.github/workflows/ci.yml`) must stay green; `pre-push` (`lint` + `typecheck`) must exit 0
- PRs are opened non-interactively — no step in this flow requires a GUI, so it can run unattended on a schedule
- PR creation prefers the GitHub MCP when connected this session (check the active tool list for a PR-creation tool, e.g. `create_pull_request` under a `github`-namespaced tool); falls back to `gh pr create` only when no such tool is present. Either path leaves a real, open PR — **this skill never merges.** Merge is always a manual step on GitHub.

## Step-by-Step Runbook

### Phase 0 — Preparation (one branch per PR, timestamped to avoid collisions)

```bash
git switch main && git pull
git switch -c chore/deps-YYYY-MM-DD-HHMM   # e.g. chore/deps-2026-08-21-1430
git status --short --branch                 # must be clean
# Ensure node_modules matches lockfile (critical after switching branches):
rm -rf node_modules && bun install --frozen-lockfile
```

> **Lesson:** `node_modules` leaks across branches. Always clean-install after switching, or `bun outdated` Current will lie.

### Phase 1 — Classify (Expo-managed vs independent)

```bash
# 1a — Expo's view (authoritative for SDK):
bunx expo install --check --bun
# If it reports outdated, note the list of Expo-managed packages (e.g. expo-constants, jest-expo).
# If `expo`, `react`, or `react-native` themselves appear in the report, STOP — those are SDK
# anchors and belong to the `upgrading-expo` flow, never this one (see Phase 3 Guard).

# 1b — Package-manager view:
bun outdated
# Focus on the `Update` column (not `Latest`). Ignore rows Expo already flagged.
# Remaining rows with Update ≠ Current and not Expo-managed are candidates for `bun update`
# Example independent: baseline-browser-mapping, apisauce

# 1c — Record any row where Latest ≠ Update (a major is available but out of scope here).
# These are NOT updated in this flow — carry the list into the PR body (Phase 5) as
# "Deferred, needs manual review" so they stay visible instead of silently disappearing.
```

> **Lesson:** `bunx expo install --check` without `--bun` fails with `npx not found` on this repo (no npm). Always pass `--bun`.

### Phase 2 — Update (one tool at a time, separate commits if both kinds)

```bash
# Expo-managed only (if any):
bunx expo install --fix --bun
git diff --stat   # expect bun.lock + package.json

# Independent only (if any, and Expo said "Dependencies are up to date"):
bun update baseline-browser-mapping   # list explicitly, never bare `bun update`
git diff --stat
```

> **Do not** mix SDK major bumps (e.g. 54→57) with minors — majors get their own `chore(expo): ...` branch with full Android/iOS/Web QA per `AGENTS.md:56`.

### Phase 3 — Verify (all must exit 0)

```bash
# Guard: confirm expo/react/react-native majors didn't move. This flow only ever touches
# them via `expo install --fix`, which realigns TO the currently-installed expo version and
# never bumps expo itself — this check turns that assumption into a verified fact.
if git diff main -- package.json | grep -qE '^\+[[:space:]]*"(expo|react|react-native)":'; then
  echo "STOP: an SDK anchor package changed — this belongs in the SDK-upgrade flow, not here."
  exit 1
else
  echo "OK: SDK anchors unchanged"
fi

bun install --frozen-lockfile          # proves lockfile valid, no `bun.lock` drift
bun audit --audit-level=moderate       # CVE check — expo install/expo-doctor don't cover this
bunx expo-doctor                       # baseline failures below are expected, not blockers
bun run lint
bun run typecheck
bun run test --passWithNoTests         # repo has no tests, --passWithNoTests is intentional
bun run format:check
bash .husky/pre-push                   # same as CI, must exit 0 (has set -e + bun PATH guard)
# Optional, catches bun 1.2.0 vs 1.3.14 lockfile drift before push:
# (requires podman/docker + act + DOCKER_HOST=unix:///run/user/$(id -u)/podman/podman.sock)
act pull_request -W .github/workflows/ci.yml
```

> **`expo-doctor` baseline — check by name, not by count.** Known, accepted failures as of the
> last clean run:
>
> - [ ] npm-missing check (repo has no npm, bun-only)
> - [ ] duplicate `@react-navigation/native`
> - [ ] duplicate `expo-constants`
>
> If `expo-doctor` fails with a **different set** of checks than the list above — even if the
> total count happens to still match — treat it as a new regression, not baseline noise. Any
> failure not in this explicit list is blocking. A matching count caused by a different failure
> is a false negative waiting to happen.
>
> **Gotcha:** `expo-env.d.ts` is gitignored but tracked and generated — it must be in `.prettierignore` or `lint`/`format:check` will fail. `app/menu/index.tsx` typed routes need `Href` (`satisfies { route: Href | null }[]`) after react-navigation 7.3.

### Phase 4 — Fix Gate Blockers (prerequisite commit, same PR)

If verification fails, fix in this PR as a first commit (gate must be green to merge). Use the appropriate scope from the allowed list (`screens, components, api, navigation, auth, notifications, deps`) matching the changed files:

- `.prettierignore` → `expo-env.d.ts` → `fix(deps): add expo-env.d.ts to prettierignore`
- `app/menu/index.tsx` Href typing → `fix(navigation): update menu items to satisfy Href type`
- Verify again until all green

### Phase 5 — PR

```bash
git add bun.lock package.json [other changed files] .prettierignore
git commit -m "chore(deps): bump <what> to <versions>

<why, not just what>"
git push -u origin chore/deps-YYYY-MM-DD-HHMM
```

**Open the PR — MCP-first, CLI fallback:**

1. Check this session's tool list for a GitHub MCP PR-creation tool before doing anything else.
   If one is present:
   - Confirm it has write scope on this repo (can open PRs), not just read/browse — if that's
     unclear from the tool description, treat it as absent and use the CLI path instead of
     guessing.
   - Call it with `title`, `head` (`chore/deps-YYYY-MM-DD-HHMM`), `base` (`main`), and the `body`
     template below. Note the returned PR URL/number in your summary back to the user.
2. If no such tool is available this session, fall back to `gh pr create`:

```bash
gh pr create \
  --title "chore(deps): bump <summary>" \
  --body "$(cat <<'EOF'
## What
- <what changed, Expo-managed vs independent>

## Deferred (major available, needs manual review)
- <rows from Phase 1c where Latest ≠ Update — or "none">

## Testing
- `bash .husky/pre-push` exits 0
- `bun audit` and `expo-doctor` reviewed against baseline
- CI pending (check after push, update before merge)
EOF
)"
```

**After opening:** verify remote CI before any green claim — poll `gh pr checks <number> --watch`
(CLI path) or the PR's check status via MCP until `.github/workflows/ci.yml` completes. Until
then the PR body stays at "CI pending" — update it to the real result only once checks finish.
Local gates passing is never evidence that remote CI passed.

**Both paths stop here.** This skill's job is "PR opened, local gates green, CI status reported
honestly" — it never merges, squash or otherwise. Leave it for manual review: self-review
"Files changed", let CodeRabbit review, then merge from the GitHub UI once satisfied.

**After the PR is merged on GitHub (by you, manually):**

```bash
git switch main && git pull && git branch -d chore/deps-YYYY-MM-DD-HHMM && git fetch --prune
```

### Cleanup When Testing

Temp branches created by this skill should be deleted after verification. Always switch to main first to avoid deleting the current branch. Before deleting anything, confirm ownership: the branch's HHMM stamp must match this run, and no open PR may still reference it. Remote deletion additionally requires explicit user confirmation — never assume:

```bash
git switch main
git branch -D chore/deps-YYYY-MM-DD-HHMM
# Only after confirming this run created the remote branch (matching HHMM stamp, no open PR on it):
git push origin --delete chore/deps-YYYY-MM-DD-HHMM
```

## Common Pitfalls

- **Using `bun update` for Expo packages** — breaks SDK compatibility. Use `bunx expo install --fix --bun`.
- **Skipping `rm -rf node_modules && bun install --frozen-lockfile` after branch switch** — `bun outdated` lies.
- **Forgetting `--bun` on expo commands** — fails with `npx not found`.
- **Treating `expo-doctor`'s pass count as the check** — verify the _specific_ failure set matches baseline, not just the number (14/18 can hide a new failure if it coincidentally offsets a fixed one).
- **Not handling `set -e` in `.husky/pre-push`** — lint failing but typecheck passing would still push.
- **Skipping `bun audit`** — `expo install --check`/`expo-doctor` cover SDK compatibility, not CVEs. Neither substitutes for the other.
- **Silently dropping majors surfaced by `bun outdated`'s `Latest` column** — capture them in the PR body (Phase 1c) even when not acting on them, so they don't become invisible technical debt.
- **Opening the PR interactively** — this skill is meant to run unattended; use the GitHub MCP or `gh pr create`, not an editor extension.
- **Assuming the GitHub MCP is connected and write-capable without checking** — if it's absent this session, or only has read/browse scope, the PR step must fall back to `gh pr create` rather than fail or guess.
- **Merging automatically from either PR path** — this skill stops at "PR opened, CI verified." Merge is a manual step on GitHub, every time.
