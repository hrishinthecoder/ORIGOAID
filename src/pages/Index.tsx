import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedCampaigns from "@/components/FeaturedCampaigns";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CategoryStrip from "@/components/CategoryStrip";
import PartnersMarquee from "@/components/PartnersMarquee";
import Testimonials from "@/components/Testimonials";


export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PartnersMarquee />
        <CategoryStrip />
        <FeaturedCampaigns />
        <HowItWorks />
        <StatsSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

