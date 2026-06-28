import React from 'react';
import { ChevronLeft, ChevronRight, Package, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) {
  return (
    <aside
      className={`
        relative bg-gradient-to-b from-blue-900 via-indigo-900 to-blue-950 text-white 
        flex flex-col shadow-2xl overflow-hidden border-r-4 border-blue-400/30
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

      {/* Toggle Button */}
      <div className="absolute -right-0.5 top-20 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            w-8 h-8 rounded-full 
            bg-gradient-to-r from-blue-500 to-indigo-500 
            hover:from-blue-600 hover:to-indigo-600
            shadow-lg shadow-blue-500/50
            flex items-center justify-center
            transition-all duration-300 hover:scale-110 hover:rotate-6
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
      <div className={`p-6 border-b border-white/10 relative z-10 transition-all duration-500 ${isCollapsed ? 'px-4' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-pulse-slow transition-all duration-500 ${isCollapsed ? 'mx-auto' : ''}`}>
            📱
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent whitespace-nowrap">
              MobileShop
            </h1>
            <p className="text-xs text-blue-200/70 whitespace-nowrap">Inventory Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10">
        <button
          onClick={() => setActiveTab('devices')}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            transition-all duration-300
            ${activeTab === 'devices'
              ? 'bg-white/20 shadow-lg backdrop-blur-sm text-white'
              : 'hover:bg-white/10 text-blue-100/70 hover:text-white'
            }
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          <Package className="w-6 h-6 flex-shrink-0" />
          <span className={`font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            Devices
          </span>
          {!isCollapsed && activeTab === 'devices' && (
            <span className="ml-auto w-1.5 h-8 bg-blue-400 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            transition-all duration-300
            ${activeTab === 'customers'
              ? 'bg-white/20 shadow-lg backdrop-blur-sm text-white'
              : 'hover:bg-white/10 text-blue-100/70 hover:text-white'
            }
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          <Users className="w-6 h-6 flex-shrink-0" />
          <span className={`font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            Customers
          </span>
          {!isCollapsed && activeTab === 'customers' && (
            <span className="ml-auto w-1.5 h-8 bg-indigo-400 rounded-full"></span>
          )}
        </button>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
            S
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <p className="text-sm font-medium whitespace-nowrap">Shop Owner</p>
            <p className="text-xs text-blue-200/50 whitespace-nowrap">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}