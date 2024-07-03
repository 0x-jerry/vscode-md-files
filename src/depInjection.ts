import type { ExtensionContext } from 'vscode';
import type { MarkdownFiles } from './markdownFiles';
import { Container } from '@0x-jerry/utils/dep-injection';

export enum DIType {
  Extension = 'extension',
  MDFiles = 'markdown-files',
}

interface DepInjectionMap {
  [DIType.Extension]: ExtensionContext;
  [DIType.MDFiles]: MarkdownFiles;
}

export const DI = new Container<DepInjectionMap>();
