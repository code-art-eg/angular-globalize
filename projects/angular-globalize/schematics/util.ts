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
} from '@angular-devkit/schematics';

import { JsonParseMode, parseJson } from '@angular-devkit/core';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { addImportToModule, addSymbolToNgModuleMetadata } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { strings, normalize, experimental } from '@angular-devkit/core';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';

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

export function updateTsConfig(packageName: string, ...paths: string[]) {

  return (host: Tree) => {
    if (!host.exists('tsconfig.json')) { return host; }

    return updateJsonFile(host, 'tsconfig.json', (tsconfig: TsConfigPartialType) => {
      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
      }
      if (!tsconfig.compilerOptions.paths[packageName]) {
        tsconfig.compilerOptions.paths[packageName] = [];
      }
      tsconfig.compilerOptions.paths[packageName].push(...paths);
    });
  };
}

export function updateTsConfigOptions(partialOptions: Partial<ts.CompilerOptions>) {

  return (host: Tree) => {
    if (!host.exists('tsconfig.json')) { return host; }

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

interface ImportModuleOptions {
  module?: string;
  path?: string;
  filename?: string;
  moduleName?: string;
}

export function addAngularGlobalize(options: ImportModuleOptions): Rule {
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

export function addAngularGlobalizeRoot(options: ImportModuleOptions, langs: string[]): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);

    const changes = addSymbolToNgModuleMetadata(source, modulePath, 'imports',
      `AngularGlobalizeModule.forRoot(${JSON.stringify(langs).replace(/\"/g, '\'')})`);

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

export function addImportToNgModule(options: ImportModuleOptions): Rule {
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

export interface AddLanguageOptions {
  project?: string;
  culture: string;
  currency: boolean;
  date: boolean;
}

export function deleteFile(path: string): Rule {
  return (host: Tree) => {
    if (host.exists(path)) {
      host.delete(path);
    }
    return host;
  };
}

export function addLanguage(options: AddLanguageOptions): Rule {
  return (host: Tree) => {
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
    const newModulePath = `${path}/globalize-data`;
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
      addImportToNgModule({
        module: findModuleFromOptions(host, {
          path,
          name: '',
        }),
        path: newModulePath,
        filename: strings.dasherize('globalize-data-' + options.culture) + '.module',
        moduleName: strings.classify('globalizeData-' + options.culture) + 'Module',
      }),
    ]);
  };
}
