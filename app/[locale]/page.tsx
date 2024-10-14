import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import DeveloperCard from "@/components/DeveloperCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* <div className="flex flex-col md:flex-row items-center justify-between"> */}
        <div className="items-center justify-between">
          {/* <div className="md:w-1/2 mb-8 md:mb-0"> */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            {t("welcome")}
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("description")}
          </p>
          <div className="w-24 h-[3px] bg-blue-600 mx-auto mb-8 rounded-full"></div>
          {/* <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Image src="/stores/play-store.webp" alt="Google Play" width={20} height={20} />
                <span className="ml-2">Google Play</span>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Image src="/stores/app-store.webp" alt="Google Play" width={20} height={20} />
                <span className="ml-2">App Store</span>
              </Button>
            </div> */}
          {/* </div> */}
          {/* <div className="md:w-1/2">
            <Image
              src="/mockup.png"
              alt="Motionext App Mockup"
              width={500}
              height={500}
              className="rounded-lg shadow-2xl"
            />
          </div> */}
        </div>
        <div className="mt-5 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg blur-sm animate-pulse"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-0.5">
              <Badge
                variant="secondary"
                className="text-lg sm:text-xl py-2 px-4 font-semibold"
              >
                {t("comingSoonQ32025")}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-blue-800 dark:text-blue-200">
          {t("mainFeatures")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title={t("bodyMeasurements")}
            description={t("bodyMeasurementsDesc")}
            icon="📏"
          />
          <FeatureCard
            title={t("calorieCounter")}
            description={t("calorieCounterDesc")}
            icon="🥗"
          />
          <FeatureCard
            title={t("workoutAssistant")}
            description={t("workoutAssistantDesc")}
            icon="💪"
          />
          <FeatureCard
            title={t("hydrationMonitor")}
            description={t("hydrationMonitorDesc")}
            icon="💧"
          />
          <FeatureCard
            title={t("intermittentFasting")}
            description={t("intermittentFastingDesc")}
            icon="⏱️"
          />
          <FeatureCard
            title={t("mentalHealth")}
            description={t("mentalHealthDesc")}
            icon="🧘"
          />
        </div>
      </section>

      <section
        id="team"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-blue-800 dark:text-blue-200">
          {t("ourTeam")}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <DeveloperCard
            image="/avatars/rafael.webp"
            name="Rafael Soares"
            role={t("leadFullStackDeveloper")}
            email="rafaelsoares@motionext.app"
            github="rsoaresdev"
          />
          <DeveloperCard
            image="/avatars/diogo.webp"
            name="Diogo Gonçalves"
            role={t("coLeadDeveloper")}
            email="diogogoncalves@motionext.app"
            github="anonimos-23"
          />
        </div>
      </section>

      <Footer
        copyright={t("copyright")}
        contactUs={t("contactUs")}
        terms={t("terms")}
        policy={t("policy")}
        eula={t("eula")}
      />
    </main>
  );
}
