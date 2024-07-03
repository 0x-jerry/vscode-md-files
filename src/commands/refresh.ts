import { extGlobals } from '../extGlobals';
import { Command, CommandId, command, type ICommandParsed } from './common';

@command()
export class RefreshCommand extends Command {
  constructor() {
    super(CommandId.Refresh);
  }

  async execute(parsedCommand: ICommandParsed, ...arg: any[]): Promise<any> {
    await extGlobals.markdownFiles!.scan();
  }
}
