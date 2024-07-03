import type { ExtensionContext } from 'vscode';
import { treeView, ViewId } from '../common';
import { ClassifyTreeView } from './ClassifyTreeView';
import { ClassifyItem, ClassifyProvider } from './ClassifyProvider';
import { CategoryIcon, TagIcon } from '../../icons';
import { DI, DIType } from '../../depInjection';
import * as ufo from 'ufo';
import type { IMarkdownFile } from '../../markdownFiles';
import { debugInfo } from '../../utils';

@treeView()
export class TagsTreeView extends ClassifyTreeView {
  constructor(ctx: ExtensionContext) {
    const provider = new ClassifyProvider({
      getChildren: createGetChildrenBuilder(ctx, 'tags'),
    });

    super(ctx, ViewId.Tags, provider);
  }
}

@treeView()
export class CategoriesTreeView extends ClassifyTreeView {
  constructor(ctx: ExtensionContext) {
    const provider = new ClassifyProvider({
      getChildren: createGetChildrenBuilder(ctx, 'tags'),
    });

    super(ctx, ViewId.Categories, provider);
  }
}

function createGetChildrenBuilder(ctx: ExtensionContext, labelType: 'tags' | 'categories') {
  const getLabels = (item: IMarkdownFile) => item.meta[labelType];
  const isTag = labelType === 'tags';

  return function getChildren(item: ClassifyItem): ClassifyItem[] {
    const mdFiles = DI.get(DIType.MDFiles);

    debugInfo('get files', item);

    if (!item) {
      const allLabels = mdFiles.files.map((item) => getLabels(item)).flat();
      const labels = [...new Set(allLabels)];

      return labels.map(
        (item) =>
          new ClassifyItem({
            label: item,
            icon: isTag ? TagIcon(ctx) : CategoryIcon(ctx),
          }),
      );
    }

    if (item.parent) {
      return [];
    }

    const label = item.label as string;

    const items = mdFiles.files
      .filter((item) => getLabels(item).includes(label))
      .map(
        (file) =>
          new ClassifyItem({
            label: ufo.parseFilename(file.uri.path, { strict: false })!,
            uri: file.uri,
            parent: item,
          }),
      );

    return items || [];
  };
}
