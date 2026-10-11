/**
 * CSS Production Bundler
 * Compiles modular stylesheets into production styles/main.css with syntax validation.
 */

const fs = require('fs');
const path = require('path');

const files = [
  'styles/base/reset.css',
  'styles/base/variables.css',
  'styles/base/typography.css',
  'styles/base/globals.css',
  'styles/components/ambient-background.css',
  'styles/components/navbar.css',
  'styles/components/hero.css',
  'styles/components/flagship.css',
  'styles/components/newsletter.css',
  'styles/components/projects.css',
  'styles/components/architecture-modal.css',
  'styles/components/resume-modal.css',
  'styles/components/experience-skills.css',
  'styles/components/ai-news-project.css',
  'styles/utilities/animations.css'
];

let bundle = '/* ===== BUNDLED PRODUCTION MAIN STYLESHEET (BROWN & NAVY PALETTE) ===== */\n\n';
let totalLines = 0;

console.log('Bundling styles into styles/main.css:');
for (const f of files) {
  const p = path.resolve(__dirname, '..', f);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n').length;
    totalLines += lines;
    console.log(`  + ${f} (${lines} lines, ${content.length} bytes)`);
    bundle += `/* --- ${f} --- */\n` + content + '\n\n';
  } else {
    console.warn('  ! Missing file: ' + p);
  }
}

// Validate CSS brace balancing
const openBraces = (bundle.match(/{/g) || []).length;
const closeBraces = (bundle.match(/}/g) || []).length;
if (openBraces !== closeBraces) {
  console.error(`  ERROR: Mismatched CSS braces! ${openBraces} open vs ${closeBraces} close.`);
  process.exit(1);
}

const outPath = path.resolve(__dirname, '../styles/main.css');
fs.writeFileSync(outPath, bundle, 'utf8');
console.log(`\nSuccess: styles/main.css compiled (${files.length} modules, ${totalLines} source lines, ${bundle.length} bytes). Braces balanced: ${openBraces}/${closeBraces}.`);
