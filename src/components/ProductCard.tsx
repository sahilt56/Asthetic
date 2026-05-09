'use client';

import Image from "next/image";
import { useState } from "react";

export interface Product {
  id: string;
  title: string;
  price?: string;
  imageUrl: string;
  link: string;
}

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongTitle = product.title.length > 40;

  return (
    <div className="group flex flex-col bg-background rounded-3xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-fit">
      <div className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-muted shrink-0">
        <Image 
          src={product.imageUrl} 
          alt={product.title}
          fill
          priority={priority}
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft overlay gradient for that premium aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-3 md:p-5 flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center w-full cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className={`font-serif text-[15px] sm:text-xl text-primary-foreground text-center leading-tight break-words break-all transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {product.title}
          </h3>
          {isLongTitle && !isExpanded && (
            <span className="text-[11px] text-muted-foreground mt-1 font-medium hover:text-primary-foreground transition-colors">
              Read more
            </span>
          )}
        </div>
        <a 
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 mb-1 bg-primary text-primary-foreground font-sans font-bold text-[14px] sm:text-sm text-center rounded-2xl shadow-[0_4px_0_0_#E8C5C1] hover:shadow-[0_2px_0_0_#E8C5C1] hover:translate-y-[2px] hover:bg-[#FADCD8] active:shadow-none active:translate-y-[4px] transition-all duration-150 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>Shop</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mb-[1px]"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
