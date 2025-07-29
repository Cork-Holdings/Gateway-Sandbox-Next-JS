import Hero from "@/components/custom/common/Hero";
import Features from "@/components/custom/common/Features";
import SIA from "@/components/custom/common/SIA";
import Footer from "@/components/custom/common/Footer";



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-clip">
      <Hero />
      <SIA />
      <Features />
      <Footer />
    </main>
  );
}