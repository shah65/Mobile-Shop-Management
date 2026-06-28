const { v4: uuidv4 } = require('uuid');
const CustomerModel = require('../models/customer.module');
const DeviceModel = require('../models/device.module'); // ✅ Add this for due functions

// ============================================
// VALIDATION FUNCTION
// ============================================
function validateCustomerData(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!data.name || !data.name.trim()) {
      errors.push('Name is required');
    }
    if (!data.phone || !data.phone.trim()) {
      errors.push('Phone is required');
    }
  }

  if (data.cnic && !/^[0-9-]+$/.test(data.cnic)) {
    errors.push('CNIC must contain only numbers and dashes');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' | '));
  }

  return {
    name: data.name ? data.name.trim() : null,
    phone: data.phone ? data.phone.trim() : null,
    cnic: data.cnic ? data.cnic.trim() : null,
    address: data.address ? data.address.trim() : null,
  };
}

// ============================================
// CUSTOMER CRUD FUNCTIONS
// ============================================

function getAllCustomers() {
  try {
    return CustomerModel.findAll();
  } catch (error) {
    console.error('[getAllCustomers] Error:', error.message);
    throw new Error('Failed to fetch customers: ' + error.message);
  }
}

function searchCustomers(query) {
  try {
    if (!query || !query.trim()) {
      return CustomerModel.findAll();
    }
    return CustomerModel.search(query.trim());
  } catch (error) {
    console.error('[searchCustomers] Error:', error.message);
    throw new Error('Failed to search customers: ' + error.message);
  }
}

function createCustomer(rawData) {
  try {
    const now = new Date().toISOString();
    const id = uuidv4();

    const validated = validateCustomerData(rawData, false);

    if (!validated.name || !validated.phone) {
      throw new Error('Name and phone are required');
    }

    const customer = {
      id: id,
      name: validated.name,
      phone: validated.phone,
      cnic: validated.cnic,
      address: validated.address,
      created_at: now,
      updated_at: now,
    };

    return CustomerModel.insert(customer);
  } catch (error) {
    console.error('[createCustomer] Error:', error.message);
    throw new Error('Failed to create customer: ' + error.message);
  }
}

function updateCustomer(id, rawData) {
  try {
    const existing = CustomerModel.findById(id);
    if (!existing) {
      throw new Error('Customer not found with ID: ' + id);
    }

    const validated = validateCustomerData(rawData, true);
    const now = new Date().toISOString();

    const updatedCustomer = {
      id: existing.id,
      name: validated.name || existing.name,
      phone: validated.phone || existing.phone,
      cnic: validated.cnic || existing.cnic,
      address: validated.address || existing.address,
      created_at: existing.created_at,
      updated_at: now,
    };

    return CustomerModel.update(id, updatedCustomer);
  } catch (error) {
    console.error('[updateCustomer] Error:', error.message);
    throw new Error('Failed to update customer: ' + error.message);
  }
}

function deleteCustomer(id) {
  try {
    const existing = CustomerModel.findById(id);
    if (!existing) {
      throw new Error('Customer not found with ID: ' + id);
    }
    return CustomerModel.delete(id);
  } catch (error) {
    console.error('[deleteCustomer] Error:', error.message);
    throw new Error('Failed to delete customer: ' + error.message);
  }
}

// ============================================
// ✅ NEW: DUE TRACKING FUNCTIONS
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
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    return DeviceModel.findByCustomerWithDue(customerId);
  } catch (error) {
    console.error('[getCustomerDevicesWithDue] Error:', error.message);
    throw new Error('Failed to fetch customer devices with due: ' + error.message);
  }
}

// ============================================
// ✅ EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  getAllCustomers,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomersWithDue,        // ✅ NEW
  getCustomerDevicesWithDue,  // ✅ NEW
};