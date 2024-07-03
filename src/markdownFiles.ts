import { RelativePattern, workspace, type ExtensionContext, type Uri } from 'vscode';
import { BaseDisposable } from './disposable';
import { parseMetadata, type IMetadata } from './metadata';
import { debugInfo } from './utils';
import { ConfigProperty, getConfig, type IScanConfig } from './configs';

export interface IMarkdownFile {
  uri: Uri;
  meta: IMetadata;
}

export class MarkdownFiles extends BaseDisposable {
  #files: IMarkdownFile[] = [];

  get files(): IMarkdownFile[] {
    return this.files;
  }

  constructor(readonly ctx: ExtensionContext) {
    super();

    this._initFileWatcher();
  }

  _initFileWatcher() {
    const scanConfigs = getConfig(ConfigProperty.ScanFolders);

    for (const scanConf of scanConfigs) {
      const pattern = new RelativePattern(scanConf.dir, scanConf.include || '**/*.{md,mdx}');
      const watcher = workspace.createFileSystemWatcher(pattern);

      watcher.onDidChange((uri) => this._updatByeUri(uri));
      watcher.onDidCreate((uri) => this._updatByeUri(uri));

      watcher.onDidDelete((uri) => this._removeByUri(uri));

      this.subscribe(watcher);
    }
  }

  async scan() {
    const scanConfigs = getConfig(ConfigProperty.ScanFolders);

    for (const scanConfig of scanConfigs) {
      await this._scan(scanConfig);
    }
  }

  async _updatByeUri(uri: Uri) {
    const content = (await workspace.fs.readFile(uri)).toString();

    const meta = parseMetadata(content);

    let url = uri.toString();
    const file = this.#files.find((n) => n.uri.toString() === url);

    if (file) {
      file.meta = meta;
    } else {
      this.#files.push({
        uri,
        meta,
      });
    }

    debugInfo('file scaned:', uri);
  }

  async _removeByUri(uri: Uri) {
    let url = uri.toString();
    const idx = this.#files.findIndex((n) => n.uri.toString() === url);

    if (idx >= 0) {
      this.#files.splice(idx, 1);
    }
  }

  async _scan(conf: IScanConfig) {
    const mdFiles = await workspace.findFiles(
      new RelativePattern(conf.dir, conf.include || '**/*.{md,mdx}'),
      new RelativePattern(conf.dir, conf.exclude || '**/node_modules/**'),
      1000,
    );

    for (const file of mdFiles) {
      await this._updatByeUri(file);
    }
  }
}
