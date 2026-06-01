export function estimateTokensFromText(text) {
  return Math.ceil(String(text).length / 4);
}

export function estimateTokensFromBytes(bytes) {
  return Math.ceil(bytes / 4);
}

export function sumTokens(files) {
  return files.reduce((total, file) => total + file.estimatedTokens, 0);
}
