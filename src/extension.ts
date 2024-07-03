import { type ExtensionContext } from 'vscode';
import { registerCommands } from './commands';
import { registerTreeViews } from './treeViews';
import { errorAlert } from './utils';
import { extGlobals } from './extGlobals';
import { MarkdownFiles } from './markdownFiles';

export function activate(context: ExtensionContext) {
  // Todo, use dep-injection instead of.
  extGlobals.markdownFiles = new MarkdownFiles(context);
  extGlobals.markdownFiles.scan()
  extGlobals.context = context;

  try {
    registerTreeViews(context);
    registerCommands(context);
  } catch (err) {
    errorAlert(String(err));
  }
}

export function deactivate() {
  extGlobals.markdownFiles = null;
  extGlobals.context = null;
}
