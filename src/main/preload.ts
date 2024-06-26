// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { BrowserWindow, contextBridge, dialog, ipcRenderer, IpcRendererEvent, SaveDialogReturnValue } from 'electron';
import { MainProcessMethodIdentifiers } from '../renderer/shared/types/identifiers';
export type Channels = 'ipc-example';
import * as fs from 'fs';

/*
const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  },
};
*/

//contextBridge.exposeInMainWorld('electron', electronHandler);

// With context isolation enabled!!
//contextBridge.exposeInMainWorld('electron', ipcRenderer);

// With context isolation disabled!!
window.electron = ipcRenderer;

//window.desktopCapturer = desktopCapturer;
//window.Menu = Menu;

/*
export const electron = new Promise((resolve,reject) => {
  resolve(ipcRenderer);
});
*/

//export type ElectronHandler = typeof electronHandler;
export type ElectronHandler = typeof ipcRenderer;