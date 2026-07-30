const fs = require('fs');
const path = require('path');

const replacements = [
  { file: 'vx-node.ts', from: 'class Partner', to: 'class VxNode' },
  { file: 'vx-org.ts', from: 'class Company', to: 'class VxOrg' },
  { file: 'vx-coin.ts', from: 'class Currency', to: 'class VxCoin' },
  { file: 'vx-zone.ts', from: 'class Country', to: 'class VxZone' },
  { file: 'vx-role.ts', from: 'class Groups', to: 'class VxRole' },
  { file: 'ix-lang.ts', from: 'class Lang', to: 'class IxLang' },
  { file: 'ix-dict.ts', from: 'class Translation', to: 'class IxDict' },
];

for (const rep of replacements) {
  const fullPath = path.join(__dirname, 'packages', 'moon-base', 'src', rep.file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(rep.from, rep.to);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${rep.file}`);
  }
}
