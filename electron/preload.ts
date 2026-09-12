import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ibuddy", {
  platform: process.platform,
  // Open URL in system browser (Chrome etc)
  openExternal: (url: string): void => ipcRenderer.send("ibuddy:open-external", url),
  getMediaPermissions: (): Promise<{ platform: string; microphone: string; screen: string }> =>
    ipcRenderer.invoke("ibuddy:get-media-permissions"),
  requestMicrophone: (): Promise<boolean> => ipcRenderer.invoke("ibuddy:request-microphone"),
  openPrivacySettings: (section: "microphone" | "screen"): void =>
    ipcRenderer.send("ibuddy:open-privacy-settings", section),

  // System Audio source fetcher
  getDesktopSources: (): Promise<{id: string, name: string}[]> =>
    ipcRenderer.invoke("ibuddy:get-desktop-sources"),

  // Mouse click-through control
  enableMouse: (): void => ipcRenderer.send("ibuddy:enable-mouse"),
  disableMouse: (): void => ipcRenderer.send("ibuddy:disable-mouse"),

  // Window control
  hide: (): void => ipcRenderer.send("ibuddy:hide"),
  show: (): void => ipcRenderer.send("ibuddy:show"),
  quit: (): void => ipcRenderer.send("ibuddy:quit"),
  copyText: (text: string): Promise<boolean> => ipcRenderer.invoke("ibuddy:copy-text", text),
  minimize: (): void => ipcRenderer.send("ibuddy:minimize"),
  toggleMaximize: (): void => ipcRenderer.send("ibuddy:toggle-maximize"),
  setWindowLayout: (layout: "compact" | "interview"): void => ipcRenderer.send("ibuddy:set-window-layout", layout),
  prepareHomeLayout: (): Promise<void> => ipcRenderer.invoke("ibuddy:prepare-home-layout"),
  getVersion: (): string => ipcRenderer.sendSync("ibuddy:get-version"),
  onShow: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:show", listener);
    return () => ipcRenderer.removeListener("ibuddy:show", listener);
  },

  // Capture
  captureFullscreen: (): Promise<string> =>
    ipcRenderer.invoke("ibuddy:capture-fullscreen"),
  attachResume: (): Promise<{ name: string; text: string } | null> =>
    ipcRenderer.invoke("ibuddy:attach-resume"),

  // Settings persistence
  getSettings: (): Promise<any> => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: any): Promise<void> =>
    ipcRenderer.invoke("save-settings", settings),

  // Opacity control
  setOpacity: (value: number): void => ipcRenderer.send("ibuddy:set-opacity", value),

  // History persistence
  getHistory: (): Promise<any[]> => ipcRenderer.invoke("get-history"),
  saveHistory: (history: any[]): Promise<void> =>
    ipcRenderer.invoke("save-history", history),

  // Profile persistence
  getSavedProfile: (): Promise<any> => ipcRenderer.invoke("get-saved-profile"),
  saveProfile: (profile: any): Promise<void> =>
    ipcRenderer.invoke("save-profile", profile),

  // Auth / User
  getUser: (): Promise<any> => ipcRenderer.invoke("get-user"),
  saveUser: (user: any): Promise<void> => ipcRenderer.invoke("save-user", user),
  logoutUser: (): Promise<void> => ipcRenderer.invoke("logout-user"),
  getAds: (): Promise<any[]> => ipcRenderer.invoke("get-ads"),
  saveAds: (ads: any[]): Promise<void> => ipcRenderer.invoke("save-ads", ads),
  onAuthToken: (cb: (data: { token: string; user: any }) => void): (() => void) => {
    const listener = (_: any, data: { token: string; user: any }): void => cb(data);
    ipcRenderer.on("ibuddy:auth-token", listener);
    return () => ipcRenderer.removeListener("ibuddy:auth-token", listener);
  },
  getPendingAuthToken: (): Promise<{ token: string; user: any } | null> =>
    ipcRenderer.invoke("ibuddy:get-pending-auth-token"),

  // Deep link callback (Google OAuth)
  onDeepLink: (cb: (url: string) => void): (() => void) => {
    const listener = (_: any, url: string): void => cb(url);
    ipcRenderer.on("ibuddy:deep-link", listener);
    return () => ipcRenderer.removeListener("ibuddy:deep-link", listener);
  },

  // Events from main process (hotkeys)
  onScreenshot: (cb: (b64: string) => void): (() => void) => {
    const listener = (_: any, b64: string): void => cb(b64);
    ipcRenderer.on("ibuddy:screenshot", listener);
    return () => ipcRenderer.removeListener("ibuddy:screenshot", listener);
  },

  onSolve: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:solve", listener);
    return () => ipcRenderer.removeListener("ibuddy:solve", listener);
  },

  onStartOver: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:start-over", listener);
    return () => ipcRenderer.removeListener("ibuddy:start-over", listener);
  },

  onNextQuestion: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:next-question", listener);
    return () => ipcRenderer.removeListener("ibuddy:next-question", listener);
  },

  onManualSend: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:manual-send", listener);
    return () => ipcRenderer.removeListener("ibuddy:manual-send", listener);
  },

  onPrevQuestion: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:prev-question", listener);
    return () => ipcRenderer.removeListener("ibuddy:prev-question", listener);
  },

  onNextQuestionPage: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:next-question-page", listener);
    return () => ipcRenderer.removeListener("ibuddy:next-question-page", listener);
  },

  // Auto updater
  onUpdateAvailable: (cb: (version: string) => void): (() => void) => {
    const listener = (_: any, version: string): void => cb(version);
    ipcRenderer.on("ibuddy:update-available", listener);
    return () => ipcRenderer.removeListener("ibuddy:update-available", listener);
  },
  onUpdateProgress: (cb: (percent: number) => void): (() => void) => {
    const listener = (_: any, percent: number): void => cb(percent);
    ipcRenderer.on("ibuddy:update-progress", listener);
    return () => ipcRenderer.removeListener("ibuddy:update-progress", listener);
  },
  onUpdateDownloaded: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:update-downloaded", listener);
    return () => ipcRenderer.removeListener("ibuddy:update-downloaded", listener);
  },
  onUpdateNotAvailable: (cb: () => void): (() => void) => {
    const listener = (): void => cb();
    ipcRenderer.on("ibuddy:update-not-available", listener);
    return () => ipcRenderer.removeListener("ibuddy:update-not-available", listener);
  },
  onUpdateError: (cb: (msg: string) => void): (() => void) => {
    const listener = (_: any, msg: string): void => cb(msg);
    ipcRenderer.on("ibuddy:update-error", listener);
    return () => ipcRenderer.removeListener("ibuddy:update-error", listener);
  },
  downloadUpdate: (): void => ipcRenderer.send("ibuddy:download-update"),
  installUpdate: (): void => ipcRenderer.send("ibuddy:install-update"),
  checkForUpdates: (): void => ipcRenderer.send("ibuddy:check-update"),

  // NVIDIA API proxy
  nvidiaApiCall: (apiKey: string, body: any): Promise<{ ok: boolean; status: number; data: string }> =>
    ipcRenderer.invoke("nvidia-api-call", { apiKey, body }),
  nvidiaListModels: (apiKey: string): Promise<{ ok: boolean; status: number; data: string }> =>
    ipcRenderer.invoke("nvidia-list-models", { apiKey }),
  nvidiaTestKey: (apiKey: string): Promise<{ ok: boolean; status: number; data: string }> =>
    ipcRenderer.invoke("nvidia-test-key", { apiKey }),
  openaiTestKey: (apiKey: string): Promise<{ ok: boolean; status: number; data: string }> =>
    ipcRenderer.invoke("openai-test-key", { apiKey }),

  // Anthropic API proxy
  anthropicApiCall: (apiKey: string, body: any): Promise<{ ok: boolean; status: number; data: string }> =>
    ipcRenderer.invoke("anthropic-api-call", { apiKey, body }),

  // Keyboard shortcuts
  getShortcuts: (): Promise<Record<string, string>> => ipcRenderer.invoke("ibuddy:get-shortcuts"),
  updateShortcuts: (bindings: Record<string, string>): Promise<{ ok: boolean; failed: string[] }> =>
    ipcRenderer.invoke("ibuddy:update-shortcuts", bindings),
  resetShortcuts: (): Promise<{ ok: boolean; failed: string[] }> =>
    ipcRenderer.invoke("ibuddy:reset-shortcuts"),
});
