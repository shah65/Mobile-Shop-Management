import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import DevicesPage from './pages/DevicesPage.jsx';
import CustomerPage from './pages/customer/Customer.jsx';  // ← Import the parent wrapper

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/50">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto transition-all duration-500">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {activeTab === 'devices' && '📦 Device Management'}
              {activeTab === 'customers' && '👥 Customer Management'}
            </h2>
            <p className="text-gray-500 mt-1">
              {activeTab === 'devices' && 'Manage your mobile inventory, track sold and unsold devices'}
              {activeTab === 'customers' && 'View and manage all customers who purchased devices'}
            </p>
          </div>
          {activeTab === 'devices' && <DevicesPage />}
          {activeTab === 'customers' && <CustomerPage />}  {/* ← Use CustomerPage */}
        </div>
      </main>
    </div>
  );
}