import {
  HeroSection,
  ServicesShowcaseSection,
  CoreCapabilitiesSection,
  HomePortfolioSection,
  ProcessSection,
  HomeBlogSection,
  CtaBannerSection,
} from "@/sections";
import { Testimonials } from "@/components/ui/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesShowcaseSection />
      <CoreCapabilitiesSection />
      <HomePortfolioSection />
      <ProcessSection />
      <Testimonials />
      <HomeBlogSection />
      <CtaBannerSection />
    </>
  );
}
