import fs from 'node:fs';
import path from 'node:path';

const featureName = process.argv[2];

if (!featureName) {
  console.error('Usage: npm.cmd run g <feature-name>');
  process.exit(1);
}

const root = path.resolve('src', 'features', featureName);
const folders = ['api', 'components', 'constants', 'pages', 'types'];

for (const folder of folders) {
  fs.mkdirSync(path.join(root, folder), { recursive: true });
}

console.log(`Feature "${featureName}" created at ${root}`);
