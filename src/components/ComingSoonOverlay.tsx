'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

const emptySubscribe = () => () => {};
const getIsMounted = () => true;
const getServerSnapshot = () => false;

const subscribeStorage = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getIsBypassed = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('admin_preview_active') === 'true';
};

interface Props {
  isEnabled: boolean;
  title?: string;
  message: string;
  targetDate: string;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-3 sm:p-5 w-20 sm:w-24 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group transition-transform hover:-translate-y-1">
    <span className="text-3xl sm:text-4xl font-bold font-serif text-[#3E322C]">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] sm:text-[12px] uppercase tracking-widest font-bold text-[#8C7A74] mt-1 group-hover:text-[#E60023] transition-colors">
      {label}
    </span>
  </div>
);

export default function ComingSoonOverlay({ isEnabled, title, message, targetDate }: Props) {
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  
  const isMounted = useSyncExternalStore(emptySubscribe, getIsMounted, getServerSnapshot);
  const isBypassed = useSyncExternalStore(subscribeStorage, getIsBypassed, getServerSnapshot);
  
  // Don't block admin pages
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/api');

  useEffect(() => {
    if (!isEnabled || isAdmin || !targetDate) return;

    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, isAdmin, targetDate]);

  // Prevent hydration mismatch by only rendering layout specifics after mounting
  if (!isMounted) return null;

  // If it's disabled, admin is viewing, OR bypass flag is set in local storage, show nothing
  if (!isEnabled || isAdmin || isBypassed) return null;

  return (
    <div className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-[#FFF5F5] overflow-hidden">
      {/* Animated Aesthetic Background Background Elements mirroring the main site */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#FFE4E6] blur-[100px] opacity-70 animate-pulse pulse-slow-8" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#EDE9FE] blur-[120px] opacity-60 animate-pulse pulse-slow-10" />
         <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[#FFEDD5] blur-[120px] opacity-50" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#3E322C] leading-tight tracking-tight mb-4 drop-shadow-sm">
          {title || "We will live soon"}
        </h1>

        <p className="font-sans text-[#8C7A74] text-base sm:text-lg md:text-xl max-w-md font-medium leading-relaxed opacity-90 mb-10">
          {message || "We are preparing something truly magical just for you. Stay tuned!"}
        </p>

        {/* Countdown Section */}
        {timeLeft && (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>
        )}

        {/* Sub Text/Notification Invitation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#3E322C]/60 uppercase tracking-wider bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-white">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E60023] opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E60023]"></span>
           </span>
           Get Ready for the Magic
        </div>
      </div>

      {/* Simple CSS for subtle animations */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(6deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .pulse-slow-8 {
          animation-duration: 8s;
        }
        .pulse-slow-10 {
          animation-duration: 10s;
        }
      `}</style>
    </div>
  );
}
