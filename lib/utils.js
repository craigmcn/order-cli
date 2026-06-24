import { COLORS, color } from './colors.js';


export function formatObject(obj, hasColor = true, addBraces = false) {
  let formatted = '';

  if (obj && Object.keys(obj).length > 0) {
    Object.keys(obj).forEach((key) => {
      formatted += addBraces ? '  ' : '';
      const formattedKey = (key.match(/^\d/) || key.includes('-')) ? formatValue(key, hasColor) : key;
      formatted += `${formattedKey}: `;
      formatted += formatValue(obj[key], hasColor) + '\n';
    });

    if (addBraces) {
      formatted = '{\n' + formatted + '}\n';
    }
  }

  return formatted;
}

export function formatValue(value, hasColor) {
  if (value === null) {
    return color('null', COLORS.YELLOW, hasColor);
  }
  if (typeof value === 'boolean') {
    return color(value ? 'true' : 'false', COLORS.YELLOW, hasColor);
  }
  if (Array.isArray(value)) {
    return '[ ' + value.map(v => formatValue(v, hasColor)).join(', ') + ' ]';
  }
  if (typeof value === 'object') {
    return formatObject(value, hasColor, true);
  }
  return color(`'${value}'`, COLORS.GREEN, hasColor);
}
