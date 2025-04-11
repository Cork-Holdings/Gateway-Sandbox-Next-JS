import Hero from "@/components/custom/common/Hero";
import Features from "@/components/custom/common/Features";
import SIA from "@/components/custom/common/SIA";
import Footer from "@/components/custom/common/Footer";
import { InfiniteLogoScroller } from "@/components/custom/common/infiniteScroller";
import About from "@/components/custom/common/About";
import CTA from "@/components/custom/common/CTA";


const logos = [
  { src: '/images/airtel.png', alt: 'Airtel' },
  { src: '/images/mtn.png', alt: 'MTN' },
  { src: '/images/zamtel_logo.png', alt: 'Zamtel' },
  { src: '/images/gpay_logo_transaparent.png', alt: 'GeePay' },

];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-clip">
      <Hero />
      <InfiniteLogoScroller logos={logos} speed={20} />
      <SIA />
      <Features />
      <About />
      <CTA/>
      <Footer />
    </main>
  );
}