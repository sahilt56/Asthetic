'use client';
import { useState, useEffect, useRef } from 'react';

interface NoticeItem {
  text: string;
  intervalSeconds: number;
  durationSeconds: number;
  link?: string;
  imageUrl?: string;
  type?: 'notice' | 'billboard';
  mediaType?: string; // 'image' | 'video'
}

interface DynamicHeaderContentProps {
  title: string;
  phrases: string[];
  notices: NoticeItem[];
  titleColor?: string;
  titleFont?: string;
  subtitleColor?: string;
  subtitleFont?: string;
}

export default function DynamicHeaderContent({
  title,
  phrases,
  notices = [],
  titleColor,
  titleFont,
  subtitleColor,
  subtitleFont
}: DynamicHeaderContentProps) {
  const [isNoticeActive, setIsNoticeActive] = useState(false);
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const loopActive = useRef(true);
  const actionLock = useRef(false); // Critical mutex lock for preventing collisions
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 1. Standard Subtitle Rotation Loop (Always runs, just hides visually if notice is on)
  useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = setInterval(() => {
      if (!loopActive.current || !isMounted.current) return;
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  // 2. MULTIPLE NOTICE SCHEDULER
  useEffect(() => {
    if (!notices || notices.length === 0) return;

    // Function to elegantly transition to a notice and back
    const executeNoticeWorkflow = (notice: NoticeItem) => {
      if (actionLock.current || !isMounted.current) return;

      actionLock.current = true;
      loopActive.current = false;
      setIsVisible(false);

      setTimeout(() => {
        if (!isMounted.current) return;
        setActiveNotice(notice);
        setIsNoticeActive(true);
        setIsVisible(true);

        // Dynamic Duration hold
        setTimeout(() => {
          if (!isMounted.current) return;
          setIsVisible(false);
          setTimeout(() => {
            if (!isMounted.current) return;
            setIsNoticeActive(false);
            setActiveNotice(null);
            setIsVisible(true);
            loopActive.current = true;
            actionLock.current = false; // Unlock
          }, 400);
        }, notice.durationSeconds * 1000);

      }, 400);
    };

    const activeTimeouts: NodeJS.Timeout[] = [];

    // Create independent timer instances for each notice
    const activeTimers: NodeJS.Timeout[] = notices.map((notice, index) => {
      const ms = Math.max(notice.intervalSeconds * 1000, 5000); // Force min 5s safety

      // 🚀 EAGER FIRST RUN: Trigger notice shortly after page load so user doesn't wait a full interval cycle!
      // Stagger them based on index so they don't collide.
      const durationSafe = Math.max(notice.durationSeconds || 5, 2);
      const initialDelay = 1500 + (index * ((durationSafe * 1000) + 2000));

      const t = setTimeout(() => executeNoticeWorkflow(notice), initialDelay);
      activeTimeouts.push(t);

      // 🔄 STANDARD LOOP
      return setInterval(() => executeNoticeWorkflow(notice), ms);
    });

    return () => {
      activeTimers.forEach(t => clearInterval(t));
      activeTimeouts.forEach(t => clearTimeout(t));

      // Reset lock on unmount so Strict Mode doesn't deadlock it!
      actionLock.current = false;
    };
  }, [notices]);

  const isBillboard = isNoticeActive && activeNotice?.type === 'billboard';

  const isVideoMedia = activeNotice?.mediaType === 'video' || (activeNotice?.imageUrl && activeNotice.imageUrl.match(/\.(mp4|webm|mov|ogg)/i));

  return (
    <>
      {/* BILLBOARD OVERLAY: Rendered absolutely over the header without affecting document flow */}
      {isBillboard && (
        <div className={`absolute inset-0 z-99 overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {(() => {
            const bannerContent = (
              <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 gap-4 shadow-2xl group/billboard overflow-hidden bg-black">

                {/* Red Gradient Underlay */}
                <div className="absolute inset-0 bg-linear-to-r from-red-600 via-pink-500 to-red-700 z-0 pointer-events-none"></div>

                {/* Full Bleed Background Media */}
                {activeNotice?.imageUrl && (
                  isVideoMedia ? (
                    <video
                      key={activeNotice.imageUrl}
                      src={activeNotice.imageUrl}
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-contain object-center opacity-90 z-0 pointer-events-none drop-shadow-2xl"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeNotice.imageUrl} alt="" className="absolute inset-0 w-full h-full object-contain object-center opacity-90 z-0 pointer-events-none text-transparent drop-shadow-2xl" />
                  )
                )}

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none z-1"></div>

                <div className="flex items-center gap-3 md:gap-5 relative z-10 flex-1 truncate py-2">
                  <div className="flex flex-col items-start text-left relative z-10">
                    {activeNotice?.text ? (
                      <>
                        <span className="bg-yellow-300 text-red-700 text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 mb-0.5 tracking-wider">
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" /></svg>
                          LIMITED PROMO
                        </span>
                        <h2 className="text-white font-serif text-base md:text-2xl font-black tracking-wide drop-shadow-md leading-none truncate max-w-75 sm:max-w-full">
                          {activeNotice.text}
                        </h2>
                      </>
                    ) : (
                      <h2 className="text-white font-sans text-sm md:text-lg font-bold tracking-wide drop-shadow-md">
                        Brand Promotion
                      </h2>
                    )}
                  </div>
                </div>

                {/* Grand CTA Button */}
                <div className="relative z-10 shrink-0 flex items-center gap-3">
                  {/* <span className="hidden md:block text-white/80 font-bold text-xs animate-bounce-x mr-2">Go to</span> */}
                  <div className="bg-white text-[#E60023] px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-xs md:text-sm shadow-xl hover:scale-105 transform transition-all active:scale-95 flex items-center gap-2 border border-red-100">
                    {activeNotice?.link ? 'VIEW' : 'INFO'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>

              </div>
            );

            return activeNotice?.link ? (
              <a href={activeNotice.link} target="_blank" rel="noopener noreferrer" className="w-full h-full cursor-pointer block relative z-999">
                {bannerContent}
              </a>
            ) : (
              bannerContent
            );
          })()}
        </div>
      )}

      {/* GLOBAL HEADER BOTTOM GLOW: Anchors directly to parent header's base without restrictive bounds */}
      {(isNoticeActive && !isBillboard) && (
        <div className={`absolute bottom-0 left-0 right-0 h-0.75 z-50 pointer-events-none transition-all duration-700 origin-center ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
        }`}>
          {/* Vivid Base Line */}
          <div className="absolute inset-x-0 -bottom-px h-0.75 bg-linear-to-r from-transparent via-[#E60023] to-transparent"></div>
          {/* Expansive Light Burst Effect */}
          <div className="absolute inset-x-0 -bottom-px h-1.5 bg-linear-to-r from-transparent via-[#E60023] to-transparent blur-[6px] animate-pulse"></div>
          <div className="absolute inset-x-0 -bottom-px h-3.75 bg-linear-to-r from-transparent via-red-500/40 to-transparent blur-[15px] opacity-70 animate-pulse delay-75"></div>
        </div>
      )}

      {/* NORMAL FLOW WRAPPER: Constrains standard content and anchors layout height */}
      <div className="dynamic-header flex flex-col items-center justify-center text-center w-full relative min-h-17.5 max-w-162.5 overflow-visible">
        <style>{`
          .dynamic-header {
            --title-color: ${titleColor || 'inherit'};
            --subtitle-color: ${subtitleColor || 'inherit'};
          }
        `}</style>

        {/* 1. PERMANENT HEIGHT ANCHOR: The original title sits in flow forever to ensure header never shifts height! */}
        <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          !isNoticeActive ? 'opacity-100 blur-none transform translate-y-0' : 'opacity-0 blur-sm transform -translate-y-2 pointer-events-none'
        }`}>
          <div className="flex flex-col items-center">
            <h1 
              className={`${titleFont || 'font-serif'} text-2xl md:text-4xl font-bold tracking-wide flex items-center gap-2 justify-center ${titleColor ? 'text-(--title-color)' : ''}`}
            >
              {title}
            </h1>
            <p 
              className={`${subtitleFont || 'font-sans'} text-[11px] sm:text-md md:text-sm mt-1 md:mt-1.5 animate-in fade-in duration-700 ${!subtitleColor ? 'opacity-70' : ''} ${subtitleColor ? 'text-(--subtitle-color)' : ''}`}
            >
              {phrases[currentPhraseIndex] || ''}
            </p>
          </div>
        </div>

        {/* 2. STANDARD NOTICE OVERLAY: Floats mathematically centered inside wrapper without shifting layout */}
        {(isNoticeActive && !isBillboard) && (
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
            isVisible ? 'opacity-100 blur-none transform translate-y-0' : 'opacity-0 blur-sm transform translate-y-2 pointer-events-none'
          }`}>
            {/* Note: Center ambient glows removed per user request to focus on bottom border */}

            {(() => {
              const content = (
                <div className="w-full flex items-center justify-between md:justify-center gap-2 md:gap-6 py-1 max-w-full overflow-visible px-1.5 md:px-6 group">

                  {activeNotice?.imageUrl && (
                    isVideoMedia ? (
                      <video
                        key={activeNotice.imageUrl}
                        src={activeNotice.imageUrl}
                        autoPlay loop muted playsInline
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-md shrink-0 bg-black ring-2 ring-red-500/20 hidden sm:block"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={activeNotice.imageUrl} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-md shrink-0 bg-black text-transparent ring-2 ring-red-500/20 hidden sm:block" />
                    )
                  )}

                  <div className="bg-[#E60023] text-white text-[9px] md:text-[11px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded shadow-md shrink-0 tracking-widest animate-bounce-subtle">
                    {activeNotice?.link ? '🔥 DEAL' : 'Notice'}
                  </div>

                  {/* Fully Optimized Wrapped Text Container that can consume all available vertical and horizontal space */}
                  <div className="flex-1 min-w-0 flex justify-center px-1">
                    <h2 className="font-sans text-[13px] sm:text-lg md:text-xl text-[#C4001D] font-black tracking-wide drop-shadow-[0_1px_3px_rgba(230,0,35,0.1)] leading-tight whitespace-normal wrap-break-word text-center">
                      {activeNotice?.text}
                    </h2>
                  </div>

                  {activeNotice?.link && (
                    <div className="bg-[#E60023] text-white text-[10px] md:text-sm font-black rounded-full px-2 md:px-4 py-1 md:py-2 shadow-lg flex items-center gap-1 border-0 shrink-0 transition-all transform hover:scale-105 hover:bg-red-700">
                      <span className="hidden xs:inline">Shop Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  )}
                </div>
              );

              return activeNotice?.link ? (
                <a href={activeNotice.link} target="_blank" rel="noopener noreferrer" className="group cursor-pointer block max-w-full">
                  {content}
                </a>
              ) : (
                content
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}
