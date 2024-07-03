import {
  type ExtensionContext,
  type TreeDataProvider,
  type TreeViewOptions,
  type TreeView,
  window,
  Disposable,
} from 'vscode';
import { BaseDisposable } from '../disposable';

const registeredTreeViews: TreeViewClass[] = [];

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

interface TreeViewClass {
  new (ctx: ExtensionContext): Disposable;
}

export function treeView() {
  return <T extends TreeViewClass>(target: T, _ctx: ClassDecoratorContext<T>) => {
    registeredTreeViews.push(target);
  };
}

export function registerTreeViews(context: ExtensionContext) {
  for (const TreeViewCtor of registeredTreeViews) {
    context.subscriptions.push(new TreeViewCtor(context));
  }
}
