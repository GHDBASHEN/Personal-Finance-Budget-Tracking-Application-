import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Glowing background blur */}
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
        
        {/* Core spinner */}
        <div className="relative z-10 bg-white p-3 rounded-2xl shadow-lg border border-slate-100">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
      <p className="text-slate-500 font-medium tracking-wide animate-pulse">{text}</p>
    </div>
  );
};

export default Loader;
