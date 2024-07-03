import { type ExtensionContext } from 'vscode';
import { registerCommands } from './commands';
import { registerTreeViews } from './treeViews';
import { debugInfo, errorAlert } from './utils';
import { DI, DIType } from './depInjection';
import { MarkdownFiles } from './markdownFiles';

export function activate(context: ExtensionContext) {
  debugInfo('activate');

  DI.bind(DIType.Extension, context);
  DI.bind(DIType.MDFiles, MarkdownFiles);

  const mdFiles = DI.get(DIType.MDFiles);

  mdFiles.scan();

  try {
    registerTreeViews(context);
    registerCommands(context);
  } catch (err) {
    errorAlert(String(err));
  }
}

export function deactivate() {
  DI.clear();
  debugInfo('deactivate');
}
