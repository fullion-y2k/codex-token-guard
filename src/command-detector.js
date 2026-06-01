import fs from "node:fs/promises";
import path from "node:path";

export async function detectCommands(cwd) {
  const commands = new Set();

  await detectPackageJson(cwd, commands);
  await detectByFile(cwd, "pyproject.toml", commands, ["pytest"]);
  await detectByFile(cwd, "Cargo.toml", commands, ["cargo test"]);
  await detectByFile(cwd, "go.mod", commands, ["go test ./..."]);
  await detectMakefile(cwd, commands);

  return [...commands];
}

async function detectPackageJson(cwd, commands) {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf8");
    const json = JSON.parse(raw);
    const scripts = json.scripts || {};

    if (scripts.test) {
      commands.add("npm test");
    }
    if (scripts.lint) {
      commands.add("npm run lint");
    }
    if (scripts.build) {
      commands.add("npm run build");
    }
  } catch {
    // Ignore invalid or missing package.json during command detection.
  }
}

async function detectByFile(cwd, fileName, commands, detected) {
  try {
    await fs.access(path.join(cwd, fileName));
    for (const command of detected) {
      commands.add(command);
    }
  } catch {
    // Missing file is not an error.
  }
}

async function detectMakefile(cwd, commands) {
  try {
    const raw = await fs.readFile(path.join(cwd, "Makefile"), "utf8");
    for (const target of ["test", "lint", "build"]) {
      if (new RegExp(`^${target}:`, "m").test(raw)) {
        commands.add(`make ${target}`);
      }
    }
  } catch {
    // Missing Makefile is not an error.
  }
}
