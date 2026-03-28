import { spawn, spawnSync } from "node:child_process";

const children = [];

function containerExists(name) {
  const result = spawnSync("docker", ["container", "inspect", name], {
    stdio: "ignore",
    shell: false
  });
  return result.status === 0;
}

function watch(command, args, label) {
  const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], shell: false });
  child.stdout.on("data", (chunk) => process.stdout.write(`[${label}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${label}] ${chunk}`));
  children.push(child);
}

watch("docker", ["compose", "logs", "-f", "backend", "frontend", "ai-worker"], "compose");

if (containerExists("team-fit-backend")) {
  watch("docker", ["logs", "-f", "team-fit-backend"], "backend");
}

if (containerExists("team-fit-frontend")) {
  watch("docker", ["logs", "-f", "team-fit-frontend"], "frontend");
}

if (containerExists("team-fit-ai-worker")) {
  watch("docker", ["logs", "-f", "team-fit-ai-worker"], "ai-worker");
}

function shutdown() {
  for (const child of children) {
    child.kill("SIGINT");
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
