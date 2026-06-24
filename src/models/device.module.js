const db = require('../main/db');

const DeviceModel = {
  findAll: () => {
    return db.prepare('SELECT * FROM devices ORDER BY created_at DESC').all();
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM devices WHERE id = ?').get(id);
  },

  findByStatus: (status) => {
    return db.prepare('SELECT * FROM devices WHERE status = ? ORDER BY created_at DESC').all(status);
  },

  search: (query) => {
    const q = `%${query}%`;
    return db.prepare(`
      SELECT * FROM devices
      WHERE brand LIKE ? OR model LIKE ? OR imei LIKE ?
      ORDER BY created_at DESC
    `).all(q, q, q);
  },

  insert: (device) => {
    const stmt = db.prepare(`
      INSERT INTO devices
        (id, brand, model, imei, color, storage, condition, purchase_price, selling_price, status, created_at, updated_at)
      VALUES
        (@id, @brand, @model, @imei, @color, @storage, @condition, @purchase_price, @selling_price, @status, @created_at, @updated_at)
    `);
    stmt.run(device);
    return DeviceModel.findById(device.id);
  },

  update: (id, device) => {
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
        status = @status,
        updated_at = @updated_at
      WHERE id = @id
    `);
    stmt.run({ ...device, id });
    return DeviceModel.findById(id);
  },

  delete: (id) => {
    db.prepare('DELETE FROM devices WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = DeviceModel;