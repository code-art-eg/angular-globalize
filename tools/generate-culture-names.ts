

import { readdir, writeFile } from 'fs';
import { join } from 'path';

readdir(join(__dirname, '..', 'node_modules', 'cldr-data', 'main'), {
  withFileTypes: true
}, (err, entries) => {
  if (err) {
    console.error(err);
  } else {
    const content = `export const CULTURE_NAMES = [
  `
      + entries.filter((e) => e.isDirectory()).map((e) => `'${e.name}'`).join(',\n  ')
      + ',\n'
      + `];
`;
    writeFile(join(__dirname, '..', 'projects', 'angular-globalize', 'schematics', 'cultures.ts'), content, (er2) => {
      if (er2) {
        console.error(err);
      }
    });
  }
});
