import * as ts from 'typescript';

import {
  Tree,
  Rule,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
  noop,
} from '@angular-devkit/schematics';

import { JsonParseMode, parseJson } from '@angular-devkit/core';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import {
  addImportToModule,
  addSymbolToNgModuleMetadata,
  getMetadataField,
  getDecoratorMetadata,
} from '@schematics/angular/utility/ast-utils';
import { InsertChange, ReplaceChange, Change, Host } from '@schematics/angular/utility/change';
import { strings, normalize, experimental } from '@angular-devkit/core';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';

export interface ImportModuleOptions {
  module?: string;
  path?: string;
  filename?: string;
  moduleName?: string;
}

export interface WorkspaceInfo {
  module?: string;
  path: string;
}

interface IReplaceChange {
  pos: number;
  oldText: string;
  newText: string;
}

import { AddLanguageOptions, DataModuleOptions, ProjectOptions } from './models';
import { LANGUAGE_NAMES } from './languages';

type UpdateJsonFn<T> = (obj: T) => T | void;
interface TsConfigPartialType {
  compilerOptions: ts.CompilerOptions;
}

function updateJsonFile<T>(host: Tree, path: string, callback: UpdateJsonFn<T>): Tree {
  const source = host.read(path);
  if (source) {
    const sourceText = source.toString('utf-8');
    const json = parseJson(sourceText, JsonParseMode.Loose);
    callback(json as {} as T);
    host.overwrite(path, JSON.stringify(json, null, 2));
  }

  return host;
}

function updateTsConfigPaths(packageName: string, ...paths: string[]) {
  return (host: Tree) => {
    if (!host.exists('tsconfig.json')) {
      return host;
    }

    return updateJsonFile(host, 'tsconfig.json', (tsconfig: TsConfigPartialType) => {
      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
      }
      if (!tsconfig.compilerOptions.paths[packageName]) {
        tsconfig.compilerOptions.paths[packageName] = [];
      }
      const ar = tsconfig.compilerOptions.paths[packageName];
      for (const path of paths) {
        if (ar.indexOf(path) > -1) {
          ar.push(path);
        }
      }
    });
  };
}

function updateTsConfigOptions(partialOptions: Partial<ts.CompilerOptions>) {
  return (host: Tree) => {
    if (!host.exists('tsconfig.json')) {
      return host;
    }

    return updateJsonFile(host, 'tsconfig.json', (tsconfig: TsConfigPartialType) => {
      for (const key in partialOptions) {
        if (partialOptions.hasOwnProperty(key)) {
          tsconfig.compilerOptions[key] = partialOptions[key];
        }
      }
    });
  };
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addAngularGlobalizeModule(options: ImportModuleOptions): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);

    const packagePath = `@code-art/angular-globalize`;

    const changes = addImportToModule(source, modulePath, 'AngularGlobalizeModule', packagePath);

    const importRecoder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        importRecoder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(importRecoder);

    return host;
  };
}

function treeToHost(host: Tree): Host {
  return {
    write: (p, content) => new Promise<void>((resolve, reject) => {
      try {
        if (host.exists(p)) {
          host.overwrite(p, content);
        } else {
          host.create(p, content);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    }),
    read: (p) => new Promise<string>((resolve, reject) => {
      try {
        if (host.exists(p)) {
          // tslint:disable-next-line: no-non-null-assertion
          resolve(host.read(p)!.toString('utf8'));
        } else {
          resolve('');
        }
      } catch (e) {
        reject(e);
      }
    }),
  };
}

function addAngularGlobalizeForRoot(options: ImportModuleOptions, cultureName: string): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);

    const changes = updateAngularglobalizeForRoot(source, modulePath, cultureName);

    const importRecoder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        importRecoder.insertLeft(change.pos, change.toAdd);
      } else if (change instanceof ReplaceChange) {
        const c = change as unknown as IReplaceChange;
        importRecoder.remove(c.pos, c.oldText.length);
        importRecoder.insertLeft(c.pos, c.newText);
      }
    }
    host.commitUpdate(importRecoder);

    return host;
  };
}

function addImportToNgModule(options: ImportModuleOptions): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);

    const newModulePath = `/${options.path}/`
      + options.filename;

    const relativePath = buildRelativePath(modulePath, newModulePath);
    const classifiedName = options.moduleName as string;
    const changes = addImportToModule(source, modulePath, classifiedName, relativePath);

    const importRecoder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        importRecoder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(importRecoder);

    return host;
  };
}

function deleteFile(path: string): Rule {
  return (host: Tree) => {
    if (host.exists(path)) {
      host.delete(path);
    }
    return host;
  };
}

function getWorkspaceInfo(host: Tree, options: ProjectOptions): WorkspaceInfo {
  const workspaceConfig = host.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }
  // convert workspace to string
  const workspaceContent = workspaceConfig.toString();

  // parse workspace string into JSON object
  const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
  if (!options.project) {
    options.project = workspace.defaultProject;
  }

  const projectName = options.project as string;
  const project = workspace.projects[projectName];
  const projectType = project.projectType === 'application' ? 'app' : 'lib';
  const path = `${project.sourceRoot}/${projectType}`;
  const module = findModuleFromOptions(host, {
    path,
    name: ''
  });
  return {
    module,
    path,
  };
}

function validateLanguageName(culture: string): void {
  if (LANGUAGE_NAMES.indexOf(culture) === -1) {
    throw new SchematicsException(`Invalid language name "${culture}".
Please note that language name is case sensitive and must be a name of a folder in node_modules/cldr-data/main.`);
  }
}

export function updateAngularglobalizeForRoot(
  source: ts.SourceFile,
  ngModulePath: string,
  cultureName: string,
): Change[] {
  const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
  let node: any = nodes[0];  // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }

  // Get all the children property assignment of object literals.
  const matchingProperties = getMetadataField(
    node as ts.ObjectLiteralExpression,
    'imports',
  );

  // Get the last node of the array literal.
  if (!matchingProperties) {
    return [];
  }
  const symbol = `AngularGlobalizeModule.forRoot(['${cultureName}'])`;
  if (matchingProperties.length === 0) {
    // We haven't found the field in the metadata declaration. Insert a new field.
    const expr = node as ts.ObjectLiteralExpression;
    let position: number;
    let valueToInsert: string;
    if (expr.properties.length === 0) {
      position = expr.getEnd() - 1;
      valueToInsert = `  imports: [${symbol}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      const matches = text.match(/^\r?\n\s*/);
      if (matches && matches.length > 0) {
        valueToInsert = `,${matches[0]}imports: [${symbol}]`;
      } else {
        valueToInsert = `, imports: [${symbol}]`;
      }
    }
    return [new InsertChange(ngModulePath, position, valueToInsert)];
  }
  const assignment = matchingProperties[0] as ts.PropertyAssignment;

  // If it's not an array, nothing we can do really.
  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return [];
  }

  const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
  if (arrLiteral.elements.length === 0) {
    // Forward the property.
    node = arrLiteral;
  } else {
    node = arrLiteral.elements;
  }

  if (!node) {
    // tslint:disable-next-line: no-console
    console.error('No app module found. Please add your new class to your component.');

    return [];
  }

  if (Array.isArray(node)) {
    const nodeArray = node as {} as Array<ts.Node>;
    const symbolsArray = nodeArray.map((n) => n.getText());
    if (symbolsArray.includes(symbol)) {
      return [];
    }
    const rx = /^AngularGlobalizeModule\.forRoot\(\s*\[\s*(.*)\s*\]\s*\)$/;
    const index = symbolsArray.findIndex((t) => rx.exec(t));
    if (index >= 0) {
      const res = rx.exec(symbolsArray[index]) as RegExpExecArray;
      const oldText = symbolsArray[index];
      let param = res[1];
      if (param.indexOf(`'${cultureName}'`) >= 0 || param.indexOf(`"${cultureName}"`) >= 0) {
        return [];
      }
      if (param.endsWith(',')) {
        param = param + ` '${cultureName}',`;
      } else {
        param = param + `, '${cultureName}'`;
      }
      return [new ReplaceChange(ngModulePath, nodeArray[index].getStart(), oldText,
        `AngularGlobalizeModule.forRoot([${param}])`
      )];
    }
    node = node[node.length - 1];
  }

  let toInsert: string;
  let nodePosition = node.getEnd();
  if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    // We haven't found the field in the metadata declaration. Insert a new
    // field.
    const expr = node as ts.ObjectLiteralExpression;
    if (expr.properties.length === 0) {
      nodePosition = expr.getEnd() - 1;
      toInsert = `  ${symbol}\n`;
    } else {
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match(/^\r?\r?\n/)) {
        toInsert = `,${text.match(/^\r?\n\s*/)[0]}${symbol}`;
      } else {
        toInsert = `, ${symbol}`;
      }
    }
  } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
    // We found the field but it's empty. Insert it just before the `]`.
    nodePosition--;
    toInsert = `${symbol}`;
  } else {
    // Get the indentation of the last element, if any.
    const text = node.getFullText(source);
    if (text.match(/^\r?\n/)) {
      toInsert = `,${text.match(/^\r?\n(\r?)\s*/)[0]}${symbol}`;
    } else {
      toInsert = `, ${symbol}`;
    }
  }
  return [new InsertChange(ngModulePath, nodePosition, toInsert)];
}

export function addAngularGlobalize(options: DataModuleOptions): Rule {
  return (host: Tree) => {
    const info = getWorkspaceInfo(host, options);

    if (!options.supportedLanguages) {
      options.supportedLanguages = 'en';
    }

    let split = options.supportedLanguages.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
    if (split.length === 0) {
      split = ['en'];
    }
    const newModulePath = `${info.path}/globalize-data`;
    const templateSource = apply(url('./files'), [
      applyTemplates({
        currency: !!options.currency,
        date: !!options.date,
        plural: !!options.plural,
      }),
      move(normalize(newModulePath as string)),
    ]);
    return chain([
      addAngularGlobalizeModule({
        module: info.module,
      }),
      deleteFile(`${newModulePath}/globalize-data.module.ts`),
      mergeWith(templateSource),
      chain(split.map((c) => addLanguageModule({
        culture: c,
        currency: !!options.currency,
        date: !!options.date,
        project: options.project,
        module: info.module,
        path: info.path,
      }))),
      addImportToNgModule({
        module: info.module,
        path: newModulePath,
        filename: 'globalize-data.module',
        moduleName: 'GlobalizeDataModule',
      }),
      options.updateTsConfig ? chain(
        [
          updateTsConfigPaths('globalize', 'node_modules/globalize/dist/globalize'),
          updateTsConfigPaths('globalize/*', 'node_modules/globalize/dist/globalize/*'),
          updateTsConfigPaths('cldr', 'node_modules/cldrjs/dist/cldr'),
          updateTsConfigPaths('cldr/*', 'node_modules/cldrjs/dist/cldr/*'),
          updateTsConfigOptions({
            allowSyntheticDefaultImports: true,
            resolveJsonModule: true,
            importHelpers: true,
          })]) : noop(),
      applyLintFix(),
    ]);
  };
}

export function addLanguageModule(options: AddLanguageOptions): Rule {
  return () => {
    validateLanguageName(options.culture);
    const newModulePath = `${options.path}/globalize-data`;
    const templateSource = apply(url('../ng-add/language-files'), [
      applyTemplates({
        currency: !!options.currency,
        date: !!options.date,
        dasherize: strings.dasherize,
        classify: strings.classify,
        name: 'globalizeData-' + options.culture,
        culture: options.culture,
      }),
      move(normalize(newModulePath as string))
    ]);
    return chain([
      deleteFile(`${newModulePath}/${strings.dasherize('globalizeData-' + options.culture)}.module.ts`),
      mergeWith(templateSource),
      addAngularGlobalizeForRoot({
        module: options.module,
      }, options.culture),
      addImportToNgModule({
        module: options.module,
        path: newModulePath,
        filename: strings.dasherize('globalize-data-' + options.culture) + '.module',
        moduleName: strings.classify('globalizeData-' + options.culture) + 'Module',
      }),
    ]);
  };
}
