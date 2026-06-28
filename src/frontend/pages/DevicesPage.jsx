import React, { useState } from 'react';
import InstockDevices from './InstockDevices.jsx';
import SoldDevices from './SoldDevices.jsx';

export default function DevicesPage() {
  const [deviceTab, setDeviceTab] = useState('instock');

  return (
    <div className="space-y-6">
      {/* Tab Navigation - Blue Theme */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-1">
        <button
          onClick={() => setDeviceTab('instock')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${deviceTab === 'instock'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-gray-600 hover:bg-blue-50'
            }`}
        >
          📦 In Stock
        </button>
        <button
          onClick={() => setDeviceTab('sold')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${deviceTab === 'sold'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-gray-600 hover:bg-blue-50'
            }`}
        >
          💰 Sold
        </button>
      </div>

      {/* Page Content */}
      {deviceTab === 'instock' && <InstockDevices />}
      {deviceTab === 'sold' && <SoldDevices />}
    </div>
  );
}