
console.log('🚀 PRELOAD: Starting...');

const { contextBridge, ipcRenderer } = require('electron');

// ✅ Log to confirm preload is running
console.log('🔵 PRELOAD: Script executed');

// Expose API
try {
  contextBridge.exposeInMainWorld('api', {
    getDevices: () => {
      console.log('📞 getDevices called');
      return ipcRenderer.invoke('devices:getAll');
    },
    getDevicesByStatus: (status) => ipcRenderer.invoke('devices:getByStatus', status),
    searchDevices: (query) => ipcRenderer.invoke('devices:search', query),
    createDevice: (data) => ipcRenderer.invoke('devices:create', data),
    updateDevice: (id, data) => ipcRenderer.invoke('devices:update', id, data),
    deleteDevice: (id) => ipcRenderer.invoke('devices:delete', id),
    // Customers (if needed)
    getCustomers: () => ipcRenderer.invoke('customers:getAll'),
    searchCustomers: (query) => ipcRenderer.invoke('customers:search', query),
    createCustomer: (data) => ipcRenderer.invoke('customers:create', data),
    updateCustomer: (id, data) => ipcRenderer.invoke('customers:update', id, data),
    deleteCustomer: (id) => ipcRenderer.invoke('customers:delete', id),
  });
  console.log('✅ API exposed successfully');
} catch (err) {
  console.error('❌ Failed to expose API:', err);
}