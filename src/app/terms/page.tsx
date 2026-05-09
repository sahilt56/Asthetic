import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileAd from "@/components/StickyMobileAd";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">Terms and Conditions</h1>
        
        <p className="text-muted-foreground font-sans text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">1. Acceptance of Terms</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            By accessing and using Aesthetic Finds, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">2. Intellectual Property Rights</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            The content, layout, design, data, databases and graphics on this website are protected by intellectual property laws and are owned by Aesthetic Finds, unless otherwise stated. You may not reproduce, download, or otherwise use any content without express permission.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">3. Affiliate Links and Advertisements</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Our website contains affiliate links (such as Amazon Associates) and third-party advertisements (such as Google AdSense). We may earn a commission from clicks or purchases made through these links. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">4. Limitation of Liability</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Aesthetic Finds and its administrators will not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website or any products linked from our website.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">5. Changes to Terms</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            We reserve the right to modify these Terms and Conditions at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms and Conditions.
          </p>
        </section>
      </div>
      <Footer />
      <StickyMobileAd />
    </main>
  );
}
