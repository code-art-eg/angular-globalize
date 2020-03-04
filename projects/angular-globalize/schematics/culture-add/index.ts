import { AddCultureOptions } from '../models';
import { addCultureModule } from '../util';
import {
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';

export function cultureAdd(options: AddCultureOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return addCultureModule(options);
  };
}
