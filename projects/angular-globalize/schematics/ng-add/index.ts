
import {
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
  NodeDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import {
  addAngularGlobalize,
} from '../util';
import { DataModuleOptions } from '../models';


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

export function ngAdd(options: DataModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    addDependencies(host);
    // Add a task to run the package manager. This is necessary because we updated the
    // workspace "package.json" file and we want lock files to reflect the new version range.
    context.addTask(new NodePackageInstallTask());

    return addAngularGlobalize(options);
  };
}


