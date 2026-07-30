const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /IrModel\b/g, to: 'MxModel' },
  { from: /'ir\.model'/g, to: "'mx.model'" },
  
  { from: /IrModelAccess\b/g, to: 'MxGrant' },
  { from: /'ir\.model\.access'/g, to: "'mx.grant'" },
  
  { from: /IrRule\b/g, to: 'MxRule' },
  { from: /'ir\.rule'/g, to: "'mx.rule'" },
  
  { from: /ResUsers\b/g, to: 'VxUser' },
  { from: /'res\.users'/g, to: "'vx.user'" },
  
  { from: /ResPartner\b/g, to: 'VxNode' },
  { from: /'res\.partner'/g, to: "'vx.node'" },
  
  { from: /ResCompany\b/g, to: 'VxOrg' },
  { from: /'res\.company'/g, to: "'vx.org'" },
  
  { from: /ResCurrency\b/g, to: 'VxCoin' },
  { from: /'res\.currency'/g, to: "'vx.coin'" },
  
  { from: /ResCountry\b/g, to: 'VxZone' },
  { from: /'res\.country'/g, to: "'vx.zone'" },
  { from: /ResCountryState\b/g, to: 'VxZoneState' },
  { from: /'res\.country\.state'/g, to: "'vx.zone.state'" },
  
  { from: /ResGroups\b/g, to: 'VxRole' },
  { from: /'res\.groups'/g, to: "'vx.role'" },
  
  { from: /ResLang\b/g, to: 'IxLang' },
  { from: /'res\.lang'/g, to: "'ix.lang'" },
  
  { from: /IrTranslation\b/g, to: 'IxDict' },
  { from: /'ir\.translation'/g, to: "'ix.dict'" },
  
  { from: /MailMessage\b/g, to: 'FxMsg' },
  { from: /'mail\.message'/g, to: "'fx.msg'" },
  
  { from: /MailTrackingValue\b/g, to: 'FxTrack' },
  { from: /'mail\.tracking\.value'/g, to: "'fx.track'" },
  
  { from: /BaseModel\b/g, to: 'Vertex' },
  
  { from: /Environment\b/g, to: 'Ctx' },
  { from: /createEnv\b/g, to: 'createCtx' },
  
  { from: /syncSchema\b/g, to: 'forge' },
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
      for (const rule of replacements) {
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
