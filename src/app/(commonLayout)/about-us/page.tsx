import AboutCraft from "@/components/modules/common/aboutUs/AboutCraft";
import AboutHero from "@/components/modules/common/aboutUs/AboutHero";
import AboutProcess from "@/components/modules/common/aboutUs/AboutProcess";

const AboutPage = () => {
  return (
    <div className="bg-background">
      <section className="mx-auto w-full max-w-7xl px-4 lg:py-36 py-24 sm:space-y-36 space-y-24">
        <AboutCraft />
        <AboutProcess />
        <AboutHero />
      </section>
    </div>
  );
};

export default AboutPage;
