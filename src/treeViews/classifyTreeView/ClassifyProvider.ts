import {
  type TreeDataProvider,
  EventEmitter,
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon,
  Uri,
  type ProviderResult,
} from 'vscode';
import { BuiltinCommandId } from '../../commands/common';
import { BaseDisposable } from '../../disposable';

export interface ClassifyProviderOption {
  getChildren(parent?: ClassifyItem): ClassifyItem[];
}

export class ClassifyProvider extends BaseDisposable implements TreeDataProvider<ClassifyItem> {
  private _onDidChangeTreeData = new EventEmitter<ClassifyItem | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private _allItems: Map<string, ClassifyItem> = new Map();

  constructor(readonly opt: ClassifyProviderOption) {
    super();

    this.subscribe(this._onDidChangeTreeData);
  }

  refresh() {
    this._allItems = new Map();
    this._onDidChangeTreeData.fire(null);
  }

  getTreeItem(element: ClassifyItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getItem(file: string) {
    const name = Uri.parse(file).toString();
    return this._allItems.get(name);
  }

  getParent(element: ClassifyItem): ProviderResult<ClassifyItem> {
    return element.parent;
  }

  async getChildren(parent?: ClassifyItem): Promise<ClassifyItem[]> {
    const elements = this.opt.getChildren(parent);

    elements.forEach((item) => {
      if (item.resourceUri) {
        this._allItems.set(item.resourceUri.toString(), item);
      }
    });

    return elements;
  }
}

interface ClassifyItemOption {
  label: string;
  uri?: Uri;
  collapsibleState?: TreeItemCollapsibleState;
  icon?: TreeItem['iconPath'];
  parent?: ClassifyItem;
}

export class ClassifyItem extends TreeItem {
  parent?: ClassifyItem;

  constructor(option: ClassifyItemOption) {
    const { uri, label, collapsibleState, icon, parent } = option;

    super(label, collapsibleState);

    this.iconPath = icon ?? (uri ? ThemeIcon.File : ThemeIcon.Folder);
    this.parent = parent;

    if (uri) {
      this.resourceUri = uri;

      this.command = {
        title: 'open',
        command: BuiltinCommandId.Open,
        arguments: [uri],
      };
    }
  }
}
