import { type ExtensionContext, commands } from 'vscode';
import { BaseDisposable } from '../disposable';

const CommandPrefix = 'markdown.sidebar.command.';

/**
 * <command>[[...args]]
 *
 * example:
 * new[default layout, default name]
 * new[post, new article]
 *
 */
export enum CommandId {
  Refresh = CommandPrefix + 'refresh',
  Delete = CommandPrefix + 'delete',
}

export enum BuiltinCommandId {
  Open = 'vscode.open',
}

export interface ICommandParsed {
  cmd: string;
  args: string[];
}

export abstract class Command extends BaseDisposable {
  static parseCommand(commandId: CommandId): ICommandParsed {
    let args: string[] = [];
    const cmd = commandId.replace(/\[(.+)\]/, (_, params) => {
      if (typeof params === 'string') {
        args = params.split(',').map((a) => a.trim());
      }

      return '';
    });

    return {
      cmd,
      args,
    };
  }

  constructor(...commandIds: CommandId[]) {
    super();

    const registers = commandIds.map((commandId) =>
      commands.registerCommand(commandId, (...args) => this._execute(commandId, ...args)),
    );

    this.subscribe(...registers);
  }

  abstract execute(parsedCommand: ICommandParsed, ...arg: any[]): Promise<any>;

  async _execute(command: CommandId, ...args: any[]) {
    const parsedCommand = Command.parseCommand(command);

    return this.execute(parsedCommand, ...args);
  }
}

const registedCommands: any[] = [];

export function command(): ClassDecorator {
  return (target: any) => {
    registedCommands.push(target);
  };
}

export function registerCommands(context: ExtensionContext): void {
  for (const CommandCtor of registedCommands) {
    context.subscriptions.push(new CommandCtor());
  }
}
