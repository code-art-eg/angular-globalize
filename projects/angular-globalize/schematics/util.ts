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

import { parse as parseJson } from 'jsonc-parser';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import {
  addImportToModule,
  getMetadataField,
  getDecoratorMetadata,
} from '@schematics/angular/utility/ast-utils';
import { InsertChange, ReplaceChange, Change } from '@schematics/angular/utility/change';
import { strings, normalize } from '@angular-devkit/core';
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

import { AddCultureOptions, DataModuleOptions, ProjectOptions } from './models';
import { CULTURE_NAMES } from './cultures';

type UpdateJsonFn<T> = (obj: T) => T | void;
interface TsConfigPartialType {
  compilerOptions: ts.CompilerOptions;
}

function updateJsonFile<T>(tree: Tree, path: string, callback: UpdateJsonFn<T>): Tree {
  const source = tree.read(path);
  if (source) {
    const sourceText = source.toString('utf-8');
    const json = parseJson(sourceText);
    callback(json as unknown as T);
    tree.overwrite(path, JSON.stringify(json, null, 2));
  }

  return tree;
}

function updateTsConfigPaths(packageName: string, ...paths: string[]) {
  return (tree: Tree) => {
    if (!tree.exists('tsconfig.json')) {
      return tree;
    }

    return updateJsonFile(tree, 'tsconfig.json', (tsconfig: TsConfigPartialType) => {
      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
      }
      if (!tsconfig.compilerOptions.paths[packageName]) {
        tsconfig.compilerOptions.paths[packageName] = [];
      }
      const ar = tsconfig.compilerOptions.paths[packageName];
      for (const path of paths) {
        if (ar.indexOf(path) === -1) {
          ar.push(path);
        }
      }
    });
  };
}

function updateTsConfigOptions(partialOptions: Partial<ts.CompilerOptions>) {
  return (tree: Tree) => {
    if (!tree.exists('tsconfig.json')) {
      return tree;
    }

    return updateJsonFile(tree, 'tsconfig.json', (tsconfig: TsConfigPartialType) => {
      for (const key in partialOptions) {
        if (partialOptions.hasOwnProperty(key)) {
          tsconfig.compilerOptions[key] = partialOptions[key];
        }
      }
    });
  };
}

function readIntoSourceFile(tree: Tree, modulePath: string): ts.SourceFile {
  const text = tree.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addAngularGlobalizeModule(options: ImportModuleOptions): Rule {
  return (tree: Tree) => {
    if (!options.module) {
      return tree;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(tree, modulePath);

    const packagePath = `@code-art-eg/angular-globalize`;

    const changes = addImportToModule(source, modulePath, 'AngularGlobalizeModule', packagePath);

    const importRecoder = tree.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        importRecoder.insertLeft(change.pos, change.toAdd);
      }
    }
    tree.commitUpdate(importRecoder);

    return tree;
  };
}

function addAngularGlobalizeForRoot(options: ImportModuleOptions, cultureName: string): Rule {
  return (tree: Tree) => {
    if (!options.module) {
      return tree;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(tree, modulePath);

    const changes = updateAngularglobalizeForRoot(source, modulePath, cultureName);

    const importRecoder = tree.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        importRecoder.insertLeft(change.pos, change.toAdd);
      } else if (change instanceof ReplaceChange) {
        const c = change as unknown as IReplaceChange;
        importRecoder.remove(c.pos, c.oldText.length);
        importRecoder.insertLeft(c.pos, c.newText);
      }
    }
    tree.commitUpdate(importRecoder);

    return tree;
  };
}

function addImportToNgModule(options: ImportModuleOptions): Rule {
  return (tree: Tree) => {
    if (!options.module) {
      return tree;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(tree, modulePath);

    const newModulePath = `/${options.path}/`
      + options.filename;

    const relativePath = buildRelativePath(modulePath, newModulePath);
    const classifiedName = options.moduleName as string;
    const changes = addImportToModule(source, modulePath, classifiedName, relativePath);

    const importRecoder = tree.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        importRecoder.insertLeft(change.pos, change.toAdd);
      }
    }
    tree.commitUpdate(importRecoder);

    return tree;
  };
}

function deleteFile(path: string): Rule {
  return (tree: Tree) => {
    if (tree.exists(path)) {
      tree.delete(path);
    }
    return tree;
  };
}

function getWorkspaceInfo(tree: Tree, options: ProjectOptions): WorkspaceInfo {
  const workspaceConfig = tree.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }
  // convert workspace to string
  const workspaceContent = workspaceConfig.toString();

  // parse workspace string into JSON object
  const workspace = JSON.parse(workspaceContent);
  if (!options.project) {
    options.project = workspace.defaultProject;
  }

  const projectName = options.project as string;
  const project = workspace.projects[projectName];
  const projectType = project.projectType === 'application' ? 'app' : 'lib';
  const path = `${project.sourceRoot}/${projectType}`;
  const module = findModuleFromOptions(tree, {
    path,
    name: ''
  });
  return {
    module,
    path,
  };
}

function validateCultureName(culture: string): void {
  if (CULTURE_NAMES.indexOf(culture) === -1) {
    throw new SchematicsException(`Invalid culture name "${culture}".
Please note that culture name is case sensitive and must be a name of a folder in node_modules/cldr-data/main.`);
  }
}

function updateAngularglobalizeForRoot(
  source: ts.SourceFile,
  ngModulePath: string,
  cultureName: string,
): Change[] {
  const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
  let node: any = nodes[0];  // eslint-disable-line @typescript-eslint/no-explicit-any

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
    // eslint-disable-next-line no-console
    console.error('No app module found. Please add your new class to your component.');

    return [];
  }

  if (Array.isArray(node)) {
    const nodeArray = node as unknown as Array<ts.Node>;
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
  return (tree: Tree) => {
    const info = getWorkspaceInfo(tree, options);

    if (!options.supportedCultures) {
      options.supportedCultures = 'en';
    }

    let split = options.supportedCultures.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
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
      chain(split.map((c) => addCultureModule({
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
    ]);
  };
}

export function addCultureModule(options: AddCultureOptions): Rule {
  return (tree: Tree) => {
    const info = getWorkspaceInfo(tree, options);
    options.module = info.module;
    options.path = info.path;
    return addCultureModuleInternal(options);
  };
}

function addCultureModuleInternal(options: AddCultureOptions): Rule {
  return () => {
    validateCultureName(options.culture);
    const newModulePath = `${options.path}/globalize-data`;
    const templateSource = apply(url('../ng-add/culture-files'), [
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
