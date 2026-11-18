import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, Headset, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#111113] text-text-secondary text-sm mt-auto pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. Value Proposition Highlights - Tactile Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#161619] hover:bg-[#1C1C21] p-5 rounded-2xl transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-[#222227] flex items-center justify-center text-white flex-shrink-0 shadow-[0_2px_0_0_#0A0A0C] group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider">Free Delivery</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">On all orders above ₹500 across India</p>
            </div>
          </div>

          <div className="bg-[#161619] hover:bg-[#1C1C21] p-5 rounded-2xl transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-[#222227] flex items-center justify-center text-white flex-shrink-0 shadow-[0_2px_0_0_#0A0A0C] group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider">Cash on Delivery</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Zero prepayment, inspect upon doorstep arrival</p>
            </div>
          </div>

          <div className="bg-[#161619] hover:bg-[#1C1C21] p-5 rounded-2xl transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-[#222227] flex items-center justify-center text-white flex-shrink-0 shadow-[0_2px_0_0_#0A0A0C] group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider">7-Day Easy Returns</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Hassle-free return & full refund guarantee</p>
            </div>
          </div>

          <div className="bg-[#161619] hover:bg-[#1C1C21] p-5 rounded-2xl transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-[#222227] flex items-center justify-center text-white flex-shrink-0 shadow-[0_2px_0_0_#0A0A0C] group-hover:scale-105 transition-transform">
              <Headset className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider">Hardware Support</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug font-mono">support@vibe2fix.com</p>
            </div>
          </div>

        </div>

        {/* 2. Structured Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-black text-black text-xs shadow-[0_2px_0_0_#0A0A0C]">
                V
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white">
                VIBE<span className="text-neutral-400">2FIX</span>
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Engineered single-vendor platform for precision audio, smart monitoring hardware, development boards, and modular fix tools. Built for engineers, makers, and enthusiasts.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] text-[11px] font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DISPATCH HUB: NATIONWIDE COD ACTIVE</span>
            </div>
          </div>

          {/* Hardware Divisions Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hardware Divisions</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/products?category=audio-sound" className="hover:text-white transition flex items-center justify-between group">
                  <span>Audio & Sound</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=smart-home" className="hover:text-white transition flex items-center justify-between group">
                  <span>Smart Home Nodes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=work-study" className="hover:text-white transition flex items-center justify-between group">
                  <span>Workstation Peripherals</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=iot-development" className="hover:text-white transition flex items-center justify-between group">
                  <span>IoT & Microcontrollers</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=power-battery" className="hover:text-white transition flex items-center justify-between group">
                  <span>GaN Power & Cells</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=fix-hardware-tools" className="hover:text-white transition flex items-center justify-between group">
                  <span>Precision Fix & Rework</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Orders & Customer Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operations</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/orders" className="hover:text-white transition">My Order History</Link></li>
              <li><Link to="/refunds" className="hover:text-white transition">Returns & Refunds</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Saved Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Saved Addresses</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Complete Catalog</Link></li>
            </ul>
          </div>

          {/* System & Portals */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Management</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/admin" className="hover:text-white transition">Admin Portal</Link></li>
              <li><Link to="/admin/products" className="hover:text-white transition">Stock Manager</Link></li>
              <li><Link to="/admin/orders" className="hover:text-white transition">Fulfillment Queue</Link></li>
              <li><Link to="/admin/coupons" className="hover:text-white transition">Promotions & Codes</Link></li>
              <li className="pt-1 text-[11px] font-mono text-neutral-500">v5.0-mock-ready</li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Vibe2Fix Inc. Precision engineered hardware. All rights reserved.</p>
          <div className="flex items-center gap-5 text-[11px]">
            <span className="hover:text-neutral-300 transition cursor-pointer">Privacy Framework</span>
            <span>•</span>
            <span className="hover:text-neutral-300 transition cursor-pointer">Terms of Purchase</span>
            <span>•</span>
            <span className="hover:text-neutral-300 transition cursor-pointer">Doorstep COD Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
