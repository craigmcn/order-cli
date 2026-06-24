import { blue, white, yellow } from './colors.js';
import { configurationFile, readConfiguration, writeConfiguration } from './configuration.js';

export function save(argv) {
  const { clipboard, colors, oxfordComma, prefix, separators } = argv;
  const configFile = configurationFile();
  const { config } = readConfiguration();

  if (!configFile.exists) {
    process.stderr.write(yellow('No configuration file found for saving.\n'));
    return;
  }

  const participants = [...argv._];
  participants.sort();
  const group = {
    participants,
    clipboard,
    colors,
    oxfordComma,
    prefix,
    separators,
  };

  let groupIndex = config.groups?.findIndex(group => JSON.stringify(group.participants) === JSON.stringify(participants));
  if (groupIndex > -1) {
    config.groups[groupIndex] = group;
  } else {
    config.groups.push(group);
    groupIndex = config.groups.length - 1;
  }

  writeConfiguration(config, configFile.format);
  process.stdout.write(blue('Group saved as '));
  process.stdout.write(white(`group ${groupIndex}\n`));
}
