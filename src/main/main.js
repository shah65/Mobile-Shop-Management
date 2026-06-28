const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ============================================
// ✅ IMPORT SERVICES - Using normal functions
// ============================================
const {
  getAllDevices,
  getDevicesByStatus,
  searchDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  sellDevice,
  returnDevice,        // 👈 NEW
  getReturnedDevices,
} = require('../services/device.service');

const {
  getAllCustomers,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  // ✅ ADD THESE TWO:
  getCustomersWithDue,
  getCustomerDevicesWithDue,
} = require('../services/customer.service');

// ============================================
// ✅ DEBUG: Log to verify imports
// ============================================
console.log('✅ Device functions imported:');
console.log('  - getAllDevices:', typeof getAllDevices);
console.log('  - getDevicesByStatus:', typeof getDevicesByStatus);
console.log('  - createDevice:', typeof createDevice);
console.log('  - sellDevice:', typeof sellDevice);

console.log('✅ Customer functions imported:');
console.log('  - getAllCustomers:', typeof getAllCustomers);
console.log('  - createCustomer:', typeof createCustomer);
console.log('  - getCustomersWithDue:', typeof getCustomersWithDue);
console.log('  - getCustomerDevicesWithDue:', typeof getCustomerDevicesWithDue);

// ============================================
// AUTO RELOAD IN DEVELOPMENT
// ============================================
if (process.env.NODE_ENV === 'development') {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

// ============================================
// CONTROLLER MIDDLEWARE (Error handler)
// ============================================
function handleIPC(fn) {
  if (typeof fn !== 'function') {
    console.error('❌ handleIPC received non-function:', fn);
    throw new Error('fn is not a function');
  }

  return async (event, ...args) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      console.error('[IPC Error]', error.message);
      throw new Error(error.message);
    }
  };
}

// ============================================
// WINDOW CREATION
// ============================================
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
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
// ✅ DEVICE IPC HANDLERS
// ============================================
ipcMain.handle('devices:getAll', handleIPC(getAllDevices));
ipcMain.handle('devices:getByStatus', handleIPC(getDevicesByStatus));
ipcMain.handle('devices:search', handleIPC(searchDevices));
ipcMain.handle('devices:create', handleIPC(createDevice));
ipcMain.handle('devices:update', handleIPC(updateDevice));
ipcMain.handle('devices:delete', handleIPC(deleteDevice));
ipcMain.handle('devices:sell', handleIPC(sellDevice));
ipcMain.handle('devices:return', handleIPC(returnDevice));        // 👈 NEW
ipcMain.handle('devices:getReturned', handleIPC(getReturnedDevices)); // 👈 NEW
// ============================================
// ✅ CUSTOMER IPC HANDLERS
// ============================================
ipcMain.handle('customers:getAll', handleIPC(getAllCustomers));
ipcMain.handle('customers:search', handleIPC(searchCustomers));
ipcMain.handle('customers:create', handleIPC(createCustomer));
ipcMain.handle('customers:update', handleIPC(updateCustomer));
ipcMain.handle('customers:delete', handleIPC(deleteCustomer));

// ✅ NEW: Due tracking handlers
ipcMain.handle('customers:getWithDue', handleIPC(getCustomersWithDue));
ipcMain.handle('customers:getDevicesWithDue', handleIPC(getCustomerDevicesWithDue));

// ============================================
// APP LIFECYCLE
// ============================================
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});