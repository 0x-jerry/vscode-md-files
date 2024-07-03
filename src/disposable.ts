import { Disposable } from 'vscode';

export class BaseDisposable implements Disposable {
  _disposables: Disposable[] = [];

  subscribe(...disposables: Disposable[]) {
    this._disposables.push(...disposables);
  }

  dispose() {
    for (const disposable of this._disposables) {
      disposable.dispose();
    }
  }
}
