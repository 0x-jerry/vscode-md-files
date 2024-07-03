import {
  type ExtensionContext,
  type TreeDataProvider,
  type TreeViewOptions,
  type TreeView,
  window,
} from 'vscode';
import { BaseDisposable } from '../disposable';

const registedTreeViews: any[] = [];

const ViewIdPrefix = 'markdown.sidebar.container.';

export enum ViewId {
  Files = ViewIdPrefix + 'files',
  Categories = ViewIdPrefix + 'categories',
  Tags = ViewIdPrefix + 'tags',
}

export abstract class BaseTreeView<T> extends BaseDisposable {
  treeView: TreeView<T>;

  constructor(viewId: ViewId, provider: TreeDataProvider<T>, opts: Partial<TreeViewOptions<T>>) {
    super();
    this.treeView = window.createTreeView(viewId, {
      canSelectMany: true,
      treeDataProvider: provider,
      ...opts,
    });
    this.subscribe(this.treeView);
  }
}

export function treeView(): ClassDecorator {
  return (target: any) => {
    registedTreeViews.push(target);
  };
}

export function registerTreeViews(context: ExtensionContext) {
  for (const TreeViewCtor of registedTreeViews) {
    context.subscriptions.push(new TreeViewCtor(context));
  }
}
