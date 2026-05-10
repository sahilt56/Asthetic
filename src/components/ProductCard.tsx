'use client';

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, ChevronRight, ArrowLeft, Sparkles, Gift, HeartHandshake } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  price?: string;
  imageUrl: string;
  link: string;
  description?: string;
  aboutText?: string;
}

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-3xl mx-auto [perspective:2000px] font-sans h-full">
      <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] [will-change:transform] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* ==================== FRONT OF CARD ==================== */}
        <div className={`group [backface-visibility:hidden] relative flex flex-col sm:flex-row bg-[#FFFBF9] rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-5 md:p-6 shadow-sm sm:shadow-[0_12px_30px_-15px_rgba(222,155,155,0.15)] border border-[#FEF2F2] gap-3 sm:gap-6 md:gap-8 transition-shadow duration-300 w-full overflow-hidden ${isFlipped ? 'pointer-events-none' : 'z-10'}`}>
          {/* Gradient Background Accent Subtle */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#FFF5F5] opacity-40 pointer-events-none" />

          {/* LEFT SECTION: Clean Image Container */}
          <div className="relative w-full sm:w-[40%] md:w-[42%] aspect-square sm:aspect-[3.8/5] md:aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shrink-0 bg-[#F5EEEC] shadow-[0_6px_15px_-5px_rgba(0,0,0,0.05)] z-10">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-105 ease-out"
              sizes="(max-width: 640px) 100vw, 40vw"
            />
            {/* Gentle shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-20 pointer-events-none" />
          </div>

          {/* RIGHT SECTION: Content Details */}
          <div className="relative flex flex-col justify-between py-1 sm:py-2 z-10 w-full">
            <div>
              {/* Subtitle Tagline */}
              <div className="text-[#011028] text-[11px] font-extrabold tracking-[0.2em] uppercase flex items-center gap-1 mb-2.5 sm:mb-3">
                Aesthetic Finds <span className="text-[14px] inline-block transform -translate-y-0.5">✨</span>
              </div>
              
              {/* Title */}
              <h2 className="font-serif text-xl sm:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#3E322C] font-bold leading-[1.15] mb-3 line-clamp-2 group-hover:text-[#eb176f] transition-colors duration-300">
                {product.title}
              </h2>
              
              {/* Divider */}
              {/* <div className="text-[#E59595] text-xs mb-2 sm:mb-3 opacity-80">❤</div> */}
              
              {/* Description */}
              <div>
                <p className={`text-[#585959] text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed font-medium max-w-[95%] ${isDescExpanded ? '' : 'line-clamp-2 lg:line-clamp-3'}`}>
                  {product.description || 'Perfect aesthetic addition to cozy up your personal space and set the mood.'}
                </p>
                {(product.description && product.description.length > 90) && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsDescExpanded(!isDescExpanded); }} 
                    className="text-[#e32bac] text-xs font-bold hover:underline mt-1 inline-block"
                  >
                    {isDescExpanded ? 'Read Less' : '... Read More'}
                  </button>
                )}
              </div>
              <div className="h-2"></div> {/* spacing filler */}

              {/* Price Replacement Section */}
              <div className="flex items-center gap-2 mb-3 sm:mb-5 py-0.5 sm:py-1">
                <span className="bg-[#FFF2F1] text-[#e32bac] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-[#FDE1DF] tracking-wide inline-flex items-center gap-1.5">
                  <ShoppingCart size={14} />
                  Price check on Amazon
                </span>
              </div>

              {/* Trigger to Flip Card (Replaces Specifications) */}
              <div className="mb-4 sm:mb-6">
                <button 
                  onClick={handleFlip}
                  className="w-full bg-[#FFFDFD] hover:bg-[#FDF0EF] border border-[#F6EBE9] text-[#8C7A74] hover:text-[#E59595] py-3.5 px-4 rounded-2xl flex items-center justify-between group/flip transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center gap-2.5 font-bold text-[13px] tracking-wide uppercase">
                    <Sparkles size={16} className="text-[#E59595]" />
                    <span>About the Product</span>
                  </div>
                  <ChevronRight size={18} className="group-hover/flip:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Action Button at the bottom */}
            <div className="mt-auto">
              <a 
                href={product.link} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/btn w-full py-3.5 sm:py-4 px-6 bg-[#5dbea3] hover:bg-[#D88282] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_6px_20px_-4px_rgba(229,149,149,0.4)] hover:shadow-[0_10px_25px_-4px_rgba(229,149,149,0.5)] transition-all duration-300 transform active:scale-[0.98]"
              >
                 <span>View on Amazon</span>
                 <ShoppingCart size={20} className="transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* ==================== BACK OF CARD ==================== */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#FFFBF9] rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-[0_20px_60px_-10px_rgba(222,155,155,0.25)] border border-[#FEF2F2] flex flex-col overflow-hidden ${!isFlipped ? 'pointer-events-none' : 'z-20'}`}>
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFF2F1] rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="relative flex flex-col h-full z-10">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-5 sm:mb-6 border-b border-[#F6EBE9] pb-4">
              <button 
                onClick={handleFlip}
                className="flex items-center gap-1.5 text-[#8C7A74] hover:text-[#E59595] font-bold text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <span className="text-[#E59595] text-[10px] font-extrabold tracking-widest uppercase">Details</span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#3E322C] font-bold mb-5">
              About the Product
            </h3>

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 sm:space-y-5">
              
              {/* Dynamic Point List Renderer */}
              {product.aboutText ? (
                product.aboutText.split('\n').filter(Boolean).map((line, idx) => (
                  <div key={idx} className="bg-white/60 p-4 rounded-2xl border border-white/40 flex gap-3.5 shadow-sm">
                    <div className="bg-[#FDF0EF] text-[#E59595] p-2.5 h-fit rounded-xl">
                      {idx % 3 === 0 ? <Sparkles size={20} /> : idx % 3 === 1 ? <Gift size={20} /> : <HeartHandshake size={20} />}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[13px] leading-relaxed text-[#5A4A42] font-bold">{line.trim()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white/60 p-4 rounded-2xl border border-white/40 flex gap-3.5 shadow-sm">
                    <div className="bg-[#FDF0EF] text-[#E59595] p-2.5 h-fit rounded-xl">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#5A4A42] text-sm mb-1">Premium Quality</h4>
                      <p className="text-[13px] leading-relaxed text-[#8C7A74] font-medium">Crafted with attention to detail, featuring premium textures and long-lasting build.</p>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-white/40 flex gap-3.5 shadow-sm">
                    <div className="bg-[#FDF0EF] text-[#E59595] p-2.5 h-fit rounded-xl">
                      <Gift size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#5A4A42] text-sm mb-1">Perfect Gift Choice</h4>
                      <p className="text-[13px] leading-relaxed text-[#8C7A74] font-medium">Surprise your loved ones with an aesthetic keepsake that boosts environment mood.</p>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-white/40 flex gap-3.5 shadow-sm">
                    <div className="bg-[#FDF0EF] text-[#E59595] p-2.5 h-fit rounded-xl">
                      <HeartHandshake size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#5A4A42] text-sm mb-1">Easy to Maintain</h4>
                      <p className="text-[13px] leading-relaxed text-[#8C7A74] font-medium">Designed to fit seamlessly into your modern lifestyle without complex usage.</p>
                    </div>
                  </div>
                </>
              )}

              {/* Disclaimer Block */}
              <div className="bg-[#FEF6F6] p-3.5 rounded-xl border border-[#FDE1DF] flex gap-2.5">
                <div className="text-[#E59595] shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <p className="text-[11px] font-medium text-[#080808] leading-relaxed">
                  <strong className="text-[#e3171e]">Disclaimer:</strong> Product visuals, colours, quality and details might vary from reference images. Please thoroughly verify all information on the final marketplace store before finalizing your purchase.
                </p>
              </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="mt-6 pt-4 border-t border-[#F6EBE9]">
              <a 
                href={product.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full py-3.5 sm:py-4 px-6 bg-[#E59595] hover:bg-[#D88282] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_6px_20px_-4px_rgba(229,149,149,0.4)] transition-all duration-300"
              >
                 <span>Order on Amazon</span>
                 <ShoppingCart size={20} />
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
