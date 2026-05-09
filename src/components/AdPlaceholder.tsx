interface AdPlaceholderProps {
  type: 'top' | 'in-feed' | 'sticky-bottom';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const baseClasses = "flex items-center justify-center bg-muted/40 border-2 border-dashed border-muted-foreground/30 overflow-hidden";
  const textClasses = "text-muted-foreground font-sans text-xs md:text-sm font-medium text-center p-4";

  if (type === 'top') {
    return (
      <div className="w-full max-w-4xl mx-auto my-6 px-4">
        <div className={`${baseClasses} w-full h-[50px] md:h-[90px] rounded-2xl`}>
          <span className={textClasses}>[Sponsor Space - 320x50 / 728x90]</span>
        </div>
      </div>
    );
  }

  if (type === 'in-feed') {
    return (
      <div className={`${baseClasses} w-full h-full min-h-[250px] rounded-3xl`}>
        <span className={textClasses}>[In-Feed Sponsor Space]</span>
      </div>
    );
  }

  if (type === 'sticky-bottom') {
    return (
      <div className={`${baseClasses} w-full max-w-[320px] h-[50px] mx-auto rounded-xl`}>
        <span className={textClasses}>[Sticky Sponsor Space]</span>
      </div>
    );
  }

  return null;
}
