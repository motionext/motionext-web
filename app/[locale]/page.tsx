import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import { Footer } from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import DeveloperCard from "@/components/DeveloperCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b dark:from-gray-900 dark:to-black bg-white text-black dark:text-white scroll-smooth">
      <section className="text-center my-20">
        <h1 className="text-5xl font-bold mb-6 text-blue-500 dark:text-blue-400">
          {t("welcome")}
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          {t("description")}
        </p>
        <div className="p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 inline-block animate-gradientMove bg-[length:300%_300%]">
          <Badge variant="secondary" className="text-2xl py-2 px-4">
            {t("comingSoonQ32025")}
          </Badge>
        </div>
      </section>

      <section id="features" className="my-20 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-800 dark:text-blue-200">
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
            icon="🍎"
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
            icon="🧠"
          />
        </div>
      </section>

      <section id="team" className="my-20 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-800 dark:text-blue-200">
          {t("ourTeam")}
        </h2>
        <div className="flex flex-wrap justify-center gap-12">
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

      <Footer copyright={t("copyright")} contactUs={t("contactUs")} />
    </main>
  );
}
