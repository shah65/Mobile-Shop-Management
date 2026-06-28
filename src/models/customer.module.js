const db = require("../main/db");

// ============================================
// CUSTOMER MODEL - Normal Functions
// ============================================

// ---------- GET ALL CUSTOMERS ----------
function findAll() {
  return db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
}

// ---------- FIND BY ID ----------
function findById(id) {
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
}

// ---------- SEARCH CUSTOMERS ----------
function search(query) {
  const q = `%${query}%`;
  return db.prepare(`
    SELECT * FROM customers 
    WHERE name LIKE ? OR phone LIKE ? OR cnic LIKE ? 
    ORDER BY created_at DESC
  `).all(q, q, q);
}

// ---------- INSERT NEW CUSTOMER ----------
function insert(customer) {
  const stmt = db.prepare(`
    INSERT INTO customers (id, name, phone, cnic, address, created_at, updated_at)
    VALUES (@id, @name, @phone, @cnic, @address, @created_at, @updated_at)
  `);
  stmt.run(customer);
  return findById(customer.id);
}

// ---------- UPDATE CUSTOMER ----------
function update(id, customer) {
  const stmt = db.prepare(`
    UPDATE customers SET 
      name = @name,
      phone = @phone,
      cnic = @cnic,
      address = @address,
      updated_at = @updated_at
    WHERE id = @id
  `);
  stmt.run({ ...customer, id });
  return findById(id);
}

// ---------- DELETE CUSTOMER ----------
function deleteCustomer(id) {
  // Check if customer has linked devices
  const devices = db.prepare("SELECT * FROM devices WHERE customer_id = ?").all(id);
  if (devices.length > 0) {
    throw new Error("Cannot delete customer with linked devices. Remove devices first.");
  }
  db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  return { success: true };
}
// ---------- RETURN DEVICE ----------
 

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  findAll,
  findById,
  search,
  insert,
  update,
  delete: deleteCustomer,
   
};