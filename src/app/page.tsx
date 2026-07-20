import HeroBanner from "@/components/home/HeroBanner";
import PressStrip from "@/components/home/PressStrip";
import ActionCards from "@/components/home/ActionCards";
import TrustBar from "@/components/home/TrustBar";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import BakerySpotlight from "@/components/home/BakerySpotlight";
import AboutIntro from "@/components/home/AboutIntro";
import Gallery from "@/components/home/Gallery";
import Reviews from "@/components/home/Reviews";
import InstagramSection from "@/components/home/InstagramSection";
import FAQSection from "@/components/home/FAQSection";
import OurLocation from "@/components/home/OurLocation";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { restaurantSchema, faqSchema, webPageSchema } from "@/data/schema";
import { FAQS } from "@/data/faqs";
import { RESTAURANT } from "@/data/restaurant";

const HOME_FAQS = FAQS.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <SchemaInjector
        schema={[
          restaurantSchema(),
          faqSchema(HOME_FAQS),
          webPageSchema({
            url: "/",
            name: `${RESTAURANT.name} | ${RESTAURANT.tagline}`,
            description: RESTAURANT.shortDescription,
            primaryImage: "/Images/hero.webp",
            hasBreadcrumb: false,
          }),
        ]}
      />
      <HeroBanner />
      <PressStrip />
      <ActionCards />
      <TrustBar />
      <FeaturedDishes />
      <BakerySpotlight />
      <AboutIntro />
      <Gallery />
      <Reviews />
      <InstagramSection />
      <FAQSection faqs={HOME_FAQS} />
      <OurLocation />
    </>
  );
}
