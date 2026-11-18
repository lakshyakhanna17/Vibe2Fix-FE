import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  RotateCcw, 
  MessageSquare, 
  Users, 
  Tag, 
  ArrowLeft,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Refunds Queue', path: '/admin/refunds', icon: RotateCcw },
  { name: 'Moderation', path: '/admin/reviews', icon: MessageSquare },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
];

export const AdminLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Dark Sidebar Nav - Generous Horizontal Spacing & Smooth Toggle */}
      <aside 
        className={`w-72 bg-bg-card flex flex-col justify-between flex-shrink-0 min-h-screen fixed top-0 bottom-0 left-0 z-40 shadow-[4px_0_30px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Admin Header Branding */}
          <div className="px-6 py-6">
            <Link to="/" className="flex items-center gap-3 group mb-1.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-black text-xs shadow-[0_2px_0_0_#0A0A0C]">
                V
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                VIBE2FIX <span className="text-[10px] text-text-muted font-bold ml-1">ADMIN</span>
              </span>
            </Link>
            <div className="text-xs text-text-muted pl-11">
              Signed in as <span className="text-white font-medium">{user?.name}</span>
            </div>
          </div>

          {/* Navigation Links with Generous Horizontal Spacing */}
          <nav className="px-5 py-2 space-y-2.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all ${
                      isActive
                        ? 'tab-3d-active'
                        : 'tab-3d text-text-secondary'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Return & Logout Actions with Comfortable Spacing */}
        <div className="p-5 space-y-2.5">
          <button
            onClick={() => {
              if (window.confirm('Reset all mock data to the newest 32 products and clean default state?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-text-secondary hover:text-white rounded-2xl bg-bg-elevated/50 hover:bg-bg-elevated transition"
            title="Clean cache and restore fresh seed products"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Store Data</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs text-text-muted hover:text-white rounded-2xl hover:bg-bg-elevated transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront Front</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-status-danger hover:bg-bg-elevated rounded-2xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div 
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-16 bg-bg-card/90 backdrop-blur-sm sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            {/* Three-line icon to toggle/show sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-bg-elevated transition"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm font-extrabold text-white uppercase tracking-wider">{title}</h1>
              {subtitle && <p className="text-[11px] text-text-muted">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-bg-elevated text-neutral-300 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              MOCK ARCHITECTURE ACTIVE
            </span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
