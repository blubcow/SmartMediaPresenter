/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, IpcRenderer, session, desktopCapturer, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { registerMainProcessMethodHandlers } from './ipc/methods';
import { registerMainProcessPythonHandlers } from './ipc/python';
import * as os from 'os';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Attention! Any changes here must be also done in "methods.ts" line 461
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    // TODO: Reverse settings to electron-react-boilerplate when IPC is implemented
    webPreferences: {
      //sandbox: true,
      nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false, // TODO: Use app.isPackaged or isDebug maybe?
      allowRunningInsecureContent: true,
      plugins: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
    /*
    webPreferences: {
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    */
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //new AppUpdater();

  /**
   * Register IPC methods
   * All methods that are calling "ipcMain.handle(...)" are set up with this function
   */
  registerMainProcessMethodHandlers(
    app.getPath('userData'),
    ipcMain,
    mainWindow,
    getAssetPath,
    isDebug
  );

  registerMainProcessPythonHandlers(
    app.getPath('userData'),
    ipcMain,
    mainWindow,
    getAssetPath,
    isDebug
  );
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


/*
// Does not work with "blob:"
const setContentPolicy = function(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["worker-src 'self' 'unsafe-inline' * blob:;"]
      }
    })
  })
}
*/

/*
const reactDevToolsPath = path.join(
  os.homedir(),
  'AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.0.0_0'
)
*/

app
  .whenReady()
  .then(async () => {
    /*
    await session.defaultSession.loadExtension(reactDevToolsPath, {
      allowFileAccess: true
    });
    */

    //setContentPolicy();
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      //setContentPolicy();
      if (mainWindow === null) createWindow();
    });

    //initDesktopCapturer();
    //getVideoSources();
  })
  .catch(console.log);

/*
const initDesktopCapturer = function():void{
  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    if(!mainWindow)
      throw new Error("Execute 'initDesktopCapturer()' after 'createWindow()'");
    for (const source of sources) {
      if (source.name === 'Electron') {
        mainWindow.webContents.send('SET_SOURCE', source.id)
        return
      }
    }
  })
}

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
    return {
      label: source.name,
      //click: () => selectSource(source)
    };
    })
  );


  videoOptionsMenu.popup();
}
*/
