import { workspace } from 'vscode';

const CONFIG_SECTION = 'markdown.sidebar';

export enum ConfigProperty {
  ScanFolders = 'scan',
  Meta = 'meta',
  Tag = 'tag',
  Category = 'category',
}

/**
 * Scan configuration, excludes will extends on .gitignore file
 */
export interface IScanConfig {
  /**
   * Relative path to current workspace
   */
  dir: string;

  /**
   * Glob pattern
   * @default '**\/*.{md,mdx}'
   */
  include?: string;

  /**
   * Glob pattern
   * @default '**\/node_modules\/**'
   */
  exclude?: string;
}

export type IMetaPrimaryType = 'number' | 'string' | 'boolean' | 'date';

/**
 * Parse markdown metadata
 */
export interface IMetadataConfig {
  [key: string]: IMetaPrimaryType;
}

export interface IMeataMapConfig {
  metaName: string;
}

interface IConfigMap {
  [ConfigProperty.ScanFolders]: IScanConfig[];
  [ConfigProperty.Meta]: IMetadataConfig;
  [ConfigProperty.Tag]: IMeataMapConfig;
  [ConfigProperty.Category]: IMeataMapConfig;
}

export function getConfig<T extends ConfigProperty>(propName: T): IConfigMap[T] {
  const configs = workspace.getConfiguration(CONFIG_SECTION);
  const conf = configs.get<IConfigMap[T]>(propName);

  return conf!;
}
