import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-5 md:py-12 px-4 mt-8 md:mt-12 border-t border-primary/20 bg-muted/30 pb-2 md:pb-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 md:gap-6">
        <p className="font-sans text-xs md:text-sm text-muted-foreground text-center font-medium">
          © {new Date().getFullYear()} Aesthetic Finds. All rights reserved.
        </p>
        <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground/80 font-medium">
          <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/affiliate" className="hover:text-primary-foreground transition-colors">Affiliate Disclosure</Link>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground/60 text-center max-w-2xl mt-1 md:mt-2 leading-relaxed">
          As an Amazon Associate I earn from qualifying purchases. This site contains affiliate links to products. We may receive a commission for purchases made through these links at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}
