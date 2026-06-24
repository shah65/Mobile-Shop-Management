const { v4: uuidv4 } = require('uuid');
const DeviceModel = require('../models/device.module');

// --- VALIDATION MIDDLEWARE (Like Express middleware but for Electron) ---
const validateDeviceData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!data.brand?.trim()) errors.push('Brand is required');
    if (!data.model?.trim()) errors.push('Model is required');
  }

  if (data.purchase_price !== undefined && data.purchase_price !== null && data.purchase_price !== '') {
    const price = parseFloat(data.purchase_price);
    if (isNaN(price) || price < 0) errors.push('Purchase price must be a valid positive number');
  }

  if (data.selling_price !== undefined && data.selling_price !== null && data.selling_price !== '') {
    const price = parseFloat(data.selling_price);
    if (isNaN(price) || price < 0) errors.push('Selling price must be a valid positive number');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' | '));
  }

  return {
    brand: data.brand?.trim() || null,
    model: data.model?.trim() || null,
    imei: data.imei?.trim() || null,
    color: data.color?.trim() || null,
    storage: data.storage?.trim() || null,
    condition: data.condition?.trim() || 'used',
    purchase_price: data.purchase_price ? parseFloat(data.purchase_price) : null,
    selling_price: data.selling_price ? parseFloat(data.selling_price) : null,
    status: data.status?.trim() || 'in_stock',
  };
};

// --- SERVICE METHODS ---
const DeviceService = {
  getAll: () => {
    return DeviceModel.findAll();
  },

  getByStatus: (status) => {
    if (!status || !['in_stock', 'sold'].includes(status)) {
      throw new Error('Invalid status filter');
    }
    return DeviceModel.findByStatus(status);
  },

  search: (query) => {
    if (!query?.trim()) {
      return DeviceModel.findAll();
    }
    return DeviceModel.search(query.trim());
  },

  create: (rawData) => {
    const now = new Date().toISOString();
    const id = uuidv4();

    const validated = validateDeviceData(rawData, false);

    if (!validated.brand || !validated.model) {
      throw new Error('Brand and Model are required');
    }
    if (validated.purchase_price === null) {
      throw new Error('Purchase price is required and must be a number');
    }

    const deviceToInsert = {
      ...validated,
      id,
      created_at: now,
      updated_at: now,
    };

    return DeviceModel.insert(deviceToInsert);
  },

  update: (id, rawData) => {
    const existing = DeviceModel.findById(id);
    if (!existing) throw new Error('Device not found');

    const validated = validateDeviceData(rawData, true);
    const now = new Date().toISOString();

    const updatedData = {
      ...existing,
      ...validated,
      updated_at: now,
    };

    return DeviceModel.update(id, updatedData);
  },

  delete: (id) => {
    const existing = DeviceModel.findById(id);
    if (!existing) throw new Error('Device not found');
    return DeviceModel.delete(id);
  }
};

module.exports = DeviceService;