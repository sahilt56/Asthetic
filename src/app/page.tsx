import Header from "@/components/Header";
import AdPlaceholder from "@/components/AdPlaceholder";
import Feed from "@/components/Feed";
import Footer from "@/components/Footer";
import StickyMobileAd from "@/components/StickyMobileAd";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative pb-16 md:pb-0">
      <Header />
      <AdPlaceholder type="top" />
      <div className="flex-1">
        <Feed />
      </div>
      <Footer />
      <StickyMobileAd />
    </main>
  );
}
