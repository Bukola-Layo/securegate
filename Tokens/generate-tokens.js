const fs = require('fs');

function generateCss() {
  const colorTokens = JSON.parse(fs.readFileSync('./color-token.json', 'utf8'));
  const designTokens = JSON.parse(fs.readFileSync('./design-tokens.tokens.json', 'utf8'));

  let css = '/* Auto-generated Design Tokens */\n\n:root {\n';

  // 1. Primitive Colors (Key & Palette)
  css += '  /* Primitive Colors */\n';
  function processPrimitives(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        processPrimitives(value, prefix ? `${prefix}-${key}` : key);
      } else {
        css += `  --${prefix}-${key}: ${value};\n`;
      }
    }
  }

  if (colorTokens.color.key) processPrimitives(colorTokens.color.key, 'color-key');
  if (colorTokens.color.palette) processPrimitives(colorTokens.color.palette, 'color-palette');

  // 2. Light Theme Color Roles
  css += '\n  /* Light Theme Color Roles */\n';
  const lightRoles = colorTokens.color.role.light;
  for (const [key, value] of Object.entries(lightRoles)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    // value is like "{color.key.primary}" -> "color-key-primary"
    const ref = value.replace('{', '').replace('}', '').replace(/\./g, '-');
    css += `  --color-${cssKey}: var(--${ref});\n`;
  }

  // 3. Typography Tokens
  css += '\n  /* Typography Tokens */\n';
  const typography = designTokens.typography;
  if (typography) {
    for (const [tokenName, properties] of Object.entries(typography)) {
      const cssPrefix = tokenName.replace(/\s+/g, '-').toLowerCase();
      for (const [propName, propData] of Object.entries(properties)) {
        const cssPropName = propName.replace(/([A-Z])/g, '-$1').toLowerCase();
        let value = propData.value;
        if (propData.type === 'dimension' && typeof value === 'number') {
          value = `${value}px`;
        }
        css += `  --typography-${cssPrefix}-${cssPropName}: ${value};\n`;
      }
    }
  }

  css += '}\n\n';

  // 4. Dark Theme Color Roles
  css += '.dark {\n';
  css += '  /* Dark Theme Color Roles */\n';
  const darkRoles = colorTokens.color.role.dark;
  if (darkRoles) {
    for (const [key, value] of Object.entries(darkRoles)) {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const ref = value.replace('{', '').replace('}', '').replace(/\./g, '-');
      css += `  --color-${cssKey}: var(--${ref});\n`;
    }
  }
  css += '}\n';

  fs.writeFileSync('./tokens.css', css);
  console.log('tokens.css generated successfully!');
}

generateCss();
