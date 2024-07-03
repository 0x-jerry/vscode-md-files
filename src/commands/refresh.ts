import { extGlobals } from '../extGlobals';
import { Command, CommandId, type ICommandParsed } from './common';

export class RefreshCommand extends Command {
  constructor() {
    super(CommandId.Refresh);
  }

  async execute(parsedCommand: ICommandParsed, ...arg: any[]): Promise<any> {
    await extGlobals.markdownFiles!.scan();
  }
}
