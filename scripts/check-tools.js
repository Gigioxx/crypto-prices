#!/usr/bin/env bun

/**
 * Verification script to ensure Bun and Turbopack are properly configured
 */

console.log('🔍 Checking tool configuration...\n');

// Check if running with Bun
const isBun = typeof Bun !== 'undefined';
console.log(`📦 Runtime: ${isBun ? '✅ Bun' : '❌ Not Bun'}`);

if (!isBun) {
  console.log('⚠️  Please run this script with Bun: bun run scripts/check-tools.js');
  process.exit(1);
}

// Check Bun version
console.log(`🐰 Bun version: ${Bun.version}`);

// Check if package.json has correct configuration
try {
  const packageJson = require('../package.json');
  
  // Check engines
  const hasBunEngine = packageJson.engines && packageJson.engines.bun;
  console.log(`⚙️  Bun engine requirement: ${hasBunEngine ? '✅ Configured' : '❌ Missing'}`);
  
  // Check dev script uses Turbopack
  const devScript = packageJson.scripts?.dev;
  const usesTurbopack = devScript && devScript.includes('--turbo');
  console.log(`🚀 Turbopack enabled: ${usesTurbopack ? '✅ Yes' : '❌ No'}`);
  
  // Check preinstall script
  const hasPreinstall = packageJson.scripts?.preinstall;
  console.log(`🔒 Bun enforcement: ${hasPreinstall ? '✅ Enabled' : '❌ Disabled'}`);
  
  console.log('\n✨ Configuration check complete!');
  
  if (hasBunEngine && usesTurbopack && hasPreinstall) {
    console.log('🎉 All tools are properly configured!');
  } else {
    console.log('⚠️  Some configurations are missing. Please check the setup.');
  }
  
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
} 