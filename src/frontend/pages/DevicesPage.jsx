import React, { useState } from 'react';
import InStockPage from './InstockDevices.jsx';
import SoldPage from './SoldDevices.jsx';

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState('instock');

  return (
    <div className="space-y-6">
      {/* ===== TAB NAVIGATION ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-1">
        <button
          onClick={() => setActiveTab('instock')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'instock'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          📦 In Stock
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'sold'
              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          💰 Sold
        </button>
      </div>

      {/* ===== PAGE CONTENT ===== */}
      {activeTab === 'instock' && <InStockPage />}
      {activeTab === 'sold' && <SoldPage />}
    </div>
  );
}