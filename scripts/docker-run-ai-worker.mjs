import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const containerName = "persona-mirror-ai-worker";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 0;
}

// Parse .env and override DATABASE_URL for Docker networking
const envVars = Object.fromEntries(
  readFileSync("apps/ai-worker/.env", "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);
// Use compose service name "db" — ai-worker joins the same Docker network
envVars["DATABASE_URL"] =
  "postgresql+psycopg://persona:persona@db:5432/persona_mirror";

const envFlags = Object.entries(envVars).flatMap(([k, v]) => ["-e", `${k}=${v}`]);

run("docker", ["rm", "-f", containerName], { stdio: "ignore" });

const status = run("docker", [
  "run",
  "-d",
  "--name",
  containerName,
  "--network",
  "persona-mirror_default",
  ...envFlags,
  "persona-mirror-ai-worker:dev",
]);

process.exit(status);
