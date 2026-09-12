# iBuddy for macOS

This port keeps the Electron/React experience from the Windows app and adds a
native macOS application menu, menu-bar operation, Command-key shortcuts,
privacy permission handling, Apple Silicon/Intel builds, hardened-runtime
entitlements, and macOS system-audio metadata.

## Requirements

- macOS 13 or newer for system-audio capture; macOS 14.2 or newer is recommended.
- Node.js 20 or newer and Xcode Command Line Tools for local builds.
- Screen & System Audio Recording and Microphone permissions when prompted.

On older macOS releases, Chromium cannot capture system audio without a virtual
audio device such as BlackHole. Screen screenshots and microphone input still work.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
# Current Mac architecture
npm run package:mac

# Apple Silicon only
npm run package:mac:arm64
```

The build produces DMG and ZIP artifacts under `dist/`. ZIP is included because
the macOS auto-updater requires it in published releases.

Local builds use an ad-hoc signature. Before public distribution, replace the
`mac.identity` setting with a Developer ID Application identity, configure Apple
notarization credentials, set `mac.notarize` appropriately, and publish both the
DMG and ZIP artifacts.

## macOS shortcuts

The app uses the Command key where the Windows build uses Control: `⌘E` captures
the screen, `⌘Return` asks AI, `⌘B` toggles visibility, `⌘N` starts the next
question, and `⌘G` resets the session. All bindings remain configurable.

## Capture-protection note

The app enables Electron's native content protection. On macOS this is best
effort: newer ScreenCaptureKit-based recording software may ignore the legacy
window-sharing exclusion. The app also hides itself briefly before its own
screenshots, but no macOS app can guarantee invisibility to every capture tool.
