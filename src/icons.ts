import type { ExtensionContext, TreeItem } from 'vscode';

type TreeItemIcon = NonNullable<TreeItem['iconPath']>;

export function TagIcon(ctx: ExtensionContext): TreeItemIcon {
  return {
    light: ctx.asAbsolutePath(`resources/light/icon-tags.svg`),
    dark: ctx.asAbsolutePath(`resources/dark/icon-tags.svg`),
  };
}

export function CategoryIcon(ctx: ExtensionContext): TreeItemIcon {
  return {
    light: ctx.asAbsolutePath(`resources/light/icon-categories.svg`),
    dark: ctx.asAbsolutePath(`resources/dark/icon-categories.svg`),
  };
}
