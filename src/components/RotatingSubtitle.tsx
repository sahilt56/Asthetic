'use client';
import { useState, useEffect, useRef } from 'react';

interface RotatingSubtitleProps {
  phrases: string[];
  specialNotice?: string;
  noticeIntervalMin?: number;
}

export default function RotatingSubtitle({ 
  phrases, 
  specialNotice = '', 
  noticeIntervalMin = 5 
}: RotatingSubtitleProps) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isShowingNotice, setIsShowingNotice] = useState(false);
  
  const phraseLoopActive = useRef(true);

  // 1. STANDARD ROTATING LOOP
  useEffect(() => {
    // If notice is force-active, don't change normal index
    const interval = setInterval(() => {
      if (!phraseLoopActive.current) return; // Pause normal cycle while notice is live
      
      setIsVisible(false); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setIsVisible(true); 
      }, 400);
    }, 4500);

    return () => clearInterval(interval);
  }, [phrases.length]);

  // 2. TEMPORAL NOTICE TRIGGER
  useEffect(() => {
    if (!specialNotice || noticeIntervalMin <= 0) return;

    const intervalMs = noticeIntervalMin * 60 * 1000;
    
    const triggerNotice = () => {
      // 1. Fade out current text
      phraseLoopActive.current = false;
      setIsVisible(false);
      
      // 2. Delay switch to Notice mode
      setTimeout(() => {
        setIsShowingNotice(true);
        setIsVisible(true); // Fade In the Notice!
        
        // 3. Keep notice active for 10 seconds, then return
        setTimeout(() => {
          setIsVisible(false); // Fade out Notice
          setTimeout(() => {
             setIsShowingNotice(false); // Exit notice mode
             setIsVisible(true); // Fade in next standard phrase
             phraseLoopActive.current = true; // Resume standard loop
          }, 400);
        }, 10000); 

      }, 400);
    };

    const noticeClock = setInterval(triggerNotice, intervalMs);

    return () => clearInterval(noticeClock);
  }, [specialNotice, noticeIntervalMin]);

  // If nothing exists, return empty spacing
  if (phrases.length === 0 && !specialNotice) {
    return <div className="h-5 mt-1 md:mt-1.5"></div>;
  }

  // Render Block
  return (
    <div className="h-5 mt-1 md:mt-1.5 flex justify-center items-center overflow-hidden relative min-w-50">
      <p 
        className={`font-sans text-[11px] sm:text-md md:text-sm transition-all duration-300 ease-out transform text-center max-w-full ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${
          isShowingNotice 
            ? 'text-[#eb176f] font-bold tracking-wide animate-pulse bg-[#FFF2F1] px-3 py-0.5 rounded-full border border-[#FDE1DF]' 
            : 'text-muted-foreground font-medium'
        }`}
      >
        {isShowingNotice ? specialNotice : phrases[index] || ''}
      </p>
    </div>
  );
}
