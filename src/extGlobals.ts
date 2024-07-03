import type { ExtensionContext } from 'vscode';
import type { MarkdownFiles } from './markdownFiles';

export const extGlobals = {
  markdownFiles: null as null | MarkdownFiles,
  context: null as null | ExtensionContext,
};
