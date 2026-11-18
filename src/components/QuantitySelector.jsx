import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({ value = 1, min = 1, max = 99, onChange, disabled = false }) => {
  return (
    <div className="flex items-center bg-bg-elevated  rounded-xl overflow-hidden w-fit">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className="p-2 text-text-secondary hover:text-white hover:bg-bg-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-10 text-center text-xs font-semibold text-white select-none">
        {value}
      </span>

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="p-2 text-text-secondary hover:text-white hover:bg-bg-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
