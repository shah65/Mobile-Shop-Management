const { v4: uuidv4 } = require('uuid');
const DeviceModel = require('../models/device.module');

// ============================================
// VALIDATION FUNCTION
// ============================================
function validateDeviceData(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!data.brand || !data.brand.trim()) {
      errors.push('Brand is required');
    }
    if (!data.model || !data.model.trim()) {
      errors.push('Model is required');
    }
  }

  if (data.purchase_price !== undefined && data.purchase_price !== null && data.purchase_price !== '') {
    const price = parseFloat(data.purchase_price);
    if (isNaN(price) || price < 0) {
      errors.push('Purchase price must be a valid positive number');
    }
  }

  if (data.selling_price !== undefined && data.selling_price !== null && data.selling_price !== '') {
    const price = parseFloat(data.selling_price);
    if (isNaN(price) || price < 0) {
      errors.push('Selling price must be a valid positive number');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' | '));
  }

  return {
    brand: data.brand ? data.brand.trim() : null,
    model: data.model ? data.model.trim() : null,
    imei: data.imei ? data.imei.trim() : null,
    color: data.color ? data.color.trim() : null,
    storage: data.storage ? data.storage.trim() : null,
    condition: data.condition ? data.condition.trim() : 'used',
    purchase_price: data.purchase_price ? parseFloat(data.purchase_price) : null,
    selling_price: data.selling_price ? parseFloat(data.selling_price) : null,
    status: data.status ? data.status.trim() : 'in_stock',
  };
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

// ---------- GET ALL DEVICES ----------
function getAllDevices() {
  try {
    return DeviceModel.findAll();
  } catch (error) {
    console.error('[getAllDevices] Error:', error.message);
    throw new Error('Failed to fetch devices: ' + error.message);
  }
}

// ---------- GET DEVICES BY STATUS ----------
function getDevicesByStatus(status) {
  try {
    if (!status || !['in_stock', 'sold'].includes(status)) {
      throw new Error('Invalid status filter. Use "in_stock" or "sold"');
    }
    return DeviceModel.findByStatus(status);
  } catch (error) {
    console.error('[getDevicesByStatus] Error:', error.message);
    throw new Error('Failed to fetch devices by status: ' + error.message);
  }
}

// ---------- SEARCH DEVICES ----------
function searchDevices(query) {
  try {
    if (!query || !query.trim()) {
      return DeviceModel.findAll();
    }
    return DeviceModel.search(query.trim());
  } catch (error) {
    console.error('[searchDevices] Error:', error.message);
    throw new Error('Failed to search devices: ' + error.message);
  }
}

// ---------- CREATE NEW DEVICE ----------
function createDevice(rawData) {
  try {
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
      id: id,
      brand: validated.brand,
      model: validated.model,
      imei: validated.imei,
      color: validated.color,
      storage: validated.storage,
      condition: validated.condition,
      purchase_price: validated.purchase_price,
      selling_price: validated.selling_price,
      paid_amount: 0,
      remaining_due: 0,
      status: 'in_stock',
      customer_id: null,
      created_at: now,
      updated_at: now,
    };

    return DeviceModel.insert(deviceToInsert);
  } catch (error) {
    console.error('[createDevice] Error:', error.message);
    throw new Error('Failed to create device: ' + error.message);
  }
}

// ---------- UPDATE DEVICE ----------
function updateDevice(id, rawData) {
  try {
    const existing = DeviceModel.findById(id);
    if (!existing) {
      throw new Error('Device not found with ID: ' + id);
    }

    const validated = validateDeviceData(rawData, true);
    const now = new Date().toISOString();

    const updatedData = {
      id: existing.id,
      brand: validated.brand || existing.brand,
      model: validated.model || existing.model,
      imei: validated.imei || existing.imei,
      color: validated.color || existing.color,
      storage: validated.storage || existing.storage,
      condition: validated.condition || existing.condition,
      purchase_price: validated.purchase_price !== null ? validated.purchase_price : existing.purchase_price,
      selling_price: validated.selling_price !== null ? validated.selling_price : existing.selling_price,
      paid_amount: existing.paid_amount || 0,
      remaining_due: existing.remaining_due || 0,
      status: validated.status || existing.status,
      customer_id: existing.customer_id,
      created_at: existing.created_at,
      updated_at: now,
    };

    return DeviceModel.update(id, updatedData);
  } catch (error) {
    console.error('[updateDevice] Error:', error.message);
    throw new Error('Failed to update device: ' + error.message);
  }
}

// ---------- DELETE DEVICE ----------
function deleteDevice(id) {
  try {
    return DeviceModel.deleteDevice(id);
  } catch (error) {
    console.error('[deleteDevice] Error:', error.message);
    throw new Error('Failed to delete device: ' + error.message);
  }
}

// ============================================
// SELL DEVICE WITH CUSTOMER AND DUE
// ============================================
function sellDevice(deviceId, customerData) {
  try {
    const CustomerModel = require('../models/customer.module');

    // 1. Check if device exists
    const device = DeviceModel.findById(deviceId);
    if (!device) {
      throw new Error('Device not found with ID: ' + deviceId);
    }

    // 2. Check if device is already sold
    if (device.status === 'sold') {
      throw new Error('Device is already sold');
    }

    // 3. Handle customer
    let customerId = customerData.id;

    if (!customerId) {
      // Create new customer
      const now = new Date().toISOString();
      const id = uuidv4();

      if (!customerData.name || !customerData.name.trim()) {
        throw new Error('Customer name is required');
      }
      if (!customerData.phone || !customerData.phone.trim()) {
        throw new Error('Customer phone is required');
      }

      const newCustomer = {
        id: id,
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        cnic: customerData.cnic ? customerData.cnic.trim() : null,
        address: customerData.address ? customerData.address.trim() : null,
        created_at: now,
        updated_at: now,
      };

      const inserted = CustomerModel.insert(newCustomer);
      customerId = inserted.id;
    }

    // 4. Calculate amounts
    const now = new Date().toISOString();
    const sellingPrice = parseFloat(customerData.selling_price) || device.selling_price || device.purchase_price;
    const paidAmount = parseFloat(customerData.paid_amount) || 0;
    const remainingDue = Math.max(0, sellingPrice - paidAmount);

    // 5. Update device
    const updatedDevice = {
      id: device.id,
      brand: device.brand,
      model: device.model,
      imei: device.imei,
      color: device.color,
      storage: device.storage,
      condition: device.condition,
      purchase_price: device.purchase_price,
      selling_price: sellingPrice,
      paid_amount: paidAmount,
      remaining_due: remainingDue,
      status: 'sold',
      customer_id: customerId,
      created_at: device.created_at,
      updated_at: now,
    };

    return DeviceModel.update(deviceId, updatedDevice);
  } catch (error) {
    console.error('[sellDevice] Error:', error.message);
    throw new Error('Failed to sell device: ' + error.message);
  }
}

// ============================================
// RETURN DEVICE
// ============================================
function returnDevice(deviceId, returnData) {
  try {
    // 1. Check if device exists
    const device = DeviceModel.findById(deviceId);
    if (!device) {
      throw new Error('Device not found with ID: ' + deviceId);
    }

    // 2. Check if device is sold
    if (device.status !== 'sold') {
      throw new Error('Only sold devices can be returned');
    }

    // 3. Validate return data
    const returnPrice = returnData.return_price || device.selling_price || device.purchase_price;
    const deduction = returnData.return_deduction || 0;

    // 4. Calculate final price after deduction
    const finalReturnPrice = returnPrice - (returnPrice * (deduction / 100));

    const returnPayload = {
      condition: returnData.condition || 'used',
      return_price: finalReturnPrice,
      return_deduction: deduction,
      return_reason: returnData.return_reason || 'Customer return',
    };

    // 5. Update device
    const updatedDevice = DeviceModel.returnDevice(deviceId, returnPayload);
    console.log('[returnDevice] Device returned successfully:', updatedDevice);

    return updatedDevice;
  } catch (error) {
    console.error('[returnDevice] Error:', error.message);
    throw new Error('Failed to return device: ' + error.message);
  }
}

// ============================================
// GET RETURNED DEVICES
// ============================================
function getReturnedDevices() {
  try {
    return DeviceModel.getReturnedDevices();
  } catch (error) {
    console.error('[getReturnedDevices] Error:', error.message);
    throw new Error('Failed to fetch returned devices: ' + error.message);
  }
}

// ============================================
// CUSTOMER DUE FUNCTIONS
// ============================================
function getCustomersWithDue() {
  try {
    return DeviceModel.getCustomersWithDue();
  } catch (error) {
    console.error('[getCustomersWithDue] Error:', error.message);
    throw new Error('Failed to fetch customers with due: ' + error.message);
  }
}

function getCustomerDevicesWithDue(customerId) {
  try {
    return DeviceModel.findByCustomerWithDue(customerId);
  } catch (error) {
    console.error('[getCustomerDevicesWithDue] Error:', error.message);
    throw new Error('Failed to fetch customer devices with due: ' + error.message);
  }
}

// ============================================
// ✅ EXPORT ALL FUNCTIONS (ONLY ONCE)
// ============================================
module.exports = {
  getAllDevices,
  getDevicesByStatus,
  searchDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  sellDevice,
  returnDevice,
  getReturnedDevices,
  getCustomersWithDue,
  getCustomerDevicesWithDue,
};