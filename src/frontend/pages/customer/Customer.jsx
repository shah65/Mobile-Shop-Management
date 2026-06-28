import React, { useState } from 'react';
import { Users, DollarSign } from 'lucide-react';
import AllCustomers from './AllCustomer.jsx';
import Borrowers from './BorrowCustomer.jsx';

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      {/* ===== TAB NAVIGATION - Blue Theme ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-gray-600 hover:bg-blue-50'
            }`}
        >
          <Users className="w-4 h-4" />
          All Customers
        </button>
        <button
          onClick={() => setActiveTab('borrowers')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'borrowers'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-gray-600 hover:bg-amber-50'
            }`}
        >
          <DollarSign className="w-4 h-4" />
          Borrowers (Due)
        </button>
        {/* Future tabs can be added here */}
      </div>

      {/* ===== PAGE CONTENT ===== */}
      {activeTab === 'all' && <AllCustomers />}
      {activeTab === 'borrowers' && <Borrowers />}
    </div>
  );
}