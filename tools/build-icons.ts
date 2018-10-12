
import * as changecase from 'change-case';
import * as fs from 'fs';
import * as https from 'https';

const hostName = 'raw.githubusercontent.com';
const version = '5.0.10';
const pathPrefix = `/FortAwesome/Font-Awesome/${version}/advanced-options/raw-svg/solid/`;
const downloadPath = `../projects/angular-datepicker/src/lib/components/icons`;
const iconNames = ['calendar-alt', 'home', 'chevron-left', 'chevron-up', 'chevron-down',
 'chevron-right', 'times', 'clock'];

function getFile(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        https.get({
            hostname: hostName,
            method: 'GET',
            path: `${pathPrefix}${name}.svg`,
            port: 443,
            protocol: 'https:',
        }, (response) => {
            let result = '';
            console.log(`Download file: https://${hostName}${pathPrefix}${name}.svg : Status ${response.statusCode}`);
            response.on('data', (chunk) => {
                result += chunk;
            });

            response.on('end', () => {
                if (response.statusCode && response.statusCode === 200 ) {
                    resolve(result);
                } else {
                    reject(new Error(`Http Error: ${response.statusMessage}. `
                        + `Body: ${result}.`));
                }
            });
        });
    });
}

function writeFile(name: string, data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(name, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function getIconFileName(name: string): string {
    return `icon-${name}.component`;
}

function getIconComponentName(name: string): string {
    return `Icon${changecase.pascal(name)}Component`;
}

async function downloadIcon(name: string): Promise<void> {
    let data = await getFile(name);
    data = '<span [class]="iconCssClassName">' + data + '</span>';
    await writeFile(`${downloadPath}/${getIconFileName(name)}.html`, data);
}

async function downloadAllIcons(): Promise<void> {
    for (const icon of iconNames) {
        await downloadIcon(icon);
        await writeComponentFile(icon);
    }
}

async function writeIndex(): Promise<void> {
    let p = `import { Type } from '@angular/core';

`;
    const ar = iconNames.slice(0).sort();
    for (const icon of ar) {
        p = p + `import { Icon${changecase.pascal(icon)}Component } from './${getIconFileName(icon)}';
`;
    }
    p = p + `
export const ICON_COMPONENTS: Array<Type<any>> = [
`;
    for (const icon of ar) {
        p += `    ${getIconComponentName(icon)},
`;
    }
    p = p + `];
`;
    await writeFile(`${downloadPath}/index.ts`, p);
}

async function writeComponentFile(name: string): Promise<void> {
    const p = `import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-${name}',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './${getIconFileName(name)}.html',
})
export class ${getIconComponentName(name)} {
    @Input() public iconCssClassName = 'icon-${name}';
}
`;
    await writeFile(`${downloadPath}/${getIconFileName(name)}.ts`, p);
}

async function buildIconFiles(): Promise<void> {
    await downloadAllIcons();
    await writeIndex();
}

buildIconFiles();
