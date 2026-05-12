'use client';

import { useState } from 'react';
import FeedbackForm from './FeedbackForm';

export default function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[88px] md:bottom-6 right-6 z-[9998] w-14 h-14 bg-white hover:bg-pink-50 text-[#E60023] rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(230,0,35,0.2)] border-2 border-pink-100 transition-all hover:-translate-y-1 active:scale-90 group"
        aria-label="Give Feedback"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border border-white text-[8px] text-white items-center justify-center font-bold">!</span>
        </span>
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm bg-black/20">
          {/* Backdrop close helper */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-pink-900/10 border border-pink-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Decorative Top Banner */}
            <div className="h-2 w-full bg-gradient-to-r from-pink-200 via-red-300 to-pink-200" />
            
            <div className="px-6 py-5 flex justify-between items-center border-b border-pink-50 bg-pink-50/30">
               <div className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-full shadow-sm text-pink-500 text-lg"></div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">Share Feedback</h3>
                    <p className="text-[10px] text-slate-500 font-medium font-sans">Help us make it more magical ✨</p>
                  </div>
               </div>
               <button 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs"
                  aria-label="Close"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                 <span>Close</span>
               </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
               <FeedbackForm onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
