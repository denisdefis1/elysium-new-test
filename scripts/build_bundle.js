#!/usr/bin/env node
/* Rebuild hub/assets/js/data-bundle.js from all hub/data/google/*.json files */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'hub', 'data', 'google');
const outFile = path.join(__dirname, '..', 'hub', 'assets', 'js', 'data-bundle.js');

const files = {
  campaigns:       'campaigns.json',
  competitors:     'competitors.json',
  negatives:       'negatives.json',
  keywords:        'keywords.json',
  research_summary:'research_summary.json',
  ads_metrics:     'ads_metrics.json',
};

let out = '/* ELYSIUM — Inline Data Bundle (file:// compatibility) */\n';
out += 'window.__ELYSIUM_DATA__ = window.__ELYSIUM_DATA__ || {};\n';

for (const [key, file] of Object.entries(files)) {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  SKIP (not found): ${file}`);
    continue;
  }
  const json = JSON.stringify(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  out += `window.__ELYSIUM_DATA__.${key} = ${json};\n`;
}

// Yandex Direct strategy markdown
const yandexMdPath = path.join(__dirname, '..', 'hub', 'data', 'yandex', 'strategy.md');
if (fs.existsSync(yandexMdPath)) {
  const md = fs.readFileSync(yandexMdPath, 'utf8');
  out += `window.__ELYSIUM_DATA__.yandexStrategy = ${JSON.stringify(md)};\n`;
  console.log('  + yandexStrategy (hub/data/yandex/strategy.md)');
} else {
  console.warn('  SKIP (not found): hub/data/yandex/strategy.md');
}

fs.writeFileSync(outFile, out, 'utf8');
console.log('data-bundle.js rebuilt OK');
