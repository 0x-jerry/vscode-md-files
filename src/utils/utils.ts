import { window, workspace } from 'vscode';

/**
 * true if yse
 * @param placeHolder msg
 */
export async function askForNext(placeHolder: string): Promise<boolean> {
  const replace = await window.showQuickPick(['yes', 'no'], {
    placeHolder,
  });

  return replace === 'yes';
}

export function isVirtualWorkspace() {
  const isVirtualWorkspace =
    workspace.workspaceFolders && workspace.workspaceFolders.every((f) => f.uri.scheme !== 'file');

  return isVirtualWorkspace;
}
