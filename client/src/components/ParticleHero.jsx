import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import { Waves } from './Waves';

export const ParticleHero = () => {
  return (
    <section className="relative pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-[#121215] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          
          {/* React Bits Interactive Waves Background Simulation */}
          <Waves
            lineColor="rgba(255, 255, 255, 0.18)"
            backgroundColor="transparent"
            waveSpeedX={0.012}
            waveSpeedY={0.008}
            waveAmpX={32}
            waveAmpY={18}
            xGap={14}
            yGap={28}
            friction={0.92}
            tension={0.008}
            maxCursorMove={120}
            className="cursor-crosshair z-0"
          />

          {/* Vignette gradient to keep typography crisp and readable */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#121215] via-[#121215]/85 to-transparent z-10" />

          {/* Main Hero Bento Grid (Content + Flagship Hardware Showcase) */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14">
            
            {/* Left Column: High-Stakes Typography & Telemetry */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Telemetry Status Badge */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#1F1F24] shadow-[0_2px_0_0_#0A0A0C] text-[11px] font-mono tracking-wider text-neutral-300">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-white uppercase">HARDWARE LABS ACTIVE</span>
                <span className="text-neutral-500">//</span>
                <span className="text-neutral-400">BENCH-TESTED NODES</span>
              </div>

              {/* Punchy High-Impact Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08]">
                  ARCHITECTED <br />
                  <span className="text-neutral-400">FOR PRECISION.</span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl font-normal pt-1">
                  Pro-grade planar acoustics, microcontroller boards, GaN power units, and micro-soldering rework stations. Guaranteed genuine hardware with verifiable bench-tested specs.
                </p>
              </div>

              {/* Action Buttons & Telemetry Metric */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="btn-3d px-6 py-3.5 text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 group"
                >
                  <span>Explore 32 Hardware Nodes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-4 text-xs text-neutral-400 pl-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neutral-300" />
                    <div>
                      <span className="block text-white font-bold leading-none">Flat ₹50 COD</span>
                      <span className="text-[10px] text-neutral-500">Free over ₹500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Spec Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase text-neutral-400">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04]">✓ 48-Hour Doorstep Dispatch</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04]">✓ Verified Purchaser Reviews</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04]">✓ Cash On Delivery</span>
              </div>
            </div>

            {/* Right Column: Flagship Hardware Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-[#18181C] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-4 hover:translate-y-[-2px] transition-transform duration-300">
                
                {/* Product Teaser Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/[0.06]">
                    FLAGSHIP SPECIMEN
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    IN STOCK (14 units)
                  </span>
                </div>

                {/* Hardware Photo Preview */}
                <Link to="/products/prod-aud-01" className="block relative aspect-video rounded-2xl overflow-hidden bg-black group">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                    alt="NEXUS Studio Planar Magnetic Headphones"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase font-mono font-semibold">Audiophile Division</p>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        NEXUS Planar Headphones
                      </h4>
                    </div>
                    <span className="text-base font-black text-white font-mono">
                      ₹8,999
                    </span>
                  </div>
                </Link>

                {/* Technical Specifications Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded-xl bg-white/[0.04]">
                    <span className="block text-neutral-500">Transducer</span>
                    <span className="text-white font-bold">Planar</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04]">
                    <span className="block text-neutral-500">Chassis</span>
                    <span className="text-white font-bold">CNC Milled</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04]">
                    <span className="block text-neutral-500">Rating</span>
                    <span className="text-white font-bold">4.9 ★ (42)</span>
                  </div>
                </div>

                {/* Quick inspect button */}
                <Link
                  to="/products/prod-aud-01"
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <span>Inspect Hardware Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
