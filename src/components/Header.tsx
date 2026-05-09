import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-4 md:py-6 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between bg-background/90 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 gap-4">
      {/* Spacer for desktop centering of title */}
      <div className="hidden md:block w-[200px]"></div>
      
      <div className="flex flex-col items-center text-center">
        <h1 className="font-serif text-2xl md:text-4xl text-primary-foreground font-bold tracking-wide flex items-center gap-2 justify-center">
          Aesthetic Finds ✨
        </h1>
        <p className="font-sans text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-1 md:mt-1.5 max-w-md">
          Curated coquette treasures, cute decor, and premium finds, just for you.
        </p>
      </div>

      <Link 
        href="https://in.pinterest.com/sahil620476" // Replace 'contenthub' with your exact username if different
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#E60023]/10 hover:bg-[#E60023]/15 text-[#E60023] font-sans text-xs font-semibold px-4 py-2 rounded-full border border-[#E60023]/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.41.04-3.45.21-.93 1.35-5.74 1.35-5.74s-.34-.69-.34-1.71c0-1.6 1.05-2.8 2.09-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.96 3.84-.27 1.15.58 2.09 1.71 2.09 2.05 0 3.63-2.17 3.63-5.29 0-2.76-1.99-4.7-4.83-4.7-3.29 0-5.22 2.47-5.22 5.02 0 .99.38 2.06.86 2.64.09.11.11.21.08.33l-.32 1.3c-.05.21-.17.26-.39.16-1.46-.68-2.37-2.82-2.37-4.54 0-3.69 2.69-7.09 7.74-7.09 4.06 0 7.22 2.89 7.22 6.77 0 4.04-2.54 7.29-6.08 7.29-1.19 0-2.31-.62-2.69-1.35l-.73 2.79c-.26 1.02-.98 2.3-1.46 3.08C10.15 23.83 11.06 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
        </svg>
        <span>Content Hub on Pinterest</span>
      </Link>
    </header>
  );
}
