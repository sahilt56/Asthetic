interface AdPlaceholderProps {
  type: 'top' | 'in-feed' | 'sticky-bottom';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const baseClasses = "flex items-center justify-center bg-muted/40 border-2 border-dashed border-muted-foreground/30 overflow-hidden";
  const textClasses = "text-muted-foreground font-sans text-xs md:text-sm font-medium text-center p-4";

  if (type === 'top') {
    return (
      <div className="w-full max-w-4xl mx-auto my-6 px-4">
        <div className={`${baseClasses} w-full h-12.5 md:h-22.5 rounded-2xl`}>
          <span className={textClasses}>[Please fill the form and share your valuable feedback THANK YOU | Sponsor Space - 320x50 / 728x90]</span> 
          {/* Sponsor Space - 320x50 / 728x90 */}
        </div>
      </div>
    );
  }

  if (type === 'in-feed') {
    return (
      <div className={`${baseClasses} w-full h-full min-h-62.5 rounded-3xl`}>
        <span className={textClasses}>[Please fill the form and share your valuable feedback THANK YOU | In-Feed Sponsor Space]</span>
        {/* In-Feed Sponsor Space */}
      </div>
    );
  }

  if (type === 'sticky-bottom') {
    return (
      <div className={`${baseClasses} w-full max-w-[320px] h-12.5 mx-auto rounded-xl`}>
        <span className={textClasses}>[Please fill the form and share your valuable feedback THANK YOU | Sticky Sponsor Space]</span>
        {/* Sticky Sponsor Space */}
      </div>
    );
  }

  return null;
}
