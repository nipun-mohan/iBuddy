# iBuddy Design System

iBuddy should feel calm, capable, and supportive: an interview companion rather than an invisible utility.

## Brand

- Name: `iBuddy`
- Product descriptor: `Your Real-time Interview Copilot`
- Mark: rounded speech-bubble `B` with a small coral intelligence spark
- Voice: direct, reassuring, concise, and professional

## Color

| Token | Value | Use |
| --- | --- | --- |
| Navy 950 | `#06121D` | deepest chrome and shadows |
| Navy 900 | `#081B2C` | primary app surface |
| Navy 800 | `#0B2030` | elevated controls |
| Teal 500 | `#18C7B5` | primary actions and active states |
| Teal 600 | `#0FAE9F` | pressed states and gradients |
| Mint 300 | `#8EE8DC` | labels, focus, and highlights |
| Coral 400 | `#FF7A6B` | small warm accents and attention |
| White | `#FFFFFF` | high-emphasis text |

Use teal for actions and AI states, green for success, amber for warnings, and red only for destructive actions. Coral is an accent, not a substitute for error red.

## Surfaces and type

- Main cards: navy glass, 22–26 px radius, subtle white border.
- Nested controls: slightly lighter navy, 10–14 px radius.
- Primary typeface: Inter for UI; JetBrains Mono only for code, transcripts, and shortcuts.
- Text hierarchy: white at 90% for titles, 60–75% for body, 35–45% for metadata.

## Interaction

- Only dedicated headers are draggable in frameless windows.
- Inputs, buttons, and scroll regions must always use `no-drag`.
- Focus uses a teal border and low-opacity teal ring.
- Primary buttons use the teal 500 → teal 600 gradient.

## Icon assets

- `icon.png`: 1024 px application icon master used by packaging.
- `src/assets/logo.png`: 512 px renderer asset.
- `public/favicon.png`: 256 px renderer/favicon asset.
- `build/ibuddy-icon-master.png`: generated source master retained for future exports.
