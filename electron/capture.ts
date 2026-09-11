import { BrowserWindow, desktopCapturer, screen, systemPreferences } from "electron";
import { applyStealthMode, removeStealthMode, safeguardVisibility } from "./stealth";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function captureFullScreen(): Promise<string> {
  if (process.platform === "darwin") {
    const permission = systemPreferences.getMediaAccessStatus("screen");
    if (permission === "denied" || permission === "restricted") {
      throw new Error("Screen Recording access is disabled. Enable Ghostly in System Settings → Privacy & Security → Screen & System Audio Recording, then quit and reopen Ghostly.");
    }
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;

  // Max 2560px width for better text readability by vision models
  // Higher resolution = AI reads code/text more accurately
  const MAX_WIDTH = 2560;
  const targetWidth = Math.min(width, MAX_WIDTH);
  const targetHeight = Math.round((targetWidth / width) * height);

  const win = BrowserWindow.getAllWindows()[0] || null;
  const previousOpacity = win?.getOpacity() ?? 1;
  const wasVisible = Boolean(win?.isVisible());

  try {
    // Capture protection can prevent ScreenCaptureKit from returning a usable
    // display thumbnail. Hide the overlay first, then temporarily remove only
    // the protection flag while Electron performs its own screenshot.
    if (win && !win.isDestroyed()) {
      win.setOpacity(0);
      removeStealthMode(win);
    }
    await wait(250);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width: targetWidth, height: targetHeight },
      });
      const selected = sources.find((source) => source.display_id === String(primaryDisplay.id)) || sources[0];
      if (selected && !selected.thumbnail.isEmpty()) {
        const jpegBuffer = selected.thumbnail.toJPEG(90);
        if (jpegBuffer.length > 0) {
          return `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`;
        }
      }
      await wait(400);
    }

    throw new Error("macOS returned an empty screen image. Quit Ghostly completely and reopen it after granting Screen & System Audio Recording permission.");
  } finally {
    if (win && !win.isDestroyed()) {
      applyStealthMode(win);
      win.setOpacity(previousOpacity);
      if (wasVisible) win.showInactive();
      safeguardVisibility(win);
    }
  }
}
