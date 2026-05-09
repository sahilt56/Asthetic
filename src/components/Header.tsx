export default function Header() {
  return (
    <header className="w-full py-4 md:py-6 px-4 md:px-8 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
      <h1 className="font-serif text-2xl md:text-4xl text-primary-foreground font-bold tracking-wide">
        Aesthetic Finds ✨
      </h1>
      <p className="font-sans text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-1.5 md:mt-2 text-center max-w-md">
        Curated coquette treasures, cute decor, and premium finds, just for you.
      </p>
    </header>
  );
}
