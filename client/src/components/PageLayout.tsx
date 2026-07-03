import React from 'react';
import ColorBends from '@/components/ColorBends';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* ColorBends Background - Fixed */}
      <div className="fixed inset-0 z-0">
        <ColorBends
          colors={['#72548A', '#21152D', '#140F1B', '#120F17']}
          rotation={90}
          speed={0.15}
          scale={1.2}
          frequency={0.8}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.3}
          iterations={2}
          intensity={1.2}
          bandWidth={5}
          transparent
        />
      </div>

      {/* Content - Relative to background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
