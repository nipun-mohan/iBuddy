# Security Policy 🛡️

## Privacy & BYOK Architecture

**iBuddy Desktop App** is built with a **100% Privacy-First, Bring Your Own Key (BYOK)** architecture:

1. **Local Key Storage**: Your AI provider API keys (Gemini, Groq, OpenAI, Anthropic, OpenRouter) and custom settings are stored strictly on your local machine via local storage / electron store.
2. **Direct API Calls**: AI requests travel directly from your app to the official API endpoints over TLS/HTTPS.
3. **Stealth Overlay Security**: On Windows, iBuddy uses native OS APIs (`WDA_EXCLUDEFROMCAPTURE`) to ensure the overlay window remains invisible to screen capturing applications (Zoom, Google Meet, Microsoft Teams, Discord).

---

## Reporting a Vulnerability

To report a security vulnerability or bug in iBuddy Desktop App:

Open a private security advisory in the [iBuddy repository](https://github.com/nipun-mohan/iBuddy/security/advisories/new).

We review all security reports promptly and coordinate fixes before public release.
