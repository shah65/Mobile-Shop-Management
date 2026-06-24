import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, DollarSign, Tag } from 'lucide-react';

// ===== BRAND COLOR MAP =====
const brandColors = {
  samsung: { bg: 'from-blue-500 to-cyan-400', border: 'border-blue-200' },
  apple: { bg: 'from-gray-700 to-gray-900', border: 'border-gray-300' },
  oneplus: { bg: 'from-red-500 to-orange-400', border: 'border-red-200' },
  google: { bg: 'from-blue-600 to-indigo-500', border: 'border-blue-200' },
  xiaomi: { bg: 'from-orange-500 to-yellow-400', border: 'border-orange-200' },
  oppo: { bg: 'from-green-500 to-teal-400', border: 'border-green-200' },
  vivo: { bg: 'from-purple-500 to-pink-400', border: 'border-purple-200' },
  default: { bg: 'from-indigo-500 to-purple-400', border: 'border-indigo-200' },
};

const getBrandColor = (brand) => {
  if (!brand) return brandColors.default;
  const key = brand.toLowerCase();
  return brandColors[key] || brandColors.default;
};

const emptyForm = {
  brand: '',
  model: '',
  imei: '',
  color: '',
  storage: '',
  condition: 'used',
  purchase_price: '',
  selling_price: '',
};

export default function InstockDevices() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadDevices() {
    setLoading(true);
    try {
      let result;
      if (search.trim()) {
        const all = await window.api.searchDevices(search.trim());
        result = all.filter(d => d.status === 'in_stock');
      } else {
        result = await window.api.getDevicesByStatus('in_stock');
      }
      setDevices(result);
    } catch (error) {
      alert('Error loading devices: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, [search]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.brand || !form.model || !form.purchase_price) {
      alert('Brand, model and purchase price are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        purchase_price: parseFloat(form.purchase_price),
        selling_price: form.selling_price ? parseFloat(form.selling_price) : null,
      };

      if (editingId) {
        await window.api.updateDevice(editingId, payload);
      } else {
        await window.api.createDevice(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadDevices();
    } catch (error) {
      alert('Error saving device: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(device) {
    setEditingId(device.id);
    setForm({
      brand: device.brand,
      model: device.model,
      imei: device.imei || '',
      color: device.color || '',
      storage: device.storage || '',
      condition: device.condition || 'used',
      purchase_price: device.purchase_price,
      selling_price: device.selling_price || '',
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this device?')) return;
    setLoading(true);
    try {
      await window.api.deleteDevice(id);
      await loadDevices();
    } catch (error) {
      alert('Error deleting device: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function markAsSold(device) {
    setLoading(true);
    try {
      const updatedDevice = {
        brand: device.brand,
        model: device.model,
        imei: device.imei || '',
        color: device.color || '',
        storage: device.storage || '',
        condition: device.condition || 'used',
        purchase_price: device.purchase_price,
        selling_price: device.selling_price || null,
        status: 'sold',
      };
      await window.api.updateDevice(device.id, updatedDevice);
      await loadDevices();
    } catch (error) {
      alert('Error marking as sold: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const totalDevices = devices.length;
  const totalValue = devices.reduce((sum, d) => sum + (d.purchase_price || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">In Stock</p>
              <p className="text-3xl font-bold mt-1">{totalDevices}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold mt-1">Rs {totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by brand, model, or IMEI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingId(null);
                setForm(emptyForm);
              }
            }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-emerald-500/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Device'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slideDown">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? '✏️ Edit Device' : '➕ Add New Device'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input name="brand" placeholder="Brand *" value={form.brand} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <input name="model" placeholder="Model *" value={form.model} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <input name="imei" placeholder="IMEI" value={form.imei} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <input name="storage" placeholder="Storage (e.g., 128GB)" value={form.storage} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <select name="condition" value={form.condition} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            <input name="purchase_price" type="number" placeholder="Purchase Price *" value={form.purchase_price} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <input name="selling_price" type="number" placeholder="Selling Price" value={form.selling_price} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-emerald-500/30 disabled:opacity-50">
                {loading ? 'Saving...' : editingId ? 'Update Device' : 'Add Device'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(false); }} className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : devices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No devices in stock</h3>
          <p className="text-gray-400 mt-1">Add your first device to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {devices.map((device) => {
            const brandColor = getBrandColor(device.brand);
            return (
              <div key={device.id} className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border ${brandColor.border} overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/95 group`}>
                <div className={`h-1.5 bg-gradient-to-r ${brandColor.bg} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">{device.brand} {device.model}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{device.imei || 'No IMEI'}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{device.storage || 'No storage'}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">In Stock</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span>Condition: <span className="font-medium capitalize">{device.condition}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>Color: <span className="font-medium">{device.color || 'N/A'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span>Purchase: <span className="font-medium">Rs {device.purchase_price}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span>Selling: <span className="font-medium">{device.selling_price ? `Rs ${device.selling_price}` : 'N/A'}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => markAsSold(device)} className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 hover:shadow-md hover:shadow-emerald-200/50 group-hover:scale-[1.02] transform">
                      ✅ Mark as Sold
                    </button>
                    <button onClick={() => startEdit(device)} className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105 transform" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(device.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all duration-200 hover:scale-105 transform" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}