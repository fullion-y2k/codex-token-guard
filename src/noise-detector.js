import { generatedPatterns, secretPatterns } from "./defaults.js";
import { matchesAny } from "./match.js";

export function classifyFile(file, config) {
  const ignored = matchesAny(file.path, config.ignore);
  const generated = matchesAny(file.path, generatedPatterns);
  const secretLike = matchesAny(file.path, secretPatterns);
  const large = file.size >= config.largeFileBytes;
  const noisy = ignored || generated || large || secretLike;

  return {
    ...file,
    ignored,
    generated,
    secretLike,
    large,
    noisy
  };
}
