#!/usr/bin/env node
import path from "node:path";
import { briefCommand, estimateCommand, initCommand, scanCommand } from "./commands.js";

const helpText = `
codex-token-guard

Usage:
  codex-token-guard init [--force]
  codex-token-guard scan [--write] [--json] [--cwd <path>]
  codex-token-guard estimate [--json] [--cwd <path>]
  codex-token-guard brief "<task>" [--json] [--max-files <n>] [--cwd <path>]

Examples:
  codex-token-guard scan
  codex-token-guard brief "fix login validation"
`;

async function main(argv) {
  const args = [...argv];
  const command = args.shift();
  const options = parseOptions(args);
  const cwd = path.resolve(options.cwd || process.cwd());

  switch (command) {
    case "init":
      await initCommand(cwd, options);
      break;
    case "scan":
      await scanCommand(cwd, options);
      break;
    case "estimate":
      await estimateCommand(cwd, options);
      break;
    case "brief":
      await briefCommand(cwd, options.positionals.join(" "), options);
      break;
    case "-h":
    case "--help":
    case undefined:
      console.log(helpText.trim());
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

function parseOptions(args) {
  const options = { positionals: [] };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") {
      options.force = true;
    } else if (arg === "--write") {
      options.write = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--cwd") {
      options.cwd = args[++index];
    } else if (arg === "--max-files") {
      options.maxFiles = args[++index];
    } else {
      options.positionals.push(arg);
    }
  }

  return options;
}

main(process.argv.slice(2)).catch((error) => {
  console.error(`codex-token-guard: ${error.message}`);
  process.exitCode = 1;
});
