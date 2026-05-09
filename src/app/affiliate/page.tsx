import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileAd from "@/components/StickyMobileAd";

export default function AffiliateDisclosure() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">Affiliate Disclosure</h1>
        
        <p className="text-muted-foreground font-sans text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">Amazon Associates Program</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Aesthetic Finds is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.
          </p>
          <p className="mb-4 leading-relaxed font-semibold text-foreground">
            As an Amazon Associate, I earn from qualifying purchases.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">General Affiliate Transparency</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            In compliance with the FTC guidelines, please assume that any and all links on this website are affiliate links. This means that if you click on the link and buy certain items, we may receive a small commission. 
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            <strong className="text-foreground">The price is the exact same for you whether you purchase through an affiliate link or a non-affiliate link.</strong> You will not pay more by clicking through to the link.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Our priority is always providing curated, high-quality aesthetic recommendations. We only link to products that fit our strict quality and aesthetic standards. Earning a commission helps us maintain the website and continue curating the best finds for you.
          </p>
        </section>
      </div>
      <Footer />
      <StickyMobileAd />
    </main>
  );
}
