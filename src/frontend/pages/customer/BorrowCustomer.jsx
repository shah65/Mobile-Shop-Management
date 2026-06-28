import React, { useState, useEffect } from 'react';
import { Search, User, Phone, DollarSign, Eye, CreditCard } from 'lucide-react';

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadBorrowers = async () => {
    setLoading(true);
    try {
      let result = await window.api.getCustomersWithDue();

      // Client-side search filter
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        result = result.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.cnic && c.cnic.includes(query))
        );
      }

      setBorrowers(result);
    } catch (error) {
      alert('Error loading borrowers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowers();
  }, [search]);

  // Stats
  const totalBorrowers = borrowers.length;
  const totalDue = borrowers.reduce((sum, c) => sum + (c.total_due || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats - Amber Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Borrowers</p>
              <p className="text-3xl font-bold mt-1">{totalBorrowers}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Due</p>
              <p className="text-3xl font-bold mt-1">Rs {totalDue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search borrowers by name, phone, or CNIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>
      ) : borrowers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No borrowers found</h3>
          <p className="text-gray-400 mt-1">All customers have paid their dues 🎉</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-50 border-b border-amber-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">CNIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Devices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Total Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {borrowers.map((c) => (
                <tr key={c.id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">
                      Due
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
                    {c.phone}
                  </td>
                  <td className="px-6 py-4">{c.cnic || '-'}</td>
                  <td className="px-6 py-4 text-center">{c.device_count || 0}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">Rs {(c.total_due || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-all"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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