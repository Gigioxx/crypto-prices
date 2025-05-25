#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test mobile translations
function testMobileTranslations() {
  console.log('🧪 Testing mobile translations...\n');

  const messagesDir = path.join(__dirname, '..', 'messages');
  const enMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
  const esMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'es.json'), 'utf8'));

  console.log('📱 Mobile card translations:');
  console.log('English:');
  console.log(`  - Rank: "${enMessages.crypto.rank}"`);
  console.log(`  - Market Cap: "${enMessages.crypto.marketCap}"`);

  console.log('Spanish:');
  console.log(`  - Rank: "${esMessages.crypto.rank}"`);
  console.log(`  - Market Cap: "${esMessages.crypto.marketCap}"`);

  // Verify translations exist and are different
  const rankTranslated = enMessages.crypto.rank !== esMessages.crypto.rank;
  const marketCapTranslated = enMessages.crypto.marketCap !== esMessages.crypto.marketCap;

  console.log('\n✅ Translation status:');
  console.log(`  - Rank translated: ${rankTranslated ? '✅' : '❌'}`);
  console.log(`  - Market Cap translated: ${marketCapTranslated ? '✅' : '❌'}`);

  if (rankTranslated && marketCapTranslated) {
    console.log('\n🎉 Mobile translations are working correctly!');
  } else {
    console.log('\n⚠️  Some translations may not be working as expected.');
  }

  console.log('\n📋 Expected mobile layout:');
  console.log('Left side: Icon, Name, Symbol, Rank');
  console.log('Right side: Price, 24h Change, Market Cap');
}

testMobileTranslations();
