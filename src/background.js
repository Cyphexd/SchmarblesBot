'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

import path from 'path'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {


  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 400,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: false,
      preload: path.resolve(__static, 'preload.js'),
    }
  })

  win.removeMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}




/** Chat Client Stuff */

import { ChatClient } from '@twurple/chat';
import { ElectronAuthProvider } from '@twurple/auth-electron';
import MarblesService from './services/marbles.service';

let chatClient = {};
const marblesService = new MarblesService();

ipcMain.on('LOGIN_TWITCH',  async (event, arg) => {
  const clientId = 'qp31wd44exfg200d1yl6zqtmx4z3dq';
  const redirectUri = 'http://localhost/login';
  
  const authProvider = new ElectronAuthProvider({
      clientId,
      redirectUri
  }, {
    escapeToClose: true,
    windowOptions: {
      modal: true
    }
  });

  await authProvider.getAccessToken(['chat:read', 'chat:edit', 'channel:moderate'])


  chatClient = new ChatClient({ authProvider });

  chatClient.onJoinFailure((channel, reason) => {
    event.reply('TWITCH_CHANNEL', {command: 'JOIN_FAIL', data: {channel, reason}});
  });

  chatClient.onJoin((channel, user) => {
    marblesService.addGame(channel);
    event.reply('TWITCH_CHANNEL', {command: 'JOIN_SUCCESS', data: {channel, user}});
  });
  

  await chatClient.connect()
  .catch((err) => {
    console.error(err);
  });

  if(!chatClient.isConnected) {
    event.reply('LOGIN_TWITCH_OK', {status: 'failure'});
    return;
  }

  marblesService.start(chatClient);
  marblesService.on('play', () => {
    const _opts = {
      command: 'UPDATE_GAME'
    }
    event.reply('TWITCH_CHANNEL', _opts);
  });
  event.reply('LOGIN_TWITCH_OK', {status: 'success'});
});




ipcMain.on('TWITCH_CHANNEL', async(event, arg) => {
  const {command, data} = arg;
  
  switch(command) {
    case 'JOIN': {
      if(chatClient.isConnected) {
        chatClient.join(data);
      }
    } break;
    case 'LIST_GAMES': {
      const games = marblesService.getGames();
      const _opt = {
        command: 'LIST_GAMES_OK',
        data: games
      }
      event.reply('TWITCH_CHANNEL', _opt);
    } break;
    case 'TOGGLE_PLAY_GAME': {
      marblesService.togglePlayGame(data);

      const _opt = {
        command: 'TOGGLE_PLAY_GAME_OK',
        data: data
      }
      event.reply('TWITCH_CHANNEL', _opt);
    } break;
    case 'REMOVE_GAME': {
      chatClient.part(data);
      marblesService.removeGame(data);

      const _opt = {
        command: 'REMOVE_GAME_OK',
        data: data
      }
      event.reply('TWITCH_CHANNEL', _opt);
    } break;
    case 'CHANGE_MESSAGE': {
      marblesService.setPlayMessage(data.channel, data.message);
      const _opt = {
        command: 'CHANGE_MESSAGE_OK',
        data: data.message
      }
      event.reply('TWITCH_CHANNEL', _opt);
    } break;
    case 'CHANGE_MIN_MESSAGES': {
      marblesService.setMinReqMsg(data.channel, data.message);
      const _opt = {
        command: 'CHANGE_MIN_MESSAGES_OK',
        data: data.message
      }
      event.reply('TWITCH_CHANNEL', _opt);
    } break;
    case 'CHANGE_MIN_MESSAGE_DELAY': {
      marblesService.setMinMsgDelay(data.channel, data.message);
      const _opt = {
        command: 'CHANGE_MIN_MESSAGE_DELAY_OK',
        data: data.message
      }
      event.reply('TWITCH_CHANNEL', _opt);
    } break;
    default: {
      console.log(`Command ${command} not found!`);
      console.log(arg);
    } break;
  }
})