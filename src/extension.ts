import { type ExtensionContext, window } from 'vscode';
import { registerCommands } from './commands';
import { registerTreeViews } from './treeViews';

export function activate(context: ExtensionContext) {
  try {
    registerTreeViews(context);
    registerCommands(context);
  } catch (err) {
    window.showErrorMessage(String(err));
  }
}

export function deactivate() {}
