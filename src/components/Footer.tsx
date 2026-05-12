import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-5 md:py-12 px-4 mt-8 md:mt-12 border-t border-primary/20 bg-slate-900 text-white text-center pb-2 md:pb-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 md:gap-6">
        <p className="font-sans text-xs md:text-sm text-white text-center font-medium">
          © {new Date().getFullYear()} Aesthetic Finds. All rights reserved.
        </p>
        <div className="flex items-center gap-2 -mt-1 mb-2">
          <span className="text-[11px] text-white font-sans">Official Site of</span>
          <Link 
            href="https://in.pinterest.com/sahil620476" // Replace 'contenthub' with your exact username if different
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white hover:bg-[#E60023]/15 text-[#E60023] font-sans text-[11px] font-bold px-3 py-1 rounded-full border border-[#E60023]/15 transition-all duration-300 hover:scale-[1.03]"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.41.04-3.45.21-.93 1.35-5.74 1.35-5.74s-.34-.69-.34-1.71c0-1.6 1.05-2.8 2.09-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.96 3.84-.27 1.15.58 2.09 1.71 2.09 2.05 0 3.63-2.17 3.63-5.29 0-2.76-1.99-4.7-4.83-4.7-3.29 0-5.22 2.47-5.22 5.02 0 .99.38 2.06.86 2.64.09.11.11.21.08.33l-.32 1.3c-.05.21-.17.26-.39.16-1.46-.68-2.37-2.82-2.37-4.54 0-3.69 2.69-7.09 7.74-7.09 4.06 0 7.22 2.89 7.22 6.77 0 4.04-2.54 7.29-6.08 7.29-1.19 0-2.31-.62-2.69-1.35l-.73 2.79c-.26 1.02-.98 2.3-1.46 3.08C10.15 23.83 11.06 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
            </svg>
            <span>Content Hub</span>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-white font-medium">
          <Link href="/privacy" className="hover:text-[#e59595] transition-colors">Privacy Policy</Link>
          <span className="hidden md:inline">•</span>
          <Link href="/terms" className="hover:text-[#e59595] transition-colors">Terms & Conditions</Link>
          {/* <span className="hidden md:inline">•</span>
          <Link href="/feedback" className="hover:text-[#e59595] transition-colors">Feedback</Link> */}
          <span className="hidden md:inline">•</span>
          <Link href="/contact" className="hover:text-[#e59595] transition-colors">Contact Us</Link>
          <span className="hidden md:inline">•</span>
          <Link href="/affiliate" className="hover:text-[#e59595] transition-colors">Affiliate Disclosure</Link>
        </div>
        <p className="text-[10px] md:text-xs text-white/70 text-center max-w-2xl mt-1 md:mt-2 leading-relaxed">
          As an Amazon Associate I earn from qualifying purchases. This site contains affiliate links to products. We may receive a commission for purchases made through these links at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}
