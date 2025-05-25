#!/usr/bin/env node

const semver = require('semver');
const { execSync } = require('child_process');

const REQUIRED_NODE_VERSION = '22.0.0';

function checkNodeVersion() {
  const currentVersion = process.version;
  
  console.log(`Current Node.js version: ${currentVersion}`);
  console.log(`Required Node.js version: >=${REQUIRED_NODE_VERSION}`);
  
  if (!semver.gte(currentVersion, REQUIRED_NODE_VERSION)) {
    console.error(`\n❌ Error: This project requires Node.js ${REQUIRED_NODE_VERSION} or higher.`);
    console.error(`You are currently using Node.js ${currentVersion}.`);
    console.error('\nPlease upgrade your Node.js version:');
    console.error('- Using nvm: nvm install 22 && nvm use 22');
    console.error('- Using fnm: fnm install 22 && fnm use 22');
    console.error('- Download from: https://nodejs.org/');
    process.exit(1);
  }
  
  console.log('✅ Node.js version requirement satisfied.');
}

// Only run the check if this script is executed directly
if (require.main === module) {
  checkNodeVersion();
}

module.exports = { checkNodeVersion }; 