const { contextBridge, ipcRenderer } = require('electron');

console.log('🚀 PRELOAD: Starting...');

contextBridge.exposeInMainWorld('api', {
  // ===== DEVICES =====
  getDevices: () => ipcRenderer.invoke('devices:getAll'),
  getDevicesByStatus: (status) => ipcRenderer.invoke('devices:getByStatus', status),
  searchDevices: (query) => ipcRenderer.invoke('devices:search', query),
  createDevice: (data) => ipcRenderer.invoke('devices:create', data),
  updateDevice: (id, data) => ipcRenderer.invoke('devices:update', id, data),
  deleteDevice: (id) => ipcRenderer.invoke('devices:delete', id),
  sellDevice: (deviceId, customerData) => ipcRenderer.invoke('devices:sell', deviceId, customerData),

  // ===== CUSTOMERS =====
  getCustomers: () => ipcRenderer.invoke('customers:getAll'),
  searchCustomers: (query) => ipcRenderer.invoke('customers:search', query),
  createCustomer: (data) => ipcRenderer.invoke('customers:create', data),
  updateCustomer: (id, data) => ipcRenderer.invoke('customers:update', id, data),
  deleteCustomer: (id) => ipcRenderer.invoke('customers:delete', id),
  returnDevice: (deviceId, returnData) => ipcRenderer.invoke('devices:return', deviceId, returnData),
  getReturnedDevices: () => ipcRenderer.invoke('devices:getReturned'),
  // ===== DUE TRACKING (NEW) =====
  getCustomersWithDue: () => ipcRenderer.invoke('customers:getWithDue'),
  getCustomerDevicesWithDue: (customerId) => ipcRenderer.invoke('customers:getDevicesWithDue', customerId),
});