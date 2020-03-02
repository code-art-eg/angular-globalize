
import {
  Rule,
  Tree,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
  SchematicContext,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask, TslintFixTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
  NodeDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { normalize, experimental } from '@angular-devkit/core';
import {
  updateTsConfig,
  updateTsConfigOptions,
  addImportToNgModule,
  addLanguage,
  deleteFile,
  addAngularGlobalize,
  addAngularGlobalizeRoot,
} from '../util';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';


function addDependencies(host: Tree): Tree {
  const dependencies: NodeDependency[] = [
    { type: NodeDependencyType.Dev, version: '^0.0.35', name: '@types/globalize' },
    { type: NodeDependencyType.Default, version: '^1.4.2', name: 'globalize' },
    { type: NodeDependencyType.Default, version: '^36.0.0', name: 'cldr-data' }
  ];

  dependencies.forEach(dependency => {
    if (!getPackageJsonDependency(host, dependency.name)) {
      addPackageJsonDependency(host, dependency);
    }
  }
  );

  return host;
}

export interface DataModuleOptions {
  date?: boolean;
  currency?: boolean;
  plural?: boolean;
  project?: string;
  updateTsConfig?: boolean;
  supportedLanguages?: string;
}

export function ngAdd(options: DataModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    addDependencies(host);
    // Add a task to run the package manager. This is necessary because we updated the
    // workspace "package.json" file and we want lock files to reflect the new version range.
    context.addTask(new NodePackageInstallTask());

    const workspaceConfig = host.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    if (!options.supportedLanguages) {
      options.supportedLanguages = 'en';
    }

    let split = options.supportedLanguages.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
    if (split.length === 0) {
      split = ['en'];
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
    const templateSource = apply(url('./files'), [
      applyTemplates({
        currency: !!options.currency,
        date: !!options.date,
        plural: !!options.plural,
      }),
      move(normalize(newModulePath as string)),
    ]);
    return chain([
      addAngularGlobalize({
        module: findModuleFromOptions(host, {
          path,
          name: '',
        }),
      }),
      addAngularGlobalizeRoot({
        module: findModuleFromOptions(host, {
          path,
          name: '',
        }),
      }, split),
      deleteFile(`${newModulePath}/globalize-data.module.ts`),
      mergeWith(templateSource),
      chain(split.map((c) => addLanguage({
        culture: c,
        currency: !!options.currency,
        date: !!options.date,
        project: options.project,
      }))),
      addImportToNgModule({
        module: findModuleFromOptions(host, {
          path,
          name: '',
        }),
        path: newModulePath,
        filename: 'globalize-data.module',
        moduleName: 'GlobalizeDataModule',
      }),
      options.updateTsConfig ? chain(
        [
          updateTsConfig('globalize', 'node_modules/globalize/dist/globalize'),
          updateTsConfig('globalize/*', 'node_modules/globalize/dist/globalize/*'),
          updateTsConfig('cldr', 'node_modules/cldrjs/dist/cldr'),
          updateTsConfig('cldr/*', 'node_modules/cldrjs/dist/cldr/*'),
          updateTsConfigOptions({
            allowSyntheticDefaultImports: true,
            resolveJsonModule: true,
            importHelpers: true,
          })]) : noop(),
      applyLintFix(),
    ]);
  };
}


