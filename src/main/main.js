const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

 
// ✅ ADD THIS - Auto reload in development
if (process.env.NODE_ENV === 'development') {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

// Import SERVICES (Controllers use Services)
const DeviceService = require('../services/device.service');
 

// --- CONTROLLER MIDDLEWARE (Error handler) ---
// This is like Express error middleware
const handleIPC = (fn) => {
  return async (event, ...args) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      console.error('[IPC Error]', error.message);
      // Send error back to React frontend
      throw new Error(error.message);
    }
  };
};

// --- WINDOW CREATION (Like Express app.listen) ---
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox:false,
    },
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

// ============================================
// DEVICE CONTROLLERS (IPC Routes)
// These are like: app.get('/devices', controller.getAll)
// ============================================
ipcMain.handle('devices:getAll', handleIPC(DeviceService.getAll));
ipcMain.handle('devices:getByStatus', handleIPC(DeviceService.getByStatus));
ipcMain.handle('devices:search', handleIPC(DeviceService.search));
ipcMain.handle('devices:create', handleIPC(DeviceService.create));
ipcMain.handle('devices:update', handleIPC(DeviceService.update));
ipcMain.handle('devices:delete', handleIPC(DeviceService.delete));

 
// ============================================
// APP LIFECYCLE (Like Express server start)
// ============================================
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});