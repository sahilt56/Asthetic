import AdPlaceholder from "./AdPlaceholder";

export default function StickyMobileAd() {
  return (
    <div className="fixed bottom-1 left-0 right-0 z-50 md:hidden flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-background/95 backdrop-blur-md border border-primary/20 rounded-2xl p-1.5 shadow-xl">
        <AdPlaceholder type="sticky-bottom" />
      </div>
    </div>
  );
}
