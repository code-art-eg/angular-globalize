
export interface ProjectOptions {
  project?: string;
  module?: string;
  path?: string;
}

export interface AddCultureOptions extends ProjectOptions {
  culture: string;
  currency: boolean;
  date: boolean;
}

export interface DataModuleOptions extends ProjectOptions {
  date?: boolean;
  currency?: boolean;
  plural?: boolean;
  updateTsConfig?: boolean;
  supportedCultures?: string;
}
