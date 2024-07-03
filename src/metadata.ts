import { ConfigProperty, getConfig } from './configs';
import { makePair } from '@0x-jerry/utils';
import { debugInfo } from './utils';
import { parse } from 'yamljs';

export interface IMetadata {
  tags: string[];
  categories: string[];
  [key: string]: unknown | undefined;
}

const yamlRE = /---([\s\S]+)?---/;

/**
 *
 * @param content markdown content
 * @returns
 */
export function parseMetadata(content: string): IMetadata {
  const yamlContent = content.match(yamlRE)?.at(0);

  const meta: IMetadata = {
    tags: [],
    categories: [],
  };

  if (!yamlContent) {
    return meta;
  }

  try {
    const data = parse(yamlContent);

    return _parseMetadataType(data);
  } catch (error) {
    debugInfo('Parse metadata failed:', yamlContent);
    return meta;
  }
}

const valueTypePair = makePair({
  string(value) {
    return String(value);
  },
  number(value) {
    return parseFloat(value);
  },
  boolean(value) {
    return !!value;
  },
  date(value) {
    return new Date(value);
  },
});

function _parseMetadataType(data: Record<string, unknown>) {
  const conf = getConfig(ConfigProperty.Meta);

  const meta: IMetadata = {
    tags: [],
    categories: [],
  };

  Object.entries(conf).forEach(([key, type]) => {
    const value = data[key];

    if (value == null) {
      return;
    }

    const v = valueTypePair(type, value);

    meta[key] = v;
  });

  const tagConf = getConfig(ConfigProperty.Tag);
  const tagsValue = data[tagConf.metaName];
  meta.tags = isArrayString(tagsValue) ? tagsValue : [];

  const categoryConf = getConfig(ConfigProperty.Category);
  const categoriesValue = data[categoryConf.metaName];
  meta.categories = isArrayString(categoriesValue) ? categoriesValue : [];

  return meta;
}

function isArrayString(o: unknown): o is string[] {
  if (!Array.isArray(o)) {
    return false;
  }

  return o.every((n) => typeof n === 'string');
}
