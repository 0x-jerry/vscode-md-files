import { debug } from 'debug';
import { window } from 'vscode';

export function infoAlert(str: string, ...items: string[]) {
  return window.showInformationMessage(str, ...items);
}

export function warnAlert(str: string, ...items: string[]) {
  return window.showWarningMessage(str, ...items);
}

export function errorAlert(str: string, ...items: string[]) {
  return window.showErrorMessage(str, ...items);
}

export const debugInfo = debug('md-files');
