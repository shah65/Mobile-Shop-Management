import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import DevicesPage from './pages/DevicesPage.jsx';

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          relative bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 text-white 
          flex flex-col shadow-2xl overflow-hidden border-r-4 border-indigo-400/30
          transition-all duration-500 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          flex-shrink-0
        `}
      >
        {/* Phone "notch" decoration */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/40 rounded-full blur-sm"></div>

        {/* Subtle screen grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        {/* ===== TOGGLE BUTTON - CLEARLY VISIBLE ===== */}
        <div className="absolute -right-0.5 top-20 z-50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-8 h-8 rounded-full 
              bg-gradient-to-r from-blue-500 to-purple-500 
              hover:from-blue-600 hover:to-purple-600
              shadow-lg shadow-purple-500/50
              flex items-center justify-center
              transition-all duration-300 hover:scale-110
              border-2 border-white/50
              group
            `}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white stroke-[3]" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-white stroke-[3]" />
            )}
          </button>
        </div>

        {/* Brand / Logo */}
        <div className={`
          p-6 border-b border-white/10 relative z-10
          transition-all duration-500
          ${isCollapsed ? 'px-4' : ''}
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl 
              flex items-center justify-center text-3xl shadow-lg animate-pulse-slow
              transition-all duration-500
              ${isCollapsed ? 'mx-auto' : ''}
            `}>
              📱
            </div>
            <div className={`
              transition-all duration-500 overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            `}>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent whitespace-nowrap">
                MobileShop
              </h1>
              <p className="text-xs text-blue-200/70 whitespace-nowrap">Inventory Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 relative z-10">
          <div className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            bg-white/20 shadow-lg backdrop-blur-sm text-white
            transition-all duration-300
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}>
            <Package className="w-6 h-6 flex-shrink-0" />
            <span className={`
              font-medium transition-all duration-500 overflow-hidden whitespace-nowrap
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            `}>
              Devices
            </span>
            {!isCollapsed && (
              <span className="ml-auto w-1.5 h-8 bg-blue-400 rounded-full"></span>
            )}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-white/10 relative z-10">
          <div className={`
            flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5
            transition-all duration-300
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              S
            </div>
            <div className={`
              transition-all duration-500 overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            `}>
              <p className="text-sm font-medium whitespace-nowrap">Shop Owner</p>
              <p className="text-xs text-blue-200/50 whitespace-nowrap">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className={`
        flex-1 overflow-y-auto transition-all duration-500
      `}>
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">📦 Device Management</h2>
            <p className="text-gray-500 mt-1">Manage your mobile inventory, track sold and unsold devices</p>
          </div>
          <DevicesPage />
        </div>
      </main>
    </div>
  );
}