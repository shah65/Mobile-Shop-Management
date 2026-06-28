import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, DollarSign, Tag, RotateCcw } from 'lucide-react';

// ===== BRAND COLOR MAP =====
const brandColors = {
  samsung: { bg: 'from-blue-500 to-cyan-400', border: 'border-blue-200' },
  apple: { bg: 'from-gray-700 to-gray-900', border: 'border-gray-300' },
  oneplus: { bg: 'from-red-500 to-orange-400', border: 'border-red-200' },
  google: { bg: 'from-blue-600 to-indigo-500', border: 'border-blue-200' },
  xiaomi: { bg: 'from-orange-500 to-yellow-400', border: 'border-orange-200' },
  oppo: { bg: 'from-green-500 to-teal-400', border: 'border-green-200' },
  vivo: { bg: 'from-purple-500 to-pink-400', border: 'border-purple-200' },
  returned: { bg: 'from-amber-500 to-yellow-500', border: 'border-amber-200' },
  default: { bg: 'from-indigo-500 to-purple-400', border: 'border-indigo-200' },
};

const getBrandColor = (brand, isReturned) => {
  if (isReturned) return brandColors.returned;
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

const emptyCustomerForm = {
  name: '',
  phone: '',
  cnic: '',
  address: '',
  selling_price: '',
  paid_amount: '',
};

export default function InstockDevices() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== SELL MODAL STATE =====
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);

  // ===== LOAD DEVICES =====
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

  // ===== FORM HANDLERS =====
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

  // ===== SELL MODAL HANDLERS =====
  function openSellModal(device) {
    setSelectedDevice(device);
    setCustomerForm({
      name: '',
      phone: '',
      cnic: '',
      address: '',
      selling_price: device.selling_price || device.purchase_price || '',
      paid_amount: '',
    });
    setShowSellModal(true);
  }

  function handleCustomerChange(e) {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  }

  const calculateRemaining = () => {
    const sellingPrice = parseFloat(customerForm.selling_price) || 0;
    const paidAmount = parseFloat(customerForm.paid_amount) || 0;
    return sellingPrice - paidAmount;
  };

  async function handleSell(e) {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) {
      alert('Customer name and phone are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: customerForm.name,
        phone: customerForm.phone,
        cnic: customerForm.cnic || '',
        address: customerForm.address || '',
        selling_price: parseFloat(customerForm.selling_price) || selectedDevice.purchase_price,
        paid_amount: parseFloat(customerForm.paid_amount) || 0,
      };

      await window.api.sellDevice(selectedDevice.id, payload);
      setShowSellModal(false);
      setSelectedDevice(null);
      setCustomerForm(emptyCustomerForm);
      await loadDevices();
    } catch (error) {
      alert('Error selling device: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // ===== STATS =====
  const totalDevices = devices.length;
  const totalValue = devices.reduce((sum, d) => sum + (d.purchase_price || 0), 0);
  const returnedCount = devices.filter(d => d.returned_at).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">In Stock</p>
              <p className="text-3xl font-bold mt-1">{totalDevices}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold mt-1">Rs {totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Returned</p>
              <p className="text-3xl font-bold mt-1">{returnedCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <RotateCcw className="w-6 h-6" />
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
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
            <input
              name="brand"
              placeholder="Brand *"
              value={form.brand}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              name="model"
              placeholder="Model *"
              value={form.model}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              name="imei"
              placeholder="IMEI"
              value={form.imei}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              name="color"
              placeholder="Color"
              value={form.color}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              name="storage"
              placeholder="Storage (e.g., 128GB)"
              value={form.storage}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            <input
              name="purchase_price"
              type="number"
              placeholder="Purchase Price *"
              value={form.purchase_price}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              name="selling_price"
              type="number"
              placeholder="Selling Price"
              value={form.selling_price}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Device' : 'Add Device'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(false); }}
                  className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            const isReturned = !!device.returned_at;
            const brandColor = getBrandColor(device.brand, isReturned);

            return (
              <div key={device.id} className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border ${brandColor.border} overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white group ${isReturned ? 'border-amber-300' : ''}`}>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${isReturned ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {isReturned ? '🔄 Returned' : '✅ In Stock'}
                    </span>
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

                    {/* Show return info if returned */}
                    {isReturned && (
                      <div className="col-span-2 mt-1 pt-2 border-t border-amber-100">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-600">
                          <RotateCcw className="w-3 h-3" />
                          <span>Returned: {new Date(device.returned_at).toLocaleDateString()}</span>
                          <span className="text-amber-400">•</span>
                          <span>Deduction: {device.return_deduction || 0}%</span>
                          <span className="text-amber-400">•</span>
                          <span>Return Price: Rs {device.return_price?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ===== ACTION BUTTONS ===== */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {/* ✅ SELL / RESELL BUTTON - Now enabled for returned devices */}
                    <button
                      onClick={() => openSellModal(device)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 
                        ${isReturned
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 hover:shadow-md hover:shadow-amber-200/50'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:shadow-md hover:shadow-blue-200/50'
                        } group-hover:scale-[1.02] transform`}
                    >
                      {isReturned ? '🔄 Resell Returned' : '✅ Mark as Sold'}
                    </button>

                    <button
                      onClick={() => startEdit(device)}
                      className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105 transform"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(device.id)}
                      className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all duration-200 hover:scale-105 transform"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== SELL MODAL ===== */}
      {showSellModal && selectedDevice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedDevice.returned_at ? '🔄 Resell Returned Device' : 'Sell Device'}
            </h3>
            <p className="text-gray-500 mb-4">
              Enter customer details for{' '}
              <span className="font-semibold text-gray-700">
                {selectedDevice.brand} {selectedDevice.model}
              </span>
              {selectedDevice.returned_at && (
                <span className="block text-xs text-amber-600 mt-1">
                  ⚡ This device was previously returned. Selling it again.
                </span>
              )}
            </p>

            <form onSubmit={handleSell} className="space-y-4">
              <input
                name="name"
                placeholder="Customer Name *"
                value={customerForm.name}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                name="phone"
                placeholder="Phone Number *"
                value={customerForm.phone}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                name="cnic"
                placeholder="CNIC (optional)"
                value={customerForm.cnic}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="address"
                placeholder="Address (optional)"
                value={customerForm.address}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Selling Price & Paid Amount */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="selling_price"
                  type="number"
                  placeholder="Selling Price (Rs)"
                  value={customerForm.selling_price}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  name="paid_amount"
                  type="number"
                  placeholder="Amount Paid (Rs)"
                  value={customerForm.paid_amount}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Remaining Due Preview */}
              {customerForm.selling_price && customerForm.paid_amount && (
                <div className={`text-sm font-medium p-2 rounded-lg ${calculateRemaining() > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {calculateRemaining() > 0 ? (
                    <>⚠️ Remaining Due: Rs {calculateRemaining().toLocaleString()}</>
                  ) : (
                    <>✅ Full Payment Received</>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg disabled:opacity-50 ${selectedDevice?.returned_at
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/30'
                    }`}
                >
                  {loading ? 'Selling...' : selectedDevice?.returned_at ? 'Confirm Resale' : 'Confirm Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSellModal(false);
                    setSelectedDevice(null);
                    setCustomerForm(emptyCustomerForm);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}