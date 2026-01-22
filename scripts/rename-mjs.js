const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function replaceInFile(filePath, replacer) {
  const src = fs.readFileSync(filePath, 'utf8');
  const out = replacer(src);
  if (out !== src) fs.writeFileSync(filePath, out, 'utf8');
}

function renameExtMjsToJs(rootDir) {
  const renameQueue = [];
  walk(rootDir, (full) => {
    if (full.endsWith('.mjs')) renameQueue.push(full);
  });
  // Replace references first in html/js files
  walk(rootDir, (full) => {
    if (full.endsWith('.html') || full.endsWith('.js') || full.endsWith('.mjs')) {
      replaceInFile(full, (txt) => txt.replace(/\.mjs(\b)/g, '.js$1'));
    }
  });
  // Rename files
  for (const oldPath of renameQueue) {
    const newPath = oldPath.slice(0, -4) + '.js';
    if (!fs.existsSync(newPath)) fs.renameSync(oldPath, newPath);
  }
}

function main() {
  const root = path.resolve(__dirname, '..', 'build', 'dstudio');
  if (!fs.existsSync(root)) {
    console.error('[rename-mjs] build/dstudio not found');
    process.exit(1);
  }
  renameExtMjsToJs(root);
  console.log('[rename-mjs] done for', root);
}

main();
