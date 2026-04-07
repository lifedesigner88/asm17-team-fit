import { existsSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const nxBinary = path.join(rootDir, "node_modules", ".bin", process.platform === "win32" ? "nx.cmd" : "nx");

if (!existsSync(nxBinary)) {
  console.error("Local Node dependencies are missing.");
  console.error("Run `pnpm bootstrap` or `pnpm run setup` first, then retry `pnpm dev`.");
  process.exit(1);
}
