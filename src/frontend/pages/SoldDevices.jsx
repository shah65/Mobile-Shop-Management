import React, { useEffect, useState } from 'react';
import { Search, DollarSign, Package, Tag, XCircle } from 'lucide-react';

// ===== BRAND COLOR MAP (darker for sold) =====
const brandColors = {
  samsung: { bg: 'from-blue-700 to-cyan-600', border: 'border-blue-300' },
  apple: { bg: 'from-gray-800 to-gray-950', border: 'border-gray-400' },
  oneplus: { bg: 'from-red-700 to-orange-600', border: 'border-red-300' },
  google: { bg: 'from-blue-700 to-indigo-600', border: 'border-blue-300' },
  xiaomi: { bg: 'from-orange-700 to-yellow-600', border: 'border-orange-300' },
  oppo: { bg: 'from-green-700 to-teal-600', border: 'border-green-300' },
  vivo: { bg: 'from-purple-700 to-pink-600', border: 'border-purple-300' },
  default: { bg: 'from-indigo-700 to-purple-600', border: 'border-indigo-300' },
};

const getBrandColor = (brand) => {
  if (!brand) return brandColors.default;
  const key = brand.toLowerCase();
  return brandColors[key] || brandColors.default;
};

export default function SoldDevices() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadDevices() {
    setLoading(true);
    try {
      let result;
      if (search.trim()) {
        const all = await window.api.searchDevices(search.trim());
        result = all.filter(d => d.status === 'sold');
      } else {
        result = await window.api.getDevicesByStatus('sold');
      }
      setDevices(result);
    } catch (error) {
      alert('Error loading sold devices: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, [search]);

  const totalDevices = devices.length;
  const totalRevenue = devices.reduce((sum, d) => sum + (d.selling_price || 0), 0);
  const totalCost = devices.reduce((sum, d) => sum + (d.purchase_price || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Sold</p>
              <p className="text-3xl font-bold mt-1">{totalDevices}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">Rs {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Cost</p>
              <p className="text-3xl font-bold mt-1">Rs {totalCost.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Profit</p>
              <p className="text-3xl font-bold mt-1">Rs {totalProfit.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Tag className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search sold devices by brand, model, or IMEI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      ) : devices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No sold devices yet</h3>
          <p className="text-gray-400 mt-1">When you sell a device, it will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {devices.map((device) => {
            const brandColor = getBrandColor(device.brand);
            return (
              <div key={device.id} className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border ${brandColor.border} overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/95 group opacity-90`}>
                <div className={`h-1.5 bg-gradient-to-r ${brandColor.bg} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">💰 Sold</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span>Condition: <span className="font-medium capitalize">{device.condition}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>Color: <span className="font-medium">{device.color || 'N/A'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span>Sold Price: <span className="font-medium text-emerald-600">Rs {device.selling_price || 'N/A'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span>Profit: <span className={`font-medium ${(device.selling_price - device.purchase_price) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        Rs {device.selling_price ? (device.selling_price - device.purchase_price).toLocaleString() : 'N/A'}
                      </span></span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-center text-xs text-gray-400 bg-gray-50 py-1.5 rounded-lg">
                      ✅ Sold on {device.updated_at ? new Date(device.updated_at).toLocaleDateString() : 'Unknown date'}
                    </div>
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