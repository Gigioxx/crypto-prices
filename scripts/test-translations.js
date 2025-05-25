#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test translation files
function testTranslations() {
  console.log('🧪 Testing translation files...\n');

  const messagesDir = path.join(__dirname, '..', 'messages');
  const enMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
  const esMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'es.json'), 'utf8'));

  console.log('📄 English messages loaded:', Object.keys(enMessages).length, 'sections');
  console.log('📄 Spanish messages loaded:', Object.keys(esMessages).length, 'sections');

  // Check structure consistency
  function checkStructure(obj1, obj2, path = '') {
    const errors = [];

    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in obj2)) {
        errors.push(`Missing key in Spanish: ${currentPath}`);
        continue;
      }

      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        errors.push(...checkStructure(obj1[key], obj2[key], currentPath));
      }
    }

    return errors;
  }

  const errors = checkStructure(enMessages, esMessages);

  if (errors.length === 0) {
    console.log('✅ Translation structure is consistent!');
  } else {
    console.log('❌ Translation structure issues found:');
    errors.forEach((error) => console.log(`  - ${error}`));
  }

  // Display sample translations
  console.log('\n📋 Sample translations:');
  console.log('English title:', enMessages.crypto.title);
  console.log('Spanish title:', esMessages.crypto.title);
  console.log('English description:', enMessages.crypto.description);
  console.log('Spanish description:', esMessages.crypto.description);

  console.log('\n🎯 Translation test completed!');
}

testTranslations();
