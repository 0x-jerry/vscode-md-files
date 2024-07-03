import { DI } from '../depInjection';
import { Command, CommandId, command, type ICommandParsed } from './common';

@command()
export class RefreshCommand extends Command {
  constructor() {
    super(CommandId.Refresh);
  }

  async execute(parsedCommand: ICommandParsed, ...arg: any[]): Promise<any> {
    await DI.markdownFiles!.scan();
  }
}
