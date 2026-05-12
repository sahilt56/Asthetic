import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileAd from "@/components/StickyMobileAd";
import FeedbackForm from "@/components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <main className="min-h-screen flex flex-col relative bg-[#fffbfb]">
      <Header />
      <div className="flex-1 max-w-xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-slate-800 mb-2">We Love Feedback 💌</h1>
          <p className="text-slate-500 font-sans text-sm">
            Tell us what you think or how we can improve!
          </p>
        </div>

        <div className="bg-white border border-pink-100 rounded-3xl p-6 md:p-8 shadow-sm shadow-pink-100/50">
          <FeedbackForm />
        </div>
      </div>
      <Footer />
      <StickyMobileAd />
    </main>
  );
}
