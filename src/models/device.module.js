const db = require('../main/db');

// ============================================
// DEVICE MODEL - Normal Functions
// ============================================

// ---------- FIND ALL DEVICES ----------
function findAll() {
  try {
    return db.prepare(`
      SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
      FROM devices 
      LEFT JOIN customers ON devices.customer_id = customers.id 
      ORDER BY devices.created_at DESC
    `).all();
  } catch (error) {
    console.error('[findAll] Error:', error.message);
    throw new Error('Failed to fetch devices: ' + error.message);
  }
}

// ---------- FIND DEVICE BY ID ----------
function findById(id) {
  try {
    return db.prepare(`
      SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
      FROM devices 
      LEFT JOIN customers ON devices.customer_id = customers.id 
      WHERE devices.id = ?
    `).get(id);
  } catch (error) {
    console.error('[findById] Error:', error.message);
    throw new Error('Failed to find device: ' + error.message);
  }
}

// ---------- FIND DEVICES BY STATUS ----------
function findByStatus(status) {
  try {
    return db.prepare(`
      SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
      FROM devices 
      LEFT JOIN customers ON devices.customer_id = customers.id 
      WHERE devices.status = ? 
      ORDER BY devices.created_at DESC
    `).all(status);
  } catch (error) {
    console.error('[findByStatus] Error:', error.message);
    throw new Error('Failed to fetch devices by status: ' + error.message);
  }
}

// ---------- SEARCH DEVICES ----------
function search(query) {
  try {
    const q = `%${query}%`;
    return db.prepare(`
      SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
      FROM devices 
      LEFT JOIN customers ON devices.customer_id = customers.id 
      WHERE devices.brand LIKE ? OR devices.model LIKE ? OR devices.imei LIKE ?
      ORDER BY devices.created_at DESC
    `).all(q, q, q);
  } catch (error) {
    console.error('[search] Error:', error.message);
    throw new Error('Failed to search devices: ' + error.message);
  }
}

// ---------- INSERT NEW DEVICE ----------
function insert(device) {
  try {
    const stmt = db.prepare(`
      INSERT INTO devices
        (id, brand, model, imei, color, storage, condition, 
         purchase_price, selling_price, paid_amount, remaining_due, 
         status, customer_id, created_at, updated_at)
      VALUES
        (@id, @brand, @model, @imei, @color, @storage, @condition, 
         @purchase_price, @selling_price, @paid_amount, @remaining_due, 
         @status, @customer_id, @created_at, @updated_at)
    `);
    stmt.run(device);
    return findById(device.id);
  } catch (error) {
    console.error('[insert] Error:', error.message);
    throw new Error('Failed to create device: ' + error.message);
  }
}

// ---------- UPDATE DEVICE ----------
function update(id, device) {
  try {
    const stmt = db.prepare(`
      UPDATE devices SET
        brand = @brand,
        model = @model,
        imei = @imei,
        color = @color,
        storage = @storage,
        condition = @condition,
        purchase_price = @purchase_price,
        selling_price = @selling_price,
        paid_amount = @paid_amount,
        remaining_due = @remaining_due,
        status = @status,
        customer_id = @customer_id,
        updated_at = @updated_at
      WHERE id = @id
    `);
    stmt.run({ ...device, id });
    return findById(id);
  } catch (error) {
    console.error('[update] Error:', error.message);
    throw new Error('Failed to update device: ' + error.message);
  }
}

// ---------- DELETE DEVICE ----------
function deleteDevice(id) {
  try {
    const existing = findById(id);
    if (!existing) {
      throw new Error('Device not found with ID: ' + id);
    }
    db.prepare('DELETE FROM devices WHERE id = ?').run(id);
    return { success: true };
  } catch (error) {
    console.error('[deleteDevice] Error:', error.message);
    throw new Error('Failed to delete device: ' + error.message);
  }
}

// ---------- FIND DEVICES BY CUSTOMER WITH DUE ----------
function findByCustomerWithDue(customerId) {
  try {
    return db.prepare(`
      SELECT * FROM devices 
      WHERE customer_id = ? AND remaining_due > 0
      ORDER BY created_at DESC
    `).all(customerId);
  } catch (error) {
    console.error('[findByCustomerWithDue] Error:', error.message);
    throw new Error('Failed to fetch customer devices with due: ' + error.message);
  }
}

// ---------- GET ALL CUSTOMERS WITH DUE ----------
function getCustomersWithDue() {
  try {
    return db.prepare(`
      SELECT 
        customers.*,
        COUNT(devices.id) as device_count,
        SUM(devices.remaining_due) as total_due
      FROM customers
      INNER JOIN devices ON customers.id = devices.customer_id
      WHERE devices.remaining_due > 0
      GROUP BY customers.id
      ORDER BY total_due DESC
    `).all();
  } catch (error) {
    console.error('[getCustomersWithDue] Error:', error.message);
    throw new Error('Failed to fetch customers with due: ' + error.message);
  }
}

// ---------- GET DEVICE WITH CUSTOMER DETAILS ----------
function findWithCustomer(id) {
  try {
    return db.prepare(`
      SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
      FROM devices 
      LEFT JOIN customers ON devices.customer_id = customers.id 
      WHERE devices.id = ?
    `).get(id);
  } catch (error) {
    console.error('[findWithCustomer] Error:', error.message);
    throw new Error('Failed to fetch device with customer: ' + error.message);
  }
}

// ============================================
// ✅ RETURN DEVICE - Sets status to 'in_stock'
// ============================================
function returnDevice(id, returnData) {
  try {
    const stmt = db.prepare(`
      UPDATE devices SET
        status = 'in_stock',           -- ✅ Back to stock
        condition = @condition,
        selling_price = @return_price,
        return_price = @return_price,
        return_deduction = @return_deduction,
        return_reason = @return_reason,
        returned_at = @returned_at,
        customer_id = NULL,            -- ✅ Remove customer link
        paid_amount = 0,               -- ✅ Reset payment
        remaining_due = 0,             -- ✅ Reset due
        updated_at = @updated_at
      WHERE id = @id
    `);
    stmt.run({
      id: id,
      condition: returnData.condition || 'used',
      return_price: returnData.return_price,
      return_deduction: returnData.return_deduction || 0,
      return_reason: returnData.return_reason || 'Customer return',
      returned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return findById(id);
  } catch (error) {
    console.error('[returnDevice] Error:', error.message);
    throw new Error('Failed to return device: ' + error.message);
  }
}

// ============================================
// ✅ GET RETURNED DEVICES
// ============================================
function getReturnedDevices() {
  try {
    return db.prepare(`
      SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
      FROM devices 
      LEFT JOIN customers ON devices.customer_id = customers.id 
      WHERE devices.returned_at IS NOT NULL   -- ✅ Check if returned_at exists
      ORDER BY devices.returned_at DESC
    `).all();
  } catch (error) {
    console.error('[getReturnedDevices] Error:', error.message);
    // Fallback: use status
    try {
      return db.prepare(`
        SELECT devices.*, customers.name as customer_name, customers.phone as customer_phone 
        FROM devices 
        LEFT JOIN customers ON devices.customer_id = customers.id 
        WHERE devices.status = 'in_stock' AND devices.returned_at IS NOT NULL
        ORDER BY devices.updated_at DESC
      `).all();
    } catch (e) {
      throw new Error('Failed to fetch returned devices: ' + error.message);
    }
  }
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  findAll,
  findById,
  findByStatus,
  search,
  insert,
  update,
  deleteDevice,
  findByCustomerWithDue,
  getCustomersWithDue,
  findWithCustomer,
  returnDevice,
  getReturnedDevices,
};