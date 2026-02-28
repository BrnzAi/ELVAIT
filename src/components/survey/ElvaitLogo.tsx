'use client';

export function ElvaitLogo({ className = 'h-7' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg viewBox="0 0 120 28" xmlns="http://www.w3.org/2000/svg" className="h-full">
        <text x="0" y="22" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="700" fontSize="24" letterSpacing="2">
          <tspan fill="#D2FFB8">ELV</tspan><tspan fill="#FF4C4C">AIT</tspan>
        </text>
      </svg>
    </div>
  );
}
