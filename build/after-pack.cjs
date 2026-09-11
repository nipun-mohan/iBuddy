const { execFileSync } = require("node:child_process");
const { readdir } = require("node:fs/promises");

async function removeFinderInfo(path) {
  try { execFileSync("xattr", ["-d", "com.apple.FinderInfo", path], { stdio: "ignore" }); } catch {}
  let entries;
  try { entries = await readdir(path, { withFileTypes: true }); } catch { return; }
  await Promise.all(entries.map((entry) => removeFinderInfo(`${path}/${entry.name}`)));
}

/** Remove Finder/resource-fork metadata that makes codesign reject copied files. */
exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") return;
  execFileSync("xattr", ["-cr", context.appOutDir], { stdio: "inherit" });
  await removeFinderInfo(context.appOutDir);
};
