'use client';

import React from 'react';
import Link from 'next/link';

export default function MugranLogo({ className = '', variant = 'dark', showText = true }) {
  const isDark = variant === 'dark';
  
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      {/* Brand Text (RTL: right of emblem, or LTR) */}
      {showText && (
        <div className="flex flex-col text-right leading-tight select-none">
          <span className="font-extrabold text-[1.1rem] tracking-tight text-[#141b34] group-hover:text-[#233e86] transition-colors">
            وكالة مُقرَن
          </span>
          <span className="font-semibold text-[0.8rem] text-[#233e86] tracking-wider">
            الإبداعية
          </span>
        </div>
      )}

      {/* Geometric Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 transition-transform duration-300 group-hover:rotate-3">
        <svg
          viewBox="0 0 460.34 487.93"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            fill="#233e86"
            points="386.04 302.31 386.04 357.79 339.02 330.05 308.75 347.9 272.12 369.51 386.04 436.71 460.34 480.55 460.34 258.47 449.24 265.02 386.04 302.31"
          />
          <polygon
            fill="#233e86"
            points="65.69 204.51 74.3 199.43 74.3 130.09 133.06 164.76 157.58 179.23 230.7 222.36 303.81 179.23 230.69 136.1 206.17 121.63 74.3 43.83 0 0 0 243.26 29.06 226.12 65.69 204.51"
          />
          <polygon
            fill="#141b34"
            points="386.04 44.45 267.5 114.38 340.61 157.52 386.04 130.72 386.04 173.93 377.24 179.12 340.43 200.84 267.33 243.97 230.22 265.86 199.95 283.72 163.32 305.32 90.21 348.45 74.3 357.84 74.3 314.62 126.69 283.72 163.32 262.11 193.59 244.25 120.47 201.12 90.21 218.97 74.3 228.36 53.58 240.58 0 272.19 0 487.93 74.3 444.1 163.32 391.58 236.43 348.45 273.06 326.85 303.32 308.99 340.43 287.1 386.04 260.19 413.54 243.97 450.35 222.25 460.34 216.36 460.34 .62 386.04 44.45"
          />
        </svg>
      </div>
    </Link>
  );
}
