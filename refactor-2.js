const fs = require('fs');
const path = require('path');

const replacements = [
  // Model names
  { from: /'res\.user'/g, to: "'vx.user'" },
  { from: /'res\.node'/g, to: "'vx.node'" },
  { from: /'res\.org'/g, to: "'vx.org'" },
  { from: /'res\.company'/g, to: "'vx.org'" }, // just in case
  { from: /'res\.partner'/g, to: "'vx.node'" },
  { from: /'ir\.model'/g, to: "'mx.model'" },
  { from: /'ir\.model\.access'/g, to: "'mx.grant'" },
  { from: /'ir\.rule'/g, to: "'mx.rule'" },
  { from: /'mail\.message'/g, to: "'fx.msg'" },
  { from: /'mail\.tracking\.value'/g, to: "'fx.track'" },
  
  // Table names or raw SQL queries
  { from: /res_user_res_groups_rel/g, to: 'vx_user_vx_role_rel' },
  { from: /res_user_id/g, to: 'vx_user_id' },
  { from: /res_groups_id/g, to: 'vx_role_id' },
  
  // Classes in imports
  { from: /\bUser\b/g, to: 'VxUser' },
  { from: /\bPartner\b/g, to: 'VxNode' },
  { from: /\bCompany\b/g, to: 'VxOrg' },
  { from: /\bCountry\b/g, to: 'VxZone' },
  { from: /\bCurrency\b/g, to: 'VxCoin' },
  { from: /\bGroups\b/g, to: 'VxRole' },
  { from: /\bLang\b/g, to: 'IxLang' },
  { from: /\bTranslation\b/g, to: 'IxDict' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // We only apply the class name replacements carefully to avoid breaking code like 'import { User } from ...'
      // Wait, regex \bUser\b is dangerous globally.
      // Let's only do it for specific files if needed, or stick to literal string replacements first.
      
      let safeReplacements = [
        { from: /'res\.user'/g, to: "'vx.user'" },
        { from: /'res_user_res_groups_rel'/g, to: "'vx_user_vx_role_rel'" },
        { from: /res_user_id/g, to: 'vx_user_id' },
        { from: /res_groups_id/g, to: 'vx_role_id' },
      ];
      
      for (const rule of safeReplacements) {
        content = content.replace(rule.from, rule.to);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'packages', 'moon-base', 'src'));
processDirectory(path.join(__dirname, 'packages', 'moon-orm', 'src'));
processDirectory(path.join(__dirname, 'packages', 'moon-server', 'src'));
processDirectory(path.join(__dirname, 'apps', 'api', 'src'));
