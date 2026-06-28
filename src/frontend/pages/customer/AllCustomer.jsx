import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, User, Phone, CreditCard, Plus } from 'lucide-react';

const emptyForm = { name: '', phone: '', cnic: '', address: '' };

export default function AllCustomers() {  // ← Changed from CustomersPage
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const result = search.trim()
        ? await window.api.searchCustomers(search.trim())
        : await window.api.getCustomers();
      setCustomers(result);
    } catch (error) {
      alert('Error loading customers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('Name and phone are required');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await window.api.updateCustomer(editingId, form);
      } else {
        await window.api.createCustomer(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadCustomers();
    } catch (error) {
      alert('Error saving customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, phone: c.phone, cnic: c.cnic || '', address: c.address || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    try {
      await window.api.deleteCustomer(id);
      await loadCustomers();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Stats
  const totalCustomers = customers.length;
  const totalWithCnic = customers.filter(c => c.cnic).length;

  return (
    <div className="space-y-6">
      {/* Stats - Blue Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold mt-1">{totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">With CNIC</p>
              <p className="text-3xl font-bold mt-1">{totalWithCnic}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <CreditCard className="w-6 h-6" />
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
              placeholder="Search by name, phone, or CNIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) { setEditingId(null); setForm(emptyForm); }
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Customer'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slideDown">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? '✏️ Edit Customer' : '➕ Add New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="cnic" placeholder="CNIC (optional)" value={form.cnic} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="address" placeholder="Address (optional)" value={form.address} onChange={handleChange} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50">
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Customer'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(false); }} className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No customers yet</h3>
          <p className="text-gray-400 mt-1">Customers will appear here after they buy devices</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">{c.name.charAt(0)}</div>
                    <span className="font-medium">{c.name}</span>
                  </td>
                  <td className="px-6 py-4"><Phone className="w-4 h-4 inline mr-1 text-gray-400" />{c.phone}</td>
                  <td className="px-6 py-4">{c.cnic || '-'}</td>
                  <td className="px-6 py-4">{c.address || '-'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => startEdit(c)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}