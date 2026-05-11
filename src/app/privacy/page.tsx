import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileAd from "@/components/StickyMobileAd";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">Privacy Policy</h1>
        
        <p className="text-muted-foreground font-sans text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">1. Introduction</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Welcome to Aesthetic Finds. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">2. Data We Collect</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-3 text-foreground/90">
            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">3. Third-Party Links, Advertising & Affiliate Programs</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            <strong>Google AdSense:</strong> We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our site. Googles use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            <strong>Amazon Associates Program:</strong> Aesthetic Finds is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases. Amazon may use cookies to track your visits and assign commissions correctly.
          </p>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">4. Cookies</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
          </p>
        </section>
      </div>
      <Footer />
      <StickyMobileAd />
    </main>
  );
}
