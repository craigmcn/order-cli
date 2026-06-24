import { PREFIX, SEPARATORS } from './constants.js';

export const options = {
  prefix: {
    alias: 'p',
    describe: 'Output prefix',
    default: PREFIX,
    type: 'string',
  },
  separators: {
    alias: 's',
    describe: 'Output list separators (i.e., [separator, lastSeparator])',
    default: SEPARATORS,
    type: 'array',
  },
  oxfordComma: {
    alias: ['oc', 'oxford-comma'],
    describe: `Use the Oxford comma (e.g., "Alice, Bob, and Charlie";
      applies the separator to the second-to-last item;
      to disable: --no-oc, --no-oxford-comma)`,
    type: 'boolean',
  },
  clipboard: {
    alias: 'cc',
    describe: 'Copy the output to the clipboard (to disable: --no-cc, --no-clipboard)',
    default: true,
    type: 'boolean',
  },
  colors: {
    alias: 'clr',
    describe: 'Colorize the output (to disable: --no-clr, --no-colors)',
    default: true,
    type: 'boolean',
  },
};

export const validKeys = Object.entries(options).reduce((acc, [key, value]) => {
  const obj = {type: value.type, parent: key};
  acc[key] = {...obj};
  if (value.alias) {
    if (Array.isArray(value.alias)) {
      value.alias.forEach(alias => {
        acc[alias] = {...obj};
      });
    } else {
      acc[value.alias] = {...obj};
    }
  }
  return acc;
}, {});
