import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileAd from "@/components/StickyMobileAd";

export default function ContactUs() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">Contact Us</h1>
        
        <p className="text-muted-foreground font-sans text-sm mb-10">
          We'd love to hear from you!
        </p>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">Get In Touch</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            If you have any questions about our website, our affiliate partnerships (including Amazon Associates and Google AdSense), or any business inquiries, please feel free to reach out to us.
          </p>
          
          <div className="mt-8 bg-muted/30 border border-primary/20 p-6 rounded-lg">
            <h3 className="font-serif text-xl mb-3 text-primary-foreground/90">Email Us</h3>
            <p className="mb-2 text-foreground/90">For general inquiries, support, or partnership opportunities:</p>
            <a href="mailto:vartalapsupport@gmail.com" className="text-rose-500 hover:text-rose-600 hover:underline transition-colors font-medium">vartalapsupport@gmail.com</a>
          </div>
        </section>

        <section className="mb-10 font-sans text-primary-foreground">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground/90">Advertising & Partnerships</h2>
          <p className="mb-4 leading-relaxed text-foreground/90">
            We are open to collaborations and partnerships with brands that align with our aesthetic and values. If you are interested in advertising on our platform, please contact us using the email above.
          </p>
        </section>
      </div>
      <Footer />
      <StickyMobileAd />
    </main>
  );
}
