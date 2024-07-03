import { type TreeViewOptions, window, type ExtensionContext } from 'vscode';
import { BaseTreeView, ViewId } from '../common';
import { ClassifyItem, ClassifyProvider } from './ClassifyProvider';
import { sleep } from '@0x-jerry/utils';

export abstract class ClassifyTreeView extends BaseTreeView<ClassifyItem> {
  provider: ClassifyProvider;

  constructor(
    readonly context: ExtensionContext,
    viewId: ViewId,
    provider: ClassifyProvider,
    opts: Partial<TreeViewOptions<ClassifyItem>> = {},
  ) {
    super(viewId, provider, opts);

    this.provider = provider;

    this._setupAutoFocus();
  }

  _setupAutoFocus() {
    this.subscribe(
      window.onDidChangeActiveTextEditor(async (editor) => {
        await sleep(300);
        this._focus(editor);
      }),
    );
  }

  _focus(editor = window.activeTextEditor) {
    if (!editor || !this.treeView.visible) {
      return;
    }

    const fileUri = editor.document.uri;
    const fsPath =
      fileUri.scheme === 'git'
        ? // remove `.git` suffix
          fileUri.fsPath.slice(0, -3)
        : fileUri.fsPath;

    const item = this.provider.getItem(fsPath);

    if (!item) {
      return;
    }

    this.treeView.reveal(item);
  }
}
