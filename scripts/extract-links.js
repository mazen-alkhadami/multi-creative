const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next') files = files.concat(walk(full));
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const files = walk('./src');
const internalLinks = new Set();
const linkRegex = /href=["'](\/[^"'#?]*)["']/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1];
    if (!target.startsWith('/api') && !target.startsWith('/_next') && target.length > 0) {
      internalLinks.add(target);
    }
  }
});

console.log('Internal links extracted:');
console.log(JSON.stringify(Array.from(internalLinks).sort(), null, 2));
