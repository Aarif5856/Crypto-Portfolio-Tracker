/**
 * Quick scan to ensure there are no stray non-ASCII characters in source files.
 * Helps prevent broken glyphs reaching production bundles.
 */
const fs = require('fs');
const path = require('path');

const ALLOWED_CONTROL_CODES = new Set([9, 10, 13]); // tab, LF, CR
const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = ['src'];

const problems = [];

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
    } else if (entry.isFile()) {
      scanFile(entryPath);
    }
  });
};

const scanFile = (file) => {
  const buffer = fs.readFileSync(file, 'utf8');
  for (let index = 0; index < buffer.length; index += 1) {
    const code = buffer.charCodeAt(index);
    const isAscii = code >= 32 && code <= 126;
    const isAllowedControl = ALLOWED_CONTROL_CODES.has(code);
    if (!isAscii && !isAllowedControl) {
      problems.push({
        file: path.relative(ROOT, file),
        index,
        code,
        snippet: buffer.slice(Math.max(0, index - 10), Math.min(buffer.length, index + 10)),
      });
    }
  }
};

TARGET_DIRS.forEach((dir) => walk(path.join(ROOT, dir)));

if (problems.length > 0) {
  console.error('Non-ASCII characters detected:');
  problems.forEach((item) => {
    console.error(`- ${item.file} (index ${item.index}, charCode ${item.code}) -> "${item.snippet}"`);
  });
  process.exitCode = 1;
} else {
  console.log('Encoding check passed: no non-ASCII characters found.');
}
